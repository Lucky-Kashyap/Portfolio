"use client";

import { site } from "@/lib/content";

type Chapter = (typeof site.avatarIntroChapters)[number];

let cancelToken = 0;

/** Prefer Hindi voices; fall back to any available voice. */
function pickHindiVoice(): SpeechSynthesisVoice | null {
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

/** Stop any in-flight Web Speech narration. */
export function stopAvatarSpeech() {
  cancelToken += 1;
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}

/**
 * Speak Hindi intro chapters. Resolves when finished or cancelled.
 */
export function playAvatarSpeech(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const myToken = ++cancelToken;
    window.speechSynthesis.cancel();

    const chapters = site.avatarIntroChapters;

    const speak = (index: number, voice: SpeechSynthesisVoice | null) => {
      if (myToken !== cancelToken || index >= chapters.length) {
        resolve();
        return;
      }

      const chapter: Chapter = chapters[index];
      const utterance = new SpeechSynthesisUtterance(chapter.text);
      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.lang = "hi-IN";
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (myToken !== cancelToken) {
          resolve();
          return;
        }
        speak(index + 1, voice);
      };
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    };

    const start = () => speak(0, pickHindiVoice());

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", start, {
        once: true,
      });
      window.setTimeout(start, 280);
      return;
    }

    start();
  });
}
