import { useState } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { mockShifts, mockStaff } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Shift = typeof mockShifts[0];

const deptColors: Record<string, string> = {
  "Front Office": "bg-blue-100 text-blue-700 border-blue-200",
  Housekeeping: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Kitchen: "bg-orange-100 text-orange-700 border-orange-200",
  Maintenance: "bg-red-100 text-red-700 border-red-200",
  Security: "bg-gray-100 text-gray-700 border-gray-200",
};

const weekDays = ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13", "2026-03-14", "2026-03-15"];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyShift: Omit<Shift, "id"> = {
  staffId: 1, staffName: "", date: "2026-03-14", startTime: "08:00", endTime: "16:00", department: "Front Office", notes: ""
};

export function StaffShifts() {
  const { hasPermission, canAccess } = useAuth();
  const [shifts, setShifts] = useState(mockShifts);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [form, setForm] = useState<Omit<Shift, "id">>(emptyShift);

  const filtered = shifts.filter(s =>
    s.staffName.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, view, shifts.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => { setEditing(null); setForm(emptyShift); setShowModal(true); };
  const openEdit = (s: Shift) => {
    setEditing(s);
    setForm({ staffId: s.staffId, staffName: s.staffName, date: s.date, startTime: s.startTime, endTime: s.endTime, department: s.department, notes: s.notes });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.staffName || !form.date) return;
    if (editing) {
      setShifts(prev => prev.map(s => s.id === editing.id ? { ...editing, ...form } : s));
    } else {
      setShifts(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => setShifts(prev => prev.filter(s => s.id !== id));

  const handleStaffChange = (staffId: number) => {
    const staff = mockStaff.find(s => s.id === staffId);
    setForm(f => ({ ...f, staffId, staffName: staff?.name || "", department: staff?.department || f.department }));
  };

  if (!canAccess("shifts")) return <AccessDenied module="Staff Shifts" requiredRole="Manager" />;

  const canCreate = hasPermission("shifts", "create");
  const canEdit   = hasPermission("shifts", "update");
  const canDelete = hasPermission("shifts", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Staff Shifts</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Plan and manage employee schedules</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add Shift
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search shifts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
          <button onClick={() => setView("calendar")} className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${view === "calendar" ? "bg-blue-600 text-white" : "text-gray-600"}`}>
            <Calendar className="w-3.5 h-3.5" /> Calendar
          </button>
          <button onClick={() => setView("list")} className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${view === "list" ? "bg-blue-600 text-white" : "text-gray-600"}`}>List</button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
              <h2 className="text-gray-800 text-[12px] font-semibold">Week of March 9 – 15, 2026</h2>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="px-3 py-2 text-[10px] font-semibold text-gray-400">STAFF</div>
                {weekDays.map((d, i) => (
                  <div key={d} className={`px-1.5 py-2 text-center border-l border-gray-100 ${d === "2026-03-14" ? "bg-blue-50" : ""}`}>
                    <p className="text-[10px] font-semibold text-gray-500">{dayLabels[i]}</p>
                    <p className={`text-[12px] font-bold ${d === "2026-03-14" ? "text-blue-600" : "text-gray-800"}`}>{d.split("-")[2]}</p>
                  </div>
                ))}
              </div>
              {/* Staff Rows */}
              {mockStaff.map(staff => (
                <div key={staff.id} className="grid grid-cols-8 border-b border-gray-100 min-h-[44px]">
                  <div className="px-3 py-2 flex items-center gap-1.5 border-r border-gray-100">
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-[9px] font-bold flex-shrink-0">
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 truncate">{staff.name.split(" ")[0]}</span>
                  </div>
                  {weekDays.map(day => {
                    const dayShifts = shifts.filter(s => s.staffId === staff.id && s.date === day);
                    return (
                      <div key={day} className={`px-1 py-1.5 border-l border-gray-100 ${day === "2026-03-14" ? "bg-blue-50" : ""}`}>
                        {dayShifts.map(shift => (
                          <div
                            key={shift.id}
                            onClick={() => openEdit(shift)}
                            className={`text-[10px] px-1 py-0.5 rounded border mb-0.5 cursor-pointer hover:opacity-80 transition-opacity ${deptColors[shift.department] || "bg-gray-100 text-gray-700"}`}
                          >
                            <p className="font-medium truncate">{shift.startTime}–{shift.endTime}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Staff</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Start</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">End</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-[9px] font-bold">
                        {s.staffName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[12px] font-medium text-gray-800">{s.staffName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.date}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.startTime}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.endTime}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${deptColors[s.department] || "bg-gray-100 text-gray-700"}`}>{s.department}</span>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-gray-500 max-w-xs truncate">{s.notes || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Shift" : "Add Shift"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Staff Member</label>
                <select value={form.staffId} onChange={e => handleStaffChange(+e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {mockStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Department</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Front Office", "Housekeeping", "Kitchen", "Maintenance", "Security"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Shift notes..." />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Save Shift</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
