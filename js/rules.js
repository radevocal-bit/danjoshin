// 採点と進行のルール（04 §5・§6、06 §4）。content/rules.json に従う。画面には触らない。

/** その返事の減点（0 か負の数）。grade と manners の両方があるときは大きい方だけ */
export function deductionFor(choice, stars, rules) {
  let points = 0
  if (choice.grade) points = Math.min(points, rules.grades[choice.grade]?.points[String(stars)] ?? 0)
  if (choice.manners) points = Math.min(points, rules.manners[choice.manners]?.points ?? 0)
  return points
}

/** 減点したあとの点数。0点より下にはしない */
export function applyDeduction(score, points) {
  return Math.max(0, score + points)
}

/** 会話が終わる理由（'zero' / 'stars' / 'manners'）。続くなら null */
export function endReasonFor(choice, score, stars, rules) {
  if (score <= 0) return 'zero'
  if (choice.grade && rules.grades[choice.grade]?.ends_conversation_at_stars?.includes(stars)) return 'stars'
  if (choice.manners && rules.manners[choice.manners]?.ends_conversation) return 'manners'
  return null
}

/** ミスの返事か: 評価が miss_grades、または人としての基本が miss_manners */
export function isMiss(choice, rules) {
  if (!choice) return false
  return rules.miss_grades.includes(choice.grade) || (rules.miss_manners ?? []).includes(choice.manners)
}

/** その手で出すセリフと手がかり。直前がミスなら partner_after_miss / cues_after_miss を使う */
export function stepContent(step, previousChoice, rules) {
  const afterMiss = Boolean(step.partner_after_miss) && isMiss(previousChoice, rules)
  return {
    afterMiss,
    lines: afterMiss ? step.partner_after_miss : step.partner,
    cues: (afterMiss && step.cues_after_miss) || step.cues || [],
  }
}

// 同性・異性で入れかわる手（06 §6.5）で、上書きできる項目
export const PAIRING_FIELDS = ['scene', 'partner', 'partner_after_miss', 'cues', 'cues_after_miss', 'choices']

/**
 * プレイヤーと相手の組み合わせ（same / opposite / null＝答えない）で出す手（06 §6.5）。
 * by_pairing にその組み合わせがあれば、書いてある項目だけを上書きする（id・mode・phase は元の手のまま）。
 * variant: 'same' / 'opposite'（入れかえた）・'base'（入れかわる手だが元の手を出した）・null（入れかわらない手）
 */
export function stepFor(step, pairing) {
  if (!step.by_pairing) return { step, variant: null }
  const override = pairing ? step.by_pairing[pairing] : null
  if (!override) return { step, variant: 'base' }
  const merged = { ...step }
  for (const field of PAIRING_FIELDS) {
    if (field in override) merged[field] = override[field]
  }
  return { step: merged, variant: pairing }
}

const singleScenes = new WeakMap()

/** 話の場面。v1 の形（scenes がなく steps が直下）は、札のない1つの場面として扱う */
export function scenesOf(episode) {
  if (episode.scenes?.length) return episode.scenes
  if (!singleScenes.has(episode)) {
    singleScenes.set(episode, [{ id: 'main', label: null, mode: episode.steps?.[0]?.mode ?? 'chat', steps: episode.steps ?? [] }])
  }
  return singleScenes.get(episode)
}

/** 場面のはじめのセリフ。前の場面のミスが rough_scene_min_misses 回以上なら opening_if_rough */
export function openingFor(scene, previousSceneMisses, rules) {
  const rough = previousSceneMisses != null
    && previousSceneMisses >= (rules.rough_scene_min_misses ?? 1)
    && Boolean(scene.opening_if_rough)
  return { rough, lines: (rough ? scene.opening_if_rough : scene.opening) ?? [] }
}

/** ランク: ranks を上から見て、min 以上の最初のもの */
export function rankFor(score, rules) {
  return rules.ranks.find((rank) => score >= rank.min) ?? rules.ranks[rules.ranks.length - 1]
}

export function bestChoice(step) {
  return step.choices.find((choice) => choice.grade === 'best') ?? null
}

/** 結果画面に出す評価。label は「× 逆効果」「人として・重」など、tone は色分け用 */
export function evaluationOf(choice, stars, rules) {
  const grade = choice.grade ? rules.grades[choice.grade] : null
  const manners = choice.manners ? rules.manners[choice.manners] : null
  const gradePoints = grade?.points[String(stars)] ?? 0
  return {
    label: [grade && `${grade.mark} ${grade.label}`, manners?.label].filter(Boolean).join('／'),
    points: deductionFor(choice, stars, rules),
    tone: manners && (!grade || manners.points <= gradePoints) ? 'manners' : choice.grade,
  }
}

/** 並べ替えたコピーを返す（Fisher–Yates） */
export function shuffle(items, random = Math.random) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const item = result[i]
    result[i] = result[j]
    result[j] = item
  }
  return result
}
