import data from '../data/interjections.json'
import { shuffle } from './slots'

export const interjections = data.items

// Build a 4-option multiple-choice question for one item: the correct meaning
// plus 3 distractors drawn at random from the other items' meanings.
export function buildOptions(item, all = interjections, count = 4) {
  const distractors = shuffle(all.filter(i => i.id !== item.id))
    .slice(0, count - 1)
    .map(i => i.meaning)
  return shuffle([item.meaning, ...distractors])
}
