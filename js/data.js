// content/ の JSON を読む。会話の中身はすべてここから（04 §3・§11、06 §6）

import { PAIRING_FIELDS, scenesOf, stepFor } from './rules.js'

const cache = new Map()
const TIER_IDS = ['beginner', 'intermediate', 'advanced']
const NO_ART = { characters: {}, backgrounds: {} }

export function loadJSON(path) {
  if (!cache.has(path)) {
    const request = fetch(path, { cache: 'no-cache' }).then((response) => {
      if (!response.ok) throw new Error(`${path} を読み込めませんでした（${response.status}）`)
      return response.json()
    })
    request.catch(() => cache.delete(path))
    cache.set(path, request)
  }
  return cache.get(path)
}

/** 遊べる話を全部読む（ホームに並べるため） */
export async function loadGame() {
  const [index, rules, types, art] = await Promise.all([
    loadJSON('content/index.json'),
    loadJSON('content/rules.json'),
    loadJSON('content/types.json'),
    loadJSON('content/art.json').catch(() => NO_ART), // 画像に差し替えていなければ、なくてよい
  ])
  const entries = await Promise.all(index.episodes.map((item) => loadEpisode(item.id)))
  return { index, rules, types, art, entries }
}

export async function loadEpisode(id) {
  const episode = await loadJSON(`content/episodes/${id}.json`)
  const character = await loadJSON(`content/characters/${episode.character}.json`)
  return { episode, character }
}

/**
 * データの点検。おかしな所を文章の配列で返す（ブラウザではコンソールに出す）
 * backgrounds: 絵がある背景ID / episodeIds: index.json にある話のID（requires の確認用）
 */
export function validateEpisode({ episode, character }, { rules, types, backgrounds = null, episodeIds = null }) {
  const problems = []
  const problem = (where, message) => problems.push(`${episode.id}${where}: ${message}`)
  const faces = rules.faces ?? []
  const people = [character.id, 'staff', 'narration']
  const textsOf = (lines) => (lines ?? []).map((line) => (typeof line === 'string' ? line : line.text))
  const switchTopics = (character.switches ?? []).map((item) => item.topic)

  if (!types.types.some((type) => type.id === character.type)) problem('', `タイプ ${character.type} が types.json にない`)
  if (!(String(character.stars) in rules.grades.best.points)) problem('', `★${character.stars} の減点が rules.json にない`)
  for (const item of character.switches ?? []) {
    for (const axis of Object.keys(item.flips ?? {})) {
      if (!types.axes[axis]) problem('', `${character.id} の switches の軸 ${axis} が types.json にない`)
    }
  }
  if (episode.tier && !TIER_IDS.includes(episode.tier)) problem('', `tier「${episode.tier}」は ${TIER_IDS.join(' / ')}`)
  if (episode.pairing && !['any', 'opposite'].includes(episode.pairing)) problem('', `pairing「${episode.pairing}」は any / opposite`)
  if (episode.requires && episodeIds && !episodeIds.includes(episode.requires)) problem('', `requires「${episode.requires}」が index.json にない`)
  if (episode.guess === 'gap') {
    const options = episode.gap_guess?.options ?? []
    if (options.length !== 4) problem('', `gap_guess の選択肢が ${options.length} 個（4つの想定）`)
    if (options.filter((option) => option.correct).length !== 1) problem('', 'gap_guess の正解（correct: true）が1つでない')
  }

  const checkLine = (line, where, mode) => {
    if (typeof line === 'string') {
      if (mode === 'face') problem(where, '会う場面のセリフは { who, text } の形')
      return
    }
    if (!line?.text) problem(where, 'text がない')
    if (line.who && !people.includes(line.who)) problem(where, `who「${line.who}」は ${people.join(' / ')}`)
    if (line.face && !faces.includes(line.face)) problem(where, `face「${line.face}」が rules.json の faces にない`)
    if (mode === 'face' && line.who === character.id && !line.face) problem(where, `「${line.text}」に表情（face）がない`)
    if (line.delay && line.delay !== 'long') problem(where, `delay「${line.delay}」は long だけ`)
  }

  /** 1手の中身の点検。同性・異性で入れかわる手は、入れかえたあとの手もこれで点検する */
  const checkStep = (step, where, mode) => {
    if (!step.partner?.length) problem(where, 'partner がない')
    for (const line of step.partner ?? []) checkLine(line, where, mode)
    for (const line of step.partner_after_miss ?? []) checkLine(line, `${where} partner_after_miss`, mode)

    const checkCues = (cues, lines, name) => {
      for (const cue of cues ?? []) {
        if (!types.axes[cue.axis]) problem(where, `${name} の軸 ${cue.axis} が types.json にない`)
        if (!textsOf(lines).includes(cue.line)) problem(where, `${name} の line「${cue.line}」がセリフにない`)
      }
    }
    checkCues(step.cues, step.partner, 'cues')
    if (step.partner_after_miss) {
      // cues_after_miss がない手は、ミスのあとも cues を使う
      checkCues(step.cues_after_miss ?? step.cues, step.partner_after_miss, step.cues_after_miss ? 'cues_after_miss' : 'cues（ミスのあと）')
    }

    const choices = step.choices ?? []
    const bests = choices.filter((choice) => choice.grade === 'best').length
    if (choices.length !== 4) problem(where, `選択肢が ${choices.length} 個（4つの想定）`)
    if (new Set(choices.map((choice) => choice.id)).size !== choices.length) problem(where, '選択肢の id が重複している')
    if (bests === 0) problem(where, '最適解（grade: best）がない')
    if (bests > 1) problem(where, `最適解（grade: best）が ${bests} 個ある（1つにする）`)
    for (const choice of choices) {
      const here = `${where}-${choice.id}`
      if (!choice.grade && !choice.manners) problem(here, 'grade も manners もない')
      if (choice.grade && !rules.grades[choice.grade]) problem(here, `grade「${choice.grade}」が rules.json にない`)
      if (choice.manners && !rules.manners[choice.manners]) problem(here, `manners「${choice.manners}」が rules.json にない`)
      if (choice.send_as === 'sticker' && !choice.sticker) problem(here, 'sticker がない')
      if (mode === 'face') {
        if (!choice.to) problem(here, 'to（誰への返事か）がない')
        else if (![character.id, 'staff'].includes(choice.to)) problem(here, `to「${choice.to}」は ${character.id} / staff`)
        if (!choice.inner) problem(here, 'inner（心の声）がない')
      }
      for (const line of choice.reaction ?? []) checkLine(line, `${here} reaction`, mode)
      for (const axis of Object.keys(choice.leans ?? {})) {
        if (!types.axes[axis]) problem(here, `leans の軸 ${axis} が types.json にない`)
      }
    }
  }

  /** 同性・異性で入れかわる手（06 §6.5）の点検 */
  const checkPairing = (step, where, mode) => {
    if (episode.pairing === 'opposite') problem(where, 'by_pairing は pairing: any の話だけ（恋愛の話には付けない）')
    for (const [key, override] of Object.entries(step.by_pairing)) {
      const at = `${where}（${PAIRING_NAMES[key] ?? key}）`
      if (!PAIRING_NAMES[key]) {
        problem(at, 'by_pairing に書けるのは same / opposite だけ')
        continue
      }
      for (const field of Object.keys(override ?? {})) {
        if (!PAIRING_FIELDS.includes(field)) problem(at, `「${field}」は上書きできない（${PAIRING_FIELDS.join('・')} だけ）`)
      }
      if (step.partner_after_miss && !override?.partner_after_miss) problem(at, '元の手に partner_after_miss があるので、こちらにも書く')
      const variant = stepFor(step, key).step
      checkStep(variant, at, mode)
      const base = cueAxes(step)
      const swapped = cueAxes(variant)
      if (base.join('') !== swapped.join('')) {
        problem(at, `手がかりの軸（${swapped.join('・') || 'なし'}）が、元の手（${base.join('・') || 'なし'}）と違う`)
      }
    }
  }

  if (!scenesOf(episode).some((scene) => scene.steps?.length)) problem('', 'steps がない')
  const stepIds = new Set()
  let pairingSteps = 0
  for (const scene of scenesOf(episode)) {
    const mode = scene.mode
    const at = episode.scenes ? ` 場面${scene.id}` : ''
    if (!['chat', 'face'].includes(mode)) problem(at, `mode が chat / face 以外（${mode}）`)
    if (episode.scenes && !scene.label) problem(at, 'label（場面の札）がない')
    if (mode === 'face') {
      if (!scene.background) problem(at, 'background がない')
      else if (backgrounds && !backgrounds.includes(scene.background)) problem(at, `background「${scene.background}」の絵がない`)
    }
    for (const line of scene.opening ?? []) checkLine(line, `${at} opening`, mode)
    for (const line of scene.opening_if_rough ?? []) checkLine(line, `${at} opening_if_rough`, mode)

    for (const step of scene.steps ?? []) {
      const where = ` 手${step.id}`
      if (stepIds.has(step.id)) problem(where, '手の id が重複している')
      stepIds.add(step.id)
      if (step.mode && step.mode !== mode) problem(where, `mode（${step.mode}）が場面の mode（${mode}）と違う`)
      if (step.topic && !switchTopics.includes(step.topic)) problem(where, `topic「${step.topic}」がキャラの switches にない`)
      checkStep(step, where, mode)
      if (step.by_pairing) {
        pairingSteps += 1
        checkPairing(step, where, mode)
      }
    }
  }
  if (pairingSteps > 1) problem('', `by_pairing は1話に1手まで（${pairingSteps}手にある）`)

  // リアルで使える一言は、入れかわる手から取らない（どの組み合わせで遊んでも出会う一言にする）
  const realLine = episode.result?.real_line
  for (const step of realLine ? scenesOf(episode).flatMap((scene) => scene.steps ?? []) : []) {
    if (!step.by_pairing) continue
    const texts = [step, ...Object.values(step.by_pairing)].flatMap((part) => (part?.choices ?? []).map((choice) => choice.text))
    if (texts.includes(realLine)) problem(` 手${step.id}`, 'result.real_line が入れかわる手の選択肢から取られている（どの組み合わせでも出会う一言にする）')
  }

  // どの組み合わせ（答えない・同性・異性）で遊んでも、4軸の手がかりがそろう
  for (const pairing of pairingSteps ? [null, 'same', 'opposite'] : [null]) {
    const seen = new Set(scenesOf(episode).flatMap((scene) => (scene.steps ?? []).flatMap((step) => cueAxes(stepFor(step, pairing).step))))
    const missing = Object.keys(types.axes).filter((axis) => !seen.has(axis))
    if (missing.length) problem('', `${pairing ? `${PAIRING_NAMES[pairing]}で` : ''}遊ぶと、手がかりのない軸がある（${missing.join('・')}）`)
  }

  for (const line of episode.exit ?? []) checkLine(line, ' exit', null)
  return [...new Set(problems)]
}

const PAIRING_NAMES = { same: '同性', opposite: '異性' }

/** その手の手がかりの軸（cues と cues_after_miss）。並べて返す */
function cueAxes(step) {
  return [...new Set([...(step.cues ?? []), ...(step.cues_after_miss ?? [])].map((cue) => cue.axis))].sort()
}
