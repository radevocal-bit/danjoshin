// 画面下の欄: 待っている間の案内 → 4つの選択肢 → 次へのボタン

import { h } from '../ui.js'

// 早送りの連打で、出てきた選択肢をうっかり押さないように少し待つ
const GUARD_MS = 400

export function createPanel() {
  const el = h('div', { class: 'panel' })
  const set = (...nodes) => el.replaceChildren(...nodes)

  return {
    el,

    hint() {
      set(h('p', { class: 'panel-hint', text: '画面をタップすると早く進みます' }))
    },

    /** choices をボタンで出し、選ばれた choice を返す。render(choice) はボタンの中身 */
    choose(choices, render) {
      return new Promise((resolve) => {
        const list = h('div', { class: 'choices' })
        let ready = false
        for (const choice of choices) {
          const button = h('button', { class: 'choice', type: 'button' }, render(choice))
          button.addEventListener('click', () => {
            if (!ready) return
            ready = false
            button.classList.add('picked')
            for (const other of list.children) other.disabled = true
            setTimeout(() => resolve(choice), 160)
          })
          list.append(button)
        }
        set(h('p', { class: 'panel-label', text: '返事を選ぶ' }), list)
        setTimeout(() => {
          ready = true
          list.classList.add('ready')
        }, GUARD_MS)
      })
    },

    button(label) {
      return new Promise((resolve) => {
        set(h('button', { class: 'btn btn-primary', type: 'button', onClick: () => resolve() }, label))
      })
    },
  }
}
