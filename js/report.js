// テスト用「結果をコピー」の文字列（04 §9。06 で、どの話か・プレイヤーの性別・ギャップ推理を足した）

import { GENDERS, PAIRINGS, TIERS, pairingOf } from './catalog.js'
import { rankFor } from './rules.js'

const VARIANTS = { same: '同性', opposite: '異性', base: '元の手' }

/**
 * guess: null（スキップ）/ { kind: 'type', answers: { A: 'near', … } } / { kind: 'gap', option: 'a' }
 */
export function buildReport({ rules, types, episode, character, play, saved, guess, playMs, playerGender }) {
  const { record, isFirst } = saved
  const first = record.first ?? { score: play.score }
  const tier = TIERS[episode.tier]
  const pairing = pairingOf(playerGender, character.gender)
  const now = isFirst ? `${play.score}` : `${play.score}（${record.plays}回目）`
  const picks = play.steps.map(({ step, choice }) => `${step.id}-${choice.id}${markOf(choice, rules)}`).join(' ')
  const ended = play.endReason ? `（${play.steps.length}手目で終了）` : ''
  const swapped = play.steps.find(({ variant }) => variant) // 同性・異性で入れかわる手（そこまで進んだとき）
  return [
    '【男女心 試作テスト】',
    `話: ${character.name}「${episode.title}」${tier ? `（${tier}）` : ''}`,
    `あなた: ${GENDERS[playerGender] ?? GENDERS.none}${pairing ? `（${PAIRINGS[pairing]}）` : ''}`,
    `初見スコア: ${first.score}（${rankFor(first.score, rules).label}） / 今回: ${now}`,
    `選んだ返事: ${picks}${ended}`,
    swapped ? `入れかわる手: ${swapped.step.id}手目＝${VARIANTS[swapped.variant]}` : null,
    guessLine(episode, guess, types, character),
    `プレイ時間: ${formatDuration(playMs)}`,
  ].filter((line) => line != null).join('\n')
}

export function formatDuration(ms) {
  const seconds = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(seconds / 60)}分${seconds % 60}秒`
}

function markOf(choice, rules) {
  const grade = choice.grade ? rules.grades[choice.grade]?.mark ?? '' : ''
  const manners = choice.manners ? `（${rules.manners[choice.manners]?.label}）` : ''
  return grade + manners
}

function guessLine(episode, guess, types, character) {
  if (episode.guess === 'gap') {
    if (!guess) return 'ギャップ推理: スキップ'
    const correct = episode.gap_guess?.options.find((option) => option.correct)
    return `ギャップ推理: ${guess.option === correct?.id ? '○' : '×'}（${guess.option}）`
  }
  if (!guess) return 'タイプ推理: スキップ'
  const answer = types.types.find((type) => type.id === character.type)
  const marks = Object.keys(types.axes).map((axis) => `${axis}${guess.answers[axis] === answer?.[axis] ? '○' : '×'}`)
  return `タイプ推理: ${marks.join(' ')}`
}
