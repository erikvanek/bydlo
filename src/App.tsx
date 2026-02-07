import { Routes, Route } from 'react-router-dom'
import { ConversationProvider } from '@/context/ConversationContext'
import { LandingPage } from '@/pages/LandingPage'
import { DescribeSituationPage } from '@/pages/DescribeSituationPage'
import { ConversationPage } from '@/pages/ConversationPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { DesignerDetailPage } from '@/pages/DesignerDetailPage'
import { BrowsePage } from '@/pages/BrowsePage'

function App() {
  return (
    <ConversationProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/describe" element={<DescribeSituationPage />} />
        <Route path="/conversation" element={<ConversationPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/designer/:id" element={<DesignerDetailPage />} />
      </Routes>
    </ConversationProvider>
  )
}

export default App
