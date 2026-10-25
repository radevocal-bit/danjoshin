// 男女心（仮）試作版 — 画面の流れ（04 §4・06 §4）
// S0 タイトル → S1 遊び方 → S1.5 あなたは？（初回だけ）→ S2 ホーム → S3 紹介 → S4 会話（場面ごと）→ S5 推理 → S6 結果

import { BACKGROUND_IDS, lookProblems, setArtImages } from './art/index.js'
import { TIERS, defaultTab, pairingOf } from './catalog.js'
import { loadGame, validateEpisode } from './data.js'
import { buildReport } from './report.js'
import { runEpisode } from './runner.js'
import { browserStorage, createStore } from './store.js'
import { copyText, h, toast } from './ui.js'
import { setSpeed, skipWaits } from './wait.js'
import { createConversation } from './views/conversation.js'
import { guessScreen } from './screens/guess.js'
import { homeScreen } from './screens/home.js'
import { resultScreen } from './screens/result.js'
import { genderScreen, howToScreen, introScreen, titleScreen } from './screens/start.js'

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

let game // { index, rules, types, art, entries: [{ episode, character }] }
let homeTab = null // ホームで開いているタブ（相手の性別）
let session // いまのプレイ: { entry, startedAt, play, saved, guess, playMs }

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
const entryOf = (id) => game.entries.find((entry) => entry.episode.id === id)

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
  const episodeIds = game.entries.map((entry) => entry.episode.id)
  for (const entry of game.entries) {
    const problems = validateEpisode(entry, { rules: game.rules, types: game.types, backgrounds: BACKGROUND_IDS, episodeIds })
    for (const problem of problems) console.warn(`[content] ${problem}`)
  }
  for (const character of new Set(game.entries.map((entry) => entry.character))) {
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
    onTab: (tab) => {
      homeTab = tab
      showHome({ guard: false })
    },
    onOpen: (id) => showIntro(entryOf(id)),
    onChangeGender: showGender,
  }), { guard })
}

function showIntro(entry) {
  homeTab = entry.character.gender
  show(introScreen({
    ...entry,
    tierLabel: TIERS[entry.episode.tier],
    onStart: () => startConversation(entry),
    onBack: () => showHome(),
  }))
}

async function startConversation(entry) {
  session = { entry, startedAt: Date.now() }
  const conversation = createConversation(entry)
  show(conversation.el)
  session.play = await runEpisode({
    ...entry,
    rules: game.rules,
    director: conversation,
    pairing: pairingOf(playerGender(), entry.character.gender), // 同性・異性で1手だけ入れかわる
  })
  // 会話を最後まで（0点で途中終了も含む）終えた時点で記録する
  session.saved = store.recordPlay(entry.episode.id, session.play)
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
  show(resultScreen({
    ...session.entry,
    rules: game.rules,
    types: game.types,
    play: session.play,
    saved: session.saved,
    guess: session.guess,
    onRetry: () => showIntro(session.entry),
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
    playMs: session.playMs,
    playerGender: playerGender(),
  })
  return { ok: await copyText(text), text }
}

function errorScreen(error) {
  return h('section', { class: 'screen page center' },
    h('h2', { class: 'howto-title', text: 'データを読み込めませんでした' }),
    h('p', { class: 'fine', text: error?.message ?? String(error) }),
    h('p', { class: 'fine', text: 'npm start で開くか、静的ホスティングに置いて開いてください（README.md）。' }),
  )
}

boot()
