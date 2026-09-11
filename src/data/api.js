export const FIREBASE_PATHS = {
  liveLocation: 'live_location',
  locationHistory: (deviceId) => `location_history/${deviceId}`,
  deviceStatus: (deviceId) => `device_status/${deviceId}`,
  recentActivity: (deviceId) => `activity/${deviceId}`,
  frequentPlaces: (userId) => `frequent_places/${userId}`,
  alerts: (userId) => `alerts/${userId}`,
}

export const RECORDINGS_API = {
  baseUrl: import.meta.env.VITE_RECORDINGS_API_BASE_URL,
  testConnection: '/api/test',
  listVideos: '/api/cloudinary/videos',
  deleteVideo: (id) => `/api/cloudinary/videos/${id}`,
}

export async function fetchLiveLocation() {
  throw new Error('Not implemented yet — pending backend integration')
}

export async function fetchLocationHistory(deviceId) {
  throw new Error('Not implemented yet — pending backend integration')
}

export async function fetchDeviceStatus(deviceId) {
  throw new Error('Not implemented yet — pending backend integration')
}

export async function fetchRecentActivity(deviceId) {
  throw new Error('Not implemented yet — pending backend integration')
}

export async function fetchFrequentPlaces(userId) {
  throw new Error('Not implemented yet — pending backend integration')
}

export async function fetchRecordings() {
  throw new Error('Not implemented yet — pending backend integration')
}