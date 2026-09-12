import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Lock, Mail, User, Tag, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const [displayName, setDisplayName] = useState('')
  const [tagline, setTagline] = useState('Care creates freedom')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(email, password, displayName, tagline)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card rounded-card p-8 sm:p-10 w-full max-w-md relative z-10 border border-border shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold text-xl shadow-[0_0_24px_rgba(47,128,255,0.5)] mb-3">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Create an Account</h1>
          <p className="text-xs text-text-secondary mt-1">Register as a Netra Sarthi guardian or caretaker</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-card bg-status-error/15 border border-status-error/30 flex items-start gap-2.5 text-xs text-status-error">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-card bg-bg-card border border-border focus-within:border-accent-primary transition-all">
              <User size={16} className="text-text-muted shrink-0" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Shreya Sharma"
                className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Motto / Tagline</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-card bg-bg-card border border-border focus-within:border-accent-primary transition-all">
              <Tag size={16} className="text-text-muted shrink-0" />
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Care creates freedom"
                className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email address</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-card bg-bg-card border border-border focus-within:border-accent-primary transition-all">
              <Mail size={16} className="text-text-muted shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-card bg-bg-card border border-border focus-within:border-accent-primary transition-all">
              <Lock size={16} className="text-text-muted shrink-0" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted flex-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-card bg-accent-primary hover:bg-accent-primary/90 text-white font-medium text-sm transition-all shadow-[0_0_16px_rgba(47,128,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Register Guardian Account'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex flex-col items-center">
          <p className="text-xs text-text-muted text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-text-primary hover:text-accent-primary font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
