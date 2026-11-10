import { useEffect, useRef, useState } from 'react'
import { POOL, QUESTIONS, type Q } from './data'

type Item = Q & { url: string; options: string[] }
const CLIP = 7 // segundos de fragmento
const BLUR = [30, 16, 6]
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)

async function load(q: Q): Promise<Item | null> {
  try {
    const entity = q.kind === 'audio' ? 'song' : 'album'
    const r = await fetch(`https://itunes.apple.com/search?media=music&entity=${entity}&limit=5&country=ES&term=${encodeURIComponent(q.term)}`)
    const hit = (await r.json()).results.find((x: any) => (q.kind === 'audio' ? x.previewUrl : x.artworkUrl100))
    if (!hit) return null
    const url: string = q.kind === 'audio' ? hit.previewUrl : hit.artworkUrl100.replace('100x100', '600x600')
    const options = shuffle([q.answer, ...shuffle(POOL.filter(p => p !== q.answer)).slice(0, 3)])
    return { ...q, url, options }
  } catch { return null }
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [items, setItems] = useState<Item[] | null>(null)
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const timer = useRef<number>()

  const start = async () => {
    setItems(null); setI(0); setScore(0); setPick(null); setHint(0)
    const loaded = (await Promise.all(shuffle(QUESTIONS).slice(0, 14).map(load))).filter(Boolean) as Item[]
    setItems(shuffle(loaded).slice(0, 10))
  }
  useEffect(() => { if (started) start() }, [started])

  const cur = items?.[i]
  const play = (h = hint) => {
    const a = audio.current; if (!a) return
    clearTimeout(timer.current)
    a.currentTime = 8; a.play().catch(() => {}); setPlaying(true)
    timer.current = window.setTimeout(() => { a.pause(); setPlaying(false) }, (CLIP + h * 3) * 1000)
  }
  useEffect(() => { // autoplay al cambiar de pregunta
    setHint(0); setPick(null)
    const t = cur?.kind === 'audio' ? setTimeout(() => play(0), 300) : undefined
    return () => { clearTimeout(t); clearTimeout(timer.current); audio.current?.pause(); setPlaying(false) }
  }, [cur])

  const answer = (o: string) => {
    if (pick || !cur) return
    audio.current?.pause(); setPlaying(false); clearTimeout(timer.current)
    setPick(o)
    if (o === cur.answer) setScore(s => s + 3 - (cur.kind === 'image' ? hint : 0))
  }

  if (!started) return (
    <main className="card center">
      <p className="tag">Día 17 · QR 4</p>
      <h1>🎭 ¡Adivina el musical!</h1>
      <p>Feliz cumpleaños, <b>Irina</b> 🎂<br />Glee, Mamma Mia!, Cabaret, Wicked, Tina…<br />Escucha el fragmento o mira la imagen y acierta el musical.</p>
      <button className="big" onClick={() => setStarted(true)}>▶ Empezar</button>
    </main>
  )
  if (!items) return <main className="card center"><h2>🎶 Afinando…</h2></main>
  if (!cur) return (
    <main className="card center">
      <h1>🎉 ¡{score >= items.length * 2 ? 'Eres una estrella de Broadway' : 'Bravo'}, Irina!</h1>
      <p className="score">{score} / {items.length * 3} puntos</p>
      <button className="big" onClick={start}>↻ Otra vez</button>
    </main>
  )

  return (
    <main className="card q">
      <header>
        <span>Pregunta {i + 1}/{items.length}</span>
        <span className="pts" role="status" aria-label={`${score} puntos`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" /></svg>
          <b>{score}</b> pts
        </span>
      </header>
      {cur.kind === 'audio' ? (
        <div className="center">
          <audio ref={audio} src={cur.url} preload="auto" />
          <div className={'disc' + (playing ? ' spin' : '')}>🎵</div>
          <button onClick={() => play()}>{playing ? '🔊 Sonando…' : '🔁 Repetir fragmento'}</button>
          {!pick && hint < 2 && <button className="ghost" onClick={() => { setHint(hint + 1); play(hint + 1) }}>💡 Fragmento más largo</button>}
        </div>
      ) : (
        <div className="center">
          <img src={cur.url} alt="" style={{ filter: `blur(${pick ? 0 : BLUR[hint]}px)` }} />
          {!pick && hint < 2 && <button className="ghost" onClick={() => setHint(hint + 1)}>💡 Menos borroso (-1 punto)</button>}
        </div>
      )}
      <div className="opts">
        {cur.options.map(o => (
          <button key={o} disabled={!!pick} onClick={() => answer(o)}
            className={pick ? (o === cur.answer ? 'ok' : o === pick ? 'ko' : '') : ''}>{o}</button>
        ))}
      </div>
      {pick && <>
        <p className="center">{pick === cur.answer ? '✅ ¡Correcto!' : `❌ Era: ${cur.answer}`} {cur.note}</p>
        <button className="big" onClick={() => setI(i + 1)}>{i + 1 < items.length ? 'Siguiente →' : 'Ver resultado'}</button>
      </>}
    </main>
  )
}
