import { useState } from "react";
import { Plus, Search, X, Grid3X3, List } from "lucide-react";
import { mockRooms } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Room = typeof mockRooms[0];

const statusColors: Record<string, string> = {
  Available: "bg-green-100 text-green-700 border-green-200",
  Occupied: "bg-blue-100 text-blue-700 border-blue-200",
  Cleaning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Maintenance: "bg-red-100 text-red-700 border-red-200",
};

const statusDot: Record<string, string> = {
  Available: "bg-green-500",
  Occupied: "bg-blue-500",
  Cleaning: "bg-yellow-500",
  Maintenance: "bg-red-500",
};

const roomTypes = ["All", "Standard", "Deluxe", "Suite", "Penthouse"];
const statuses = ["All", "Available", "Occupied", "Cleaning", "Maintenance"];

const emptyRoom: Omit<Room, "id"> = {
  number: "", type: "Standard", price: 89, floor: 1, status: "Available", description: ""
};

export function Rooms() {
  const { hasPermission, canAccess } = useAuth();
  const [rooms, setRooms] = useState(mockRooms);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<Omit<Room, "id">>(emptyRoom);

  const filtered = rooms.filter(r => {
    const matchSearch = r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || r.type === filterType;
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, filterType, filterStatus, viewMode, rooms.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => { setEditing(null); setForm(emptyRoom); setShowModal(true); };
  const openEdit = (r: Room) => {
    setEditing(r);
    setForm({ number: r.number, type: r.type, price: r.price, floor: r.floor, status: r.status, description: r.description });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.number) return;
    if (editing) {
      setRooms(prev => prev.map(r => r.id === editing.id ? { ...editing, ...form } : r));
    } else {
      setRooms(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => setRooms(prev => prev.filter(r => r.id !== id));

  if (!canAccess("rooms")) return <AccessDenied module="Rooms" />;

  const canCreate = hasPermission("rooms", "create");
  const canEdit   = hasPermission("rooms", "update");
  const canDelete = hasPermission("rooms", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Rooms</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Manage hotel rooms and availability</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add Room
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
            <button onClick={() => setViewMode("grid")} className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}><Grid3X3 className="w-3.5 h-3.5 text-gray-600" /></button>
            <button onClick={() => setViewMode("list")} className={`p-1 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}><List className="w-3.5 h-3.5 text-gray-600" /></button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-500 font-medium">Type:</span>
          {roomTypes.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors font-medium ${filterType === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{t}</button>
          ))}
          <span className="text-[10px] text-gray-500 font-medium ml-1.5">Status:</span>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors font-medium ${filterStatus === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {pageItems.map(r => (
            <div key={r.id} className="bg-white rounded-lg border border-gray-200 p-2.5 aspect-square flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-gray-800">#{r.number}</span>
                  <div className={`w-2 h-2 rounded-full ${statusDot[r.status]}`} />
                </div>
                <p className="text-[11px] text-gray-600">{r.type}</p>
                <p className="text-[10px] text-gray-400">Floor {r.floor}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-[13px] mb-1.5">${r.price}<span className="text-[10px] font-normal text-gray-400">/night</span></p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[r.status]}`}>{r.status}</span>
                {(canEdit || canDelete) && (
                  <div className="flex gap-1 mt-1.5">
                    {canEdit && <button onClick={() => openEdit(r)} className="flex-1 text-[10px] text-blue-600 hover:bg-blue-50 py-0.5 rounded-lg transition-colors font-medium">Edit</button>}
                    {canDelete && <button onClick={() => handleDelete(r.id)} className="flex-1 text-[10px] text-red-500 hover:bg-red-50 py-0.5 rounded-lg transition-colors font-medium">Delete</button>}
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Room</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Floor</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Price/Night</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                {(canEdit || canDelete) && <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-semibold text-gray-900 text-[12px]">#{r.number}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-700">{r.type}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">Floor {r.floor}</td>
                  <td className="px-3 py-2 text-[12px] font-medium text-gray-800">${r.price}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="px-3 py-2 text-[12px] text-gray-500 max-w-xs truncate">{r.description}</td>
                  {(canEdit || canDelete) && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {canEdit && <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>}
                        {canDelete && <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>}
                      </div>
                    </td>
                  )}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Room" : "Add Room"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Room Number</label>
                <input type="text" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 205" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Standard", "Deluxe", "Suite", "Penthouse"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Price / Night ($)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Floor</label>
                <input type="number" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Available", "Occupied", "Cleaning", "Maintenance"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium transition-colors">Save Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
