// 絵の呼び出し口。絵は「キャラID＋表情ID」「背景ID」で呼ぶ（06 §3・§5）。
// content/art.json に画像が登録されていれば画像を、なければ Claude が描いた仮の絵（SVG）を使う。
// 本番の絵に替えるときは、画像ファイルを置いて art.json に書き足すだけで、エピソードのデータは変えない。

import { BACKGROUNDS, backgroundSvg } from './backgrounds.js'
import { FACES, characterSvg, lookProblems } from './character.js'

export const FACE_IDS = Object.keys(FACES)
export const BACKGROUND_IDS = Object.keys(BACKGROUNDS)
export { lookProblems }

let images = { characters: {}, backgrounds: {} }

/** art.json: { characters: { キャラID: { 表情ID: 画像パス } }, backgrounds: { 背景ID: 画像パス } } */
export function setArtImages(manifest) {
  images = { characters: manifest?.characters ?? {}, backgrounds: manifest?.backgrounds ?? {} }
}

/** キャラの絵 → { image } か { svg }。look も画像もなければ null（文字アイコンにする） */
export function characterArt(character, face = 'normal', crop = 'bust') {
  const image = images.characters[character.id]?.[face]
  if (image) return { image }
  if (!character.look) return null
  return { svg: characterSvg(character, face, crop) }
}

/** 背景 → { image } か { back, front }（SVG） */
export function backgroundArt(id) {
  const image = images.backgrounds[id]
  if (image) return { image }
  return backgroundSvg(id)
}
