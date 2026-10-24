// S5 推理。タイプ推理（4つの軸を2択で。04 §4）か、続きの話のギャップ推理（4択。06 §4）

import { shuffle } from '../rules.js'
import { h } from '../ui.js'

/** 答えは onDone({ kind: 'type', answers }) / onDone({ kind: 'gap', option }) / スキップは onDone(null) */
export function guessScreen({ episode, character, types, onDone }) {
  return episode.guess === 'gap'
    ? gapGuess({ question: episode.gap_guess.question, options: episode.gap_guess.options, onDone })
    : typeGuess({ character, types, onDone })
}

function typeGuess({ character, types, onDone }) {
  const keys = Object.keys(types.axes)
  const answers = {}
  const submit = h('button', {
    class: 'btn btn-primary',
    type: 'button',
    disabled: true,
    onClick: () => onDone({ kind: 'type', answers: { ...answers } }),
  }, '答え合わせ')

  const cards = keys.map((key) => {
    const axis = types.axes[key]
    const options = Object.entries(axis.values).map(([value, label]) => {
      const button = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, label)
      button.addEventListener('click', () => {
        answers[key] = value
        for (const [other, otherButton] of options) otherButton.setAttribute('aria-pressed', String(other === value))
        // 4問すべて選ぶまで押せない
        submit.disabled = keys.some((k) => !answers[k])
      })
      return [value, button]
    })
    return h('div', { class: 'axis-card' },
      h('p', { class: 'axis-head' },
        h('span', { class: 'axis-key', text: key }),
        h('span', { class: 'axis-label', text: axis.label }),
      ),
      h('p', { class: 'axis-hint', text: `ヒント: ${axis.hint}` }),
      h('div', { class: 'opts', role: 'group', 'aria-label': axis.label }, options.map(([, button]) => button)),
    )
  })

  return h('section', { class: 'screen page guess' },
    h('p', { class: 'kicker', text: 'タイプ推理' }),
    h('h2', { class: 'guess-q', text: `${character.name}はどんなタイプだと思う？` }),
    cards,
    h('div', { class: 'btn-row' },
      submit,
      h('button', { class: 'btn btn-ghost', type: 'button', onClick: () => onDone(null) }, 'スキップ'),
    ),
  )
}

function gapGuess({ question, options, onDone }) {
  let picked = null
  const submit = h('button', {
    class: 'btn btn-primary',
    type: 'button',
    disabled: true,
    onClick: () => onDone({ kind: 'gap', option: picked }),
  }, '答え合わせ')

  // データでは正解が先頭なので、並びはシャッフル
  const buttons = shuffle(options).map((option) => {
    const button = h('button', { class: 'gap-opt', type: 'button', 'aria-pressed': 'false', 'data-id': option.id }, option.text)
    button.addEventListener('click', () => {
      picked = option.id
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button))
      submit.disabled = false
    })
    return button
  })

  return h('section', { class: 'screen page guess' },
    h('p', { class: 'kicker', text: 'ギャップ推理' }),
    h('h2', { class: 'guess-q', text: question }),
    h('p', { class: 'guess-lead', text: 'ギャップ: ある話題になると、いつものタイプと変わるところ' }),
    h('div', { class: 'gap-opts', role: 'group', 'aria-label': question }, buttons),
    h('div', { class: 'btn-row' },
      submit,
      h('button', { class: 'btn btn-ghost', type: 'button', onClick: () => onDone(null) }, 'スキップ'),
    ),
  )
}
