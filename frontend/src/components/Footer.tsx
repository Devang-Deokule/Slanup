import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border-t border-slanup-border mt-auto"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-slanup-text-secondary text-sm">
            © {new Date().getFullYear()} Slanup. Built with ❤️ for event discovery.
          </div>
          <a
            href="https://www.slanup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-slanup-primary hover:text-slanup-primary/80 transition-colors text-sm"
          >
            <span>Visit Slanup.com</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

