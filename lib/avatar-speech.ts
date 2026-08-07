"use client";

import { site } from "@/lib/content";

export type AvatarSpeechLocale = "en" | "hi";
export type AvatarSpeechSection = "hero" | "about";

type Chapter = { id: string; label: string; text: string };

let cancelToken = 0;
let sectionLocale: AvatarSpeechLocale = "en";
const sectionListeners = new Set<(locale: AvatarSpeechLocale) => void>();

function chaptersFor(locale: AvatarSpeechLocale): readonly Chapter[] {
  return locale === "hi" ? site.aboutSpeechChapters : site.heroSpeechChapters;
}

function pickVoice(locale: AvatarSpeechLocale): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (locale === "hi") {
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
  return (
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /^en\b/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

/** Current hero/about locale for the floating avatar. */
export function getAvatarSpeechLocale(): AvatarSpeechLocale {
  return sectionLocale;
}

/**
 * Called while the shared avatar morphs. Stops any playing script so English
 * and Hindi never overlap.
 */
export function setAvatarSpeechSection(section: AvatarSpeechSection) {
  const next: AvatarSpeechLocale = section === "about" ? "hi" : "en";
  if (next === sectionLocale) return;
  sectionLocale = next;
  stopAvatarSpeech();
  for (const listener of sectionListeners) listener(sectionLocale);
}

export function subscribeAvatarSpeechSection(
  listener: (locale: AvatarSpeechLocale) => void,
) {
  sectionListeners.add(listener);
  listener(sectionLocale);
  return () => {
    sectionListeners.delete(listener);
  };
}

/** Stop any in-flight Web Speech narration. */
export function stopAvatarSpeech() {
  cancelToken += 1;
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}

/**
 * Speak intro chapters for one locale only. Always cancels prior speech first.
 */
export function playAvatarSpeech(
  locale: AvatarSpeechLocale = sectionLocale,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Never allow two narrations at once
    stopAvatarSpeech();
    const myToken = ++cancelToken;

    const chapters = chaptersFor(locale);
    const lang = locale === "hi" ? "hi-IN" : "en-IN";

    const speak = (index: number, voice: SpeechSynthesisVoice | null) => {
      if (myToken !== cancelToken || index >= chapters.length) {
        resolve();
        return;
      }

      const chapter = chapters[index];
      const utterance = new SpeechSynthesisUtterance(chapter.text);
      utterance.rate = locale === "hi" ? 0.98 : 1;
      utterance.pitch = 1;
      utterance.lang = lang;
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (myToken !== cancelToken) {
          resolve();
          return;
        }
        speak(index + 1, voice);
      };
      utterance.onerror = () => {
        if (myToken === cancelToken) resolve();
      };

      window.speechSynthesis.speak(utterance);
    };

    const start = () => speak(0, pickVoice(locale));

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
