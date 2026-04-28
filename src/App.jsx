import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ChatPage from './pages/ChatPage'
import ComingSoonPage from './pages/ComingSoonPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import MockExamPage from './pages/MockExamPage'
import OnlineLessonsPage from './pages/OnlineLessonsPage'
import PartnerPage from './pages/PartnerPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import VocabularyPage from './pages/VocabularyPage'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — redirect to /login when unauthenticated */}
      <Route path="/"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/partner"       element={<ProtectedRoute><PartnerPage /></ProtectedRoute>} />
      <Route path="/online-lessons" element={<ProtectedRoute><OnlineLessonsPage /></ProtectedRoute>} />
      <Route path="/mock-exam"     element={<ProtectedRoute><MockExamPage /></ProtectedRoute>} />
      <Route path="/progress"      element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/messages"      element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/chat"          element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/vocabulary"    element={<ProtectedRoute><VocabularyPage /></ProtectedRoute>} />
      <Route path="/settings"      element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* "View all" stub routes */}
      <Route path="/vocabulary/words"      element={<ProtectedRoute><ComingSoonPage title="All Vocabulary Words" /></ProtectedRoute>} />
      <Route path="/vocabulary/categories" element={<ProtectedRoute><ComingSoonPage title="All Categories" /></ProtectedRoute>} />
      <Route path="/progress/activity"     element={<ProtectedRoute><ComingSoonPage title="Recent Activity" /></ProtectedRoute>} />
      <Route path="/lessons/all"           element={<ProtectedRoute><ComingSoonPage title="All Lessons" /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
