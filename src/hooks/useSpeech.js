import { useEffect, useRef } from 'react'

export function useSpeech() {
  const voiceRef = useRef(null)

  useEffect(() => {
    function loadVoice() {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find(v => v.lang === 'en-US') ??
        voices.find(v => v.lang.startsWith('en')) ??
        voices[0] ??
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
