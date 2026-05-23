import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts'

const categorySpend = [
  { category: 'Groceries', amount: 480 },
  { category: 'Restaurants', amount: 310 },
  { category: 'Gas', amount: 195 },
  { category: 'Utilities', amount: 180 },
  { category: 'Shopping', amount: 119 },
]

const trendData = [
  { month: 'Jan', Groceries: 400, Restaurants: 250, Gas: 160 },
  { month: 'Feb', Groceries: 440, Restaurants: 300, Gas: 175 },
  { month: 'Mar', Groceries: 380, Restaurants: 210, Gas: 145 },
  { month: 'Apr', Groceries: 510, Restaurants: 330, Gas: 200 },
  { month: 'May', Groceries: 480, Restaurants: 310, Gas: 195 },
]

const memberSpend = [
  { name: 'Alex', value: 560, color: '#7c3aed' },
  { name: 'Sam', value: 310, color: '#3b82f6' },
  { name: 'Jordan', value: 280, color: '#10b981' },
  { name: 'Casey', value: 134, color: '#f59e0b' },
]

const topItems = [
  { item: 'Organic Milk', category: 'Groceries', frequency: 8, total: '$42.32' },
  { item: 'Regular Unleaded', category: 'Gas', frequency: 5, total: '$195.00' },
  { item: 'Chicken Breast', category: 'Groceries', frequency: 6, total: '$67.50' },
  { item: 'Avocados', category: 'Groceries', frequency: 10, total: '$28.90' },
  { item: 'Coffee', category: 'Restaurant', frequency: 12, total: '$54.00' },
]

export default function Analysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">Understand your family's spending patterns.</p>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Spend by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categorySpend} layout="vertical" barSize={18}>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={80} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
                formatter={(v) => `$${v}`}
              />
              <Bar dataKey="amount" fill="#7c3aed" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By member */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Spend by Family Member</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={memberSpend} dataKey="value" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}>
                {memberSpend.map((m) => (
                  <Cell key={m.name} fill={m.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
                formatter={(v) => `$${v}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend over time */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Category Trends (5 Months)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
              formatter={(v) => `$${v}`}
            />
            <Legend iconType="circle" iconSize={10} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Line type="monotone" dataKey="Groceries" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Restaurants" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Gas" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Most purchased items */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Most Purchased Items</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {topItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-500">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.item}</p>
                  <p className="text-xs text-gray-400">{item.category} · {item.frequency}x this month</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{item.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
