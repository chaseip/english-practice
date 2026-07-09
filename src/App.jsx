import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PatternDrill from './pages/PatternDrill'
import Interjections from './pages/Interjections'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pattern/:id" element={<PatternDrill />} />
      <Route path="/interjections" element={<Interjections />} />
    </Routes>
  )
}
