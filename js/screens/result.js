// S6 結果（04 §4 S5 に、06 §4 S6 を足したもの）

import { TIERS } from '../catalog.js'
import { bestChoice, evaluationOf, rankFor, scenesOf } from '../rules.js'
import { card, characterAvatar, copyBlock, h, speakerName, stars, tierBadge } from '../ui.js'

const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮'
const stepNumber = (id) => CIRCLED[id - 1] ?? `${id}.`
const STAR_LABELS = { 1: '余裕あり', 2: 'ふつう', 3: '余裕なし' } // 心の余裕（設計書 §3.3）

export function resultScreen({ episode, character, rules, types, play, saved, guess, onRetry, onHome, onCopy }) {
  const type = types.types.find((t) => t.id === character.type)
  const axes = Object.entries(types.axes)
  const result = episode.result ?? {}
  const ctx = { episode, character, rules, types, type, axes }

  return h('section', { class: 'screen result' },
    scorePart(ctx, play, saved),
    type ? typePart(ctx) : null,
    guess ? guessPart(ctx, guess) : null,
    stepsPart(ctx, play),
    cuesPart(ctx, play),
    type?.tips?.length
      ? card(`${type.name}との話し方`, h('ul', { class: 'tips' }, type.tips.map((tip) => h('li', { text: tip }))))
      : null,
    result.real_line ? card('リアルで使える一言', h('p', { class: 'real-line', text: result.real_line })) : null,
    result.learn?.length
      ? card('このエピソードで学べること', h('ol', { class: 'learn' }, result.learn.map((item) => h('li', { text: item }))))
      : null,
    h('p', { class: 'footnote', text: 'タイプは入口。最後は目の前の本人に聞くのが一番。' }),
    h('div', { class: 'actions' },
      h('button', { class: 'btn btn-primary', type: 'button', onClick: onHome }, 'ホームにもどる'),
      h('button', { class: 'btn btn-secondary', type: 'button', onClick: onRetry }, 'もう一度'),
      copyBlock(onCopy),
    ),
  )
}

// 1. 点数とランク（初見かリトライか。リトライならベストも）
function scorePart({ episode, character, rules }, play, saved) {
  const { isFirst, record } = saved
  const meta = isFirst
    ? [h('span', { class: 'chip accent', text: '初見' })]
    : [
        h('span', { class: 'chip accent', text: `リトライ（${record.plays}回目）` }),
        h('span', { class: 'chip', text: `ベスト ${record.best}点` }),
        h('span', { class: 'chip', text: `初見 ${record.first.score}点` }),
      ]
  return h('header', { class: 'score' },
    h('p', { class: 'score-title', text: `${character.name}との会話「${episode.title}」` }),
    h('p', { class: 'score-num' }, String(play.score), h('small', { text: '点' })),
    h('p', { class: 'score-rank', text: rankFor(play.score, rules).label }),
    play.endReason ? h('p', { class: 'score-end', text: '途中で会話が終わった' }) : null,
    h('div', { class: 'score-meta' }, tierBadge(episode.tier, TIERS[episode.tier]), meta),
  )
}

// 2. タイプの種明かし（心の余裕の★と、ギャップも）
function typePart({ episode, character, type, axes }) {
  const section = card(`${character.name}のタイプは……`,
    h('p', { class: 'type-name', text: type.name }),
    h('p', { class: 'type-catch', text: type.catch }),
    h('dl', { class: 'axes' }, axes.map(([key, axis]) => h('div', { class: 'axis' },
      h('dt', { text: `${key} ${axis.label}` }),
      h('dd', { text: axis.values[type[key]] }),
    ))),
    h('p', { class: 'type-stars' },
      '心の余裕 ', stars(character.stars), `（${STAR_LABELS[character.stars] ?? ''}）`,
    ),
    gapPart({ episode, character, type, axes }),
  )
  section.classList.add('reveal')
  return section
}

/** ギャップの種明かし。その話にギャップの話題（topic）が出たとき、またはギャップ推理の話のときだけ出す */
function gapPart({ episode, character, type, axes }) {
  const topics = new Set(scenesOf(episode).flatMap((scene) => scene.steps.map((step) => step.topic).filter(Boolean)))
  const gaps = (character.switches ?? []).filter((item) => episode.guess === 'gap' || topics.has(item.topic))
  if (!gaps.length) return null
  const axisMap = Object.fromEntries(axes)
  const correct = episode.gap_guess?.options.find((option) => option.correct)
  return h('div', { class: 'gap-reveal' },
    h('p', { class: 'gap-title', text: 'ギャップ' }),
    gaps.map((gap) => h('div', { class: 'gap-item' },
      correct && gaps.length === 1 ? h('p', { class: 'gap-text', text: correct.text }) : null,
      Object.entries(gap.flips ?? {}).map(([key, value]) => h('p', {
        class: 'gap-flip',
        text: `${key} ${axisMap[key]?.label ?? ''}: ${axisMap[key]?.values[type[key]] ?? ''} → ${axisMap[key]?.values[value] ?? value}`,
      })),
      gap.cue ? h('p', { class: 'gap-cue', text: `見分け方: ${gap.cue}` }) : null,
    )),
  )
}

// 3. 推理の答え合わせ（スキップしたら出さない）
function guessPart({ episode, type, axes }, guess) {
  if (guess.kind === 'gap') {
    const options = episode.gap_guess?.options ?? []
    const chosen = options.find((option) => option.id === guess.option)
    const correct = options.find((option) => option.correct)
    const ok = chosen?.correct === true
    return card('あなたの推理',
      h('p', { class: `gap-answer ${ok ? 'ok' : 'ng'}` },
        h('span', { class: 'guess-mark', 'aria-label': ok ? '正解' : '不正解', text: ok ? '○' : '×' }),
        h('span', { text: chosen?.text ?? '' }),
      ),
      ok || !correct ? null : h('p', { class: 'note', text: `正解: ${correct.text}` }),
    )
  }
  if (!type) return null
  const hits = axes.filter(([key]) => guess.answers[key] === type[key]).length
  return card('あなたの推理',
    h('ul', { class: 'guess-list' }, axes.map(([key, axis]) => {
      const ok = guess.answers[key] === type[key]
      return h('li', { class: `guess-row ${ok ? 'ok' : 'ng'}` },
        h('span', { class: 'guess-axis', text: `${key} ${axis.label}` }),
        h('span', { class: 'guess-you', text: axis.values[guess.answers[key]] }),
        h('span', { class: 'guess-mark', 'aria-label': ok ? '正解' : '不正解', text: ok ? '○' : '×' }),
      )
    })),
    h('p', { class: 'guess-sum', text: `${axes.length}つ中 ${hits}つ正解` }),
  )
}

// 4. 1手ごとの解説。場面の札で区切り、会う場面では心の声も出す
function stepsPart(ctx, play) {
  const groups = play.scenes
    .map(({ scene, rough }) => ({ scene, rough, steps: play.steps.filter((s) => s.scene === scene) }))
    .filter((group) => group.steps.length)
  return card('1手ごとの解説',
    groups.map((group) => [
      group.scene.label ? h('h3', { class: 'scene-head', text: group.scene.label }) : null,
      group.rough ? h('p', { class: 'scene-rough', text: '前の場面のミスで、はじめの様子が変わっていた' }) : null,
      group.steps.map((s) => stepBlock(ctx, s)),
    ]),
    play.endReason ? h('p', { class: 'steps-end', text: 'ここで会話が終わった' }) : null,
  )
}

// 同性・異性で入れかわった手の印（06 §6.5）
const VARIANT_BADGES = { same: '同性のとき', opposite: '異性のとき' }

function stepBlock({ character, rules }, { step, variant, scene, lines, choice }) {
  const evaluation = evaluationOf(choice, character.stars, rules)
  const best = choice.grade === 'best' ? null : bestChoice(step)
  const face = scene.mode === 'face'
  return h('article', { class: 'step' },
    h('p', { class: 'step-head' },
      h('span', { class: 'step-no', text: stepNumber(step.id) }),
      step.topic ? h('span', { class: 'badge gap', text: 'ギャップ' }) : null,
      VARIANT_BADGES[variant] ? h('span', { class: `badge pair pair-${variant}`, text: VARIANT_BADGES[variant] }) : null,
    ),
    h('div', { class: 'mini partner' }, lines.map((line) => miniLine(line, character))),
    reply(choice, character),
    h('p', { class: `ev tone-${evaluation.tone}` },
      evaluation.label,
      evaluation.points ? h('span', { class: 'ev-points', text: ` −${-evaluation.points}` }) : null,
    ),
    h('p', { class: 'note', text: choice.note }),
    face && choice.inner ? innerVoice(`${character.name}の心の声`, choice.inner) : null,
    best
      ? h('div', { class: 'best' },
          h('p', { class: 'best-label', text: `${rules.grades.best.mark} 最適解` }),
          reply(best, character),
          h('p', { class: 'note', text: best.note }),
          face && best.inner ? innerVoice('そのときの心の声', best.inner) : null,
        )
      : null,
  )
}

// 5. 手がかりはここにあった（実際に出たセリフの手がかりだけ。表情の手がかりには、そのときの顔を添える）
function cuesPart({ character, types }, play) {
  const items = play.steps.flatMap(({ step, scene, lines, cues }) => cues.map((cue) => {
    const line = lines.find((item) => (typeof item === 'string' ? item : item.text) === cue.line)
    const face = scene.mode === 'face' && typeof line === 'object' ? line.face : null
    return h('li', { class: 'cue' },
      h('div', { class: 'cue-head' },
        h('span', { class: 'step-no', text: stepNumber(step.id) }),
        face ? characterAvatar(character, 'sm', face) : null,
        h('p', { class: 'mini-bubble', text: cue.line }),
      ),
      h('p', { class: 'cue-text' },
        h('span', { class: 'axis-tag', text: `${cue.axis} ${types.axes[cue.axis]?.label ?? ''}`.trim() }),
        cue.text,
      ),
    )
  }))
  return items.length ? card('手がかりはここにあった', h('ul', { class: 'cues' }, items)) : null
}

function miniLine(line, character) {
  if (typeof line === 'string') return h('p', { class: 'mini-bubble', text: line })
  if (line.who === 'narration') return h('p', { class: 'mini-narration', text: line.text })
  if (line.who === 'staff') {
    return h('p', { class: 'mini-bubble staff' }, h('span', { class: 'mini-tag', text: speakerName('staff', character) }), line.text)
  }
  return h('p', { class: 'mini-bubble', text: line.text })
}

function reply(choice, character) {
  const text = choice.send_as === 'sticker' ? `${choice.text} ${choice.sticker}` : choice.text
  const to = choice.to && choice.to !== character.id ? `→ ${speakerName(choice.to, character)}に` : null
  return h('div', { class: 'mini player' },
    to ? h('p', { class: 'reply-to', text: to }) : null,
    h('p', { class: 'mini-bubble', text }),
  )
}

function innerVoice(label, text) {
  return h('div', { class: 'inner' }, h('p', { class: 'inner-label', text: label }), h('p', { class: 'inner-text', text }))
}
