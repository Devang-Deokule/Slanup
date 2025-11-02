import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import CreateEvent from './pages/CreateEvent'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-slanup-text-primary">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#212529',
                border: '1px solid #E9ECEF',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            }}
          />
        </div>
      </Router>
  )
}

export default App

