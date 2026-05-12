import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import AgentPage from './pages/AgentPage'
import ScrollToTop from "./components/ScrollToTop";
import BattleModeLanding from './pages/BattleModeLanding'
import BattleModeSetup from './pages/BattleModeSetup'
import BattleModeArena from './pages/BattleModeArena'
import BattleModeWinner from './pages/BattleModeWinner'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen transition-theme dark:bg-surface bg-gray-50">
      <ScrollToTop />
      <Routes>
        {/* Battle Mode — full-screen, own layout */}
        <Route path="/battle" element={<BattleModeLanding />} />
        <Route path="/battle/setup" element={<BattleModeSetup />} />
        <Route path="/battle/arena" element={<BattleModeArena />} />
        <Route path="/battle/winner" element={<BattleModeWinner />} />

        {/* Main app layout */}
        <Route path="*" element={
          <>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="pt-14 lg:pl-60">
              <div className="p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/agent/:id" element={<AgentPage />} />
                </Routes>
              </div>
            </main>
          </>
        } />
      </Routes>
    </div>
  )
}
