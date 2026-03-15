import { useState } from "react";
import { Plus, Search, X, Phone, Mail, MapPin, CreditCard, Star } from "lucide-react";
import { mockGuests, mockBookings } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Guest = typeof mockGuests[0];

const emptyGuest: Omit<Guest, "id"> = {
  firstName: "", lastName: "", phone: "", email: "", address: "", idPassport: "", visits: 0, notes: ""
};

export function Guests() {
  const { hasPermission, canAccess } = useAuth();
  const [guests, setGuests] = useState(mockGuests);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [form, setForm] = useState<Omit<Guest, "id">>(emptyGuest);

  const filtered = guests.filter(g =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, guests.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyGuest);
    setShowModal(true);
    setSelectedGuest(null);
  };

  const openEdit = (g: Guest) => {
    setEditing(g);
    setForm({ firstName: g.firstName, lastName: g.lastName, phone: g.phone, email: g.email, address: g.address, idPassport: g.idPassport, visits: g.visits, notes: g.notes });
    setShowModal(true);
    setSelectedGuest(null);
  };

  const handleSave = () => {
    if (!form.firstName || !form.lastName) return;
    if (editing) {
      setGuests(prev => prev.map(g => g.id === editing.id ? { ...editing, ...form } : g));
    } else {
      setGuests(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    setSelectedGuest(null);
  };

  const guestBookings = selectedGuest
    ? mockBookings.filter(b => b.guestId === selectedGuest.id)
    : [];

  if (!canAccess("guests")) return <AccessDenied module="Guests" />;

  const canCreate = hasPermission("guests", "create");
  const canEdit   = hasPermission("guests", "update");
  const canDelete = hasPermission("guests", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Guests</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Manage guest profiles and visit history</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add Guest
          </button>
        )}
      </div>

      <div className="flex gap-4">
        {/* Guest List */}
        <div className={`flex flex-col gap-3 ${selectedGuest ? "w-1/2" : "w-full"} transition-all`}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Visits</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.map(g => (
                  <tr
                    key={g.id}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedGuest?.id === g.id ? "bg-blue-50" : ""}`}
                    onClick={() => setSelectedGuest(selectedGuest?.id === g.id ? null : g)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-[10px] font-bold flex-shrink-0">
                          {g.firstName[0]}{g.lastName[0]}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-gray-800">{g.firstName} {g.lastName}</p>
                          {g.visits >= 5 && <span className="text-[10px] text-amber-600 flex items-center gap-0.5"><Star className="w-2.5 h-2.5" /> VIP</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[12px] text-gray-600">{g.phone}</td>
                    <td className="px-3 py-2 text-[12px] text-gray-600">{g.email}</td>
                    <td className="px-3 py-2 text-[12px] text-gray-600">{g.visits}</td>
                    <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(g)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>
                        )}
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
        </div>

        {/* Guest Detail Panel */}
        {selectedGuest && (
          <div className="w-1/2 space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-[14px]">
                    {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-gray-900 text-[13px]">{selectedGuest.firstName} {selectedGuest.lastName}</h2>
                    {selectedGuest.visits >= 5 && (
                      <span className="text-[10px] text-amber-600 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> VIP Guest</span>
                    )}
                    <p className="text-gray-400 text-[10px] mt-0.5">{selectedGuest.visits} total visits</p>
                  </div>
                </div>
                <button onClick={() => setSelectedGuest(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center gap-1.5 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" />{selectedGuest.phone}</div>
                <div className="flex items-center gap-1.5 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" />{selectedGuest.email}</div>
                <div className="flex items-center gap-1.5 text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-400" />{selectedGuest.address}</div>
                <div className="flex items-center gap-1.5 text-gray-600"><CreditCard className="w-3.5 h-3.5 text-gray-400" />ID: {selectedGuest.idPassport}</div>
                {selectedGuest.notes && <p className="text-[10px] text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-1.5 mt-1.5">{selectedGuest.notes}</p>}
              </div>
              <div className="flex gap-2 mt-3">
                {canEdit && (
                  <button onClick={() => openEdit(selectedGuest)} className="flex-1 px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-medium rounded-lg hover:bg-blue-700 transition-colors">Edit Profile</button>
                )}
                {canDelete && (
                  <button onClick={() => handleDelete(selectedGuest.id)} className="px-2.5 py-1.5 border border-red-200 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                )}
              </div>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="text-gray-800 text-[12px] font-semibold mb-2">Booking History</h3>
              {guestBookings.length === 0
                ? <p className="text-gray-400 text-[12px] text-center py-3">No bookings found</p>
                : <div className="space-y-1.5">
                  {guestBookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-[12px] font-medium text-gray-800">Room {b.room}</p>
                        <p className="text-[10px] text-gray-500">{b.checkIn} → {b.checkOut}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-medium text-gray-800">${b.amount}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          b.status === "Confirmed" ? "bg-blue-100 text-blue-700" :
                          b.status === "Checked-in" ? "bg-green-100 text-green-700" :
                          b.status === "Checked-out" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"
                        }`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Guest" : "Add Guest"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: "First Name", key: "firstName" },
                { label: "Last Name", key: "lastName" },
                { label: "Phone", key: "phone" },
                { label: "Email", key: "email" },
                { label: "ID / Passport", key: "idPassport" },
              ].map(({ label, key }) => (
                <div key={key} className={key === "email" ? "col-span-2" : ""}>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Special requirements..." />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium transition-colors">Save Guest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
