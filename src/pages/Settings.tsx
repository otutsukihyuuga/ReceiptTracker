import { Bell, Shield, Users, Palette, Mail } from 'lucide-react'

const familyMembers = [
  { name: 'Alex Johnson', email: 'alex@family.com', role: 'Admin', avatar: 'A', color: 'from-violet-400 to-violet-600' },
  { name: 'Sam Johnson', email: 'sam@family.com', role: 'Member', avatar: 'S', color: 'from-blue-400 to-blue-600' },
  { name: 'Jordan Johnson', email: 'jordan@family.com', role: 'Member', avatar: 'J', color: 'from-green-400 to-green-600' },
  { name: 'Casey Johnson', email: 'casey@family.com', role: 'Member', avatar: 'C', color: 'from-amber-400 to-amber-500' },
]

function Section({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <Icon size={16} className="text-violet-600" />
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-violet-600 peer-focus:ring-2 peer-focus:ring-violet-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  )
}

export default function Settings() {
  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Family Members */}
      <Section icon={Users} title="Family Members">
        <div className="space-y-3 mb-4">
          {familyMembers.map((m) => (
            <div key={m.email} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${m.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                  {m.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.role === 'Admin' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium">
          + Invite a family member
        </button>
      </Section>

      {/* Email Import */}
      <Section icon={Mail} title="Email Import">
        <p className="text-sm text-gray-500 mb-3">
          Forward receipts to this address and they'll be imported automatically.
        </p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <code className="text-sm text-violet-700 font-mono flex-1">receipts@receipttrack.app</code>
          <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Copy</button>
        </div>
        <div className="mt-4 space-y-3 divide-y divide-gray-100">
          <Toggle label="Auto-import emails" description="Automatically process forwarded receipts" defaultOn />
          <Toggle label="Email confirmation" description="Send a confirmation when a receipt is imported" />
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <div className="space-y-1 divide-y divide-gray-100">
          <Toggle label="Split requests" description="When a family member creates a new split" defaultOn />
          <Toggle label="Payment reminders" description="Remind you about pending payments" defaultOn />
          <Toggle label="New bill uploaded" description="When any family member uploads a bill" />
          <Toggle label="Monthly summary" description="Receive a monthly spending report" defaultOn />
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance">
        <p className="text-sm text-gray-500 mb-3">Choose your preferred theme.</p>
        <div className="flex gap-3">
          {['Light', 'Dark', 'System'].map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${t === 'Light' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security">
        <div className="space-y-3">
          <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100">
            Change password →
          </button>
          <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100">
            Two-factor authentication →
          </button>
          <button className="w-full text-left text-sm text-red-500 hover:text-red-600 py-2">
            Sign out of all devices →
          </button>
        </div>
      </Section>
    </div>
  )
}
