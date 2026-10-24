// 画面づくりの小さな道具

import { characterArt } from './art/index.js'

/** 要素を作る。props: class / text / on〇〇（イベント）/ そのほかは属性 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue
    if (key === 'class') el.className = value
    else if (key === 'text') el.textContent = value
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value)
    else el.setAttribute(key, value === true ? '' : String(value))
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue
    el.append(child)
  }
  return el
}

/** 決まった絵（SVG の文字列）を要素にする。データの文字をそのまま入れないこと */
export function art(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild
}

/** art/index.js の絵（{ image } か { svg }）を要素にする */
export function artNode(picture, className = '') {
  if (!picture) return null
  const node = picture.image
    ? h('img', { src: picture.image, alt: '', decoding: 'async' })
    : art(picture.svg)
  if (className) node.classList.add(...className.split(' '))
  return node
}

/** キャラのアイコン。絵があれば顔のまわり、なければ icon_text の1文字 */
export function characterAvatar(character, size = '', face = 'normal') {
  const picture = characterArt(character, face, 'head')
  const className = ['avatar', picture ? 'art' : '', size].filter(Boolean).join(' ')
  if (picture) return h('span', { class: className, 'aria-hidden': 'true' }, artNode(picture))
  return h(
    'span',
    { class: className, style: `--hue: ${hueOf(character.id)}`, 'aria-hidden': 'true' },
    character.icon_text ?? character.name.slice(0, 1),
  )
}

export function staffAvatar() {
  return h('span', { class: 'avatar staff', 'aria-hidden': 'true' }, '店')
}

function hueOf(id) {
  let hue = 0
  for (const ch of id) hue = (hue * 31 + ch.codePointAt(0)) % 360
  return hue
}

export function stars(count, max = 3) {
  return h(
    'span',
    { class: 'stars', role: 'img', 'aria-label': `★${count}` },
    '★'.repeat(count),
    h('span', { class: 'off' }, '★'.repeat(Math.max(0, max - count))),
  )
}

/** 段階のバッジ（初級・中級・上級） */
export function tierBadge(tierId, label) {
  return label ? h('span', { class: `badge tier tier-${tierId}`, text: label }) : null
}

/** 誰のセリフ・誰への返事か（会う場面の who / to） */
export function speakerName(who, character) {
  if (who === character.id) return character.name
  if (who === 'staff') return '店員さん'
  return who
}

export function card(title, ...children) {
  return h('section', { class: 'card' }, h('h2', { class: 'card-title', text: title }), ...children)
}

export function toast(message) {
  document.querySelector('.toast')?.remove()
  const el = h('div', { class: 'toast', role: 'status' }, message)
  document.body.append(el)
  setTimeout(() => el.remove(), 2400)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // http で開いたときや古いブラウザは、下の方法で試す
  }
  const area = h('textarea', { readonly: true, style: 'position:fixed;top:0;left:0;opacity:0' })
  area.value = text
  document.body.append(area)
  area.select()
  area.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}

/** テスト用「結果をコピー」のボタンと、コピーした内容を見せる欄 */
export function copyBlock(onCopy) {
  const area = h('div', { class: 'copy-area' })
  const button = h('button', {
    class: 'btn btn-test',
    type: 'button',
    onClick: async () => {
      const { ok, text } = await onCopy()
      area.replaceChildren(
        h('p', {
          class: 'copy-msg',
          text: ok
            ? 'コピーしました。送る内容は下のとおりです。'
            : 'コピーできませんでした。下の枠を長押しして、全部選んでコピーしてください。',
        }),
        ok
          ? h('pre', { class: 'copy-text', text })
          : h('textarea', { class: 'copy-text', rows: text.split('\n').length, readonly: true }, text),
      )
      if (ok) toast('コピーしました')
    },
  }, 'テスト用: 結果をコピー')
  return [button, area]
}
