import { useState } from 'react'
import { Receipt, Search, Filter, Eye, Trash2 } from 'lucide-react'

const bills = [
  { id: 1, merchant: 'Whole Foods', date: 'May 22, 2026', amount: '$87.43', tax: '$7.12', discount: '$5.00', category: 'Groceries', member: 'Alex', items: 14, status: 'processed' },
  { id: 2, merchant: 'Shell Gas Station', date: 'May 21, 2026', amount: '$52.10', tax: '$0.00', discount: '$0.00', category: 'Gas', member: 'Sam', items: 1, status: 'processed' },
  { id: 3, merchant: 'Olive Garden', date: 'May 20, 2026', amount: '$64.80', tax: '$5.80', discount: '$0.00', category: 'Restaurant', member: 'Alex', items: 5, status: 'processed' },
  { id: 4, merchant: 'Costco', date: 'May 19, 2026', amount: '$143.25', tax: '$11.40', discount: '$10.00', category: 'Groceries', member: 'Jordan', items: 22, status: 'processed' },
  { id: 5, merchant: 'Target', date: 'May 17, 2026', amount: '$38.99', tax: '$3.20', discount: '$0.00', category: 'Shopping', member: 'Alex', items: 6, status: 'processing' },
  { id: 6, merchant: 'Chipotle', date: 'May 16, 2026', amount: '$24.50', tax: '$2.00', discount: '$0.00', category: 'Restaurant', member: 'Sam', items: 3, status: 'processed' },
]

const statusStyle: Record<string, string> = {
  processed: 'bg-green-100 text-green-700',
  processing: 'bg-yellow-100 text-yellow-700',
}

const categoryStyle: Record<string, string> = {
  Groceries: 'bg-violet-100 text-violet-700',
  Gas: 'bg-green-100 text-green-700',
  Restaurant: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-orange-100 text-orange-700',
}

export default function Bills() {
  const [search, setSearch] = useState('')

  const filtered = bills.filter(
    (b) =>
      b.merchant.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.member.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <p className="text-gray-500 text-sm mt-1">All your family's receipts in one place.</p>
        </div>
        <a
          href="/upload"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Receipt size={15} />
          Add Bill
        </a>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Merchant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                        <Receipt size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bill.merchant}</p>
                        <p className="text-xs text-gray-400">{bill.items} items</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{bill.date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryStyle[bill.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {bill.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{bill.member}</td>
                  <td className="px-4 py-3.5 text-right text-gray-500">{bill.tax}</td>
                  <td className="px-4 py-3.5 text-right text-gray-500">{bill.discount}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-gray-900">{bill.amount}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[bill.status]}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Receipt size={32} className="mx-auto mb-3 opacity-30" />
              <p>No bills found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
