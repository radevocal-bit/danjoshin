// 背景の仮の絵（06 §5.4）。キャラより落ち着いた色にして、キャラが目立つようにする。
// back はキャラの後ろ、front はキャラの手前（テーブル）。どちらも 400×300 で、画面に合わせて切り取る
// （下をそろえて切るので、横長の画面でもテーブルは残る）。

export const BACKGROUNDS = {
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
export function backgroundSvg(id) {
  const scene = BACKGROUNDS[id]
  if (!scene) return { back: svg('<rect width="400" height="300" fill="#EFE7DC"/>'), front: null }
  return { back: svg(scene.back), front: svg(scene.front) }
}
