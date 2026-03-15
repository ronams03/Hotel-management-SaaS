import { useState } from "react";
import { Save, Hotel, Globe, Palette, Clock, DollarSign, Calendar, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUiSettings } from "../context/UiSettingsContext";
import { AccessDenied } from "../components/AccessDenied";

const tabs = ["Hotel Profile", "Tenant Config", "Preferences"];

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR", "BHD"];
const timezones = [
  "UTC-12:00", "UTC-08:00 (PST)", "UTC-07:00 (MST)", "UTC-06:00 (CST)",
  "UTC-05:00 (EST)", "UTC+00:00 (GMT)", "UTC+01:00 (CET)", "UTC+05:30 (IST)",
  "UTC+08:00 (CST Asia)", "UTC+09:00 (JST)", "UTC+10:00 (AEST)"
];
const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD"];
const themes = ["Blue", "Purple", "Green", "Orange", "Red", "Dark"];

export function Settings() {
  const { canAccess, hasPermission } = useAuth();
  const { pageSize, setPageSize, pageSizeOptions } = useUiSettings();
  const [activeTab, setActiveTab] = useState("Hotel Profile");
  const [saved, setSaved] = useState(false);
  const [hotel, setHotel] = useState({
    name: "Grand HotelSaaS",
    address: "123 Luxury Ave, New York, NY 10001",
    city: "New York",
    country: "United States",
    phone: "+1-555-HOTEL",
    email: "info@grandhotelsaas.com",
    website: "www.grandhotelsaas.com",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    taxRate: 10,
    totalRooms: 50,
    description: "A premium hotel management SaaS platform for modern hospitality businesses."
  });
  const [tenant, setTenant] = useState({
    subdomain: "grandhotel",
    themeColor: "Blue",
    currency: "USD",
    timezone: "UTC-05:00 (EST)",
    logoUrl: "",
    primaryColor: "#3b82f6",
    maxUsers: 20,
    plan: "Professional"
  });
  const [prefs, setPrefs] = useState({
    dateFormat: "MM/DD/YYYY",
    language: "English",
    autoLogoutMinutes: 30,
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmation: true,
    dailyReport: true,
    weeklyReport: false,
    maintenanceAlerts: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!canAccess("settings")) return <AccessDenied module="Settings" requiredRole="Manager" />;

  const canEdit = hasPermission("settings", "update");
  const isReadOnly = !canEdit;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Settings</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">Configure hotel-specific settings</p>
        </div>
        {canEdit ? (
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-[11px] font-medium ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            <Save className="w-3.5 h-3.5" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-700 text-[10px] font-medium">View Only</span>
          </div>
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

      {/* Hotel Profile */}
      {activeTab === "Hotel Profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 mb-4">
              <Hotel className="w-4 h-4 text-blue-600" />
              <h2 className="text-gray-900 text-[12px] font-semibold">Hotel Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Hotel Name</label>
                <input type="text" value={hotel.name} onChange={e => setHotel(h => ({ ...h, name: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={hotel.address} onChange={e => setHotel(h => ({ ...h, address: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={hotel.city} onChange={e => setHotel(h => ({ ...h, city: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Country</label>
                <input type="text" value={hotel.country} onChange={e => setHotel(h => ({ ...h, country: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={hotel.phone} onChange={e => setHotel(h => ({ ...h, phone: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={hotel.email} onChange={e => setHotel(h => ({ ...h, email: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Website</label>
                <input type="text" value={hotel.website} onChange={e => setHotel(h => ({ ...h, website: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Total Rooms</label>
                <input type="number" value={hotel.totalRooms} onChange={e => setHotel(h => ({ ...h, totalRooms: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Check-in Time</label>
                <input type="time" value={hotel.checkInTime} onChange={e => setHotel(h => ({ ...h, checkInTime: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Check-out Time</label>
                <input type="time" value={hotel.checkOutTime} onChange={e => setHotel(h => ({ ...h, checkOutTime: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input type="number" value={hotel.taxRate} onChange={e => setHotel(h => ({ ...h, taxRate: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Description</label>
                <textarea value={hotel.description} onChange={e => setHotel(h => ({ ...h, description: e.target.value }))} rows={2} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="text-[12px] font-semibold text-gray-700 mb-3">Hotel Preview</h3>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-center font-bold text-gray-900 text-[13px]">{hotel.name}</h2>
              <p className="text-center text-[10px] text-gray-500 mt-0.5">{hotel.address}</p>
              <p className="text-center text-[10px] text-gray-500">{hotel.city}, {hotel.country}</p>
              <div className="mt-3 space-y-1 text-[10px] text-gray-600">
                <div className="flex justify-between"><span>Check-in</span><span className="font-medium">{hotel.checkInTime}</span></div>
                <div className="flex justify-between"><span>Check-out</span><span className="font-medium">{hotel.checkOutTime}</span></div>
                <div className="flex justify-between"><span>Total Rooms</span><span className="font-medium">{hotel.totalRooms}</span></div>
                <div className="flex justify-between"><span>Tax Rate</span><span className="font-medium">{hotel.taxRate}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Config */}
      {activeTab === "Tenant Config" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 mb-4">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-gray-900 text-[12px] font-semibold">Tenant Configuration</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Subdomain</label>
                <div className="flex items-center gap-0">
                  <input type="text" value={tenant.subdomain} onChange={e => setTenant(t => ({ ...t, subdomain: e.target.value }))} className="flex-1 px-2.5 py-1.5 border border-r-0 border-gray-300 rounded-l-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="yourhotel" />
                  <span className="px-2.5 py-1.5 bg-gray-100 border border-gray-300 rounded-r-lg text-[12px] text-gray-500">.hotelsaas.com</span>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Plan</label>
                <select value={tenant.plan} onChange={e => setTenant(t => ({ ...t, plan: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Starter", "Professional", "Enterprise"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Theme Color</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {themes.map(t => (
                    <button
                      key={t}
                      onClick={() => setTenant(p => ({ ...p, themeColor: t }))}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium transition-colors ${tenant.themeColor === t ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        t === "Blue" ? "bg-blue-500" : t === "Purple" ? "bg-purple-500" :
                        t === "Green" ? "bg-green-500" : t === "Orange" ? "bg-orange-500" :
                        t === "Red" ? "bg-red-500" : "bg-gray-800"
                      }`} />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Currency</label>
                  <select value={tenant.currency} onChange={e => setTenant(t => ({ ...t, currency: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {currencies.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Max Users</label>
                  <input type="number" value={tenant.maxUsers} onChange={e => setTenant(t => ({ ...t, maxUsers: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Timezone</label>
                <select value={tenant.timezone} onChange={e => setTenant(t => ({ ...t, timezone: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {timezones.map(tz => <option key={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences */}
      {activeTab === "Preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-gray-900 text-[12px] font-semibold">System Preferences</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Date Format</label>
                <select value={prefs.dateFormat} onChange={e => setPrefs(p => ({ ...p, dateFormat: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {dateFormats.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Language</label>
                <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["English", "Spanish", "French", "German", "Japanese"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Auto Logout (minutes)</label>
                <input type="number" value={prefs.autoLogoutMinutes} onChange={e => setPrefs(p => ({ ...p, autoLogoutMinutes: +e.target.value }))} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Items per page</label>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(+e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {pageSizeOptions.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Applies to all list and table views.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-gray-900 text-[12px] font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-2">
              {[
                { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                { key: "smsNotifications", label: "SMS Notifications", desc: "Receive updates via SMS" },
                { key: "bookingConfirmation", label: "Booking Confirmations", desc: "Auto-send booking confirmations" },
                { key: "dailyReport", label: "Daily Report", desc: "Receive daily summary report" },
                { key: "weeklyReport", label: "Weekly Report", desc: "Receive weekly performance report" },
                { key: "maintenanceAlerts", label: "Maintenance Alerts", desc: "Get notified about maintenance tasks" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-[12px] font-medium text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => setPrefs(p => ({ ...p, [key]: !(p as any)[key] }))}
                    className={`relative w-8 h-5 rounded-full transition-colors ${(prefs as any)[key] ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${(prefs as any)[key] ? "left-3.5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
