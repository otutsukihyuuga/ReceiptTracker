import { useState } from 'react'
import { SplitSquareVertical, CheckCircle2, Clock, UserPlus, DollarSign } from 'lucide-react'

const splits = [
  {
    id: 1,
    bill: 'Olive Garden',
    date: 'May 20',
    total: '$64.80',
    paidBy: 'Alex',
    splits: [
      { member: 'Alex', amount: '$21.60', status: 'paid', you: true },
      { member: 'Sam', amount: '$21.60', status: 'pending', you: false },
      { member: 'Jordan', amount: '$21.60', status: 'pending', you: false },
    ],
  },
  {
    id: 2,
    bill: 'Costco',
    date: 'May 19',
    total: '$143.25',
    paidBy: 'Jordan',
    splits: [
      { member: 'Alex', amount: '$47.75', status: 'paid', you: true },
      { member: 'Sam', amount: '$47.75', status: 'paid', you: false },
      { member: 'Jordan', amount: '$47.75', status: 'paid', you: false },
    ],
  },
  {
    id: 3,
    bill: 'Netflix',
    date: 'May 15',
    total: '$22.99',
    paidBy: 'Sam',
    splits: [
      { member: 'Alex', amount: '$5.75', status: 'pending', you: true },
      { member: 'Sam', amount: '$5.75', status: 'paid', you: false },
      { member: 'Jordan', amount: '$5.75', status: 'paid', you: false },
      { member: 'Casey', amount: '$5.74', status: 'pending', you: false },
    ],
  },
]

const memberColors: Record<string, string> = {
  Alex: 'from-violet-400 to-violet-600',
  Sam: 'from-blue-400 to-blue-600',
  Jordan: 'from-green-400 to-green-600',
  Casey: 'from-amber-400 to-amber-500',
}

const summary = [
  { label: 'You owe', amount: '$27.35', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Owed to you', amount: '$43.20', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Net balance', amount: '+$15.85', color: 'text-violet-600', bg: 'bg-violet-50' },
]

export default function Splits() {
  const [activeTab, setActiveTab] = useState<'active' | 'settled'>('active')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Splits</h1>
          <p className="text-gray-500 text-sm mt-1">Track shared expenses with your family.</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <UserPlus size={15} />
          Invite Member
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.amount}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['active', 'settled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Split cards */}
      <div className="space-y-4">
        {splits.map((split) => (
          <div key={split.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center">
                  <SplitSquareVertical size={16} className="text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{split.bill}</p>
                  <p className="text-xs text-gray-400">{split.date} · Paid by {split.paidBy}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{split.total}</p>
                <p className="text-xs text-gray-400">total</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {split.splits.map((s) => (
                <div key={s.member} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 bg-gradient-to-br ${memberColors[s.member] ?? 'from-gray-400 to-gray-600'} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {s.member[0]}
                    </div>
                    <span className="text-sm text-gray-700">
                      {s.member} {s.you && <span className="text-xs text-gray-400">(you)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800">{s.amount}</span>
                    {s.status === 'paid' ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={11} />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Clock size={11} />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {split.splits.some((s) => s.you && s.status === 'pending') && (
              <button className="mt-4 w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                <DollarSign size={15} />
                Mark My Share as Paid
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
