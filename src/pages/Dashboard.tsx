import { DollarSign, Receipt, TrendingDown, Users } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const stats = [
  { label: 'Total Spent', value: '$1,284.50', change: '+4.2%', icon: DollarSign, color: 'bg-violet-50 text-violet-600' },
  { label: 'Bills This Month', value: '24', change: '+2', icon: Receipt, color: 'bg-blue-50 text-blue-600' },
  { label: 'Avg. Bill Size', value: '$53.52', change: '-1.8%', icon: TrendingDown, color: 'bg-green-50 text-green-600' },
  { label: 'Family Members', value: '4', change: '', icon: Users, color: 'bg-orange-50 text-orange-600' },
]

const monthlyData = [
  { month: 'Jan', amount: 920 },
  { month: 'Feb', amount: 1050 },
  { month: 'Mar', amount: 870 },
  { month: 'Apr', amount: 1200 },
  { month: 'May', amount: 1284 },
]

const categoryData = [
  { name: 'Groceries', value: 480, color: '#7c3aed' },
  { name: 'Restaurants', value: 310, color: '#3b82f6' },
  { name: 'Gas', value: 195, color: '#10b981' },
  { name: 'Utilities', value: 180, color: '#f59e0b' },
  { name: 'Other', value: 119, color: '#6b7280' },
]

const recentBills = [
  { id: 1, merchant: 'Whole Foods', date: 'May 22', amount: '$87.43', category: 'Groceries', member: 'Alex' },
  { id: 2, merchant: 'Shell Gas Station', date: 'May 21', amount: '$52.10', category: 'Gas', member: 'Sam' },
  { id: 3, merchant: 'Olive Garden', date: 'May 20', amount: '$64.80', category: 'Restaurant', member: 'Alex' },
  { id: 4, merchant: 'Costco', date: 'May 19', amount: '$143.25', category: 'Groceries', member: 'Jordan' },
]

const categoryColors: Record<string, string> = {
  Groceries: 'bg-violet-100 text-violet-700',
  Gas: 'bg-green-100 text-green-700',
  Restaurant: 'bg-blue-100 text-blue-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Alex. Here's your family's spending overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            {s.change && (
              <p className="text-xs text-gray-400 mt-1">{s.change} from last month</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly spend bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={32}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
                formatter={(v) => `$${v}`}
              />
              <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">By Category</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
                formatter={(v) => `$${v}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-medium text-gray-800">${c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bills */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Bills</h2>
          <a href="/bills" className="text-sm text-violet-600 hover:underline">View all</a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentBills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  <Receipt size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{bill.merchant}</p>
                  <p className="text-xs text-gray-400">{bill.date} · {bill.member}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[bill.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {bill.category}
                </span>
                <span className="text-sm font-semibold text-gray-900">{bill.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
