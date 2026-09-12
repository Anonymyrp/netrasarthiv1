import { useState } from 'react'
import LiveMap from '../components/dashboard/LiveMap'
import LocationFilterTabs from '../components/pastLocations/LocationFilterTabs'
import HistoryList from '../components/pastLocations/HistoryList'
import { mockLocationHistory } from '../data/mockDashboardData'

const filters = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'All', value: 'all' },
]

function PastLocations() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(mockLocationHistory[0]?.id)

  const filteredEntries = mockLocationHistory.filter((entry) => {
    if (activeFilter === 'all') return true
    return entry.period === activeFilter
  })

  const selectedEntry = filteredEntries.find((entry) => entry.id === selectedId) || filteredEntries[0]

  return (
    <div className="px-4 md:px-8 pt-4 pb-6 flex flex-col gap-4 h-auto lg:h-[calc(100vh-88px)]">
      <div className="flex items-center">
        <LocationFilterTabs filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full">
          {selectedEntry ? (
            <LiveMap
              latitude={selectedEntry.latitude}
              longitude={selectedEntry.longitude}
              accuracy={selectedEntry.accuracy}
              zoom={15}
            />
          ) : (
            <div className="glass-card rounded-card h-full flex items-center justify-center text-text-secondary text-sm">
              No location selected
            </div>
          )}
        </div>

        <HistoryList entries={filteredEntries} selectedId={selectedEntry?.id} onSelectEntry={setSelectedId} />
      </div>
    </div>
  )
}

export default PastLocations