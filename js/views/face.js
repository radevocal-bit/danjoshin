// 会う場面（06 §4 S4・§5）。上半分に背景とキャラの絵、下半分に吹き出しと選択肢。
// セリフの face でキャラの表情を切り替える。地の文は帯で出し、店員さんは札つきの吹き出しにする。

import { backgroundArt, characterArt } from '../art/index.js'
import { art, artNode, characterAvatar, h, speakerName } from '../ui.js'
import { between, wait } from '../wait.js'
import { createPanel } from './panel.js'

const LONG_MS = 2800 // delay: "long" … 黙っている間
const MS_PER_CHAR = 40 // 前のセリフを読む時間の目安
const GAP_MS = [700, 2600]

export function createFaceView({ character, scene }) {
  const background = backgroundArt(scene.background)
  const figure = h('div', { class: 'stage-figure' })
  const stage = h('div', { class: 'stage' },
    background.image
      ? artNode(background, 'stage-layer')
      : h('div', { class: 'stage-layer' }, art(background.back)),
    figure,
    background.front ? h('div', { class: 'stage-layer front' }, art(background.front)) : null,
  )
  const log = h('div', { class: 'say-log', role: 'log', 'aria-live': 'polite' })
  const panel = createPanel()
  const el = h('section', { class: 'view face' }, stage, log, panel.el)

  const scrollDown = () => requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }))
  new ResizeObserver(scrollDown).observe(log)

  let face = null
  let lastWho = null // 同じ人が続くときは名前を省く
  let lastLength = 0
  const readingGap = () => Math.min(GAP_MS[1], Math.max(GAP_MS[0], 300 + lastLength * MS_PER_CHAR))

  /** 表情を切り替える（絵は キャラID＋表情ID で呼ぶ） */
  function setFace(next) {
    if (!next || next === face) return
    face = next
    figure.replaceChildren(artNode(characterArt(character, next), 'stage-art') ?? characterAvatar(character, 'xl'))
  }
  setFace('normal')

  function lineNode(who, text) {
    if (who === 'narration') return h('p', { class: 'narration', text })
    const staff = who === 'staff'
    return h('div', { class: `say ${staff ? 'staff' : 'person'}` },
      staff || who !== lastWho ? h('p', { class: 'say-name', text: speakerName(who, character) }) : null,
      h('div', { class: 'bubble', text }),
    )
  }

  async function say(line, gap = readingGap()) {
    await wait(gap)
    const who = line.who ?? character.id
    if (line.face) setFace(line.face) // 地の文でも、face があれば表情だけ変える
    log.append(lineNode(who, line.text))
    lastWho = who === 'narration' ? null : who
    lastLength = line.text.length
    scrollDown()
  }

  const reaction = (line) => say(line, line.delay === 'long' ? LONG_MS : between(700, 1100))

  panel.hint()

  return {
    el,
    partner: (line) => say(line), // 会う場面のセリフは { who, text, face }
    async choose(choices) {
      // 相手以外（店員さんなど）への返事がある手だけ、誰への返事かの札を出す
      const tagged = choices.some((choice) => choice.to && choice.to !== character.id)
      const choice = await panel.choose(choices, (c) => [
        tagged && c.to ? h('span', { class: 'choice-to', text: `${speakerName(c.to, character)}に` }) : null,
        c.text,
      ])
      panel.hint()
      return choice
    },
    async player(choice) {
      const to = choice.to && choice.to !== character.id ? `→ ${speakerName(choice.to, character)}に` : null
      log.append(h('div', { class: 'say player' },
        to ? h('p', { class: 'say-name', text: to }) : null,
        h('div', { class: 'bubble', text: choice.text }),
      ))
      lastWho = 'player'
      lastLength = 0
      scrollDown()
      await wait(400)
    },
    reaction,
    noReply: () => wait(1200),
    exit: reaction,
    async showEnd(label) {
      await wait(800)
      log.append(h('p', { class: 'say-end', text: '会話が終わりました' }))
      scrollDown()
      await panel.button(label)
    },
  }
}
