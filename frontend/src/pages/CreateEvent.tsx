import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, FileText, ArrowLeft, Search } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axiosClient from '../api/axiosClient'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationPicker from '../components/LocationPicker'
import { Location, getAddressFromCoordinates, getCoordinatesFromAddress } from '../utils/maps'

interface FormData {
  title: string
  description: string
  location: Location
  date: Date | null
  maxParticipants: string
}

const defaultCenter = {
  lat: 51.5074, // London coordinates as default
  lng: -0.1278
}

const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchAddress, setSearchAddress] = useState('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: { ...defaultCenter, address: '' },
    date: null,
    maxParticipants: '50',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMapClick = useCallback(async (coords: { lat: number; lng: number }) => {
    try {
      const address = await getAddressFromCoordinates(coords.lat, coords.lng)
      setFormData((prev) => ({
        ...prev,
        location: { lat: coords.lat, lng: coords.lng, address },
      }))
    } catch (error) {
      toast.error('Failed to get location address')
    }
  }, [])

  const handleAddressSearch = useCallback(async () => {
    if (!searchAddress.trim()) return

    try {
      const location = await getCoordinatesFromAddress(searchAddress)
      setFormData((prev) => ({
        ...prev,
        location,
      }))
    } catch (error) {
      toast.error('Failed to find location')
    }
  }, [searchAddress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.address || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    // Date is already validated by DatePicker component

    try {
      setLoading(true)

      // enforce numeric participants and clamp to [1,50]
      let maxP = parseInt(formData.maxParticipants || '50', 10);
      if (isNaN(maxP)) maxP = 50;
      maxP = Math.max(1, Math.min(50, maxP));

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        // send a human-readable address string to backend so Event.location remains a string
        location: formData.location.address || `${formData.location.lat},${formData.location.lng}`,
        // include coordinates if available for distance calculations
        coords: formData.location?.lat && formData.location?.lng ? { lat: formData.location.lat, lng: formData.location.lng } : undefined,
        date: formData.date?.toISOString(),
        maxParticipants: maxP,
        currentParticipants: 0,
      }

      const response: any = await axiosClient.post('/api/events', payload)

      toast.success('Event created successfully!')

      // Navigate to event details after a short delay
      const created = response?.data || response
      const eventId = created?._id || created?.id
      if (eventId) {
        setTimeout(() => {
          navigate(`/events/${eventId}`)
        }, 1000)
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast.error(error.message || 'Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slanup-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-slanup-text-secondary hover:text-slanup-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-lg p-8 sm:p-12 max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slanup-text-primary mb-4">
              Create New Event
            </h1>
            <p className="text-slanup-text-secondary">
              Share your event with the community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="flex items-center space-x-2 text-slanup-text-primary font-medium mb-2">
                <FileText size={18} className="text-slanup-primary" />
                <span>Event Title *</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-white border border-slanup-border rounded-lg text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="flex items-center space-x-2 text-slanup-text-primary font-medium mb-2">
                <FileText size={18} className="text-slanup-primary" />
                <span>Description *</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                required
                rows={5}
                maxLength={2000}
                className="w-full px-4 py-3 bg-white border border-slanup-border rounded-lg text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all resize-none"
              />
              <p className="text-slanup-text-secondary text-sm mt-1">
                {formData.description.length} / 2000 characters
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="flex items-center space-x-2 text-slanup-text-primary font-medium mb-2">
                <MapPin size={18} className="text-slanup-primary" />
                <span>Location *</span>
              </label>
              
              {/* Location Search */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Search for a location"
                  className="flex-1 px-4 py-3 bg-white border border-slanup-border rounded-lg text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  className="px-4 py-3 bg-slanup-primary text-white rounded-lg hover:bg-slanup-primary-hover transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Map (Leaflet + OpenStreetMap). Click on the map to pick a location. */}
              <LocationPicker center={formData.location} onLocationSelect={handleMapClick} />

              {/* Selected Location Display */}
              {formData.location.address && (
                <p className="mt-2 text-slanup-text-secondary">
                  Selected: {formData.location.address}
                </p>
              )}
            </div>

            {/* Date and Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="flex items-center space-x-2 text-slanup-text-primary font-medium mb-2">
                  <Calendar size={18} className="text-slanup-primary" />
                  <span>Date & Time *</span>
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date: Date | null) => setFormData(prev => ({ ...prev, date }))}
                  showTimeSelect
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select date and time"
                  className="w-full px-4 py-3 bg-white border border-slanup-border rounded-lg text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label htmlFor="maxParticipants" className="flex items-center space-x-2 text-slanup-text-primary font-medium mb-2">
                  <Users size={18} className="text-slanup-primary" />
                  <span>Maximum Participants *</span>
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 bg-white border border-slanup-border rounded-lg text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full px-8 py-4 bg-slanup-primary text-white rounded-lg font-semibold transition-all hover:bg-slanup-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="!border-t-white" />
                  <span>Creating Event...</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateEvent

