import { useEffect } from 'react'

// Pick an American English voice, falling back to any English voice.
// Some WebKit versions report langs like "en_US" or "en-us", so normalize
// before comparing. Returns null if the device has no English voice at all.
export function findEnglishVoice(voices) {
  const norm = v => (v.lang || '').toLowerCase().replace('_', '-')
  return (
    voices.find(v => norm(v) === 'en-us') ??
    voices.find(v => norm(v).startsWith('en')) ??
    null
  )
}

export function useSpeech() {
  useEffect(() => {
    // iOS Safari fills the voice list asynchronously and often never fires
    // voiceschanged. Calling getVoices() early kicks off loading so the list
    // is ready by the time the user taps a speak button.
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices()
  }, [])

  function speak(text) {
    if (!text || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'en-US'
    utt.rate = 0.85
    // Resolve the voice at speak time: picking it once at mount breaks on
    // iOS, where the list is empty at first. An utterance without an explicit
    // voice makes iOS fall back to the device's default (e.g. Japanese) voice
    // even though lang is set.
    const voice = findEnglishVoice(window.speechSynthesis.getVoices())
    if (voice) utt.voice = voice
    window.speechSynthesis.speak(utt)
  }

  return { speak }
}
