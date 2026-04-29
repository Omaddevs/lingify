import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useUser } from './context/UserContext'
import { useNotification } from './hooks/useNotification'
import { useStreak } from './hooks/useStreak'
import { NotificationToast } from './components/NotificationToast'
import OnboardingModal from './components/OnboardingModal'

// ── Eager loaded (critical path) ─────────────────────────────────────────────
import Dashboard       from './pages/Dashboard'
import LoginPage       from './pages/LoginPage'

// ── Lazy loaded (code splitting) ─────────────────────────────────────────────
const ChatPage            = lazy(() => import('./pages/ChatPage'))
const FlashcardPage       = lazy(() => import('./pages/FlashcardPage'))
const LeaderboardPage     = lazy(() => import('./pages/LeaderboardPage'))
const LessonPlayerPage    = lazy(() => import('./pages/LessonPlayerPage'))
const MessagesPage        = lazy(() => import('./pages/MessagesPage'))
const MockExamPage        = lazy(() => import('./pages/MockExamPage'))
const MockTestSession     = lazy(() => import('./pages/MockTestSession'))
const ExamSessionPage     = lazy(() => import('./pages/ExamSessionPage'))
const GamesPage           = lazy(() => import('./pages/GamesPage'))
const OnlineLessonsPage   = lazy(() => import('./pages/OnlineLessonsPage'))
const PartnerPage         = lazy(() => import('./pages/PartnerPage'))
const PlacementTestPage   = lazy(() => import('./pages/PlacementTestPage'))
const ProgressPage        = lazy(() => import('./pages/ProgressPage'))
const SettingsPage        = lazy(() => import('./pages/SettingsPage'))
const SpeakingPracticePage= lazy(() => import('./pages/SpeakingPracticePage'))
const TeacherMarketplace  = lazy(() => import('./pages/TeacherMarketplace'))
const TeacherDashboardPage= lazy(() => import('./pages/TeacherDashboardPage'))
const AdminPage           = lazy(() => import('./pages/AdminPage'))
const VocabularyPage      = lazy(() => import('./pages/VocabularyPage'))
const CertificatePage     = lazy(() => import('./pages/CertificatePage'))
const ProfilePage         = lazy(() => import('./pages/ProfilePage'))

// ── Loading spinner ───────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-xs text-slate-400">Yuklanmoqda...</p>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const { user, loading, completeOnboarding } = useUser()
  const { notifications } = useNotification()
  useStreak()   // auto-increments streak daily
  useDarkMode() // applies .dark class to <html> // applies .dark class to <html> from localStorage

  if (loading) return <Spinner />

  if (!user?.isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*"     element={<Dashboard />} />
        </Routes>
        <NotificationToast notifications={notifications} />
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                      element={<Dashboard />} />
          <Route path="/profile"               element={<ProfilePage />} />
          <Route path="/partner"               element={<PartnerPage />} />
          <Route path="/online-lessons"        element={<OnlineLessonsPage />} />
          <Route path="/lessons/:id"           element={<LessonPlayerPage />} />
          <Route path="/mock-exam"             element={<MockExamPage />} />
          <Route path="/mock-test/:testId"     element={<MockTestSession />} />
          <Route path="/exam/:testId"          element={<ExamSessionPage />} />
          <Route path="/games"                 element={<GamesPage />} />
          <Route path="/teachers"              element={<TeacherMarketplace />} />
          <Route path="/teacher-dashboard"     element={<TeacherDashboardPage />} />
          <Route path="/admin"                 element={<AdminPage />} />
          <Route path="/progress"              element={<ProgressPage />} />
          <Route path="/leaderboard"           element={<LeaderboardPage />} />
          <Route path="/messages"              element={<MessagesPage />} />
          <Route path="/chat"                  element={<ChatPage />} />
          <Route path="/vocabulary"            element={<VocabularyPage />} />
          <Route path="/flashcards"            element={<FlashcardPage />} />
          <Route path="/placement-test"        element={<PlacementTestPage />} />
          <Route path="/speaking-practice"     element={<SpeakingPracticePage />} />
          <Route path="/settings"              element={<SettingsPage />} />
          <Route path="/certificate"           element={<CertificatePage />} />
          <Route path="/login"                 element={<Navigate to="/" replace />} />
          <Route path="/vocabulary/words"      element={<VocabularyPage />} />
          <Route path="/vocabulary/categories" element={<VocabularyPage />} />
          <Route path="/progress/activity"     element={<ProgressPage />} />
          <Route path="/lessons/all"           element={<OnlineLessonsPage />} />
          <Route path="*"                      element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {user?.isAuthenticated && user?.isFirstTime && (
        <OnboardingModal userName={user?.name} onFinish={completeOnboarding} />
      )}

      <NotificationToast notifications={notifications} />
    </>
  )
}

export default App
