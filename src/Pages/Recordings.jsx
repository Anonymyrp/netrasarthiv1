import { useState, useEffect } from 'react';
import RecordingCard from '../components/recordings/RecordingCard';
import StorageStats from '../components/recordings/StorageStats';
import { RefreshCw, Film } from 'lucide-react';

function Recordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      const response = await fetch(`${baseUrl}/recordings`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setRecordings(data.recordings || []);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
      setError('Could not load recordings from Cloudinary.');
      setRecordings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const storageUsed = recordings.reduce((acc, r) => acc + (parseFloat(r.size) || 0), 0);
  const storageTotal = 2048;

  return (
    <div className="px-4 md:px-8 pt-4 pb-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-sm text-text-secondary sm:col-span-2 lg:col-span-3">Loading videos from Cloudinary...</p>
          ) : error ? (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
              <Film size={48} className="mx-auto mb-4 text-text-secondary" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No videos available</h3>
              <p className="text-text-secondary mb-4">{error}</p>
              <a href="https://console.cloudinary.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go to Cloudinary Console
              </a>
            </div>
          ) : recordings.length === 0 ? (
            <p className="text-sm text-text-secondary sm:col-span-2 lg:col-span-3">No recordings available yet.</p>
          ) : (
            recordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                title={recording.title || 'Untitled'}
                timeAgo={recording.timeAgo || recording.time_ago || 'Recently'}
                duration={recording.duration || '0:00'}
                size={recording.size || '0 MB'}
                thumbnail={recording.thumbnail || null}
                onPlay={() => window.open(recording.videoUrl || recording.url || '#', '_blank')}
              />
            ))
          )}
        </div>
        <StorageStats usedMb={Math.round(storageUsed)} totalMb={storageTotal} />
      </div>
      {!loading && !error && (
        <div className="flex justify-end">
          <button onClick={fetchRecordings} className="flex items-center gap-2 px-3 py-2 text-sm text-accent-primary hover:text-accent-secondary" aria-label="Refresh recordings">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default Recordings;
