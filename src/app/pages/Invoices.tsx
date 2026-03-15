import { useState } from "react";
import { Plus, Search, X, Download, Eye } from "lucide-react";
import { mockInvoices, mockGuests, mockBookings } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Invoice = typeof mockInvoices[0];

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statuses = ["All", "Paid", "Pending", "Cancelled"];

const emptyInvoice: Omit<Invoice, "id"> = {
  guestName: "", bookingId: 1, room: "", amount: 0, tax: 0, discount: 0, total: 0, status: "Pending", date: "2026-03-14"
};

export function Invoices() {
  const { hasPermission, canAccess } = useAuth();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState<Omit<Invoice, "id">>(emptyInvoice);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.guestName.toLowerCase().includes(search.toLowerCase()) || inv.id.includes(search);
    const matchStatus = filterStatus === "All" || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, filterStatus, invoices.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === "Pending").reduce((sum, i) => sum + i.total, 0);

  const computeTotal = (amount: number, tax: number, discount: number) =>
    Math.max(0, amount + tax - discount);

  const openAdd = () => { setEditing(null); setForm(emptyInvoice); setShowModal(true); };
  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({ guestName: inv.guestName, bookingId: inv.bookingId, room: inv.room, amount: inv.amount, tax: inv.tax, discount: inv.discount, total: inv.total, status: inv.status, date: inv.date });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.guestName) return;
    const total = computeTotal(form.amount, form.tax, form.discount);
    if (editing) {
      setInvoices(prev => prev.map(i => i.id === editing.id ? { ...editing, ...form, total } : i));
    } else {
      const newId = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
      setInvoices(prev => [...prev, { id: newId, ...form, total }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: string) => setInvoices(prev => prev.filter(i => i.id !== id));

  if (!canAccess("invoices")) return <AccessDenied module="Invoices" requiredRole="Manager" />;

  const canCreate = hasPermission("invoices", "create");
  const canEdit   = hasPermission("invoices", "update");
  const canDelete = hasPermission("invoices", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Invoices</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Track guest billing and payment status</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Create Invoice
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "Pending Amount", value: `$${pendingAmount.toFixed(2)}`, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
          { label: "Total Invoices", value: invoices.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        ].map((c, i) => (
          <div key={i} className={`${c.bg} border ${c.border} rounded-lg p-2 flex items-center justify-between`}>
            <p className="text-[11px] text-gray-500">{c.label}</p>
            <p className={`text-[14px] font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-1.5">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors font-medium ${filterStatus === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Invoice ID</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Room</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Tax</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Discount</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageItems.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 text-[12px] font-mono font-medium text-blue-600">{inv.id}</td>
                <td className="px-3 py-2 text-[12px] font-medium text-gray-800">{inv.guestName}</td>
                <td className="px-3 py-2 text-[12px] text-gray-600">Room {inv.room}</td>
                <td className="px-3 py-2 text-[12px] text-gray-700">${inv.amount.toFixed(2)}</td>
                <td className="px-3 py-2 text-[12px] text-gray-700">${inv.tax.toFixed(2)}</td>
                <td className="px-3 py-2 text-[12px] text-gray-700">${inv.discount.toFixed(2)}</td>
                <td className="px-3 py-2 text-[12px] font-bold text-gray-900">${inv.total.toFixed(2)}</td>
                <td className="px-3 py-2 text-[12px] text-gray-600">{inv.date}</td>
                <td className="px-3 py-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowDetail(inv)} className="p-0.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    {canEdit && <button onClick={() => openEdit(inv)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>}
                    {canDelete && <button onClick={() => handleDelete(inv.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>

      {/* Invoice Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-gray-900 text-[14px] font-semibold">{showDetail.id}</h2>
                <p className="text-gray-500 text-[10px] mt-0.5">{showDetail.date}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">Guest</span><span className="font-medium text-gray-800">{showDetail.guestName}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">Room</span><span className="font-medium text-gray-800">{showDetail.room}</span></div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">Subtotal</span><span className="text-gray-800">${showDetail.amount.toFixed(2)}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">Tax (10%)</span><span className="text-gray-800">${showDetail.tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">Discount</span><span className="text-red-600">-${showDetail.discount.toFixed(2)}</span></div>
              <hr className="border-gray-200" />
              <div className="flex justify-between"><span className="font-semibold text-gray-800 text-[12px]">Total</span><span className="font-bold text-gray-900 text-[14px]">${showDetail.total.toFixed(2)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[12px]">Payment Status</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[showDetail.status]}`}>{showDetail.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-[12px] font-medium">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button onClick={() => setShowDetail(null)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Invoice" : "Create Invoice"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Guest Name</label>
                <input type="text" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Room</label>
                <input type="text" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 301" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Amount ($)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: +e.target.value, tax: +(+e.target.value * 0.1).toFixed(2) }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Tax ($)</label>
                <input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Discount ($)</label>
                <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Total (auto)</label>
                <div className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[12px] bg-gray-50 font-bold text-gray-900">
                  ${computeTotal(form.amount, form.tax, form.discount).toFixed(2)}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Payment Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Pending", "Paid", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Save Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
