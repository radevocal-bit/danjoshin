// S4 会話の入れ物（06 §4）。場面ごとに、メッセージの画面と会う場面を切り替え、場面の札を出す。

import { h } from '../ui.js'
import { skipWaits, wait } from '../wait.js'
import { createChatView } from './chat.js'
import { createFaceView } from './face.js'

const LABEL_MS = 1600 // 場面の札を出しておく長さ（1〜2秒。タップで飛ばせる）

export function createConversation({ episode, character }) {
  const el = h('section', { class: 'screen conversation' })
  // 待っている間は、どこをタップしても早送り（ボタンの上は除く）
  el.addEventListener('click', (event) => {
    if (!event.target.closest('button')) skipWaits()
  })

  let chat = null // メッセージの場面は、1つのトーク画面を続けて使う
  let current = null

  return {
    el,

    /** runner から呼ばれる: 場面の札を出し、その場面の view を返す */
    async enterScene(scene) {
      const sceneCard = scene.label
        ? h('div', { class: 'scene-card', role: 'status' }, h('p', { class: 'scene-card-label', text: scene.label }))
        : null
      if (sceneCard) el.append(sceneCard)

      let view
      if (scene.mode === 'face') {
        view = createFaceView({ character, scene })
      } else {
        chat ??= createChatView({ episode, character })
        chat.startScene(scene)
        view = chat
      }
      if (view !== current) {
        current?.el.remove()
        el.prepend(view.el)
        current = view
      }

      if (sceneCard) {
        await wait(LABEL_MS)
        sceneCard.classList.add('leaving')
        setTimeout(() => sceneCard.remove(), 400)
      }
      return view
    },

    /** 会話が終わったあと、推理へのボタンを出して押されるまで待つ */
    showEnd(label) {
      return current.showEnd(label)
    },
  }
}
