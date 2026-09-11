import RecordingCard from '../components/recordings/RecordingCard'
import StorageStats from '../components/recordings/StorageStats'
import { mockRecordings, mockStorageStats } from '../data/mockDashboardData'

function Recordings() {
  return (
    <div className="px-8 pt-4 pb-6 flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 grid grid-cols-3 gap-4">
          {mockRecordings.length === 0 ? (
            <p className="text-sm text-text-secondary col-span-3">No recordings available yet.</p>
          ) : (
            mockRecordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                title={recording.title}
                timeAgo={recording.timeAgo}
                duration={recording.duration}
                size={recording.size}
                thumbnail={recording.thumbnail}
                onPlay={() => {}}
              />
            ))
          )}
        </div>

        <StorageStats usedMb={mockStorageStats.usedMb} totalMb={mockStorageStats.totalMb} />
      </div>
    </div>
  )
}

export default Recordings