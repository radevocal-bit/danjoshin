// S2 ホーム（06 §4）。タブは相手の性別。★（心の余裕）はここでは出さない

import { GENDERS, PAIRINGS, TABS, homeCards } from '../catalog.js'
import { characterAvatar, h, tierBadge } from '../ui.js'

export function homeScreen({ entries, tab, playerGender, recordOf, onTab, onOpen, onChangeGender }) {
  const cards = homeCards({ entries, tab, playerGender, recordOf })

  const cardNode = (c) => h('button', {
    class: `ep-card${c.locked ? ' locked' : ''}`,
    type: 'button',
    disabled: c.locked,
    onClick: () => onOpen(c.episode.id),
  },
    characterAvatar(c.character, 'md'),
    h('span', { class: 'ep-body' },
      h('span', { class: 'ep-top' },
        h('span', { class: 'ep-name', text: c.character.name }),
        tierBadge(c.episode.tier, c.tier),
        c.pairing ? h('span', { class: `badge pair pair-${c.pairing}`, text: PAIRINGS[c.pairing] }) : null,
      ),
      h('span', { class: 'ep-title', text: c.episode.title }),
      c.locked
        ? h('span', { class: 'ep-lock', text: `🔒 ${c.lockText}` })
        : h('span', { class: 'ep-relation', text: c.relation }),
      !c.locked && c.best != null ? h('span', { class: 'ep-best', text: `最高 ${c.best}点` }) : null,
    ),
  )

  return h('section', { class: 'screen home' },
    h('header', { class: 'home-head' },
      h('p', { class: 'home-logo' }, '男女心', h('small', { text: '（仮）試作版' })),
      h('button', { class: 'home-you', type: 'button', onClick: onChangeGender },
        `あなた: ${GENDERS[playerGender] ?? GENDERS.none}`,
        h('span', { class: 'home-change', text: '変える' }),
      ),
    ),
    h('div', { class: 'tabs', role: 'tablist' },
      TABS.map((item) => h('button', {
        class: 'tab',
        type: 'button',
        role: 'tab',
        'aria-selected': String(item.id === tab),
        onClick: () => onTab(item.id),
      }, item.label)),
    ),
    h('div', { class: 'home-list' },
      cards.length ? cards.map(cardNode) : h('p', { class: 'fine home-empty', text: 'まだ遊べる話がありません' }),
    ),
    h('p', { class: 'fine home-foot', text: '記録はこの端末のブラウザの中にだけ残ります。' }),
  )
}
