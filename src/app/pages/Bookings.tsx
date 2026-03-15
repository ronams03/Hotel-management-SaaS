import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { mockBookings, mockRooms } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Booking = typeof mockBookings[0];

const statusColors: Record<string, string> = {
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  "Checked-in": "bg-green-100 text-green-700 border-green-200",
  "Checked-out": "bg-gray-100 text-gray-600 border-gray-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statuses = ["All", "Confirmed", "Checked-in", "Checked-out", "Cancelled"];

const emptyBooking: Omit<Booking, "id"> = {
  guestId: 1, guestName: "", room: "", checkIn: "", checkOut: "",
  adults: 1, children: 0, status: "Confirmed", notes: "", amount: 0
};

export function Bookings() {
  const { hasPermission, canAccess } = useAuth();

  const [bookings, setBookings] = useState(mockBookings);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [form, setForm] = useState<Omit<Booking, "id">>(emptyBooking);

  const filtered = bookings.filter(b => {
    const matchSearch = b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.room.includes(search);
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, filterStatus, bookings.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyBooking);
    setShowModal(true);
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setForm({ guestId: b.guestId, guestName: b.guestName, room: b.room, checkIn: b.checkIn, checkOut: b.checkOut, adults: b.adults, children: b.children, status: b.status, notes: b.notes, amount: b.amount });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.guestName || !form.room || !form.checkIn || !form.checkOut) return;
    if (editing) {
      setBookings(prev => prev.map(b => b.id === editing.id ? { ...editing, ...form } : b));
    } else {
      setBookings(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  if (!canAccess("bookings")) return <AccessDenied module="Bookings" />;

  const canCreate = hasPermission("bookings", "create");
  const canEdit   = hasPermission("bookings", "update");
  const canDelete = hasPermission("bookings", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Bookings</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Manage reservations and guest stays</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> New Booking
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search guest or room..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors font-medium ${filterStatus === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Room</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Check-in</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Check-out</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Guests</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                {(canEdit || canDelete) && (
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-[10px] font-bold flex-shrink-0">
                        {b.guestName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[12px] font-medium text-gray-800">{b.guestName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2"><span className="text-[12px] text-gray-700 font-medium">Room {b.room}</span></td>
                  <td className="px-3 py-2"><span className="text-[12px] text-gray-600">{b.checkIn}</span></td>
                  <td className="px-3 py-2"><span className="text-[12px] text-gray-600">{b.checkOut}</span></td>
                  <td className="px-3 py-2"><span className="text-[12px] text-gray-600">{b.adults}A {b.children > 0 ? `${b.children}C` : ""}</span></td>
                  <td className="px-3 py-2"><span className="text-[12px] font-medium text-gray-800">${b.amount}</span></td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400 text-[12px]">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Booking" : "New Booking"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Guest Name</label>
                <input type="text" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Guest full name" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Room Number</label>
                <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select room</option>
                  {mockRooms.map(r => <option key={r.id} value={r.number}>Room {r.number} ({r.type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Confirmed", "Checked-in", "Checked-out", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Check-in Date</label>
                <input type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Check-out Date</label>
                <input type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Adults</label>
                <input type="number" min={1} value={form.adults} onChange={e => setForm(f => ({ ...f, adults: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Children</label>
                <input type="number" min={0} value={form.children} onChange={e => setForm(f => ({ ...f, children: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Amount ($)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium transition-colors">Save Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
