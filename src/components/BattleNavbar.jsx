import { Swords } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BattleNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 sm:px-6
      bg-gray-950/90 backdrop-blur-md border-b border-yellow-400/10">
      <Link to="/battle" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center
          group-hover:bg-yellow-400/20 transition-colors">
          <Swords size={18} className="text-yellow-400" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">
          Battle Mode
        </span>
      </Link>
    </nav>
  )
}
