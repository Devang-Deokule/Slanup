import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'

interface EventCardProps {
  event: {
    _id: string
    title: string
    description: string
    location: string
    date: string
    maxParticipants: number
    currentParticipants: number
    distanceKm?: number
  }
  index?: number
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const participationRate = (event.currentParticipants / event.maxParticipants) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-slanup-card-bg border border-slanup-border rounded-xl p-6 hover:border-slanup-primary/40 transition-all duration-300 group"
    >
      <Link to={`/events/${event._id}`} className="block">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-xl font-semibold text-slanup-text-primary group-hover:text-slanup-primary transition-colors mb-2 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-slanup-text-secondary text-sm line-clamp-2">
              {event.description}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slanup-text-secondary">
              <Calendar size={16} className="text-slanup-primary" />
              <span className="text-sm">
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slanup-text-secondary">
              <MapPin size={16} className="text-slanup-primary" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slanup-text-secondary">
                <Users size={16} className="text-slanup-primary" />
                <span className="text-sm">
                  {event.currentParticipants} / {event.maxParticipants} participants
                </span>
              </div>
              <div className="flex items-center gap-3">
                {typeof event.distanceKm === 'number' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slanup-primary/20 text-slanup-primary">
                    {event.distanceKm.toFixed(1)} km
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${
                participationRate >= 90
                  ? 'bg-red-500/20 text-red-400'
                  : participationRate >= 70
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-slanup-primary/20 text-slanup-primary'
              }`}>
                {Math.round(participationRate)}% full
              </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slanup-background rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${participationRate}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className={`h-full ${
                participationRate >= 90
                  ? 'bg-red-500'
                  : participationRate >= 70
                  ? 'bg-yellow-500'
                  : 'bg-slanup-primary'
              }`}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default EventCard

