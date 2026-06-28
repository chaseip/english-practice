import { useState, useEffect } from 'react'

// Detects whether the device has an English text-to-speech voice. If not, the
// app's audio will mispronounce English, so we surface install instructions
// (in Japanese) for iPhone and Android.
export default function VoiceHelp() {
  const [hasEnglish, setHasEnglish] = useState(null) // null = still loading
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setHasEnglish(false)
      return
    }
    function check() {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return // not ready yet; voiceschanged will fire
      setHasEnglish(voices.some(v => v.lang && v.lang.toLowerCase().startsWith('en')))
    }
    check()
    window.speechSynthesis.addEventListener('voiceschanged', check)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check)
  }, [])

  // If no English voice is found, open the panel automatically.
  useEffect(() => {
    if (hasEnglish === false) setOpen(true)
  }, [hasEnglish])

  function test() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance('Hello! This is American English.')
    u.lang = 'en-US'
    u.rate = 0.9
    const voices = window.speechSynthesis.getVoices()
    const v =
      voices.find(x => x.lang === 'en-US') ??
      voices.find(x => x.lang && x.lang.toLowerCase().startsWith('en'))
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }

  const warn = hasEnglish === false

  return (
    <div className={`mx-4 mb-3 rounded-xl border ${warn ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <span className="text-sm font-medium text-gray-800">
          {warn ? '⚠️ 英語の音声が見つかりません' : '🔊 音声について / English voice'}
        </span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-gray-700 space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            このアプリは、お使いの端末の音声合成（TTS）で英語を読み上げます。
            アメリカ英語の音声が入っていないと、英語が正しく発音されません。
            まず下のボタンで確認してください。
          </p>

          <button
            onClick={test}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium active:bg-blue-700"
          >
            🔊 音声をテスト
          </button>
          <p className="text-xs text-gray-500">
            ↑ きれいなアメリカ英語で聞こえれば設定は不要です。
          </p>

          <div>
            <p className="font-semibold text-gray-800 mb-1">📱 iPhone の場合</p>
            <ol className="list-decimal list-inside text-xs space-y-0.5 text-gray-700 leading-relaxed">
              <li>「設定」アプリを開く</li>
              <li>「アクセシビリティ」をタップ</li>
              <li>「読み上げコンテンツ」→「声」</li>
              <li>「英語」→「アメリカ英語」を選んでダウンロード</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">🤖 Android の場合</p>
            <ol className="list-decimal list-inside text-xs space-y-0.5 text-gray-700 leading-relaxed">
              <li>「設定」アプリを開く</li>
              <li>「システム」→「言語と入力」</li>
              <li>「テキスト読み上げの出力」（音声合成）を開く</li>
              <li>エンジン（Google 音声サービス）の設定 →「音声データのインストール」</li>
              <li>「English (United States)」を選んでダウンロード</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            ※ メニューの名前は機種やバージョンによって少し異なる場合があります。
            ダウンロード後は、このページを再読み込み（リフレッシュ）してください。
          </p>
        </div>
      )}
    </div>
  )
}
