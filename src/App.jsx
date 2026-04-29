import { Navigate, Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Dashboard from './pages/Dashboard'
import FlashcardPage from './pages/FlashcardPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LessonPlayerPage from './pages/LessonPlayerPage'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import MockExamPage from './pages/MockExamPage'
import MockTestSession from './pages/MockTestSession'
import ExamSessionPage from './pages/ExamSessionPage'
import GamesPage from './pages/GamesPage'
import OnlineLessonsPage from './pages/OnlineLessonsPage'
import PartnerPage from './pages/PartnerPage'
import PlacementTestPage from './pages/PlacementTestPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import SpeakingPracticePage from './pages/SpeakingPracticePage'
import TeacherMarketplace from './pages/TeacherMarketplace'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import AdminPage from './pages/AdminPage'
import VocabularyPage from './pages/VocabularyPage'
import OnboardingModal from './components/OnboardingModal'
import { NotificationToast } from './components/NotificationToast'
import { useUser } from './context/UserContext'
import { useNotification } from './hooks/useNotification'
import { useStreak } from './hooks/useStreak'

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  )
}

function App() {
  const { user, loading, completeOnboarding } = useUser()
  const { notifications } = useNotification()
  const { streak } = useStreak()

  if (loading) return <Spinner />

  if (!user?.isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        <NotificationToast notifications={notifications} />
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/"                    element={<Dashboard />} />
        <Route path="/partner"             element={<PartnerPage />} />
        <Route path="/online-lessons"      element={<OnlineLessonsPage />} />
        <Route path="/lessons/:id"         element={<LessonPlayerPage />} />
        <Route path="/mock-exam"           element={<MockExamPage />} />
        <Route path="/mock-test/:testId"   element={<MockTestSession />} />
        <Route path="/exam/:testId"        element={<ExamSessionPage />} />
        <Route path="/games"               element={<GamesPage />} />
        <Route path="/teachers"            element={<TeacherMarketplace />} />
        <Route path="/teacher-dashboard"   element={<TeacherDashboardPage />} />
        <Route path="/admin"               element={<AdminPage />} />
        <Route path="/progress"            element={<ProgressPage />} />
        <Route path="/leaderboard"         element={<LeaderboardPage />} />
        <Route path="/messages"            element={<MessagesPage />} />
        <Route path="/chat"                element={<ChatPage />} />
        <Route path="/vocabulary"          element={<VocabularyPage />} />
        <Route path="/flashcards"          element={<FlashcardPage />} />
        <Route path="/placement-test"      element={<PlacementTestPage />} />
        <Route path="/speaking-practice"   element={<SpeakingPracticePage />} />
        <Route path="/settings"            element={<SettingsPage />} />
        <Route path="/login"               element={<Navigate to="/" replace />} />
        <Route path="/vocabulary/words"    element={<VocabularyPage />} />
        <Route path="/vocabulary/categories" element={<VocabularyPage />} />
        <Route path="/progress/activity"   element={<ProgressPage />} />
        <Route path="/lessons/all"         element={<OnlineLessonsPage />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>

      {user?.isAuthenticated && user?.isFirstTime && (
        <OnboardingModal userName={user?.name} onFinish={completeOnboarding} />
      )}

      <NotificationToast notifications={notifications} />
    </>
  )
}

export default App
