// S0 タイトル / S1 遊び方 / S1.5 あなたは？ / S3 紹介

import { GENDERS } from '../catalog.js'
import { art, characterAvatar, h, tierBadge } from '../ui.js'

// S1 の文言（04 §4）
const HOW_TO_PLAY = [
  '相手のタイプはひみつ。',
  '返事の内容や、絵文字・語尾・返信の間の変化から相手を読んで、一番届く返事を選ぼう。',
  '点数は最後まで分からない。',
]

const TITLE_ART = `
<svg class="title-art" viewBox="6 8 54 54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M16 12H36A6 6 0 0 1 42 18V30A6 6 0 0 1 36 36H22L15 43V36H16A6 6 0 0 1 10 30V18A6 6 0 0 1 16 12Z" fill="#d4566e"/>
  <path d="M28 28H48A6 6 0 0 1 54 34V46A6 6 0 0 1 48 52V59L41 52H28A6 6 0 0 1 22 46V34A6 6 0 0 1 28 28Z" fill="#33405e"/>
  <circle cx="31" cy="40" r="2.6" fill="#fff"/>
  <circle cx="38" cy="40" r="2.6" fill="#fff"/>
  <circle cx="45" cy="40" r="2.6" fill="#fff"/>
</svg>`

export function titleScreen({ onStart }) {
  return h('section', { class: 'screen page center title' },
    art(TITLE_ART),
    h('h1', {}, '男女心', h('small', { text: '（仮）' })),
    h('p', { class: 'title-badge', text: '試作版' }),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: onStart }, 'はじめる'),
    h('p', { class: 'fine', text: '記録はこの端末のブラウザの中にだけ残ります。どこにも送信しません。' }),
  )
}

export function howToScreen({ onNext }) {
  return h('section', { class: 'screen page center howto' },
    h('h2', { class: 'howto-title', text: '遊び方' }),
    h('div', { class: 'howto-card' }, HOW_TO_PLAY.map((text) => h('p', { text }))),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: onNext }, 'わかった'),
  )
}

/** S1.5 あなたは？（06 §4）。同性・異性の札を出すためだけに使う */
export function genderScreen({ current, onDone }) {
  return h('section', { class: 'screen page center gender' },
    h('h2', { class: 'gender-title', text: 'あなたは？' }),
    h('div', { class: 'gender-options' },
      Object.entries(GENDERS).map(([id, label]) => h('button', {
        class: `btn ${id === current ? 'btn-primary' : 'btn-secondary'}`,
        type: 'button',
        onClick: () => onDone(id),
      }, label)),
    ),
    h('p', { class: 'fine gender-note', text: '同性・異性の組み合わせを出すために使います。記録はこの端末だけに残ります' }),
  )
}

/** S3 紹介。タイプも★も出さず、段階のバッジを出す */
export function introScreen({ episode, character, tierLabel, onStart, onBack }) {
  return h('section', { class: 'screen page center intro' },
    characterAvatar(character, 'xl'),
    h('p', { class: 'intro-name', text: character.name }),
    h('p', { class: 'intro-tier' }, tierBadge(episode.tier, tierLabel)),
    h('div', { class: 'intro-card' },
      h('p', { class: 'intro-title', text: episode.title }),
      h('p', { class: 'intro-text', text: episode.intro }),
    ),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: onStart }, '会話をはじめる'),
    onBack ? h('button', { class: 'btn btn-ghost', type: 'button', onClick: onBack }, 'ホームにもどる') : null,
  )
}
