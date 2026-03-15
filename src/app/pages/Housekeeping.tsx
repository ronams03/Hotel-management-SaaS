import { useState } from "react";
import { Plus, Search, X, LayoutGrid, List } from "lucide-react";
import { mockHousekeepingTasks, mockStaff, mockRooms } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Task = typeof mockHousekeepingTasks[0];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Normal: "bg-gray-100 text-gray-700",
  Low: "bg-green-100 text-green-700",
};

const typeColors: Record<string, string> = {
  Cleaning: "bg-blue-50 text-blue-600",
  Maintenance: "bg-orange-50 text-orange-600",
  Restock: "bg-purple-50 text-purple-600",
};

const statuses = ["All", "Pending", "In Progress", "Completed"];

const emptyTask: Omit<Task, "id"> = {
  room: "", assignedStaff: "", priority: "Normal", status: "Pending", notes: "", type: "Cleaning"
};

export function Housekeeping() {
  const { hasPermission, canAccess } = useAuth();
  const [tasks, setTasks] = useState(mockHousekeepingTasks);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [view, setView] = useState<"board" | "list">("board");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id">>(emptyTask);

  const filtered = tasks.filter(t => {
    const matchSearch = t.room.includes(search) || t.assignedStaff.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, filterStatus, view, tasks.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const boardCols = ["Pending", "In Progress", "Completed"];

  const openAdd = () => { setEditing(null); setForm(emptyTask); setShowModal(true); };
  const openEdit = (t: Task) => {
    setEditing(t);
    setForm({ room: t.room, assignedStaff: t.assignedStaff, priority: t.priority, status: t.status, notes: t.notes, type: t.type });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.room) return;
    if (editing) {
      setTasks(prev => prev.map(t => t.id === editing.id ? { ...editing, ...form } : t));
    } else {
      setTasks(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  const moveTask = (id: number, newStatus: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  if (!canAccess("housekeeping")) return <AccessDenied module="Housekeeping" />;

  const canCreate = hasPermission("housekeeping", "create");
  const canEdit   = hasPermission("housekeeping", "update");
  const canDelete = hasPermission("housekeeping", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Housekeeping</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Track room cleaning and maintenance tasks</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search room or staff..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-1.5">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-2 py-1 text-[10px] rounded-lg border transition-colors font-medium ${filterStatus === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 ml-auto">
          <button onClick={() => setView("board")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${view === "board" ? "bg-blue-600 text-white" : "text-gray-600"}`}><LayoutGrid className="w-3 h-3" /> Board</button>
          <button onClick={() => setView("list")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${view === "list" ? "bg-blue-600 text-white" : "text-gray-600"}`}><List className="w-3 h-3" /> List</button>
        </div>
      </div>

      {/* Board View */}
      {view === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {boardCols.map(col => {
            const colTasks = filtered.filter(t => t.status === col);
            return (
              <div key={col} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[12px] font-semibold text-gray-700">{col}</h3>
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center font-medium">{colTasks.length}</span>
                  </div>
                </div>
                <div className="space-y-2 min-h-[160px]">
                  {colTasks.map(t => (
                    <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-2 flex flex-col gap-2 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[t.type]}`}>{t.type}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                          </div>
                          {canEdit && <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-blue-600 transition-colors text-[10px]">Edit</button>}
                        </div>
                        <p className="text-gray-900 font-semibold text-[12px] mb-0.5">Room {t.room}</p>
                        <p className="text-gray-500 text-[10px]">Assigned: {t.assignedStaff}</p>
                        {t.notes && <p className="text-[10px] text-gray-400 italic mt-1">"{t.notes}"</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {canEdit && boardCols.filter(c => c !== col).map(c => (
                          <button key={c} onClick={() => moveTask(t.id, c)} className="text-[10px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded-lg transition-colors border border-blue-100">→ {c}</button>
                        ))}
                        {canDelete && <button onClick={() => handleDelete(t.id)} className="text-[10px] text-red-500 hover:bg-red-50 px-1.5 py-0.5 rounded-lg transition-colors border border-red-100 ml-auto">Delete</button>}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400 text-[11px]">No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Room</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-semibold text-gray-900 text-[12px]">Room {t.room}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[t.type]}`}>{t.type}</span></td>
                  <td className="px-3 py-2 text-[12px] text-gray-700">{t.assignedStaff}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[t.priority]}`}>{t.priority}</span></td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[t.status]}`}>{t.status}</span></td>
                  <td className="px-3 py-2 text-[12px] text-gray-500 max-w-xs truncate">{t.notes || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {canEdit && <button onClick={() => openEdit(t)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>}
                      {canDelete && <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Task" : "Add Task"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Room</label>
                <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select room</option>
                  {mockRooms.map(r => <option key={r.id} value={r.number}>Room {r.number}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Cleaning", "Maintenance", "Restock"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Assigned Staff</label>
                <select value={form.assignedStaff} onChange={e => setForm(f => ({ ...f, assignedStaff: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select staff</option>
                  {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["High", "Normal", "Low"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Pending", "In Progress", "Completed"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Save Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
