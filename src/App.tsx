import { Routes, Route, Navigate } from 'react-router-dom'
import { ConversationProvider } from '@/context/ConversationContext'
import { LandingPage } from '@/pages/LandingPage'
import { ConversationPage } from '@/pages/ConversationPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { DesignerDetailPage } from '@/pages/DesignerDetailPage'
import { BrowsePage } from '@/pages/BrowsePage'
import { ShaderBackground } from '@/components/ShaderBackground'

function App() {
  return (
    <ConversationProvider>
      <ShaderBackground />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/describe" element={<Navigate to="/" replace />} />
        <Route path="/conversation" element={<ConversationPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/designer/:id" element={<DesignerDetailPage />} />
      </Routes>
    </ConversationProvider>
  )
}

export default App
