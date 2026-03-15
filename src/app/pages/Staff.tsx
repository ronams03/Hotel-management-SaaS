import { useState } from "react";
import { Plus, Search, X, Phone, Mail, Briefcase } from "lucide-react";
import { mockStaff } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type Staff = typeof mockStaff[0];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Inactive: "bg-gray-100 text-gray-600",
};

const departments = ["All", "Front Office", "Housekeeping", "Kitchen", "Maintenance", "Security"];

const emptyStaff: Omit<Staff, "id"> = {
  name: "", role: "", phone: "", email: "", status: "Active", department: "Front Office"
};

export function Staff() {
  const { hasPermission, canAccess } = useAuth();
  const [staff, setStaff] = useState(mockStaff);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState<Omit<Staff, "id">>(emptyStaff);

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "All" || s.department === filterDept;
    return matchSearch && matchDept;
  });
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filtered.length,
    [search, filterDept, staff.length]
  );
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => { setEditing(null); setForm(emptyStaff); setShowModal(true); setSelectedStaff(null); };
  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, phone: s.phone, email: s.email, status: s.status, department: s.department });
    setShowModal(true);
    setSelectedStaff(null);
  };
  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setStaff(prev => prev.map(s => s.id === editing.id ? { ...editing, ...form } : s));
    } else {
      setStaff(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => { setStaff(prev => prev.filter(s => s.id !== id)); setSelectedStaff(null); };

  if (!canAccess("staff")) return <AccessDenied module="Staff" requiredRole="Manager" />;

  const canCreate = hasPermission("staff", "create");
  const canEdit   = hasPermission("staff", "update");
  const canDelete = hasPermission("staff", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Staff</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Manage staff information and roles</p>
        </div>
        {canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add Staff
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {departments.map(d => (
            <button key={d} onClick={() => setFilterDept(d)} className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors font-medium ${filterDept === d ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Staff Table */}
        <div className={`flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden ${selectedStaff ? "w-1/2" : "w-full"}`}>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map(s => (
                <tr
                  key={s.id}
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedStaff?.id === s.id ? "bg-blue-50" : ""}`}
                  onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-[10px] font-bold flex-shrink-0">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[12px] font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.role}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.department}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-600">{s.phone}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {canEdit && <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>}
                      {canDelete && <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>}
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

        {/* Profile Panel */}
        {selectedStaff && (
          <div className="w-60 flex-shrink-0 bg-white rounded-lg border border-gray-200 p-3 space-y-3 h-fit">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-[14px] mb-1.5">
                  {selectedStaff.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h2 className="text-gray-900 text-[12px] font-semibold text-center">{selectedStaff.name}</h2>
                <p className="text-gray-500 text-[10px] text-center">{selectedStaff.role}</p>
                <span className={`mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[selectedStaff.status]}`}>{selectedStaff.status}</span>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex items-center gap-1.5 text-gray-600"><Briefcase className="w-3.5 h-3.5 text-gray-400" />{selectedStaff.department}</div>
              <div className="flex items-center gap-1.5 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" />{selectedStaff.phone}</div>
              <div className="flex items-center gap-1.5 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" />{selectedStaff.email}</div>
            </div>
            <div className="flex gap-1.5 pt-1.5">
              {canEdit && <button onClick={() => openEdit(selectedStaff)} className="flex-1 px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-medium rounded-lg hover:bg-blue-700 transition-colors">Edit</button>}
              {canDelete && <button onClick={() => handleDelete(selectedStaff.id)} className="px-2.5 py-1.5 border border-red-200 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors">Delete</button>}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Role</label>
                <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Department</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {departments.filter(d => d !== "All").map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Active", "On Leave", "Inactive"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
