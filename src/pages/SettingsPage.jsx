import { useRef, useState } from 'react'
import {
  Bell, Camera, ChevronRight, CircleHelp, CreditCard,
  Globe, Lock, LogOut, Monitor, ShieldCheck, UserRound,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'
import { uploadAvatar, updateProfile } from '../services/profileService'

const settingMenu = [
  { title: 'Account',          subtitle: 'Manage your profile',            icon: UserRound,  section: 'profile' },
  { title: 'Preferences',      subtitle: 'App settings and preferences',   icon: ShieldCheck, section: 'appearance' },
  { title: 'Notifications',    subtitle: 'Manage your alerts',             icon: Bell,        section: 'notifications' },
  { title: 'Language',         subtitle: 'App language settings',          icon: Globe,       section: 'language' },
  { title: 'Privacy & Security', subtitle: 'Privacy and data protection', icon: Lock,        section: 'privacy' },
  { title: 'Subscription',     subtitle: 'Manage your plan',               icon: CreditCard,  section: 'subscription' },
  { title: 'Payment Methods',  subtitle: 'Cards and billing',              icon: CreditCard,  section: 'payment' },
  { title: 'Help & Support',   subtitle: 'Get help and support',           icon: CircleHelp,  section: 'help' },
  { title: 'About Lingify',    subtitle: 'App information',                icon: CircleHelp,  section: 'about' },
]

const notificationItems = [
  { name: 'Lesson Reminders',      desc: 'Get reminded about upcoming lessons',       enabled: true },
  { name: 'Study Reminders',       desc: 'Daily reminders to stay consistent',        enabled: true },
  { name: 'New Messages',          desc: 'Notify me when I receive new messages',     enabled: true },
  { name: 'Promotions & Updates',  desc: 'Get updates about new features and offers', enabled: false },
]

const privacyItems = [
  { name: 'Change Password',           desc: 'Update your account password',    meta: '' },
  { name: 'Two-Factor Authentication', desc: 'Add an extra layer of security',  meta: 'Off' },
  { name: 'Privacy Settings',          desc: 'Manage your data and privacy',    meta: '' },
  { name: 'Blocked Users',             desc: 'Manage blocked users list',       meta: '' },
]

// ── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection({ user, patchUser, logout }) {
  const fileRef = useRef(null)
  const [saving,        setSaving]        = useState(false)
  const [uploadingAvt,  setUploadingAvt]  = useState(false)
  const [name,          setName]          = useState(user.name)
  const [saveMsg,       setSaveMsg]       = useState('')

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvt(true)
    try {
      const url = await uploadAvatar(user.id, file)
      patchUser({ avatar: url, avatar_url: url })
    } catch (err) {
      alert('Avatar upload failed: ' + err.message)
    } finally {
      setUploadingAvt(false)
    }
  }

  const handleSaveName = async () => {
    if (!name.trim() || name === user.name) return
    setSaving(true)
    try {
      await updateProfile(user.id, { name: name.trim() })
      patchUser({ name: name.trim() })
      setSaveMsg('Saved!')
      setTimeout(() => setSaveMsg(''), 2000)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Account Information</h3>
          {saveMsg && <span className="text-xs font-semibold text-emerald-600">{saveMsg}</span>}
        </div>

        {/* Avatar */}
        <div className="mb-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
              alt={user.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-100"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvt}
              className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {uploadingAvt
                ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                : <Camera size={13} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <p className="mt-0.5 text-xs text-emerald-600">✓ Verified</p>
          </div>
        </div>

        {/* Name edit */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Full Name</label>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
            <button
              onClick={handleSaveName}
              disabled={saving || name === user.name}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {[
            { label: 'Email',    value: user.email },
            { label: 'Username', value: `@${user.username}` },
            { label: 'Level',    value: user.level },
            { label: 'Streak',   value: `${user.streak} days` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm text-slate-500">{row.label}</span>
              <span className="text-sm font-medium text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-red-100 bg-red-50/50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Log Out</h3>
            <p className="text-xs text-slate-500">You will be logged out from all devices</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </article>
    </div>
  )
}

// ── Notifications Section ────────────────────────────────────────────────────
function NotificationsSection() {
  const [items, setItems] = useState(notificationItems)
  const toggle = (name) =>
    setItems((prev) => prev.map((n) => (n.name === name ? { ...n, enabled: !n.enabled } : n)))

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Notifications</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-start justify-between rounded-xl border border-slate-100 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.name)}
              className={`h-6 w-10 rounded-full p-0.5 transition-colors ${item.enabled ? 'bg-indigo-500' : 'bg-slate-200'}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}

// ── Privacy Section ──────────────────────────────────────────────────────────
function PrivacySection() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Privacy &amp; Security</h3>
      <div className="space-y-2">
        {privacyItems.map((item) => (
          <button
            key={item.name}
            className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-400">
              {item.meta}
              <ChevronRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </article>
  )
}

function PlaceholderSection({ title, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-indigo-500" />}
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">This section is coming soon.</p>
    </article>
  )
}

function RightPanel({ section, user, patchUser, logout }) {
  switch (section) {
    case 'profile':       return <ProfileSection user={user} patchUser={patchUser} logout={logout} />
    case 'notifications': return <NotificationsSection />
    case 'privacy':       return <PrivacySection />
    case 'appearance':    return <PlaceholderSection title="Preferences" icon={Monitor} />
    case 'language':      return <PlaceholderSection title="Language" icon={Globe} />
    default: {
      const item = settingMenu.find((m) => m.section === section)
      return <PlaceholderSection title={item?.title ?? section} icon={item?.icon} />
    }
  }
}

export default function SettingsPage() {
  const { user, setUser: patchUser, logout } = useUser()
  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Settings" subtitle="Manage your account, preferences and more" />

          <section className="grid gap-4 xl:grid-cols-[300px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="space-y-1">
                {settingMenu.map((item) => {
                  const active = activeSection === item.section
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveSection(item.section)}
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition ${active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <item.icon size={16} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                        <div>
                          <p className={`text-sm font-semibold ${active ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                          <p className="text-xs text-slate-500">{item.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <div>
              <RightPanel section={activeSection} user={user} patchUser={patchUser} logout={logout} />
            </div>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
