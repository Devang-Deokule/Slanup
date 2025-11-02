// Types for location data
export interface Location {
  lat: number
  lng: number
  address: string
}

// Use Nominatim (OpenStreetMap) for geocoding so we don't rely on Google Maps.
// Note: For heavy usage or production, host your own Nominatim instance or use a paid provider.

export async function getAddressFromCoordinates(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}`
    const response = await fetch(url, {
      headers: {
        // Nominatim asks for a valid User-Agent; browsers provide one, but be explicit if needed.
        'Accept-Language': 'en',
      },
    })
    const data = await response.json()
    if (data && data.display_name) return data.display_name
    throw new Error('No address found')
  } catch (error) {
    console.error('Error getting address (Nominatim):', error)
    throw error
  }
}

export async function getCoordinatesFromAddress(address: string): Promise<Location> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      address
    )}&limit=1`
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    })
    const results = await response.json()
    if (results && results[0]) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
        address: results[0].display_name,
      }
    }
    throw new Error('No coordinates found')
  } catch (error) {
    console.error('Error getting coordinates (Nominatim):', error)
    throw error
  }
}