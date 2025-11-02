import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowLeft, UserPlus, Clock } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Event {
  _id: string
  title: string
  description: string
  location: string
  date: string
  maxParticipants: number
  currentParticipants: number
  createdAt: string
  updatedAt: string
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      const response: any = await axiosClient.get(`/api/events/${id}`)
      // Response is already { success: true, data: event } from interceptor
      if (response?.data) {
        setEvent(response.data)
      } else if (response?._id) {
        // Fallback if response is directly the event object
        setEvent(response)
      }
    } catch (error: any) {
      console.error('Error fetching event:', error)
      toast.error(error.message || 'Failed to load event details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async () => {
    if (!event) return

    if (event.currentParticipants >= event.maxParticipants) {
      toast.error('Event is full!')
      return
    }

    setJoining(true)
    // Placeholder - In a real app, this would update the participant count
    setTimeout(() => {
      toast.success('Successfully joined the event!')
      setJoining(false)
      // Note: In production, this would update the backend
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slanup-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slanup-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slanup-text-primary mb-4">Event not found</h2>
          <Link
            to="/"
            className="text-slanup-primary hover:text-slanup-primary/80 transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const participationRate = (event.currentParticipants / event.maxParticipants) * 100
  const isFull = event.currentParticipants >= event.maxParticipants
  const spotsLeft = event.maxParticipants - event.currentParticipants

  return (
  <div className="min-h-screen bg-slanup-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-accent-teal transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>
        </motion.div>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slanup-card-bg border border-slanup-border rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slanup-text-primary mb-4">
              {event.title}
            </h1>
            <div className="h-1 w-24 bg-slanup-primary rounded-full"></div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date & Time */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slanup-primary/20 rounded-lg">
                <Calendar className="text-slanup-primary" size={24} />
              </div>
              <div>
                <p className="text-slanup-text-secondary text-sm mb-1">Date & Time</p>
                <p className="text-slanup-text-primary font-medium">{formattedDate}</p>
                <p className="text-slanup-text-secondary text-sm">{formattedTime}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slanup-primary/20 rounded-lg">
                <MapPin className="text-slanup-primary" size={24} />
              </div>
              <div>
                <p className="text-slanup-text-secondary text-sm mb-1">Location</p>
                <p className="text-slanup-text-primary font-medium">{event.location}</p>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slanup-primary/20 rounded-lg">
                <Users className="text-slanup-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-slanup-text-secondary text-sm mb-1">Participants</p>
                <p className="text-slanup-text-primary font-medium mb-2">
                  {event.currentParticipants} / {event.maxParticipants}
                </p>
                <div className="h-2 bg-slanup-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${participationRate}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${
                      isFull ? 'bg-red-500' : participationRate >= 70 ? 'bg-yellow-500' : 'bg-accent-teal'
                    }`}
                  />
                </div>
                <p className="text-slanup-text-secondary text-xs mt-1">
                  {isFull ? 'Event Full' : `${spotsLeft} spots left`}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slanup-primary/20 rounded-lg">
                <Clock className="text-slanup-primary" size={24} />
              </div>
              <div>
                <p className="text-slanup-text-secondary text-sm mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    isFull
                      ? 'bg-red-500/20 text-red-400'
                      : participationRate >= 70
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slanup-primary/20 text-slanup-primary'
                  }`}
                >
                  {isFull ? 'Full' : participationRate >= 70 ? 'Almost Full' : 'Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">About this Event</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Join Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinEvent}
            disabled={isFull || joining}
            className={`w-full sm:w-auto px-8 py-4 rounded-button font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
              isFull
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-accent-teal hover:bg-accent-teal/80 hover:shadow-accent-hover'
            }`}
          >
            {joining ? (
              <>
                <LoadingSpinner size="sm" className="!border-t-white" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>{isFull ? 'Event Full' : 'Join Event'}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetails

