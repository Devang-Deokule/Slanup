import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Plus, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Events', icon: Calendar },
    { path: '/create', label: 'Create Event', icon: Plus },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-slanup-border sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="text-slanup-primary font-bold text-2xl">
              slanup
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-1 sm:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-slanup-primary/10 text-slanup-primary'
                      : 'text-slanup-text-secondary hover:text-slanup-primary hover:bg-slanup-primary/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-md text-slanup-text-secondary hover:text-slanup-primary">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="sm:hidden mt-2 space-y-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-slanup-primary/10 text-slanup-primary' : 'text-slanup-text-secondary hover:text-slanup-primary hover:bg-slanup-primary/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar

