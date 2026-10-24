// キャラの仮の絵（06 §5）。キャラの look（見た目）と表情IDから、バストアップの SVG（文字列）を作る。
// フラットで、影もグラデーションもなし。線は同じ太さ。どのキャラも同じ描き方でそろえる。
// 本番の絵に替えるときは content/art.json に画像を登録する（art/index.js）。

const SKIN = '#F7DDCB'
const SKIN_DEEP = '#EDC9B2' // 首と耳（影ではなく、顔と分けるための色）
const IRIS = '#3B2B26'
const LINE = '#2B211F'
const MOUTH = '#99484C'
const BLUSH = '#F19B9B'

export const HAIR_COLORS = {
  black: '#2F2D37',
  dark_brown: '#4A3328',
  brown: '#6E4A33',
  light_brown: '#9A7050',
  ash: '#8C8B90',
}

export const CLOTHES_COLORS = {
  light_blue: '#A9C9E8',
  gray: '#A4A8AF',
  navy: '#3E4C6E',
  white: '#F2F0EB',
  beige: '#E1D1B5',
  pink: '#F0B8C5',
  green: '#9EC5A3',
}

// 表情 = 目・眉・口・頬の組み合わせ（06 §5.3）。「作り笑い」は口だけ笑って目は笑わない
export const FACES = {
  normal: { eyes: 'open', brows: 'neutral', mouth: 'closed_smile' },
  smile: { eyes: 'happy', brows: 'up', mouth: 'open_smile', blush: 0.4 },
  shy: { eyes: 'down', brows: 'soft', mouth: 'small_smile', blush: 0.85, shyLines: true },
  forced_smile: { eyes: 'flat', brows: 'lowered', mouth: 'wide_smile' },
  troubled: { eyes: 'open', brows: 'worried', mouth: 'wavy' },
  annoyed: { eyes: 'flat', brows: 'furrowed', mouth: 'frown' },
  sad: { eyes: 'down', brows: 'worried', mouth: 'sad' },
  look_away: { eyes: 'side', brows: 'neutral', mouth: 'flat' },
}

const EYES = {
  round: { rx: 7.2, ry: 8.4, iris: 5.4, browY: 81 },
  narrow: { rx: 8.4, ry: 4.9, iris: 4.1, browY: 85 },
  droopy: { rx: 7.6, ry: 7.2, iris: 5.1, browY: 82, tilt: 9 },
}

const BROWS = {
  // [内側の上下, 外側の上下, 真ん中の上下]
  neutral: [0, 1.2, -2.8],
  up: [-1.6, -0.6, -4.2],
  soft: [-0.8, 1.6, -2.4],
  lowered: [2.2, 2.6, 0.8],
  worried: [-4.4, 2.4, -2.2],
  furrowed: [3.4, -2.4, 0.6],
}

const MOUTHS = {
  closed_smile: 'M94.5 121Q100 125 105.5 121',
  small_smile: 'M96.5 121.5Q100 123.8 103.5 121.5',
  wide_smile: 'M90.5 120Q100 127.5 109.5 120',
  wavy: 'M94.5 122.5Q97.3 120 100 122.5Q102.7 125 105.5 122.5',
  frown: 'M93.5 124.5Q100 118.5 106.5 124.5',
  sad: 'M95.5 124Q100 120.8 104.5 124',
  flat: 'M95 122.5L105 122.5',
}

const FACE_SHAPE = 'M56 86C56 53 76 38 100 38C124 38 144 53 144 86C144 114 126 137 100 139C74 137 56 114 56 86Z'

// 髪型: back は頭の後ろ、front は前髪（と顔の前に落ちる髪）。coversEars なら耳を描かない
const HAIR = {
  short: {
    coversEars: false,
    back: ['M50 93C47 53 72 30 100 30C128 30 153 53 150 93C146 84 140 80 133 79H67C60 80 54 84 50 93Z'],
    front: [
      'M51 90C47 57 70 32 100 31C130 32 153 57 149 90C146 80 141 73 133 69C123 74 109 76 96 75C84 74 73 72 65 69C59 74 54 81 51 90Z',
      'M53 88H60V106L55 104Z',
      'M147 88H140V106L145 104Z',
    ],
  },
  long: {
    coversEars: true,
    back: ['M46 98C43 50 70 26 100 26C130 26 157 50 154 98C154 140 157 176 161 208H39C43 176 46 140 46 98Z'],
    front: [
      'M54 92C51 56 73 34 100 34C127 34 149 56 146 92C144 84 141 78 137 74C118 78 82 78 63 74C59 78 56 84 54 92Z',
      'M55 86C50 122 50 162 54 198L66 194C62 162 62 124 66 88Z',
      'M145 86C150 122 150 162 146 198L134 194C138 162 138 124 134 88Z',
    ],
  },
  ponytail: {
    coversEars: false,
    back: [
      'M50 94C47 52 72 30 100 30C128 30 153 52 150 94C146 84 140 80 133 79H67C60 80 54 84 50 94Z',
      'M136 50C158 52 172 76 168 108C165 132 154 150 146 160C149 138 151 114 146 94C143 80 139 68 132 60Z',
    ],
    front: [
      'M52 90C49 56 72 33 100 33C128 33 151 56 148 90C143 78 136 71 127 67C118 73 104 76 90 74C80 73 70 70 63 68C58 74 54 81 52 90Z',
      'M55 86C53 96 54 106 57 114L61 112C59 104 59 95 60 87Z',
      'M145 86C147 96 146 106 143 114L139 112C141 104 141 95 140 87Z',
    ],
    ornament: '<circle cx="146" cy="62" r="4" fill="#E8798F"/>', // 髪ゴム
  },
  bob: {
    coversEars: true,
    back: ['M47 98C44 51 70 26 100 26C130 26 156 51 153 98C152 121 150 135 146 145H54C50 135 48 121 47 98Z'],
    front: [
      'M54 92C51 56 73 34 100 34C127 34 149 56 146 92C140 77 133 69 125 65C119 74 109 79 96 80C100 74 101 68 99 62C89 70 76 75 63 78C59 83 56 87 54 92Z',
      'M55 85C50 106 52 129 60 146L70 144C63 125 62 105 66 87Z',
      'M145 85C150 106 148 129 140 146L130 144C137 125 138 105 134 87Z',
    ],
  },
  short_messy: {
    coversEars: false,
    back: ['M50 94C47 52 72 29 100 29C129 29 154 52 150 94C146 85 140 80 133 79H67C60 80 54 85 50 94Z'],
    front: [
      'M51 91C47 56 70 31 100 30C131 30 154 55 149 91L144 79L137 85L132 71L124 77L117 65L109 76L101 63L93 76L85 65L77 77L70 70L64 85L57 77Z',
      'M86 35L91 22L98 33Z',
      'M103 32L113 23L113 35Z',
      'M119 38L130 33L126 43Z',
      'M53 88H60V108L55 105Z',
      'M147 88H140V108L145 105Z',
    ],
  },
}

const BODY = 'M26 224C28 183 55 163 100 161C145 163 172 183 174 224Z'

// 服: under は首より後ろ（フードなど）、over は体の上に描く
const CLOTHES = {
  blouse: (c) => ({
    under: '',
    over:
      `<path d="M88 161L100 181L112 161Z" fill="${SKIN_DEEP}"/>` +
      `<path d="M86 158L100 181L92.5 189L78.5 166Z" fill="${c.light}"/>` +
      `<path d="M114 158L100 181L107.5 189L121.5 166Z" fill="${c.light}"/>` +
      `<circle cx="100" cy="197" r="2.1" fill="${c.deep}"/><circle cx="100" cy="212" r="2.1" fill="${c.deep}"/>`,
  }),
  hoodie: (c) => ({
    under: `<path d="M64 168C68 146 132 146 136 168C124 179 76 179 64 168Z" fill="${c.deep}"/>`,
    over:
      `<path d="M88 161Q100 172 112 161Z" fill="${SKIN_DEEP}"/>` +
      `<path d="M93.5 170L91.5 199M106.5 170L108.5 199" fill="none" stroke="${c.light}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="91.4" cy="201" r="2" fill="${c.light}"/><circle cx="108.6" cy="201" r="2" fill="${c.light}"/>`,
  }),
  shirt: (c) => ({
    under: '',
    over:
      `<path d="M90 161L100 177L110 161Z" fill="${SKIN_DEEP}"/>` +
      `<path d="M88 157L100 177L93.5 186L81 165Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M112 157L100 177L106.5 186L119 165Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M100 186V224" fill="none" stroke="${c.deep}" stroke-width="1.4"/>` +
      `<circle cx="100" cy="196" r="1.8" fill="${c.deep}"/><circle cx="100" cy="211" r="1.8" fill="${c.deep}"/>`,
  }),
  cardigan: (c) => ({
    under: '',
    over:
      `<path d="M85 162L100 224L115 162Z" fill="#F5F2EC"/>` +
      `<path d="M89 161Q100 171 111 161Z" fill="${SKIN_DEEP}"/>` +
      `<path d="M85 162L100 224M115 162L100 224" fill="none" stroke="${c.deep}" stroke-width="1.6"/>` +
      `<circle cx="91.5" cy="198" r="1.9" fill="${c.deep}"/><circle cx="95" cy="212" r="1.9" fill="${c.deep}"/>`,
  }),
  tshirt: (c) => ({
    under: '',
    over:
      `<path d="M87 161Q100 174 113 161Z" fill="${SKIN_DEEP}"/>` +
      `<path d="M87 161Q100 174 113 161" fill="none" stroke="${c.deep}" stroke-width="2"/>`,
  }),
  plain: () => ({
    under: '',
    over: `<path d="M87 161Q100 174 113 161Z" fill="${SKIN_DEEP}"/>`,
  }),
}

const CROPS = {
  bust: '0 0 200 224',
  head: '40 22 120 120', // アイコン用（顔のまわりだけ）
}

let uid = 0

/** 絵にない look の値（データの点検用） */
export function lookProblems(look) {
  if (!look) return ['look がない']
  const problems = []
  const check = (key, table) => {
    if (look[key] != null && !(look[key] in table)) problems.push(`${key}「${look[key]}」の描き方がない`)
  }
  check('hair', HAIR)
  check('hair_color', HAIR_COLORS)
  check('eyes', EYES)
  if (look.clothes != null && (!(look.clothes in CLOTHES) || look.clothes === 'plain')) {
    problems.push(`clothes「${look.clothes}」の描き方がない`)
  }
  check('clothes_color', CLOTHES_COLORS)
  if (look.accessory != null && !['glasses', 'earrings'].includes(look.accessory)) {
    problems.push(`accessory「${look.accessory}」の描き方がない`)
  }
  return problems
}

/** バストアップの SVG。crop: 'bust'（全体）/ 'head'（顔のまわり） */
export function characterSvg(character, faceId = 'normal', crop = 'bust') {
  const look = character.look ?? {}
  const face = FACES[faceId] ?? FACES.normal
  const hair = HAIR[look.hair] ?? HAIR.short_messy
  const hairColor = HAIR_COLORS[look.hair_color] ?? HAIR_COLORS.dark_brown
  const browColor = mix(hairColor, '#000000', 0.25)
  const clothColor = CLOTHES_COLORS[look.clothes_color] ?? CLOTHES_COLORS.gray
  const clothes = (CLOTHES[look.clothes] ?? CLOTHES.plain)({
    base: clothColor,
    light: mix(clothColor, '#FFFFFF', 0.45),
    deep: mix(clothColor, '#000000', 0.16),
  })
  const eyeShape = EYES[look.eyes] ?? EYES.round

  const parts = [
    ...hair.back.map((d) => `<path d="${d}" fill="${hairColor}"/>`),
    clothes.under,
    `<path d="M88.5 126H111.5V164H88.5Z" fill="${SKIN_DEEP}"/>`,
    `<path d="${BODY}" fill="${clothColor}"/>`,
    clothes.over,
    hair.coversEars ? '' : `<ellipse cx="56.5" cy="97" rx="6" ry="9" fill="${SKIN_DEEP}"/><ellipse cx="143.5" cy="97" rx="6" ry="9" fill="${SKIN_DEEP}"/>`,
    `<path d="${FACE_SHAPE}" fill="${SKIN}"/>`,
    face.blush ? blush(face.blush, face.shyLines) : '',
    eye(82, 96, -1, eyeShape, face.eyes),
    eye(118, 96, 1, eyeShape, face.eyes),
    mouth(face.mouth),
    ...hair.front.map((d) => `<path d="${d}" fill="${hairColor}"/>`),
    hair.ornament ?? '',
    // 眉は前髪の上に描く（表情が読めるように）
    brow(82, eyeShape.browY, -1, face.brows, browColor),
    brow(118, eyeShape.browY, 1, face.brows, browColor),
    accessory(look.accessory, hair.coversEars),
  ]
  const label = escapeText(`${character.name ?? ''}（${faceId}）`)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CROPS[crop] ?? CROPS.bust}" role="img" aria-label="${label}">${parts.join('')}</svg>`
}

function eye(cx, cy, side, shape, state) {
  const { rx, ry, iris } = shape
  const stroke = `fill="none" stroke="${LINE}" stroke-linecap="round"`
  let body
  if (state === 'happy') {
    // 笑った目は、上に丸い弧だけ
    body = `<path d="M${cx - rx} ${cy + 1.5}Q${cx} ${cy - ry - 3} ${cx + rx} ${cy + 1.5}" ${stroke} stroke-width="3"/>`
  } else {
    const id = `eye${++uid}`
    const dx = state === 'side' ? rx * 0.42 : 0
    const dy = state === 'down' ? ry * 0.3 : 0.4
    const lid = state === 'flat' ? 0.42 : state === 'down' ? 0.5 : 0 // 上から覆うまぶたの割合
    const top = cy - ry
    const lidY = top + ry * 2 * lid
    const lash = lid
      ? `M${cx - rx - 0.8} ${lidY + 0.6}Q${cx} ${lidY - 1.4} ${cx + rx + 0.8} ${lidY + 0.6}`
      : `M${cx - rx - 0.8} ${cy - ry * 0.12}Q${cx} ${cy - ry * 1.5} ${cx + rx + 0.8} ${cy - ry * 0.12}`
    body =
      `<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>` +
      `<g clip-path="url(#${id})">` +
      `<circle cx="${cx + dx}" cy="${cy + dy}" r="${iris}" fill="${IRIS}"/>` +
      `<circle cx="${cx + dx - iris * 0.34}" cy="${cy + dy - iris * 0.4}" r="${iris * 0.33}" fill="#FFFFFF"/>` +
      (lid ? `<rect x="${cx - rx - 1}" y="${top - 1}" width="${rx * 2 + 2}" height="${lidY - top + 1}" fill="${SKIN}"/>` : '') +
      `</g>` +
      `<path d="${lash}" ${stroke} stroke-width="2.6"/>`
  }
  return shape.tilt ? `<g transform="rotate(${side * shape.tilt} ${cx} ${cy})">${body}</g>` : body
}

function brow(cx, y, side, kind, color) {
  const [innerDy, outerDy, middleDy] = BROWS[kind] ?? BROWS.neutral
  const inner = cx - side * 6.5
  const outer = cx + side * 7.5
  return `<path d="M${inner} ${y + innerDy}Q${(inner + outer) / 2} ${y + middleDy} ${outer} ${y + outerDy}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>`
}

function mouth(kind) {
  if (kind === 'open_smile') {
    return `<path d="M91.5 119.5Q100 132 108.5 119.5Z" fill="${MOUTH}"/><ellipse cx="100" cy="126" rx="3.6" ry="2" fill="#E2878A"/>`
  }
  return `<path d="${MOUTHS[kind] ?? MOUTHS.closed_smile}" fill="none" stroke="${MOUTH}" stroke-width="2.4" stroke-linecap="round"/>`
}

function blush(opacity, lines) {
  const cheeks = `<ellipse cx="73" cy="111" rx="7.5" ry="4.2" fill="${BLUSH}" opacity="${opacity}"/><ellipse cx="127" cy="111" rx="7.5" ry="4.2" fill="${BLUSH}" opacity="${opacity}"/>`
  if (!lines) return cheeks
  return cheeks + `<path d="M69 109L71 113M73 109L75 113M125 109L127 113M129 109L131 113" fill="none" stroke="#E07C7C" stroke-width="1.4" stroke-linecap="round"/>`
}

function accessory(kind, earsCovered) {
  if (kind === 'glasses') {
    return `<g fill="none" stroke="#34323A" stroke-width="2"><rect x="70.5" y="86.5" width="23" height="18" rx="6"/><rect x="106.5" y="86.5" width="23" height="18" rx="6"/><path d="M93.5 95Q100 91.5 106.5 95"/></g>`
  }
  if (kind === 'earrings' && !earsCovered) {
    return `<circle cx="56.5" cy="108" r="2.6" fill="#E5C15C"/><circle cx="143.5" cy="108" r="2.6" fill="#E5C15C"/>`
  }
  return ''
}

function mix(hex, target, amount) {
  const a = parseInt(hex.slice(1), 16)
  const b = parseInt(target.slice(1), 16)
  const channel = (shift) => Math.round(((a >> shift) & 255) * (1 - amount) + ((b >> shift) & 255) * amount)
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, '0')).join('')}`
}

function escapeText(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])
}
