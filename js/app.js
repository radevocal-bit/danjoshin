// 男女心（仮）試作版 — js/ を組み立てで1つにまとめたもの（tools/bundle.mjs）
(() => {
'use strict'
const __modules = {}
// ---- js/art/backgrounds.js
__modules["js/art/backgrounds.js"] = (() => {
// 背景の仮の絵（06 §5.4）。キャラより落ち着いた色にして、キャラが目立つようにする。
// back はキャラの後ろ、front はキャラの手前（テーブル）。どちらも 400×300 で、画面に合わせて切り取る
// （下をそろえて切るので、横長の画面でもテーブルは残る）。

const BACKGROUNDS = {
  // 夜のファミレス: ソファ席、テーブル、暗い窓
  family_restaurant: {
    back:
      '<rect width="400" height="300" fill="#E4D5C0"/>' +
      '<rect width="400" height="16" fill="#D3C0A6"/>' +
      '<rect x="14" y="42" width="120" height="112" rx="4" fill="#2A3350"/>' +
      '<path d="M22 154V112H40V154ZM44 154V96H68V154ZM74 154V120H90V154ZM96 154V104H126V154Z" fill="#1F263C"/>' +
      '<path d="M50 104h4v5h-4zM58 116h4v5h-4zM102 112h4v5h-4zM112 124h4v5h-4zM28 120h3v4h-3zM80 128h3v4h-3z" fill="#F2CF79"/>' +
      '<rect x="14" y="42" width="120" height="112" rx="4" fill="none" stroke="#F3ECE0" stroke-width="6"/>' +
      '<path d="M74 42V154" stroke="#F3ECE0" stroke-width="4"/>' +
      '<rect x="282" y="44" width="96" height="72" rx="4" fill="#4E5E52" stroke="#8B6A4E" stroke-width="5"/>' +
      '<path d="M296 64H352M296 78H344M296 92H360" stroke="#E9E3D2" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M80 0V22M320 0V22" stroke="#6E5A48" stroke-width="2"/>' +
      '<path d="M66 34L72 22H88L94 34ZM306 34L312 22H328L334 34Z" fill="#E2AF57"/>' +
      '<circle cx="80" cy="36" r="4" fill="#FFF3CF"/><circle cx="320" cy="36" r="4" fill="#FFF3CF"/>' +
      '<rect x="-10" y="164" width="420" height="12" rx="4" fill="#8E6B50"/>' +
      '<rect x="-10" y="174" width="420" height="96" rx="14" fill="#B26E62"/>' +
      '<path d="M40 184V262M120 184V262M280 184V262M360 184V262" stroke="#A1625A" stroke-width="3"/>',
    front:
      '<rect y="252" width="400" height="8" fill="#C7AB87"/>' +
      '<rect y="258" width="400" height="42" fill="#D9C2A2"/>' +
      '<rect x="44" y="262" width="74" height="15" rx="2" fill="#B24A41"/>' +
      '<rect x="54" y="267" width="40" height="3" rx="1.5" fill="#F0D9B5"/>' +
      '<rect x="300" y="228" width="22" height="34" rx="3" fill="#D6E9F0" stroke="#B2CED8" stroke-width="2"/>',
  },

  // 昼のパスタ屋: 明るい窓、木のテーブル、壁の小さな絵
  pasta_shop: {
    back:
      '<rect width="400" height="300" fill="#F3EADA"/>' +
      '<rect y="176" width="400" height="124" fill="#D2B18A"/>' +
      '<path d="M40 178V300M110 178V300M290 178V300M360 178V300" stroke="#C4A07A" stroke-width="2"/>' +
      '<rect y="172" width="400" height="6" fill="#B98F66"/>' +
      '<rect x="276" y="34" width="110" height="122" rx="6" fill="#CFE6F2"/>' +
      '<circle cx="298" cy="146" r="12" fill="#A8CE99"/><circle cx="322" cy="148" r="10" fill="#93C285"/><circle cx="360" cy="146" r="12" fill="#A8CE99"/>' +
      '<rect x="276" y="34" width="110" height="122" rx="6" fill="none" stroke="#FFFFFF" stroke-width="7"/>' +
      '<path d="M331 34V156M276 95H386" stroke="#FFFFFF" stroke-width="4"/>' +
      '<rect x="34" y="60" width="62" height="48" fill="#DDEFF6"/>' +
      '<path d="M34 108L56 88L72 98L96 80V108Z" fill="#9DC598"/>' +
      '<circle cx="80" cy="74" r="7" fill="#F2C66C"/>' +
      '<rect x="34" y="60" width="62" height="48" fill="none" stroke="#B98F66" stroke-width="5"/>' +
      '<rect x="26" y="134" width="84" height="6" fill="#B98F66"/>' +
      '<rect x="40" y="108" width="10" height="26" rx="3" fill="#8DA45A"/><rect x="43" y="100" width="4" height="9" fill="#8DA45A"/>' +
      '<rect x="58" y="112" width="12" height="22" rx="3" fill="#A24C4B"/><rect x="62" y="104" width="4" height="9" fill="#A24C4B"/>' +
      '<circle cx="88" cy="128" r="6" fill="#E9D8B4"/>',
    front:
      '<rect y="250" width="400" height="8" fill="#A97B51"/>' +
      '<rect y="256" width="400" height="44" fill="#BC8D60"/>' +
      '<ellipse cx="312" cy="270" rx="52" ry="13" fill="#FFFFFF"/>' +
      '<ellipse cx="312" cy="267" rx="30" ry="7.5" fill="#EFD38C"/>' +
      '<ellipse cx="324" cy="264" rx="5" ry="2.6" fill="#6E9F5A"/>' +
      '<rect x="62" y="226" width="20" height="34" rx="3" fill="#E1EFF4" stroke="#BCD5DE" stroke-width="2"/>',
  },
}

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${body}</svg>`

/** 背景ID → { back, front }（SVG の文字列）。ない背景は無地 */
function backgroundSvg(id) {
  const scene = BACKGROUNDS[id]
  if (!scene) return { back: svg('<rect width="400" height="300" fill="#EFE7DC"/>'), front: null }
  return { back: svg(scene.back), front: svg(scene.front) }
}

return { BACKGROUNDS, backgroundSvg }
})()
// ---- js/art/character.js
__modules["js/art/character.js"] = (() => {
// キャラの仮の絵（06 §5）。キャラの look（見た目）と表情IDから、バストアップの SVG（文字列）を作る。
// フラットで、影もグラデーションもなし。線は同じ太さ。どのキャラも同じ描き方でそろえる。
// 本番の絵に替えるときは content/art.json に画像を登録する（art/index.js）。

const SKIN = '#F7DDCB'
const SKIN_DEEP = '#EDC9B2' // 首と耳（影ではなく、顔と分けるための色）
const IRIS = '#3B2B26'
const LINE = '#2B211F'
const MOUTH = '#99484C'
const BLUSH = '#F19B9B'

const HAIR_COLORS = {
  black: '#2F2D37',
  dark_brown: '#4A3328',
  brown: '#6E4A33',
  light_brown: '#9A7050',
  ash: '#8C8B90',
}

const CLOTHES_COLORS = {
  light_blue: '#A9C9E8',
  gray: '#A4A8AF',
  navy: '#3E4C6E',
  white: '#F2F0EB',
  beige: '#E1D1B5',
  pink: '#F0B8C5',
  green: '#9EC5A3',
}

// 表情 = 目・眉・口・頬の組み合わせ（06 §5.3）。「作り笑い」は口だけ笑って目は笑わない
const FACES = {
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
function lookProblems(look) {
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
function characterSvg(character, faceId = 'normal', crop = 'bust') {
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

return { HAIR_COLORS, CLOTHES_COLORS, FACES, lookProblems, characterSvg }
})()
// ---- js/art/index.js
__modules["js/art/index.js"] = (() => {
// 絵の呼び出し口。絵は「キャラID＋表情ID」「背景ID」で呼ぶ（06 §3・§5）。
// content/art.json に画像が登録されていれば画像を、なければ Claude が描いた仮の絵（SVG）を使う。
// 本番の絵に替えるときは、画像ファイルを置いて art.json に書き足すだけで、エピソードのデータは変えない。

const { BACKGROUNDS, backgroundSvg } = __modules["js/art/backgrounds.js"]
const { FACES, characterSvg, lookProblems } = __modules["js/art/character.js"]

const FACE_IDS = Object.keys(FACES)
const BACKGROUND_IDS = Object.keys(BACKGROUNDS)

let images = { characters: {}, backgrounds: {} }

/** art.json: { characters: { キャラID: { 表情ID: 画像パス } }, backgrounds: { 背景ID: 画像パス } } */
function setArtImages(manifest) {
  images = { characters: manifest?.characters ?? {}, backgrounds: manifest?.backgrounds ?? {} }
}

/** キャラの絵 → { image } か { svg }。look も画像もなければ null（文字アイコンにする） */
function characterArt(character, face = 'normal', crop = 'bust') {
  const image = images.characters[character.id]?.[face]
  if (image) return { image }
  if (!character.look) return null
  return { svg: characterSvg(character, face, crop) }
}

/** 背景 → { image } か { back, front }（SVG） */
function backgroundArt(id) {
  const image = images.backgrounds[id]
  if (image) return { image }
  return backgroundSvg(id)
}

return { FACE_IDS, BACKGROUND_IDS, lookProblems, setArtImages, characterArt, backgroundArt }
})()
// ---- js/catalog.js
__modules["js/catalog.js"] = (() => {
// ホームに並べる話（06 §4 S2）。段階・同性／異性・鍵を決める。画面には触らない。

const TIERS = { beginner: '初級', intermediate: '中級', advanced: '上級' }
const GENDERS = { male: '男性', female: '女性', none: '答えない' }
const PAIRINGS = { same: '同性', opposite: '異性' }
const TABS = [
  { id: 'female', label: '女心を学ぶ' },
  { id: 'male', label: '男心を学ぶ' },
]

/** 同性／異性。プレイヤーが「答えない」なら null（札を出さない） */
function pairingOf(playerGender, partnerGender) {
  if (playerGender !== 'male' && playerGender !== 'female') return null
  return playerGender === partnerGender ? 'same' : 'opposite'
}

/** 最初に開くタブ: 異性の相手のタブ。「答えない」なら女心 */
function defaultTab(playerGender) {
  return playerGender === 'female' ? 'male' : 'female'
}

/** 相手の性別（タブ）。お話（06 §6.6）は、お話のファイルに書いてある */
function genderOf(entry) {
  return entry.story ? entry.story.gender : entry.character.gender
}

/**
 * タブに並べる話のカード
 * @param entries        index.json の順。固定の人の話 { episode, character } と、お話 { story, variants }
 * @param recordOf       (episodeId) => { plays, best }
 * @param storyRecordOf  (storyId) => { plays, best, met }
 */
function homeCards({ entries, tab, playerGender, recordOf, storyRecordOf = () => ({ plays: 0, best: null, met: [] }) }) {
  const byId = new Map(entries.filter((entry) => entry.episode).map((entry) => [entry.episode.id, entry]))
  return entries
    .filter((entry) => genderOf(entry) === tab)
    .map((entry) => {
      const { episode, character, story } = entry
      const pairing = pairingOf(playerGender, genderOf(entry))
      const base = {
        entry,
        pairing,
        tier: TIERS[(story ?? episode).tier] ?? null,
        // 恋愛の話（opposite）は、同性のプレイヤーには出さない
        hidden: (story ?? episode).pairing === 'opposite' && pairing === 'same',
      }
      if (story) {
        // お話のカードには名前を出さない（始めるときに相手が決まる）。題と一言の説明だけ
        const record = storyRecordOf(story.id)
        return {
          ...base,
          id: story.id,
          story,
          locked: false,
          lockText: null,
          best: record.best,
          met: record.met?.length ?? 0,
          total: story.variants.length,
          summary: story.summary,
        }
      }
      const required = episode.requires ? byId.get(episode.requires) : null
      const locked = Boolean(episode.requires) && !(recordOf(episode.requires).plays > 0)
      return {
        ...base,
        id: episode.id,
        episode,
        character,
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

return { TIERS, GENDERS, PAIRINGS, TABS, pairingOf, defaultTab, genderOf, homeCards }
})()
// ---- js/build-info.js
__modules["js/build-info.js"] = (() => {
// 組み立て（npm run build）で書きかわる。npm start で直に動かすときは null（content/ を1つずつ読む）
const BUNDLE = "content/bundle.json?v=f3ac25d8ae"

return { BUNDLE }
})()
// ---- js/rules.js
__modules["js/rules.js"] = (() => {
// 採点と進行のルール（04 §5・§6、06 §4）。content/rules.json に従う。画面には触らない。

/** その返事の減点（0 か負の数）。grade と manners の両方があるときは大きい方だけ */
function deductionFor(choice, stars, rules) {
  let points = 0
  if (choice.grade) points = Math.min(points, rules.grades[choice.grade]?.points[String(stars)] ?? 0)
  if (choice.manners) points = Math.min(points, rules.manners[choice.manners]?.points ?? 0)
  return points
}

/** 減点したあとの点数。0点より下にはしない */
function applyDeduction(score, points) {
  return Math.max(0, score + points)
}

/** 会話が終わる理由（'zero' / 'stars' / 'manners'）。続くなら null */
function endReasonFor(choice, score, stars, rules) {
  if (score <= 0) return 'zero'
  if (choice.grade && rules.grades[choice.grade]?.ends_conversation_at_stars?.includes(stars)) return 'stars'
  if (choice.manners && rules.manners[choice.manners]?.ends_conversation) return 'manners'
  return null
}

/** ミスの返事か: 評価が miss_grades、または人としての基本が miss_manners */
function isMiss(choice, rules) {
  if (!choice) return false
  return rules.miss_grades.includes(choice.grade) || (rules.miss_manners ?? []).includes(choice.manners)
}

/** その手で出すセリフと手がかり。直前がミスなら partner_after_miss / cues_after_miss を使う */
function stepContent(step, previousChoice, rules) {
  const afterMiss = Boolean(step.partner_after_miss) && isMiss(previousChoice, rules)
  return {
    afterMiss,
    lines: afterMiss ? step.partner_after_miss : step.partner,
    cues: (afterMiss && step.cues_after_miss) || step.cues || [],
  }
}

// 同性・異性で入れかわる手（06 §6.5）で、上書きできる項目
const PAIRING_FIELDS = ['scene', 'partner', 'partner_after_miss', 'cues', 'cues_after_miss', 'choices']

/**
 * プレイヤーと相手の組み合わせ（same / opposite / null＝答えない）で出す手（06 §6.5）。
 * by_pairing にその組み合わせがあれば、書いてある項目だけを上書きする（id・mode・phase は元の手のまま）。
 * variant: 'same' / 'opposite'（入れかえた）・'base'（入れかわる手だが元の手を出した）・null（入れかわらない手）
 */
function stepFor(step, pairing) {
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
function scenesOf(episode) {
  if (episode.scenes?.length) return episode.scenes
  if (!singleScenes.has(episode)) {
    singleScenes.set(episode, [{ id: 'main', label: null, mode: episode.steps?.[0]?.mode ?? 'chat', steps: episode.steps ?? [] }])
  }
  return singleScenes.get(episode)
}

/** 場面のはじめのセリフ。前の場面のミスが rough_scene_min_misses 回以上なら opening_if_rough */
function openingFor(scene, previousSceneMisses, rules) {
  const rough = previousSceneMisses != null
    && previousSceneMisses >= (rules.rough_scene_min_misses ?? 1)
    && Boolean(scene.opening_if_rough)
  return { rough, lines: (rough ? scene.opening_if_rough : scene.opening) ?? [] }
}

/** ランク: ranks を上から見て、min 以上の最初のもの */
function rankFor(score, rules) {
  return rules.ranks.find((rank) => score >= rank.min) ?? rules.ranks[rules.ranks.length - 1]
}

function bestChoice(step) {
  return step.choices.find((choice) => choice.grade === 'best') ?? null
}

/** 結果画面に出す評価。label は「× 逆効果」「人として・重」など、tone は色分け用 */
function evaluationOf(choice, stars, rules) {
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
function shuffle(items, random = Math.random) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const item = result[i]
    result[i] = result[j]
    result[j] = item
  }
  return result
}

return { deductionFor, applyDeduction, endReasonFor, isMiss, stepContent, PAIRING_FIELDS, stepFor, scenesOf, openingFor, rankFor, bestChoice, evaluationOf, shuffle }
})()
// ---- js/stories.js
__modules["js/stories.js"] = (() => {
// お話と、毎回ちがう相手（06 §6.6）。画面には触らない。
// お話（content/stories/<id>.json）は、4タイプぶんの話（variants）を持つ。
// 始めるたびに、タイプ・名前・見た目を決めてキャラを作り、そのタイプの話を今までどおり遊ぶ。

const NAME_SLOT = '{name}'

// 見た目の候補（06 §5.2 の値のうち、描けるもの）。小さな絵でも、ひと目で性別が分かるものに絞る
const LOOKS = {
  female: {
    hair: ['bob', 'long', 'ponytail'],
    hair_color: ['black', 'dark_brown', 'brown', 'light_brown', 'ash'],
    eyes: ['round', 'narrow', 'droopy'],
    clothes: ['blouse', 'cardigan', 'shirt', 'tshirt', 'hoodie'],
    clothes_color: ['light_blue', 'gray', 'navy', 'white', 'beige', 'pink', 'green'],
    accessory: [null, null, 'earrings', 'glasses'], // null を2つ入れて、何も付けない人を多めにする
  },
  male: {
    hair: ['short', 'short_messy'],
    hair_color: ['black', 'dark_brown', 'brown', 'light_brown', 'ash'],
    eyes: ['round', 'narrow', 'droopy'],
    clothes: ['shirt', 'hoodie', 'cardigan', 'tshirt'],
    clothes_color: ['light_blue', 'gray', 'navy', 'white', 'beige', 'green'],
    accessory: [null, null, 'glasses'],
  },
}

const pick = (list, random) => list[Math.floor(random() * list.length)]

/** 前回と同じものは続けないで、ランダムに選ぶ（候補が1つしかなければ、それ） */
function pickNew(list, last, random = Math.random) {
  const rest = list.filter((item) => item !== last)
  return pick(rest.length ? rest : list, random)
}

function randomLook(gender, random = Math.random) {
  return Object.fromEntries(Object.entries(LOOKS[gender] ?? LOOKS.female).map(([key, values]) => [key, pick(values, random)]))
}

/** 文の中の {name} を名前に置きかえる（入れ子の中の文字列も全部）。元のデータは変えない */
function fillName(value, name) {
  if (typeof value === 'string') return value.replaceAll(NAME_SLOT, name)
  if (Array.isArray(value)) return value.map((item) => fillName(item, name))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillName(item, name)]))
  }
  return value
}

/** {name} 以外の {…}（書きまちがい）。データの点検用 */
function unknownSlots(value) {
  const found = new Set()
  const walk = (item) => {
    if (typeof item === 'string') {
      for (const [slot] of item.matchAll(/\{[^{}]*\}/g)) if (slot !== NAME_SLOT) found.add(slot)
    } else if (item && typeof item === 'object') {
      for (const child of Object.values(item)) walk(child)
    }
  }
  walk(value)
  return [...found]
}

/** 1タイプの話を、遊べる話の形にする。題・段階・同性／異性はお話のもの */
function storyEpisode(story, variant) {
  return { ...variant, title: story.title, tier: story.tier, pairing: story.pairing, character: story.id }
}

/** その回の相手。name・look・age は始めるときに決めたもの。会う場面のセリフの who は、お話の id */
function characterFor(story, variant, { name, look = null, age = null }) {
  return {
    id: story.id,
    name,
    gender: story.gender,
    age,
    type: variant.type,
    stars: variant.stars,
    switches: variant.switches ?? [],
    style: variant.style,
    icon_text: [...name][0],
    look,
  }
}

/**
 * お話を始める。タイプ（variants から）・名前（names.json の相手の性別から）・見た目を決めて、
 * 今までの話と同じ { episode, character } を作る（story も添える）。
 * last: このお話で前回会った相手 { type, name }。同じタイプ・同じ名前は続けて出さない
 */
function castStory({ story, variants, names, last = null, random = Math.random }) {
  const variant = pickNew(variants, variants.find((item) => item.type === last?.type), random)
  const name = pickNew(names?.[story.gender] ?? [], last?.name, random) ?? story.relation
  const [low, high] = story.age ?? []
  const age = low == null ? null : low + Math.floor(random() * (high - low + 1))
  const look = randomLook(story.gender, random)
  const filled = fillName(variant, name)
  return {
    story,
    episode: storyEpisode(story, filled),
    character: characterFor(story, filled, { name, look, age }),
  }
}

return { NAME_SLOT, LOOKS, pickNew, randomLook, fillName, unknownSlots, storyEpisode, characterFor, castStory }
})()
// ---- js/data.js
__modules["js/data.js"] = (() => {
// content/ の JSON を読む。会話の中身はすべてここから（04 §3・§11、06 §6）
// 組み立てたもの（dist/）は、まとめたデータ1つ（content/bundle.json）を1回で読む。
// npm start で直に動かすときは、content/ を1つずつ読む（書きかえたらすぐ確かめられるように）。

const { BUNDLE } = __modules["js/build-info.js"]
const { PAIRING_FIELDS, scenesOf, stepFor } = __modules["js/rules.js"]
const { characterFor, storyEpisode, unknownSlots } = __modules["js/stories.js"]

const cache = new Map()
const TIER_IDS = ['beginner', 'intermediate', 'advanced']
const NO_ART = { characters: {}, backgrounds: {} }
const RETRY_MS = [600, 1800] // つながらないときは、間をあけて2回までやり直す
const TIMEOUT_MS = 15000 // 1回で待つ長さ

/** fetch して JSON にする。失敗したら retries の間をあけてやり直す */
async function fetchJSON(url, { cache: mode = 'default', retries = RETRY_MS, timeout = TIMEOUT_MS, fetchImpl = globalThis.fetch } = {}) {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetchImpl(url, { cache: mode, signal: controller.signal })
      if (!response.ok) throw new Error(`${url} を読み込めませんでした（${response.status}）`)
      return await response.json()
    } catch (error) {
      if (attempt >= retries.length) throw new Error(`${url} を読み込めませんでした`, { cause: error })
      await new Promise((resolve) => setTimeout(resolve, retries[attempt]))
    } finally {
      clearTimeout(timer)
    }
  }
}

function loadJSON(path) {
  if (!cache.has(path)) {
    const request = fetchJSON(path, { cache: 'no-cache' })
    request.catch(() => cache.delete(path))
    cache.set(path, request)
  }
  return cache.get(path)
}

/** まとめたデータ（tools/build.mjs が作る）を、1つずつ読んだときと同じ形にする */
function gameFromBundle(bundle) {
  const entries = bundle.index.episodes.map((item) => {
    if (item.story) {
      const story = bundle.stories[item.story]
      return { story, variants: story.variants.map((id) => bundle.episodes[id]) }
    }
    const episode = bundle.episodes[item.id]
    return { episode, character: bundle.characters[episode.character] }
  })
  return { index: bundle.index, rules: bundle.rules, types: bundle.types, art: bundle.art ?? NO_ART, names: bundle.names ?? null, entries }
}

/**
 * 遊べる話を全部読む（ホームに並べるため）。index.json に並ぶのは、2つの形:
 *   { id }    固定の人の話 → { episode, character }
 *   { story } お話（06 §6.6。相手は毎回ちがう）→ { story, variants: [タイプごとの話] }
 */
async function loadGame() {
  if (BUNDLE) return gameFromBundle(await fetchJSON(BUNDLE))
  const [index, rules, types, art] = await Promise.all([
    loadJSON('content/index.json'),
    loadJSON('content/rules.json'),
    loadJSON('content/types.json'),
    loadJSON('content/art.json').catch(() => NO_ART), // 画像に差し替えていなければ、なくてよい
  ])
  const hasStories = index.episodes.some((item) => item.story)
  const [names, entries] = await Promise.all([
    hasStories ? loadJSON('content/names.json') : null,
    Promise.all(index.episodes.map((item) => (item.story ? loadStory(item.story) : loadEpisode(item.id)))),
  ])
  return { index, rules, types, art, names, entries }
}

async function loadEpisode(id) {
  const episode = await loadJSON(`content/episodes/${id}.json`)
  const character = await loadJSON(`content/characters/${episode.character}.json`)
  return { episode, character }
}

async function loadStory(id) {
  const story = await loadJSON(`content/stories/${id}.json`)
  const variants = await Promise.all(story.variants.map((variant) => loadJSON(`content/episodes/${variant}.json`)))
  return { story, variants }
}

/**
 * データの点検。おかしな所を文章の配列で返す（ブラウザではコンソールに出す）
 * backgrounds: 絵がある背景ID / episodeIds: index.json にある話のID（requires の確認用）
 */
function validateEpisode({ episode, character }, { rules, types, backgrounds = null, episodeIds = null }) {
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

/**
 * お話の点検（06 §6.6）。お話のファイルと、タイプごとの話を、そのタイプ・★の仮のキャラで validateEpisode する
 * names: names.json（相手の名前の候補）
 */
function validateStory({ story, variants }, { rules, types, names, backgrounds = null, episodeIds = null }) {
  const problems = []
  const problem = (message) => problems.push(`${story.id}: ${message}`)

  for (const key of ['title', 'summary', 'relation']) {
    if (!story[key]) problem(`${key} がない`)
    else if (/[{}]/.test(story[key])) problem(`${key} に {name} は書けない（ホームでは、相手がまだ決まっていない）`)
  }
  if (!TIER_IDS.includes(story.tier)) problem(`tier「${story.tier}」は ${TIER_IDS.join(' / ')}`)
  if (!['any', 'opposite'].includes(story.pairing)) problem(`pairing「${story.pairing}」は any / opposite`)
  if (!['female', 'male'].includes(story.gender)) problem(`gender「${story.gender}」は female / male`)
  else if ((names?.[story.gender] ?? []).length < 2) problem(`names.json の ${story.gender} の名前が2つより少ない（前回と同じ名前を続けないため）`)
  if (story.age && !(story.age.length === 2 && story.age[0] <= story.age[1])) problem('age は [いちばん下, いちばん上] の形')
  const ids = story.variants ?? []
  if (ids.length < 2) problem('variants が2つより少ない（前回と同じタイプを続けないため）')
  ids.forEach((id, i) => {
    if (!variants[i]) problem(`variants の ${id} がない`)
  })

  const present = variants.filter(Boolean)
  for (const variant of present) {
    if (variant.story !== story.id) problem(`${variant.id} の story が「${variant.story}」（${story.id} にする）`)
    if (variant.character) problem(`${variant.id} に character は書かない（相手は始めるときに決まる）`)
  }
  const typeIds = present.map((variant) => variant.type)
  const repeated = [...new Set(typeIds.filter((id, i) => typeIds.indexOf(id) !== i))]
  if (repeated.length) problem(`タイプが重なっている（${repeated.join('・')}）`)
  // 4タイプなら、どの軸も2対2に分ける（推理であてずっぽうが効かないように）
  const known = typeIds.map((id) => types.types.find((type) => type.id === id)).filter(Boolean)
  if (known.length === 4) {
    for (const axis of Object.keys(types.axes)) {
      const same = known.filter((type) => type[axis] === known[0][axis]).length
      if (same !== 2) problem(`${axis} の軸が2対2に分かれていない`)
    }
  }

  for (const variant of present) {
    const episode = storyEpisode(story, variant)
    const character = characterFor(story, variant, { name: '（名前）' })
    problems.push(...validateEpisode({ episode, character }, { rules, types, backgrounds, episodeIds }))
    for (const slot of unknownSlots(variant)) problems.push(`${variant.id}: ${slot} は置きかえられない（相手の名前は {name}）`)
    for (const type of types.types) {
      if (variant.intro?.includes(type.name)) problems.push(`${variant.id}: 紹介文にタイプの名前（${type.name}）が出ている`)
    }
  }
  return [...new Set(problems)]
}

const PAIRING_NAMES = { same: '同性', opposite: '異性' }

/** その手の手がかりの軸（cues と cues_after_miss）。並べて返す */
function cueAxes(step) {
  return [...new Set([...(step.cues ?? []), ...(step.cues_after_miss ?? [])].map((cue) => cue.axis))].sort()
}

return { fetchJSON, loadJSON, gameFromBundle, loadGame, loadEpisode, loadStory, validateEpisode, validateStory }
})()
// ---- js/report.js
__modules["js/report.js"] = (() => {
// テスト用「結果をコピー」の文字列（04 §9。06 で、どの話か・プレイヤーの性別・ギャップ推理を足した）

const { GENDERS, PAIRINGS, TIERS, pairingOf } = __modules["js/catalog.js"]
const { rankFor } = __modules["js/rules.js"]

const VARIANTS = { same: '同性', opposite: '異性', base: '元の手' }

/**
 * guess: null（スキップ）/ { kind: 'type', answers: { A: 'near', … } } / { kind: 'gap', option: 'a' }
 * story・met: お話（06 §6.6）のときだけ。相手は毎回ちがうので、そのタイプと名前を残す
 */
function buildReport({ rules, types, episode, character, story = null, met = null, play, saved, guess, playMs, playerGender }) {
  const { record, isFirst } = saved
  const first = record.first ?? { score: play.score }
  const tier = TIERS[episode.tier]
  const pairing = pairingOf(playerGender, character.gender)
  const now = isFirst ? `${play.score}` : `${play.score}（${record.plays}回目）`
  const picks = play.steps.map(({ step, choice }) => `${step.id}-${choice.id}${markOf(choice, rules)}`).join(' ')
  const ended = play.endReason ? `（${play.steps.length}手目で終了）` : ''
  const swapped = play.steps.find(({ variant }) => variant) // 同性・異性で入れかわる手（そこまで進んだとき）
  const typeName = types.types.find((type) => type.id === character.type)?.name ?? character.type
  return [
    '【男女心 試作テスト】',
    `話: ${character.name}「${episode.title}」${tier ? `（${tier}）` : ''}`,
    story ? `相手: ${typeName}（★${character.stars}）${met ? `・このお話で会ったタイプ ${met.count}/${met.total}` : ''}` : null,
    `あなた: ${GENDERS[playerGender] ?? GENDERS.none}${pairing ? `（${PAIRINGS[pairing]}）` : ''}`,
    `初見スコア: ${first.score}（${rankFor(first.score, rules).label}） / 今回: ${now}`,
    `選んだ返事: ${picks}${ended}`,
    swapped ? `入れかわる手: ${swapped.step.id}手目＝${VARIANTS[swapped.variant]}` : null,
    guessLine(episode, guess, types, character),
    `プレイ時間: ${formatDuration(playMs)}`,
  ].filter((line) => line != null).join('\n')
}

function formatDuration(ms) {
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

return { buildReport, formatDuration }
})()
// ---- js/runner.js
__modules["js/runner.js"] = (() => {
// 1話を最初から最後まで進める（04 §4・§5・§6、06 §4）。
// 見せ方（チャットか会う場面か、待ち時間）は director と view に任せるので、ここは画面を知らない。

const { applyDeduction, deductionFor, endReasonFor, isMiss, openingFor, scenesOf, shuffle, stepContent, stepFor } = __modules["js/rules.js"]

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
async function runEpisode({ episode, character, rules, director, pairing = null, random = Math.random }) {
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

return { runEpisode }
})()
// ---- js/store.js
__modules["js/store.js"] = (() => {
// 保存（ブラウザ内だけ。サーバーには送らない。04 §8・06 §4 S1.5）
// スマホアプリにするときは、このファイルの storage を差し替える。

const PREFIX = 'danjo:v1:'

function browserStorage() {
  try {
    const storage = globalThis.localStorage
    storage.setItem(`${PREFIX}probe`, '1')
    storage.removeItem(`${PREFIX}probe`)
    return storage
  } catch {
    // プライベートブラウズなどで使えないときは、ページを開いている間だけ覚える
    return memoryStorage()
  }
}

function memoryStorage() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size
    },
  }
}

function createStore(storage) {
  const keyOf = (episodeId) => `${PREFIX}episode:${episodeId}`
  const storyKeyOf = (storyId) => `${PREFIX}story:${storyId}`
  const playerKey = `${PREFIX}player`

  function readJSON(key) {
    try {
      return JSON.parse(storage.getItem(key))
    } catch {
      return null // 読めなければ新しく始める
    }
  }
  function writeJSON(key, value) {
    try {
      storage.setItem(key, JSON.stringify(value))
    } catch {
      // 保存できなくても遊べる
    }
  }

  /** { plays, best, first: { score, choices: [{ step, id, variant? }], end, at } } */
  function read(episodeId) {
    return readJSON(keyOf(episodeId)) ?? { plays: 0, best: null, first: null }
  }

  /** お話の記録（06 §6.6）。read の形に、会ったタイプ（met）と前回の相手（last: { type, name }）を足したもの */
  function readStory(storyId) {
    return { plays: 0, best: null, first: null, met: [], last: null, ...readJSON(storyKeyOf(storyId)) }
  }

  /** 最後まで遊んだ1回を数える。初見（1回目）は上書きしない。extra は1回目の記録に足すもの */
  function countPlay(record, play, extra = {}) {
    const isFirst = !record.first
    if (isFirst) {
      record.first = {
        score: play.score,
        // 本音の間の分析（leans の集計）用に、1回目に選んだ返事の id を残す。
        // 入れかわる手は、どれを出したか（same / opposite / base＝元の手）も残す
        choices: play.steps.map(({ step, choice, variant }) => ({ step: step.id, id: choice.id, ...(variant ? { variant } : {}) })),
        end: play.endReason,
        at: new Date().toISOString(),
        ...extra,
      }
    }
    record.best = record.best == null ? play.score : Math.max(record.best, play.score)
    record.plays += 1
    return isFirst
  }

  return {
    read,
    readStory,

    /** 最後まで遊んだ1回を記録する。初見（1回目）は上書きしない */
    recordPlay(episodeId, play) {
      const record = read(episodeId)
      const isFirst = countPlay(record, play)
      writeJSON(keyOf(episodeId), record)
      return { isFirst, record }
    },

    /** お話を最後まで遊んだ1回を記録する。1回目の記録には相手のタイプと名前も残し、次は同じ相手を続けない */
    recordStoryPlay(storyId, play, { type, name }) {
      const record = readStory(storyId)
      const isFirst = countPlay(record, play, { type, name })
      record.last = { type, name }
      writeJSON(storyKeyOf(storyId), record)
      return { isFirst, record }
    },

    /** 種明かしで会ったタイプを数える。会ったタイプの一覧を返す */
    meetType(storyId, type) {
      const record = readStory(storyId)
      if (!record.met.includes(type)) {
        record.met = [...record.met, type]
        writeJSON(storyKeyOf(storyId), record)
      }
      return record.met
    },

    /** プレイヤーの設定: { gender: 'male' | 'female' | 'none' } */
    player() {
      return readJSON(playerKey) ?? {}
    },

    savePlayer(patch) {
      const next = { ...this.player(), ...patch }
      writeJSON(playerKey, next)
      return next
    },

    /** この試作の記録を全部消す（?reset=1） */
    clear() {
      const keys = []
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key?.startsWith(PREFIX)) keys.push(key)
      }
      for (const key of keys) storage.removeItem(key)
    },
  }
}

return { browserStorage, memoryStorage, createStore }
})()
// ---- js/ui.js
__modules["js/ui.js"] = (() => {
// 画面づくりの小さな道具

const { characterArt } = __modules["js/art/index.js"]

/** 要素を作る。props: class / text / on〇〇（イベント）/ そのほかは属性 */
function h(tag, props = {}, ...children) {
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
function art(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild
}

/** art/index.js の絵（{ image } か { svg }）を要素にする */
function artNode(picture, className = '') {
  if (!picture) return null
  const node = picture.image
    ? h('img', { src: picture.image, alt: '', decoding: 'async' })
    : art(picture.svg)
  if (className) node.classList.add(...className.split(' '))
  return node
}

/** キャラのアイコン。絵があれば顔のまわり、なければ icon_text の1文字 */
function characterAvatar(character, size = '', face = 'normal') {
  const picture = characterArt(character, face, 'head')
  const className = ['avatar', picture ? 'art' : '', size].filter(Boolean).join(' ')
  if (picture) return h('span', { class: className, 'aria-hidden': 'true' }, artNode(picture))
  return h(
    'span',
    { class: className, style: `--hue: ${hueOf(character.id)}`, 'aria-hidden': 'true' },
    character.icon_text ?? character.name.slice(0, 1),
  )
}

function staffAvatar() {
  return h('span', { class: 'avatar staff', 'aria-hidden': 'true' }, '店')
}

function hueOf(id) {
  let hue = 0
  for (const ch of id) hue = (hue * 31 + ch.codePointAt(0)) % 360
  return hue
}

function stars(count, max = 3) {
  return h(
    'span',
    { class: 'stars', role: 'img', 'aria-label': `★${count}` },
    '★'.repeat(count),
    h('span', { class: 'off' }, '★'.repeat(Math.max(0, max - count))),
  )
}

/** 段階のバッジ（初級・中級・上級） */
function tierBadge(tierId, label) {
  return label ? h('span', { class: `badge tier tier-${tierId}`, text: label }) : null
}

/** 誰のセリフ・誰への返事か（会う場面の who / to） */
function speakerName(who, character) {
  if (who === character.id) return character.name
  if (who === 'staff') return '店員さん'
  return who
}

function card(title, ...children) {
  return h('section', { class: 'card' }, h('h2', { class: 'card-title', text: title }), ...children)
}

function toast(message) {
  document.querySelector('.toast')?.remove()
  const el = h('div', { class: 'toast', role: 'status' }, message)
  document.body.append(el)
  setTimeout(() => el.remove(), 2400)
}

async function copyText(text) {
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
function copyBlock(onCopy) {
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

return { h, art, artNode, characterAvatar, staffAvatar, stars, tierBadge, speakerName, card, toast, copyText, copyBlock }
})()
// ---- js/wait.js
__modules["js/wait.js"] = (() => {
// 演出の待ち時間。画面をタップすると、いま待っている分を飛ばせる（仕様書 §7）

let speed = 1
const pending = new Set()

/** 待ち時間の倍率（?fast=1 の確認用に小さくする） */
function setSpeed(factor) {
  speed = factor
}

/** ms ミリ秒待つ。skipWaits() が呼ばれたら、そこで終わる */
function wait(ms) {
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer)
      pending.delete(done)
      resolve()
    }
    const timer = setTimeout(done, ms * speed)
    pending.add(done)
  })
}

/** いま待っている分を飛ばす。飛ばした数を返す */
function skipWaits() {
  const count = pending.size
  for (const done of [...pending]) done()
  return count
}

function between(min, max) {
  return min + Math.random() * (max - min)
}

return { setSpeed, wait, skipWaits, between }
})()
// ---- js/views/panel.js
__modules["js/views/panel.js"] = (() => {
// 画面下の欄: 待っている間の案内 → 4つの選択肢 → 次へのボタン

const { h } = __modules["js/ui.js"]

// 早送りの連打で、出てきた選択肢をうっかり押さないように少し待つ
const GUARD_MS = 400

function createPanel() {
  const el = h('div', { class: 'panel' })
  const set = (...nodes) => el.replaceChildren(...nodes)

  return {
    el,

    hint() {
      set(h('p', { class: 'panel-hint', text: '画面をタップすると早く進みます' }))
    },

    /** choices をボタンで出し、選ばれた choice を返す。render(choice) はボタンの中身 */
    choose(choices, render) {
      return new Promise((resolve) => {
        const list = h('div', { class: 'choices' })
        let ready = false
        for (const choice of choices) {
          const button = h('button', { class: 'choice', type: 'button' }, render(choice))
          button.addEventListener('click', () => {
            if (!ready) return
            ready = false
            button.classList.add('picked')
            for (const other of list.children) other.disabled = true
            setTimeout(() => resolve(choice), 160)
          })
          list.append(button)
        }
        set(h('p', { class: 'panel-label', text: '返事を選ぶ' }), list)
        setTimeout(() => {
          ready = true
          list.classList.add('ready')
        }, GUARD_MS)
      })
    },

    button(label) {
      return new Promise((resolve) => {
        set(h('button', { class: 'btn btn-primary', type: 'button', onClick: () => resolve() }, label))
      })
    },
  }
}

return { createPanel }
})()
// ---- js/views/chat.js
__modules["js/views/chat.js"] = (() => {
// メッセージの場面（04 §4 S3）。吹き出し・入力中…・既読・間を出す。
// 1話の中のメッセージの場面は、同じトーク画面に続けて出す（場面の札を区切りにする）。

const { characterAvatar, h } = __modules["js/ui.js"]
const { between, wait } = __modules["js/wait.js"]
const { createPanel } = __modules["js/views/panel.js"]

// 演出の目安（04 §7）
const TYPING_MS = [800, 1200] // 相手のセリフの前の「入力中…」
const READ_MS = 500 // 自分の返事 → 「既読」
const LONG_MS = 3000 // delay: "long" … 既読のまま返事が来ない間
const BEAT_MS = 300 // 既読がついてから入力中…が出るまで
const FIRST_MS = 1000 // 場面のはじめは、履歴を見てもらってから話し始める
const NO_REPLY_MS = 1500 // 返事がないとき（既読のまま）

function createChatView({ episode, character }) {
  const status = h('p', { class: 'chat-status' })
  const log = h('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite' })
  const panel = createPanel()
  const el = h('section', { class: 'view chat' },
    h('header', { class: 'chat-header' },
      characterAvatar(character),
      h('div', {}, h('p', { class: 'chat-name', text: character.name }), status),
    ),
    log,
    panel.el,
  )

  const scrollDown = () => requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }))
  new ResizeObserver(scrollDown).observe(log)

  let lastSide = null // 同じ人の吹き出しが続くときはアイコンを省く
  let pause = true

  function add(row, side) {
    if (side && side === lastSide) row.classList.add('cont')
    lastSide = side
    log.append(row)
    scrollDown()
    return row
  }
  const divider = (label) => add(h('div', { class: 'divider' }, h('span', { text: label })), null)
  const partnerRow = (bubble) => h('div', { class: 'msg partner' }, characterAvatar(character), bubble)
  const partnerMessage = (text) => add(partnerRow(h('div', { class: 'bubble', text })), 'partner')
  const playerMessage = (body) => add(h('div', { class: 'msg player' }, body), 'player')
  const markRead = (row) => row.prepend(h('span', { class: 'read', text: '既読' }))

  // 上部に過去のやりとり（相手の「いつもの口調」が手がかりの基準になる）
  if (episode.history) {
    divider(episode.history.label)
    for (const message of episode.history.messages) {
      if (message.from === 'player') markRead(playerMessage(h('div', { class: 'bubble', text: message.text })))
      else partnerMessage(message.text)
    }
  }
  panel.hint()

  /** chat のセリフは文字列。{ who, text } の形でも出せる（地の文は小さな注記にする） */
  async function partner(line) {
    const text = typeof line === 'string' ? line : line.text
    if (line.who === 'narration') {
      add(h('p', { class: 'chat-note', text }), null)
      return
    }
    if (pause) {
      pause = false
      await wait(FIRST_MS)
    }
    const typing = partnerRow(h('div', { class: 'bubble typing', 'aria-label': '入力中' }, h('i'), h('i'), h('i')))
    if (lastSide === 'partner') typing.classList.add('cont')
    log.append(typing)
    scrollDown()
    status.textContent = '入力中…'
    await wait(between(...TYPING_MS))
    typing.remove()
    status.textContent = ''
    partnerMessage(text)
  }

  async function reaction(line) {
    await wait(line.delay === 'long' ? LONG_MS : BEAT_MS)
    await partner(line)
  }

  return {
    el,
    /** 場面に入るとき: 区切り（場面の札。v1 の話は「今日」）を入れる */
    startScene(scene) {
      divider(scene.label ?? '今日')
      pause = true
      panel.hint()
    },
    partner,
    async choose(choices) {
      const choice = await panel.choose(choices, renderChoice)
      panel.hint()
      return choice
    },
    async player(choice) {
      const body = choice.send_as === 'sticker'
        ? h('div', { class: 'sticker', role: 'img', 'aria-label': 'スタンプ' }, choice.sticker)
        : h('div', { class: 'bubble', text: choice.text })
      const row = playerMessage(body)
      await wait(READ_MS)
      markRead(row)
    },
    reaction,
    noReply: () => wait(NO_REPLY_MS),
    exit: reaction,
    async showEnd(label) {
      await wait(BEAT_MS)
      add(h('p', { class: 'chat-end', text: '会話が終わりました' }), null)
      await panel.button(label)
    },
  }
}

function renderChoice(choice) {
  if (choice.send_as !== 'sticker') return choice.text
  return [choice.text, h('span', { class: 'choice-sticker', 'aria-hidden': 'true' }, choice.sticker)]
}

return { createChatView }
})()
// ---- js/views/face.js
__modules["js/views/face.js"] = (() => {
// 会う場面（06 §4 S4・§5）。上半分に背景とキャラの絵、下半分に吹き出しと選択肢。
// セリフの face でキャラの表情を切り替える。地の文は帯で出し、店員さんは札つきの吹き出しにする。

const { backgroundArt, characterArt } = __modules["js/art/index.js"]
const { art, artNode, characterAvatar, h, speakerName } = __modules["js/ui.js"]
const { between, wait } = __modules["js/wait.js"]
const { createPanel } = __modules["js/views/panel.js"]

const LONG_MS = 2800 // delay: "long" … 黙っている間
const MS_PER_CHAR = 40 // 前のセリフを読む時間の目安
const GAP_MS = [700, 2600]

function createFaceView({ character, scene }) {
  const background = backgroundArt(scene.background)
  const figure = h('div', { class: 'stage-figure' })
  const stage = h('div', { class: 'stage' },
    background.image
      ? artNode(background, 'stage-layer')
      : h('div', { class: 'stage-layer' }, art(background.back)),
    figure,
    background.front ? h('div', { class: 'stage-layer front' }, art(background.front)) : null,
  )
  const log = h('div', { class: 'say-log', role: 'log', 'aria-live': 'polite' })
  const panel = createPanel()
  const el = h('section', { class: 'view face' }, stage, log, panel.el)

  const scrollDown = () => requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }))
  new ResizeObserver(scrollDown).observe(log)

  let face = null
  let lastWho = null // 同じ人が続くときは名前を省く
  let lastLength = 0
  const readingGap = () => Math.min(GAP_MS[1], Math.max(GAP_MS[0], 300 + lastLength * MS_PER_CHAR))

  /** 表情を切り替える（絵は キャラID＋表情ID で呼ぶ） */
  function setFace(next) {
    if (!next || next === face) return
    face = next
    figure.replaceChildren(artNode(characterArt(character, next), 'stage-art') ?? characterAvatar(character, 'xl'))
  }
  setFace('normal')

  function lineNode(who, text) {
    if (who === 'narration') return h('p', { class: 'narration', text })
    const staff = who === 'staff'
    return h('div', { class: `say ${staff ? 'staff' : 'person'}` },
      staff || who !== lastWho ? h('p', { class: 'say-name', text: speakerName(who, character) }) : null,
      h('div', { class: 'bubble', text }),
    )
  }

  async function say(line, gap = readingGap()) {
    await wait(gap)
    const who = line.who ?? character.id
    if (line.face) setFace(line.face) // 地の文でも、face があれば表情だけ変える
    log.append(lineNode(who, line.text))
    lastWho = who === 'narration' ? null : who
    lastLength = line.text.length
    scrollDown()
  }

  const reaction = (line) => say(line, line.delay === 'long' ? LONG_MS : between(700, 1100))

  panel.hint()

  return {
    el,
    partner: (line) => say(line), // 会う場面のセリフは { who, text, face }
    async choose(choices) {
      // 相手以外（店員さんなど）への返事がある手だけ、誰への返事かの札を出す
      const tagged = choices.some((choice) => choice.to && choice.to !== character.id)
      const choice = await panel.choose(choices, (c) => [
        tagged && c.to ? h('span', { class: 'choice-to', text: `${speakerName(c.to, character)}に` }) : null,
        c.text,
      ])
      panel.hint()
      return choice
    },
    async player(choice) {
      const to = choice.to && choice.to !== character.id ? `→ ${speakerName(choice.to, character)}に` : null
      log.append(h('div', { class: 'say player' },
        to ? h('p', { class: 'say-name', text: to }) : null,
        h('div', { class: 'bubble', text: choice.text }),
      ))
      lastWho = 'player'
      lastLength = 0
      scrollDown()
      await wait(400)
    },
    reaction,
    noReply: () => wait(1200),
    exit: reaction,
    async showEnd(label) {
      await wait(800)
      log.append(h('p', { class: 'say-end', text: '会話が終わりました' }))
      scrollDown()
      await panel.button(label)
    },
  }
}

return { createFaceView }
})()
// ---- js/views/conversation.js
__modules["js/views/conversation.js"] = (() => {
// S4 会話の入れ物（06 §4）。場面ごとに、メッセージの画面と会う場面を切り替え、場面の札を出す。

const { h } = __modules["js/ui.js"]
const { skipWaits, wait } = __modules["js/wait.js"]
const { createChatView } = __modules["js/views/chat.js"]
const { createFaceView } = __modules["js/views/face.js"]

const LABEL_MS = 1600 // 場面の札を出しておく長さ（1〜2秒。タップで飛ばせる）

function createConversation({ episode, character }) {
  const el = h('section', { class: 'screen conversation' })
  // 待っている間は、どこをタップしても早送り（ボタンの上は除く）
  el.addEventListener('click', (event) => {
    if (!event.target.closest('button')) skipWaits()
  })

  let chat = null // メッセージの場面は、1つのトーク画面を続けて使う
  let current = null

  return {
    el,

    /** runner から呼ばれる: 場面の札を出し、その場面の view を返す */
    async enterScene(scene) {
      const sceneCard = scene.label
        ? h('div', { class: 'scene-card', role: 'status' }, h('p', { class: 'scene-card-label', text: scene.label }))
        : null
      if (sceneCard) el.append(sceneCard)

      let view
      if (scene.mode === 'face') {
        view = createFaceView({ character, scene })
      } else {
        chat ??= createChatView({ episode, character })
        chat.startScene(scene)
        view = chat
      }
      if (view !== current) {
        current?.el.remove()
        el.prepend(view.el)
        current = view
      }

      if (sceneCard) {
        await wait(LABEL_MS)
        sceneCard.classList.add('leaving')
        setTimeout(() => sceneCard.remove(), 400)
      }
      return view
    },

    /** 会話が終わったあと、推理へのボタンを出して押されるまで待つ */
    showEnd(label) {
      return current.showEnd(label)
    },
  }
}

return { createConversation }
})()
// ---- js/screens/guess.js
__modules["js/screens/guess.js"] = (() => {
// S5 推理。タイプ推理（4つの軸を2択で。04 §4）か、続きの話のギャップ推理（4択。06 §4）

const { shuffle } = __modules["js/rules.js"]
const { h } = __modules["js/ui.js"]

/** 答えは onDone({ kind: 'type', answers }) / onDone({ kind: 'gap', option }) / スキップは onDone(null) */
function guessScreen({ episode, character, types, onDone }) {
  return episode.guess === 'gap'
    ? gapGuess({ question: episode.gap_guess.question, options: episode.gap_guess.options, onDone })
    : typeGuess({ character, types, onDone })
}

function typeGuess({ character, types, onDone }) {
  const keys = Object.keys(types.axes)
  const answers = {}
  const submit = h('button', {
    class: 'btn btn-primary',
    type: 'button',
    disabled: true,
    onClick: () => onDone({ kind: 'type', answers: { ...answers } }),
  }, '答え合わせ')

  const cards = keys.map((key) => {
    const axis = types.axes[key]
    const options = Object.entries(axis.values).map(([value, label]) => {
      const button = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, label)
      button.addEventListener('click', () => {
        answers[key] = value
        for (const [other, otherButton] of options) otherButton.setAttribute('aria-pressed', String(other === value))
        // 4問すべて選ぶまで押せない
        submit.disabled = keys.some((k) => !answers[k])
      })
      return [value, button]
    })
    return h('div', { class: 'axis-card' },
      h('p', { class: 'axis-head' },
        h('span', { class: 'axis-key', text: key }),
        h('span', { class: 'axis-label', text: axis.label }),
      ),
      h('p', { class: 'axis-hint', text: `ヒント: ${axis.hint}` }),
      h('div', { class: 'opts', role: 'group', 'aria-label': axis.label }, options.map(([, button]) => button)),
    )
  })

  return h('section', { class: 'screen page guess' },
    h('p', { class: 'kicker', text: 'タイプ推理' }),
    h('h2', { class: 'guess-q', text: `${character.name}はどんなタイプだと思う？` }),
    cards,
    h('div', { class: 'btn-row' },
      submit,
      h('button', { class: 'btn btn-ghost', type: 'button', onClick: () => onDone(null) }, 'スキップ'),
    ),
  )
}

function gapGuess({ question, options, onDone }) {
  let picked = null
  const submit = h('button', {
    class: 'btn btn-primary',
    type: 'button',
    disabled: true,
    onClick: () => onDone({ kind: 'gap', option: picked }),
  }, '答え合わせ')

  // データでは正解が先頭なので、並びはシャッフル
  const buttons = shuffle(options).map((option) => {
    const button = h('button', { class: 'gap-opt', type: 'button', 'aria-pressed': 'false', 'data-id': option.id }, option.text)
    button.addEventListener('click', () => {
      picked = option.id
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button))
      submit.disabled = false
    })
    return button
  })

  return h('section', { class: 'screen page guess' },
    h('p', { class: 'kicker', text: 'ギャップ推理' }),
    h('h2', { class: 'guess-q', text: question }),
    h('p', { class: 'guess-lead', text: 'ギャップ: ある話題になると、いつものタイプと変わるところ' }),
    h('div', { class: 'gap-opts', role: 'group', 'aria-label': question }, buttons),
    h('div', { class: 'btn-row' },
      submit,
      h('button', { class: 'btn btn-ghost', type: 'button', onClick: () => onDone(null) }, 'スキップ'),
    ),
  )
}

return { guessScreen }
})()
// ---- js/screens/home.js
__modules["js/screens/home.js"] = (() => {
// S2 ホーム（06 §4）。タブは相手の性別。★（心の余裕）はここでは出さない

const { GENDERS, PAIRINGS, TABS, homeCards } = __modules["js/catalog.js"]
const { characterAvatar, h, tierBadge } = __modules["js/ui.js"]

function homeScreen({ entries, tab, playerGender, recordOf, storyRecordOf, onTab, onOpen, onChangeGender }) {
  const cards = homeCards({ entries, tab, playerGender, recordOf, storyRecordOf })
  const pairBadge = (c) => (c.pairing ? h('span', { class: `badge pair pair-${c.pairing}`, text: PAIRINGS[c.pairing] }) : null)

  const cardNode = (c) => h('button', {
    class: `ep-card${c.locked ? ' locked' : ''}`,
    type: 'button',
    disabled: c.locked,
    onClick: () => onOpen(c.entry),
  },
    characterAvatar(c.character, 'md'),
    h('span', { class: 'ep-body' },
      h('span', { class: 'ep-top' },
        h('span', { class: 'ep-name', text: c.character.name }),
        tierBadge(c.episode.tier, c.tier),
        pairBadge(c),
      ),
      h('span', { class: 'ep-title', text: c.episode.title }),
      c.locked
        ? h('span', { class: 'ep-lock', text: `🔒 ${c.lockText}` })
        : h('span', { class: 'ep-relation', text: c.relation }),
      !c.locked && c.best != null ? h('span', { class: 'ep-best', text: `最高 ${c.best}点` }) : null,
    ),
  )

  // お話（06 §6.6）: 相手は始めるときに決まるので、名前も顔も出さない
  const storyNode = (c) => h('button', { class: 'ep-card story', type: 'button', onClick: () => onOpen(c.entry) },
    characterAvatar({ id: c.story.id, name: '？', icon_text: '？' }, 'md'),
    h('span', { class: 'ep-body' },
      h('span', { class: 'ep-top' },
        h('span', { class: 'ep-who', text: '相手は毎回かわる' }),
        tierBadge(c.story.tier, c.tier),
        pairBadge(c),
      ),
      h('span', { class: 'ep-title', text: c.story.title }),
      h('span', { class: 'ep-relation', text: c.summary }),
      c.best != null ? h('span', { class: 'ep-best', text: `最高 ${c.best}点・会ったタイプ ${c.met}/${c.total}` }) : null,
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
      cards.length
        ? cards.map((c) => (c.story ? storyNode(c) : cardNode(c)))
        : h('p', { class: 'fine home-empty', text: 'まだ遊べる話がありません' }),
    ),
    h('p', { class: 'fine home-foot', text: '記録はこの端末のブラウザの中にだけ残ります。' }),
  )
}

return { homeScreen }
})()
// ---- js/screens/result.js
__modules["js/screens/result.js"] = (() => {
// S6 結果（04 §4 S5 に、06 §4 S6 を足したもの）

const { TIERS } = __modules["js/catalog.js"]
const { bestChoice, evaluationOf, rankFor, scenesOf } = __modules["js/rules.js"]
const { card, characterAvatar, copyBlock, h, speakerName, stars, tierBadge } = __modules["js/ui.js"]

const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮'
const stepNumber = (id) => CIRCLED[id - 1] ?? `${id}.`
const STAR_LABELS = { 1: '余裕あり', 2: 'ふつう', 3: '余裕なし' } // 心の余裕（設計書 §3.3）

/** met: お話で会ったタイプの数 { count, total }（06 §6.6）。固定の人の話なら null */
function resultScreen({ episode, character, rules, types, play, saved, guess, met = null, onRetry, onHome, onCopy }) {
  const type = types.types.find((t) => t.id === character.type)
  const axes = Object.entries(types.axes)
  const result = episode.result ?? {}
  const ctx = { episode, character, rules, types, type, axes, met }

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

// 2. タイプの種明かし（心の余裕の★と、ギャップも。お話なら、会ったタイプの数も）
function typePart({ episode, character, type, axes, met }) {
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
    met ? h('p', { class: 'type-met', text: `このお話で会ったタイプ ${met.count}/${met.total}` }) : null,
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

return { resultScreen }
})()
// ---- js/screens/start.js
__modules["js/screens/start.js"] = (() => {
// S0 タイトル / S1 遊び方 / S1.5 あなたは？ / S3 紹介

const { GENDERS } = __modules["js/catalog.js"]
const { art, characterAvatar, h, tierBadge } = __modules["js/ui.js"]

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

function titleScreen({ onStart }) {
  return h('section', { class: 'screen page center title' },
    art(TITLE_ART),
    h('h1', {}, '男女心', h('small', { text: '（仮）' })),
    h('p', { class: 'title-badge', text: '試作版' }),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: onStart }, 'はじめる'),
    h('p', { class: 'fine', text: '記録はこの端末のブラウザの中にだけ残ります。どこにも送信しません。' }),
  )
}

function howToScreen({ onNext }) {
  return h('section', { class: 'screen page center howto' },
    h('h2', { class: 'howto-title', text: '遊び方' }),
    h('div', { class: 'howto-card' }, HOW_TO_PLAY.map((text) => h('p', { text }))),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: onNext }, 'わかった'),
  )
}

/** S1.5 あなたは？（06 §4）。同性・異性の札を出すためだけに使う */
function genderScreen({ current, onDone }) {
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
function introScreen({ episode, character, tierLabel, onStart, onBack }) {
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

return { titleScreen, howToScreen, genderScreen, introScreen }
})()
// ---- js/main.js
__modules["js/main.js"] = (() => {
// 男女心（仮）試作版 — 画面の流れ（04 §4・06 §4）
// S0 タイトル → S1 遊び方 → S1.5 あなたは？（初回だけ）→ S2 ホーム → S3 紹介 → S4 会話（場面ごと）→ S5 推理 → S6 結果

const { BACKGROUND_IDS, lookProblems, setArtImages } = __modules["js/art/index.js"]
const { TIERS, defaultTab, pairingOf } = __modules["js/catalog.js"]
const { loadGame, validateEpisode, validateStory } = __modules["js/data.js"]
const { buildReport } = __modules["js/report.js"]
const { runEpisode } = __modules["js/runner.js"]
const { browserStorage, createStore } = __modules["js/store.js"]
const { castStory } = __modules["js/stories.js"]
const { copyText, h, toast } = __modules["js/ui.js"]
const { setSpeed, skipWaits } = __modules["js/wait.js"]
const { createConversation } = __modules["js/views/conversation.js"]
const { guessScreen } = __modules["js/screens/guess.js"]
const { homeScreen } = __modules["js/screens/home.js"]
const { resultScreen } = __modules["js/screens/result.js"]
const { genderScreen, howToScreen, introScreen, titleScreen } = __modules["js/screens/start.js"]

const root = document.getElementById('app')
const params = new URLSearchParams(location.search)
const store = createStore(browserStorage())

// 確認用: ?fast=1 で待ち時間をほぼなくす / ?reset=1 でこの端末の記録を消す
if (params.has('fast')) setSpeed(0.05)
if (params.has('reset')) {
  store.clear()
  params.delete('reset')
  const query = params.toString()
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`)
  setTimeout(() => toast('この端末の記録を消しました'), 300)
}

// PC ではスペース／Enter でも早送りできる
document.addEventListener('keydown', (event) => {
  if (event.key !== ' ' && event.key !== 'Enter') return
  if (event.target instanceof HTMLButtonElement) return
  if (skipWaits() > 0) event.preventDefault()
})

let game // { index, rules, types, art, names, entries: [{ episode, character } または お話 { story, variants }] }
let homeTab = null // ホームで開いているタブ（相手の性別）
// いまのプレイ: { source（ホームで選んだもの）, entry（遊ぶ { episode, character, story? }）, startedAt, play, saved, guess, playMs, met }
let session

function show(screen, { guard = true } = {}) {
  root.replaceChildren(screen)
  window.scrollTo(0, 0)
  if (!guard) return
  // 切り替えた直後のタップは無視する（連打で次の画面のボタンを押さないように）
  root.style.pointerEvents = 'none'
  setTimeout(() => {
    root.style.pointerEvents = ''
  }, 250)
}

const playerGender = () => store.player().gender ?? 'none'

async function boot() {
  try {
    game = await loadGame()
  } catch (error) {
    console.error(error)
    show(errorScreen(error))
    return
  }
  setArtImages(game.art)
  checkContent()
  show(titleScreen({ onStart: () => show(howToScreen({ onNext: afterHowTo })) }))
}

/** データと絵の点検。おかしな所はコンソールに出す */
function checkContent() {
  const episodeIds = game.entries.filter((entry) => entry.episode).map((entry) => entry.episode.id)
  const options = { rules: game.rules, types: game.types, names: game.names, backgrounds: BACKGROUND_IDS, episodeIds }
  for (const entry of game.entries) {
    const problems = entry.story ? validateStory(entry, options) : validateEpisode(entry, options)
    for (const problem of problems) console.warn(`[content] ${problem}`)
  }
  for (const character of new Set(game.entries.filter((entry) => entry.character).map((entry) => entry.character))) {
    for (const problem of lookProblems(character.look)) console.warn(`[art] ${character.id}: ${problem}`)
  }
}

function afterHowTo() {
  if (store.player().gender) showHome()
  else showGender()
}

function showGender() {
  show(genderScreen({
    current: store.player().gender,
    onDone: (gender) => {
      store.savePlayer({ gender })
      homeTab ??= defaultTab(gender)
      showHome()
    },
  }))
}

function showHome({ guard = true } = {}) {
  homeTab ??= defaultTab(playerGender())
  show(homeScreen({
    entries: game.entries,
    tab: homeTab,
    playerGender: playerGender(),
    recordOf: (id) => store.read(id),
    storyRecordOf: (id) => store.readStory(id),
    onTab: (tab) => {
      homeTab = tab
      showHome({ guard: false })
    },
    onOpen: openEntry,
    onChangeGender: showGender,
  }), { guard })
}

/** ホームで選んだ話を開く。お話なら、ここで相手（タイプ・名前・見た目）が決まる（06 §6.6） */
function openEntry(source) {
  const entry = source.story
    ? castStory({ ...source, names: game.names, last: store.readStory(source.story.id).last })
    : source
  showIntro(entry, source)
}

function showIntro(entry, source) {
  homeTab = entry.character.gender
  show(introScreen({
    ...entry,
    tierLabel: TIERS[entry.episode.tier],
    onStart: () => startConversation(entry, source),
    onBack: () => showHome(),
  }))
}

async function startConversation(entry, source) {
  session = { source, entry, startedAt: Date.now() }
  const conversation = createConversation(entry)
  show(conversation.el)
  session.play = await runEpisode({
    ...entry,
    rules: game.rules,
    director: conversation,
    pairing: pairingOf(playerGender(), entry.character.gender), // 同性・異性で1手だけ入れかわる
  })
  // 会話を最後まで（0点で途中終了も含む）終えた時点で記録する。お話は、お話ごとに記録する
  const { story, character } = entry
  session.saved = story
    ? store.recordStoryPlay(story.id, session.play, { type: character.type, name: character.name })
    : store.recordPlay(entry.episode.id, session.play)
  await conversation.showEnd(entry.episode.guess === 'gap' ? 'ギャップ推理へ' : 'タイプ推理へ')
  show(guessScreen({
    ...entry,
    types: game.types,
    onDone: (guess) => {
      session.guess = guess
      showResult()
    },
  }))
}

function showResult() {
  // プレイ時間は S3 の[会話をはじめる]から、結果が最初に出るまで
  session.playMs ??= Date.now() - session.startedAt
  // お話で会ったタイプは、種明かし（この画面）で数える
  const { story, character } = session.entry
  session.met ??= story ? { count: store.meetType(story.id, character.type).length, total: story.variants.length } : null
  show(resultScreen({
    ...session.entry,
    rules: game.rules,
    types: game.types,
    play: session.play,
    saved: session.saved,
    guess: session.guess,
    met: session.met,
    onRetry: () => openEntry(session.source), // お話なら、また新しい相手になる
    onHome: () => showHome(),
    onCopy: copyReport,
  }))
}

async function copyReport() {
  const text = buildReport({
    ...session.entry,
    rules: game.rules,
    types: game.types,
    play: session.play,
    saved: session.saved,
    guess: session.guess,
    met: session.met,
    playMs: session.playMs,
    playerGender: playerGender(),
  })
  return { ok: await copyText(text), text }
}

function errorScreen(error) {
  return h('section', { class: 'screen page center error' },
    h('h2', { class: 'howto-title', text: 'データを読み込めませんでした' }),
    h('p', { class: 'fine', text: '通信がよくないのかもしれません。少し待ってから、もう一度ためしてください。' }),
    h('button', { class: 'btn btn-primary', type: 'button', onClick: () => location.reload() }, 'もう一度'),
    h('p', { class: 'fine error-detail', text: error?.message ?? String(error) }),
  )
}

boot()

return {  }
})()
})()
