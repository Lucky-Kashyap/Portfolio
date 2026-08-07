"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";

type Chapter = (typeof site.avatarIntroChapters)[number];

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /hi-IN/i.test(v.lang)) ||
    voices.find((v) => /^hi\b/i.test(v.lang)) ||
    voices.find((v) => /hindi/i.test(v.name)) ||
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

export type AvatarAudioState = {
  unmuted: boolean;
  speaking: boolean;
  amplitude: number;
  toggle: () => void;
  stop: () => void;
};

/**
 * Single audio source: optional MP3 (+ AnalyserNode) or Web Speech chapters.
 * Only one path can be active at a time.
 */
export function useAvatarAudio(audioUrl?: string | null): AvatarAudioState {
  const [unmuted, setUnmuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const cancelRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const simRafRef = useRef(0);

  const stopAnalyser = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    if (simRafRef.current) cancelAnimationFrame(simRafRef.current);
    simRafRef.current = 0;
    setAmplitude(0);
  }, []);

  const stop = useCallback(() => {
    cancelRef.current = true;
    window.speechSynthesis?.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    stopAnalyser();
    setSpeaking(false);
    setUnmuted(false);
  }, [stopAnalyser]);

  useEffect(() => () => stop(), [stop]);

  const runAnalyserLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const avg = sum / (data.length * 255);
      setAmplitude(Math.min(1, avg * 2.4));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const runSimulatedLip = useCallback(() => {
    const started = performance.now();
    const tick = () => {
      const t = (performance.now() - started) / 1000;
      const wave =
        0.35 +
        0.35 * Math.abs(Math.sin(t * 9.2)) +
        0.2 * Math.abs(Math.sin(t * 14.5 + 1.2));
      setAmplitude(wave);
      simRafRef.current = requestAnimationFrame(tick);
    };
    simRafRef.current = requestAnimationFrame(tick);
  }, []);

  const playMp3 = useCallback(async () => {
    if (!audioUrl) return false;
    try {
      const audio = audioRef.current ?? new Audio(audioUrl);
      audioRef.current = audio;
      audio.crossOrigin = "anonymous";
      audio.currentTime = 0;

      if (!ctxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new Ctx();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      if (!analyserRef.current) {
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      }

      cancelRef.current = false;
      setSpeaking(true);
      setUnmuted(true);
      runAnalyserLoop();

      await audio.play();
      audio.onended = () => {
        if (cancelRef.current) return;
        stopAnalyser();
        setSpeaking(false);
        setUnmuted(false);
      };
      return true;
    } catch {
      return false;
    }
  }, [audioUrl, runAnalyserLoop, stopAnalyser]);

  const speakChapter = useCallback(
    (index: number, voice: SpeechSynthesisVoice | null) => {
      const chapters = site.avatarIntroChapters;
      if (cancelRef.current || index >= chapters.length) {
        stopAnalyser();
        setSpeaking(false);
        setUnmuted(false);
        return;
      }

      const chapter: Chapter = chapters[index];
      const utterance = new SpeechSynthesisUtterance(chapter.text);
      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.lang = "hi-IN";
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (cancelRef.current) return;
        speakChapter(index + 1, voice);
      };
      utterance.onerror = () => {
        if (cancelRef.current) return;
        stopAnalyser();
        setSpeaking(false);
        setUnmuted(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [stopAnalyser],
  );

  const playSpeech = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    cancelRef.current = false;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    setUnmuted(true);
    runSimulatedLip();

    const start = () => speakChapter(0, pickVoice());
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", start, {
        once: true,
      });
      window.setTimeout(start, 280);
      return;
    }
    start();
  }, [runSimulatedLip, speakChapter]);

  const toggle = useCallback(() => {
    if (unmuted || speaking) {
      stop();
      return;
    }
    void (async () => {
      const played = await playMp3();
      if (!played) playSpeech();
    })();
  }, [unmuted, speaking, stop, playMp3, playSpeech]);

  return { unmuted, speaking, amplitude, toggle, stop };
}
