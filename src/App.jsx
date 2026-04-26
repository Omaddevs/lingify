import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MessagesPage from './pages/MessagesPage'
import MockExamPage from './pages/MockExamPage'
import OnlineLessonsPage from './pages/OnlineLessonsPage'
import PartnerPage from './pages/PartnerPage'
import PlaceholderPage from './pages/PlaceholderPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import VocabularyPage from './pages/VocabularyPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/partner" element={<PartnerPage />} />
      <Route path="/online-lessons" element={<OnlineLessonsPage />} />
      <Route path="/mock-exam" element={<MockExamPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/vocabulary" element={<VocabularyPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
