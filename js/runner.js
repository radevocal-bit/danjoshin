// 1話を最初から最後まで進める（04 §4・§5・§6、06 §4）。
// 見せ方（チャットか会う場面か、待ち時間）は director と view に任せるので、ここは画面を知らない。

import { applyDeduction, deductionFor, endReasonFor, isMiss, openingFor, scenesOf, shuffle, stepContent, stepFor } from './rules.js'

/**
 * director.enterScene(scene, index) → その場面の view
 * view が持つもの:
 *   partner(line, step) / choose(choices, step) → 選んだ choice / player(choice, step)
 *   reaction(line, step) / noReply(step) / exit(line)
 * pairing: プレイヤーと相手が 'same' / 'opposite'。答えないなら null（入れかわる手は元の手のまま）
 * 返すもの: { episodeId, score, endReason,
 *            scenes: [{ scene, rough }],
 *            steps: [{ step（実際に出た手）, variant, scene, afterMiss, lines, cues, choice, points, score }] }
 */
export async function runEpisode({ episode, character, rules, director, pairing = null, random = Math.random }) {
  const stars = character.stars
  const scenes = []
  const steps = []
  let score = rules.start_score
  let previous = null // 直前の返事（場面をまたいで続く）
  let previousSceneMisses = null // 最初の場面には前がない
  let endReason = null

  for (const [index, scene] of scenesOf(episode).entries()) {
    const view = await director.enterScene(scene, index)
    // 前の場面の出来が、会ったときの最初の表情に出る
    const opening = openingFor(scene, previousSceneMisses, rules)
    scenes.push({ scene, rough: opening.rough })
    for (const line of opening.lines) await view.partner(line, null)

    let misses = 0
    for (const original of scene.steps) {
      // 同性・異性で1手だけ入れかわる（06 §6.5）
      const { step, variant } = stepFor(original, pairing)
      const { afterMiss, lines, cues } = stepContent(step, previous, rules)
      for (const line of lines) await view.partner(line, step)

      // データでは最適解が先頭に多いので、表示順は毎回シャッフル
      const choice = await view.choose(shuffle(step.choices, random), step)
      await view.player(choice, step)

      const points = deductionFor(choice, stars, rules)
      score = applyDeduction(score, points)
      steps.push({ step, variant, scene, afterMiss, lines, cues, choice, points, score })
      if (isMiss(choice, rules)) misses += 1

      const reaction = choice.reaction ?? []
      if (reaction.length === 0) await view.noReply(step)
      for (const line of reaction) await view.reaction(line, step)

      endReason = endReasonFor(choice, score, stars, rules)
      if (endReason) break
      previous = choice
    }

    if (endReason) {
      // 0点などで終わるときは、今の場面の形で exit を出す
      for (const line of episode.exit ?? []) await view.exit(line)
      break
    }
    previousSceneMisses = misses
  }

  return { episodeId: episode.id, score, endReason, scenes, steps }
}
