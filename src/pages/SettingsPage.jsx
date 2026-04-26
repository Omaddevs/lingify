import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const settingMenu = [
  { title: 'Account', subtitle: 'Manage your profile', icon: UserRound, active: true },
  { title: 'Preferences', subtitle: 'App settings and preferences', icon: ShieldCheck },
  { title: 'Notifications', subtitle: 'Manage your alerts', icon: Bell },
  { title: 'Language', subtitle: 'App language settings', icon: Globe },
  { title: 'Privacy & Security', subtitle: 'Privacy and data protection', icon: Lock },
  { title: 'Subscription', subtitle: 'Manage your plan', icon: CreditCard },
  { title: 'Payment Methods', subtitle: 'Cards and billing', icon: CreditCard },
  { title: 'Study Reminders', subtitle: 'Study goals and reminders', icon: Bell },
  { title: 'Help & Support', subtitle: 'Get help and support', icon: CircleHelp },
  { title: 'About Lingify', subtitle: 'App information and updates', icon: CircleHelp },
]

const accountRows = [
  { label: 'Full Name', value: 'David Johnson' },
  { label: 'Email Address', value: 'david.johnson@email.com' },
  { label: 'Username', value: 'david_ielts' },
  { label: 'Phone Number', value: '+998 90 123 45 67' },
]

const prefCards = [
  { title: 'App Language', value: 'English (US)', action: 'Change language' },
  { title: 'Time Zone', value: '(GMT+5) Tashkent', action: 'Change timezone' },
  { title: 'Theme', value: 'Light Mode', action: 'Change appearance' },
  { title: 'Study Goal', value: '30 minutes/day', action: 'Edit your goal' },
]

const notifications = [
  { name: 'Lesson Reminders', desc: 'Get reminded about your upcoming lessons', enabled: true },
  { name: 'Study Reminders', desc: 'Daily reminders to help you stay consistent', enabled: true },
  { name: 'New Messages', desc: 'Notify me when I receive new messages', enabled: true },
  { name: 'Promotions & Updates', desc: 'Get updates about new features and offers', enabled: false },
]

const privacyItems = [
  { name: 'Change Password', desc: 'Update your account password', meta: '' },
  { name: 'Two-Factor Authentication', desc: 'Add an extra layer of security', meta: 'Off' },
  { name: 'Privacy Settings', desc: 'Manage your data and privacy', meta: '' },
  { name: 'Blocked Users', desc: 'Manage blocked users list', meta: '' },
]

function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem="Settings" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Settings" subtitle="Manage your account, preferences and more" />

          <section className="grid gap-4 xl:grid-cols-[300px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="space-y-1">
                {settingMenu.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                      item.active ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <item.icon size={16} className={item.active ? 'text-indigo-600' : 'text-slate-400'} />
                      <div>
                        <p className={`text-sm font-semibold ${item.active ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                        <p className="text-xs text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Account Information</h3>
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Edit Profile</button>
                </div>
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <img src="https://i.pravatar.cc/100?img=15" alt="David Johnson" className="h-14 w-14 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">David Johnson</p>
                    <p className="text-xs text-slate-500">david.johnson@email.com</p>
                    <p className="mt-0.5 text-xs text-emerald-600">✓ Verified</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {accountRows.map((row) => (
                    <button key={row.label} className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50">
                      <span className="text-sm text-slate-600">{row.label}</span>
                      <span className="inline-flex items-center gap-2 text-sm text-slate-800">
                        {row.value}
                        <ChevronRight size={14} className="text-slate-400" />
                      </span>
                    </button>
                  ))}
                </div>
              </article>

              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {prefCards.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                    <button className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700">{item.action}</button>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-2 text-base font-semibold text-slate-900">Notifications</h3>
                  <div className="space-y-2">
                    {notifications.map((item) => (
                      <div key={item.name} className="flex items-start justify-between rounded-xl border border-slate-100 p-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <button className={`h-6 w-10 rounded-full p-0.5 ${item.enabled ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                          <span className={`block h-5 w-5 rounded-full bg-white transition ${item.enabled ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-xs font-medium text-indigo-600">Manage all notification settings</button>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-2 text-base font-semibold text-slate-900">Privacy & Security</h3>
                  <div className="space-y-2">
                    {privacyItems.map((item) => (
                      <button key={item.name} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                          {item.meta || ''}
                          <ChevronRight size={14} />
                        </span>
                      </button>
                    ))}
                  </div>
                  <button className="mt-3 text-xs font-medium text-indigo-600">Manage all security settings</button>
                </article>
              </section>

              <article className="rounded-2xl border border-red-100 bg-red-50/50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Log Out</h3>
                    <p className="text-xs text-slate-500">You will be logged out from all devices</p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default SettingsPage
