// 演出の待ち時間。画面をタップすると、いま待っている分を飛ばせる（仕様書 §7）

let speed = 1
const pending = new Set()

/** 待ち時間の倍率（?fast=1 の確認用に小さくする） */
export function setSpeed(factor) {
  speed = factor
}

/** ms ミリ秒待つ。skipWaits() が呼ばれたら、そこで終わる */
export function wait(ms) {
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
export function skipWaits() {
  const count = pending.size
  for (const done of [...pending]) done()
  return count
}

export function between(min, max) {
  return min + Math.random() * (max - min)
}
