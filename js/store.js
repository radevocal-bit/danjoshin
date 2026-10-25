// 保存（ブラウザ内だけ。サーバーには送らない。04 §8・06 §4 S1.5）
// スマホアプリにするときは、このファイルの storage を差し替える。

const PREFIX = 'danjo:v1:'

export function browserStorage() {
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

export function memoryStorage() {
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

export function createStore(storage) {
  const keyOf = (episodeId) => `${PREFIX}episode:${episodeId}`
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

  return {
    read,

    /** 最後まで遊んだ1回を記録する。初見（1回目）は上書きしない */
    recordPlay(episodeId, play) {
      const record = read(episodeId)
      const isFirst = !record.first
      if (isFirst) {
        record.first = {
          score: play.score,
          // 本音の間の分析（leans の集計）用に、1回目に選んだ返事の id を残す。
          // 入れかわる手は、どれを出したか（same / opposite / base＝元の手）も残す
          choices: play.steps.map(({ step, choice, variant }) => ({ step: step.id, id: choice.id, ...(variant ? { variant } : {}) })),
          end: play.endReason,
          at: new Date().toISOString(),
        }
      }
      record.best = record.best == null ? play.score : Math.max(record.best, play.score)
      record.plays += 1
      writeJSON(keyOf(episodeId), record)
      return { isFirst, record }
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
