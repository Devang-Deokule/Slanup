import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar as CalendarIcon, MapPin } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'

interface Event {
  _id: string
  title: string
  description: string
  location: string
  date: string
  maxParticipants: number
  currentParticipants: number
  coords?: { lat: number; lng: number }
  distanceKm?: number
}

const Home = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0)

  useEffect(() => {
    fetchEvents()
  }, [])

  // Try to get user's location for distance calculations
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        // ignore errors silently
      },
      { maximumAge: 1000 * 60 * 5 }
    )
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, locationFilter, dateFilter, events, maxDistanceKm])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params: { location?: string; date?: string } = {}
      if (locationFilter) params.location = locationFilter
      if (dateFilter) params.date = dateFilter

      const response: any = await axiosClient.get('/api/events', {
        params: params
      })
      // Response is expected as { success: true, data: events }
      const rawEvents = Array.isArray(response?.data) ? response.data : []
      // Normalize ids and extract coords (support Mongo locationCoords or in-memory coords)
      const normalized = rawEvents.map((e: any) => {
        const coords = e.locationCoords || e.coords || (typeof e.location === 'string' && e.location.match(/^\s*-?\d+\.?\d*\s*,\s*-?\d+\.?\d*\s*$/) ? (() => {
          const [lat, lng] = e.location.split(',').map((s: string) => parseFloat(s.trim()))
          return { lat, lng }
        })() : undefined)
        return { ...e, _id: e._id || e.id, coords }
      })

      // If we have user's location, compute distance for events that have coords
      const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (v: number) => (v * Math.PI) / 180
        const R = 6371 // km
        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
      }

      const withDistances = normalized.map((e: any) => {
        if (userLocation && e.coords && typeof e.coords.lat === 'number' && typeof e.coords.lng === 'number') {
          return { ...e, distanceKm: haversineKm(userLocation.lat, userLocation.lng, e.coords.lat, e.coords.lng) }
        }
        return e
      })

      setEvents(withDistances)
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Text search (title, description, location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      )
    }

    // Distance filter if set (>0) - only include events that have a computed distance
    if (maxDistanceKm > 0) {
      filtered = filtered.filter((event) => typeof (event as any).distanceKm === 'number' ? (event as any).distanceKm <= maxDistanceKm : false)
    }

    setFilteredEvents(filtered)
  }

  

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(e.target.value)
    if (e.target.value) {
      fetchEvents()
    } else {
      fetchEvents()
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value)
    if (e.target.value) {
      fetchEvents()
    } else {
      fetchEvents()
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
    setDateFilter('')
    fetchEvents()
  }

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(events.map((e) => e.location))).sort()

  return (
  <div className="min-h-screen bg-slanup-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slanup-text-primary mb-4">
            Discover <span className="text-slanup-primary">Events</span>
          </h1>
          <p className="text-slanup-text-secondary text-lg max-w-2xl mx-auto">
            Find and join exciting events happening around you
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slanup-background border border-slanup-border rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slanup-text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slanup-card-bg border border-slanup-border rounded-button text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slanup-text-secondary" size={20} />
              <select
                value={locationFilter}
                onChange={handleLocationChange}
                className="pl-10 pr-8 py-3 bg-slanup-card-bg border border-slanup-border rounded-button text-slanup-text-primary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slanup-text-secondary" size={20} />
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateChange}
                className="pl-10 pr-4 py-3 bg-slanup-card-bg border border-slanup-border rounded-button text-slanup-text-primary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all cursor-pointer min-w-[200px]"
              />
            </div>

            {/* Distance Filter */}
            <div className="relative">
              <input
                type="number"
                min={0}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value || 0))}
                placeholder="Max distance (km)"
                className="pl-3 pr-3 py-3 bg-slanup-card-bg border border-slanup-border rounded-button text-slanup-text-primary placeholder-slanup-text-secondary focus:outline-none focus:border-slanup-primary focus:ring-2 focus:ring-slanup-primary/20 transition-all cursor-pointer min-w-[160px]"
              />
            </div>

            {/* Clear Filters */}
            {(locationFilter || dateFilter || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-slanup-primary hover:bg-slanup-primary-hover text-white rounded-button transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-lg mb-4">
              {events.length === 0 ? 'No events found. Create one to get started!' : 'No events match your filters.'}
            </div>
            {searchQuery || locationFilter || dateFilter ? (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-accent-teal hover:bg-accent-teal/80 text-white rounded-button transition-all hover:shadow-accent"
              >
                Clear Filters
              </button>
            ) : null}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-gray-400"
          >
            Showing {filteredEvents.length} of {events.length} events
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Home

