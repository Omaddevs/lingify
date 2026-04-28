import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'lingify_vocabulary'
const FOLDERS_KEY = 'lingify_vocab_folders'
const PROGRESS_KEY = 'lingify_lesson_progress'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ── Default folders ─────────────────────────────────────────────────────────
const DEFAULT_FOLDERS = [
  { id: 'f1', name: 'Academic Words', color: '#6366f1', emoji: '📚' },
  { id: 'f2', name: 'IELTS So\'zlari', color: '#ef4444', emoji: '📝' },
  { id: 'f3', name: 'Kundalik Hayot', color: '#10b981', emoji: '☀️' },
  { id: 'f4', name: 'Business', color: '#f59e0b', emoji: '💼' },
]

// ── Default sample words ─────────────────────────────────────────────────────
const DEFAULT_WORDS = [
  {
    id: 'w1',
    word: 'Comprehensive',
    definition: 'Including or dealing with all or nearly all elements or aspects of something.',
    example: 'We need a comprehensive plan to solve this problem.',
    translation: 'Keng qamrovli, to\'liq',
    level: 'Advanced',
    folderId: 'f1',
    pronunciation: 'ˌkɒmprɪˈhensɪv',
    createdAt: Date.now() - 86400000 * 5,
    mastery: 2,
    nextReview: Date.now() - 1000,
  },
  {
    id: 'w2',
    word: 'Meticulous',
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'She is meticulous in her work.',
    translation: 'Puxta, aniq, e\'tiborli',
    level: 'Advanced',
    folderId: 'f1',
    pronunciation: 'mɪˈtɪkjʊləs',
    createdAt: Date.now() - 86400000 * 4,
    mastery: 3,
    nextReview: Date.now() + 86400000,
  },
  {
    id: 'w3',
    word: 'Ambiguous',
    definition: 'Open to more than one interpretation; not having one obvious meaning.',
    example: 'The instructions were ambiguous and confusing.',
    translation: 'Noaniq, ikki ma\'noli',
    level: 'Advanced',
    folderId: 'f2',
    pronunciation: 'æmˈbɪɡjuəs',
    createdAt: Date.now() - 86400000 * 3,
    mastery: 1,
    nextReview: Date.now() - 1000,
  },
  {
    id: 'w4',
    word: 'Collaborate',
    definition: 'Work jointly on an activity or project.',
    example: 'The two companies decided to collaborate on the project.',
    translation: 'Hamkorlik qilmoq',
    level: 'Intermediate',
    folderId: 'f4',
    pronunciation: 'kəˈlæbəreɪt',
    createdAt: Date.now() - 86400000 * 2,
    mastery: 4,
    nextReview: Date.now() + 86400000 * 3,
  },
  {
    id: 'w5',
    word: 'Eloquent',
    definition: 'Fluent or persuasive in speaking or writing.',
    example: 'She gave an eloquent speech at the conference.',
    translation: 'Notiq, ravon so\'zlovchi',
    level: 'Advanced',
    folderId: 'f2',
    pronunciation: 'ˈeləkwənt',
    createdAt: Date.now() - 86400000,
    mastery: 0,
    nextReview: Date.now() - 1000,
  },
]

// ── SM-2 spaced repetition ───────────────────────────────────────────────────
function getNextInterval(mastery, quality) {
  // quality: 0 = forgot, 1 = hard, 2 = good, 3 = easy
  if (quality === 0) return { mastery: 0, interval: 1 }
  const intervals = [1, 3, 7, 14, 30, 90]
  const nextMastery = Math.min(mastery + 1, intervals.length - 1)
  return { mastery: nextMastery, interval: intervals[nextMastery] }
}

export function useVocabulary() {
  const [words, setWords] = useState(() => load(STORAGE_KEY, DEFAULT_WORDS))
  const [folders, setFolders] = useState(() => load(FOLDERS_KEY, DEFAULT_FOLDERS))

  useEffect(() => { save(STORAGE_KEY, words) }, [words])
  useEffect(() => { save(FOLDERS_KEY, folders) }, [folders])

  const addWord = useCallback((wordData) => {
    const newWord = {
      id: `w${Date.now()}`,
      word: wordData.word.trim(),
      definition: wordData.definition?.trim() || '',
      example: wordData.example?.trim() || '',
      translation: wordData.translation?.trim() || '',
      level: wordData.level || 'Intermediate',
      folderId: wordData.folderId || null,
      pronunciation: wordData.pronunciation || '',
      createdAt: Date.now(),
      mastery: 0,
      nextReview: Date.now(),
    }
    setWords((prev) => [newWord, ...prev])
    return newWord
  }, [])

  const deleteWord = useCallback((id) => {
    setWords((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const updateWord = useCallback((id, updates) => {
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }, [])

  const reviewWord = useCallback((id, quality) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        const { mastery, interval } = getNextInterval(w.mastery, quality)
        return {
          ...w,
          mastery,
          nextReview: Date.now() + interval * 86400000,
        }
      }),
    )
  }, [])

  const addFolder = useCallback((name, color = '#6366f1', emoji = '📁') => {
    const folder = { id: `f${Date.now()}`, name, color, emoji }
    setFolders((prev) => [...prev, folder])
    return folder
  }, [])

  const deleteFolder = useCallback((id) => {
    setFolders((prev) => prev.filter((f) => f.id !== id))
    setWords((prev) => prev.map((w) => (w.folderId === id ? { ...w, folderId: null } : w)))
  }, [])

  const getWordsByFolder = useCallback(
    (folderId) => words.filter((w) => w.folderId === folderId),
    [words],
  )

  const getDueWords = useCallback(
    () => words.filter((w) => w.nextReview <= Date.now()),
    [words],
  )

  const speakWord = useCallback((word) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(word)
    utt.lang = 'en-US'
    utt.rate = 0.85
    window.speechSynthesis.speak(utt)
  }, [])

  return {
    words,
    folders,
    addWord,
    deleteWord,
    updateWord,
    reviewWord,
    addFolder,
    deleteFolder,
    getWordsByFolder,
    getDueWords,
    speakWord,
    totalWords: words.length,
    masteredWords: words.filter((w) => w.mastery >= 4).length,
    dueCount: words.filter((w) => w.nextReview <= Date.now()).length,
  }
}

// ── Lesson progress ──────────────────────────────────────────────────────────
export function useLessonProgress() {
  const [progress, setProgress] = useState(() => load(PROGRESS_KEY, {}))

  useEffect(() => { save(PROGRESS_KEY, progress) }, [progress])

  const completeLesson = useCallback((lessonId, xp = 20) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        completed: true,
        completedAt: Date.now(),
        xp,
      },
    }))
  }, [])

  const isCompleted = useCallback((lessonId) => !!progress[lessonId]?.completed, [progress])

  const getTotalXP = useCallback(
    () => Object.values(progress).reduce((sum, p) => sum + (p.xp || 0), 0),
    [progress],
  )

  const getCompletedCount = useCallback(() => Object.keys(progress).length, [progress])

  return { progress, completeLesson, isCompleted, getTotalXP, getCompletedCount }
}
