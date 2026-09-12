export const mockUser = {
  name: 'Guardian',
  tagline: 'Care creates freedom',
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

export const mockCurrentLocation = {
  status: 'active',
  latitude: 18.5204,
  longitude: 73.8567,
  address: 'MG Road, Pune, Maharashtra',
  accuracy: 10,
  updatedAt: '2 mins ago',
  speed: 0,
  battery: 78,
}

export const mockLocationHistory = [
  { id: 1, address: 'MG Road, Pune, Maharashtra', latitude: 18.5204, longitude: 73.8567, accuracy: 10, timestamp: 'Today, 6:12 PM', period: 'today' },
  { id: 2, address: 'FC Road, Pune, Maharashtra', latitude: 18.5245, longitude: 73.8409, accuracy: 12, timestamp: 'Today, 9:05 AM', period: 'today' },
  { id: 3, address: 'Deccan Gymkhana, Pune', latitude: 18.5158, longitude: 73.8412, accuracy: 8, timestamp: 'Yesterday, 5:20 PM', period: 'week' },
  { id: 4, address: 'Kothrud, Pune', latitude: 18.5074, longitude: 73.8077, accuracy: 15, timestamp: '3 days ago, 11:10 AM', period: 'week' },
]

export const mockRecordings = [
  { id: 1, title: 'Morning Walk', timeAgo: '2 hours ago', duration: '4:12', size: '86 MB', thumbnail: null },
  { id: 2, title: 'Grocery Store Visit', timeAgo: 'Yesterday', duration: '2:45', size: '52 MB', thumbnail: null },
  { id: 3, title: 'Evening Route', timeAgo: '2 days ago', duration: '6:30', size: '120 MB', thumbnail: null },
]

export const mockStorageStats = {
  usedMb: 258,
  totalMb: 2048,
}

export const mockAlerts = [
  { id: 1, type: 'battery', severity: 'warning', title: 'Low battery', message: 'Device battery dropped below 20%.', timestamp: 'Today, 3:10 PM', read: false },
  { id: 2, type: 'zone', severity: 'success', title: 'Reached Home', message: 'Guardian reached the saved Home location.', timestamp: 'Today, 6:12 PM', read: true },
  { id: 3, type: 'sync', severity: 'info', title: 'Device sync delayed', message: 'Last sync was 15 minutes ago.', timestamp: 'Today, 1:50 PM', read: false },
]
