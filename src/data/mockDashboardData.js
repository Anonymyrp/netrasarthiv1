export const mockUser = {
  name: 'Shreya',
  tagline: 'Care creates freedom',
}

export const mockCurrentLocation = {
  status: 'active',
  latitude: 18.5204,
  longitude: 73.8567,
  address: 'MG Road, Pune, Maharashtra',
  accuracy: 10,
  updatedAt: '2 mins ago',
}

export const mockRecentActivity = [
  { id: 1, type: 'arrival', title: 'Reached Home', timestamp: 'Today, 6:12 PM', note: 'At saved place' },
  { id: 2, type: 'visit', title: 'Visited Grocery Store', timestamp: 'Today, 4:45 PM', note: 'Routine visit' },
  { id: 3, type: 'departure', title: 'Left Office', timestamp: 'Today, 1:23 PM', note: 'On usual route' },
]

export const mockDeviceStatus = {
  connected: true,
  battery: 78,
  charging: true,
  networkStatus: 'Jio 4G',
  gpsStatus: 'Good',
  accuracy: 10,
  lastSync: '2 mins ago',
}

export const mockFrequentPlaces = [
  { id: 1, name: 'Home', type: 'home', lastVisited: 'Today, 6:12 PM', coordinates: { latitude: 18.5204, longitude: 73.8567 } },
  { id: 2, name: 'College', type: 'college', lastVisited: 'Today, 4:45 PM', coordinates: { latitude: 18.5304, longitude: 73.8467 } },
]

export const mockSystemStatus = {
  status: 'normal',
  message: "You'll be notified here if anything needs your attention.",
}