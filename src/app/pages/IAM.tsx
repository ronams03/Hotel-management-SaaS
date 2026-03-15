import { useState } from "react";
import { Plus, Search, X, Shield, Users, Check } from "lucide-react";
import { mockUsers, mockRoles } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { AccessDenied } from "../components/AccessDenied";
import { PaginationControls } from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";

type User = typeof mockUsers[0];
type Role = typeof mockRoles[0];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

const tabs = ["Users", "Roles & Permissions"];

const emptyUser: Omit<User, "id"> = {
  name: "", email: "", role: "Staff", status: "Active", lastLogin: "—"
};

const modules = ["Dashboard", "Bookings", "Guests", "Rooms", "Staff", "Invoices", "IAM", "Settings"];
const perms = ["create", "read", "update", "delete"] as const;

export function IAM() {
  const { hasPermission, canAccess } = useAuth();
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>(emptyUser);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [editingPerms, setEditingPerms] = useState(false);
  const [permForm, setPermForm] = useState<Role["permissions"]>(roles[0].permissions);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const { page, setPage, totalPages, pageSize, totalItems, start } = usePagination(
    filteredUsers.length,
    [search, users.length, activeTab]
  );
  const pageItems = filteredUsers.slice(start, start + pageSize);

  const openAdd = () => { setEditing(null); setForm(emptyUser); setShowModal(true); };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status, lastLogin: u.lastLogin });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...editing, ...form } : u));
    } else {
      setUsers(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setPermForm(role.permissions);
    setEditingPerms(false);
  };

  const togglePerm = (module: string, perm: typeof perms[number]) => {
    setPermForm(prev => ({
      ...prev,
      [module]: { ...prev[module as keyof typeof prev], [perm]: !prev[module as keyof typeof prev][perm] }
    }));
  };

  const savePerms = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, permissions: permForm } : r));
    setSelectedRole(r => r ? { ...r, permissions: permForm } : r);
    setEditingPerms(false);
  };

  if (!canAccess("iam")) return <AccessDenied module="IAM & Roles" requiredRole="Super Admin" />;

  const canCreate = hasPermission("iam", "create");
  const canEdit   = hasPermission("iam", "update");
  const canDelete = hasPermission("iam", "delete");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">IAM — Users & Roles</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Manage system access and permissions</p>
        </div>
        {activeTab === "Users" && canCreate && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium">
            <Plus className="w-3.5 h-3.5" /> Add User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors ${activeTab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >{t}</button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Last Login</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-[10px] font-bold">
                          {u.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-[12px] font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[12px] text-gray-600">{u.email}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">{u.role}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-3 py-2 text-[12px] text-gray-500">{u.lastLogin}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-[11px] font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition-colors">Edit</button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium px-1.5 py-0.5 hover:bg-red-50 rounded transition-colors">Delete</button>
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
      )}

      {/* Roles Tab */}
      {activeTab === "Roles & Permissions" && (
        <div className="flex gap-4">
          {/* Role List */}
          <div className="w-48 flex-shrink-0 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1">Roles</p>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => selectRole(r)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium transition-colors text-left ${selectedRole?.id === r.id ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                <Shield className={`w-3.5 h-3.5 flex-shrink-0 ${selectedRole?.id === r.id ? "text-white" : "text-gray-400"}`} />
                {r.name}
              </button>
            ))}
          </div>

          {/* Permissions Grid */}
          {selectedRole && (
            <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div>
                  <h2 className="text-gray-900 text-[12px] font-semibold">{selectedRole.name} — Permissions</h2>
                  <p className="text-gray-400 text-[10px] mt-0.5">Module access control</p>
                </div>
                <div className="flex gap-1.5">
                  {editingPerms ? (
                    <>
                      <button onClick={() => setEditingPerms(false)} className="px-2.5 py-1 text-[11px] border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                      <button onClick={savePerms} className="px-2.5 py-1 text-[11px] bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                    </>
                  ) : (
                    <button onClick={() => setEditingPerms(true)} className="px-2.5 py-1 text-[11px] bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Permissions</button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-40">Module</th>
                      {perms.map(p => (
                        <th key={p} className="text-center px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide capitalize">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {modules.map(module => {
                      const modPerms = (editingPerms ? permForm : selectedRole.permissions)[module as keyof typeof selectedRole.permissions];
                      return (
                        <tr key={module} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 text-[12px] font-medium text-gray-800">{module}</td>
                          {perms.map(p => (
                            <td key={p} className="px-3 py-2 text-center">
                              {editingPerms ? (
                                <button
                                  onClick={() => togglePerm(module, p)}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mx-auto transition-colors ${modPerms?.[p] ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
                                >
                                  {modPerms?.[p] && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>
                              ) : (
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${modPerms?.[p] ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                  {modPerms?.[p] ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-gray-900 text-[14px]">{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["Active", "Inactive"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-[12px] font-medium">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[12px] font-medium">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
