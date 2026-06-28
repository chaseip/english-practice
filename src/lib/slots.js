import data from '../data/patterns.json'

export const slotTypes = data.slotTypes
export const contexts = data.contexts
export const models = data.models

export function getModel(id) {
  return models.find(m => m.id === Number(id))
}

export function getColor(type) {
  return slotTypes[type]?.color ?? '#9E9E9E'
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function checkAnswer(placed, cells) {
  if (placed.length !== cells.length) return false
  return placed.every((p, i) => p.type === cells[i].type && p.text === cells[i].text)
}
