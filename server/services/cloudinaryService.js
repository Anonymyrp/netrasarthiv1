import { cloudinary } from '../config/cloudinary.js'
import { store } from './mockDataStore.js'

function formatTimeAgo(dateString) {
  if (!dateString) return 'Recently'
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / (1000 * 60))
  if (mins < 60) return `${Math.max(1, mins)} mins ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTitle(res, index) {
  const base = res.filename || res.public_id?.split('/').pop() || `Recording ${index + 1}`
  if (base.startsWith('emergency_')) {
    const epoch = base.replace('emergency_', '')
    const d = new Date(parseInt(epoch, 10) * 1000)
    if (!isNaN(d.getTime())) {
      return `Emergency Video (${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})`
    }
  }
  return base.replace(/_/g, ' ')
}

export const cloudinaryService = {
  async listRecordings() {
    if (cloudinary) {
      try {
        const result = await cloudinary.search
          .expression('resource_type:video')
          .sort_by('created_at', 'desc')
          .max_results(50)
          .execute()

        if (result.resources && result.resources.length > 0) {
          return result.resources.map((res, index) => {
            const dur = res.duration ? Math.round(res.duration) : null
            return {
              id: res.public_id || `cld_${index + 1}`,
              title: formatTitle(res, index),
              timeAgo: formatTimeAgo(res.created_at),
              duration: dur ? `${Math.floor(dur / 60)}:${(dur % 60).toString().padStart(2, '0')}` : '0:10',
              size: res.bytes ? `${(res.bytes / (1024 * 1024)).toFixed(1)} MB` : '1.1 MB',
              thumbnail: res.secure_url ? res.secure_url.replace(/\.[^/.]+$/, '.jpg') : null,
              videoUrl: res.secure_url,
            }
          })
        }
      } catch (err) {
        console.warn('[Cloudinary] Error fetching videos, using mock data:', err.message)
      }
    }
    return store.recordings
  },

  async getStorageStats() {
    if (cloudinary) {
      try {
        const usage = await cloudinary.api.usage()
        const usedMb = Math.round((usage.bandwidth?.usage || 270532608) / (1024 * 1024))
        const totalMb = Math.round((usage.bandwidth?.limit || 2147483648) / (1024 * 1024))
        return { usedMb, totalMb }
      } catch (err) {
        console.warn('[Cloudinary] Error fetching storage stats, using mock data:', err.message)
      }
    }
    return store.storageStats
  },

  async deleteRecording(publicId) {
    if (cloudinary) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
      } catch (err) {
        console.warn('[Cloudinary] Error deleting video:', err.message)
      }
    }
    store.recordings = store.recordings.filter((r) => r.id !== publicId && String(r.id) !== String(publicId))
    return { success: true, message: 'Recording deleted successfully' }
  },
}
