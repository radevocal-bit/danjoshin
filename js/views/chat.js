// メッセージの場面（04 §4 S3）。吹き出し・入力中…・既読・間を出す。
// 1話の中のメッセージの場面は、同じトーク画面に続けて出す（場面の札を区切りにする）。

import { characterAvatar, h } from '../ui.js'
import { between, wait } from '../wait.js'
import { createPanel } from './panel.js'

// 演出の目安（04 §7）
const TYPING_MS = [800, 1200] // 相手のセリフの前の「入力中…」
const READ_MS = 500 // 自分の返事 → 「既読」
const LONG_MS = 3000 // delay: "long" … 既読のまま返事が来ない間
const BEAT_MS = 300 // 既読がついてから入力中…が出るまで
const FIRST_MS = 1000 // 場面のはじめは、履歴を見てもらってから話し始める
const NO_REPLY_MS = 1500 // 返事がないとき（既読のまま）

export function createChatView({ episode, character }) {
  const status = h('p', { class: 'chat-status' })
  const log = h('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite' })
  const panel = createPanel()
  const el = h('section', { class: 'view chat' },
    h('header', { class: 'chat-header' },
      characterAvatar(character),
      h('div', {}, h('p', { class: 'chat-name', text: character.name }), status),
    ),
    log,
    panel.el,
  )

  const scrollDown = () => requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }))
  new ResizeObserver(scrollDown).observe(log)

  let lastSide = null // 同じ人の吹き出しが続くときはアイコンを省く
  let pause = true

  function add(row, side) {
    if (side && side === lastSide) row.classList.add('cont')
    lastSide = side
    log.append(row)
    scrollDown()
    return row
  }
  const divider = (label) => add(h('div', { class: 'divider' }, h('span', { text: label })), null)
  const partnerRow = (bubble) => h('div', { class: 'msg partner' }, characterAvatar(character), bubble)
  const partnerMessage = (text) => add(partnerRow(h('div', { class: 'bubble', text })), 'partner')
  const playerMessage = (body) => add(h('div', { class: 'msg player' }, body), 'player')
  const markRead = (row) => row.prepend(h('span', { class: 'read', text: '既読' }))

  // 上部に過去のやりとり（相手の「いつもの口調」が手がかりの基準になる）
  if (episode.history) {
    divider(episode.history.label)
    for (const message of episode.history.messages) {
      if (message.from === 'player') markRead(playerMessage(h('div', { class: 'bubble', text: message.text })))
      else partnerMessage(message.text)
    }
  }
  panel.hint()

  /** chat のセリフは文字列。{ who, text } の形でも出せる（地の文は小さな注記にする） */
  async function partner(line) {
    const text = typeof line === 'string' ? line : line.text
    if (line.who === 'narration') {
      add(h('p', { class: 'chat-note', text }), null)
      return
    }
    if (pause) {
      pause = false
      await wait(FIRST_MS)
    }
    const typing = partnerRow(h('div', { class: 'bubble typing', 'aria-label': '入力中' }, h('i'), h('i'), h('i')))
    if (lastSide === 'partner') typing.classList.add('cont')
    log.append(typing)
    scrollDown()
    status.textContent = '入力中…'
    await wait(between(...TYPING_MS))
    typing.remove()
    status.textContent = ''
    partnerMessage(text)
  }

  async function reaction(line) {
    await wait(line.delay === 'long' ? LONG_MS : BEAT_MS)
    await partner(line)
  }

  return {
    el,
    /** 場面に入るとき: 区切り（場面の札。v1 の話は「今日」）を入れる */
    startScene(scene) {
      divider(scene.label ?? '今日')
      pause = true
      panel.hint()
    },
    partner,
    async choose(choices) {
      const choice = await panel.choose(choices, renderChoice)
      panel.hint()
      return choice
    },
    async player(choice) {
      const body = choice.send_as === 'sticker'
        ? h('div', { class: 'sticker', role: 'img', 'aria-label': 'スタンプ' }, choice.sticker)
        : h('div', { class: 'bubble', text: choice.text })
      const row = playerMessage(body)
      await wait(READ_MS)
      markRead(row)
    },
    reaction,
    noReply: () => wait(NO_REPLY_MS),
    exit: reaction,
    async showEnd(label) {
      await wait(BEAT_MS)
      add(h('p', { class: 'chat-end', text: '会話が終わりました' }), null)
      await panel.button(label)
    },
  }
}

function renderChoice(choice) {
  if (choice.send_as !== 'sticker') return choice.text
  return [choice.text, h('span', { class: 'choice-sticker', 'aria-hidden': 'true' }, choice.sticker)]
}
