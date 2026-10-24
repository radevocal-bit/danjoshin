// ホームに並べる話（06 §4 S2）。段階・同性／異性・鍵を決める。画面には触らない。

export const TIERS = { beginner: '初級', intermediate: '中級', advanced: '上級' }
export const GENDERS = { male: '男性', female: '女性', none: '答えない' }
export const PAIRINGS = { same: '同性', opposite: '異性' }
export const TABS = [
  { id: 'female', label: '女心を学ぶ' },
  { id: 'male', label: '男心を学ぶ' },
]

/** 同性／異性。プレイヤーが「答えない」なら null（札を出さない） */
export function pairingOf(playerGender, partnerGender) {
  if (playerGender !== 'male' && playerGender !== 'female') return null
  return playerGender === partnerGender ? 'same' : 'opposite'
}

/** 最初に開くタブ: 異性の相手のタブ。「答えない」なら女心 */
export function defaultTab(playerGender) {
  return playerGender === 'female' ? 'male' : 'female'
}

/**
 * タブに並べる話のカード
 * @param entries   [{ episode, character }]（index.json の順）
 * @param recordOf  (episodeId) => { plays, best }
 */
export function homeCards({ entries, tab, playerGender, recordOf }) {
  const byId = new Map(entries.map((entry) => [entry.episode.id, entry]))
  return entries
    .filter(({ character }) => character.gender === tab)
    .map(({ episode, character }) => {
      const pairing = pairingOf(playerGender, character.gender)
      const required = episode.requires ? byId.get(episode.requires) : null
      const locked = Boolean(episode.requires) && !(recordOf(episode.requires).plays > 0)
      return {
        episode,
        character,
        pairing,
        tier: TIERS[episode.tier] ?? null,
        // 恋愛の話（opposite）は、同性のプレイヤーには出さない
        hidden: episode.pairing === 'opposite' && pairing === 'same',
        locked,
        lockText: locked
          ? required
            ? `${required.character.name}『${required.episode.title}』を遊ぶと開きます`
            : '前の話を遊ぶと開きます'
          : null,
        best: recordOf(episode.id).best,
        relation: (episode.intro ?? '').split('\n')[0],
      }
    })
    .filter((card) => !card.hidden)
}
