import { useEffect, useRef } from 'react'

export function useSpeech() {
  const voiceRef = useRef(null)

  useEffect(() => {
    function loadVoice() {
      const voices = window.speechSynthesis.getVoices()
      // Only ever use an English voice. If none is installed, leave it null so
      // we don't force a Japanese voice to mispronounce English text.
      voiceRef.current =
        voices.find(v => v.lang === 'en-US') ??
        voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ??
        null
    }
    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
  }, [])

  function speak(text) {
    if (!text) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'en-US'
    utt.rate = 0.85
    if (voiceRef.current) utt.voice = voiceRef.current
    window.speechSynthesis.speak(utt)
  }

  return { speak }
}
