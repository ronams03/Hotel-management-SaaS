import {
  BedDouble, LogIn, LogOut, DollarSign, TrendingUp,
  CalendarCheck, Plus, UserPlus, ArrowRight, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { mockBookings, mockRooms } from "../data/mockData";
import { useNavigate } from "react-router";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext";

const revenueData = [
  { day: "Mon", revenue: 1240 },
  { day: "Tue", revenue: 1890 },
  { day: "Wed", revenue: 2200 },
  { day: "Thu", revenue: 1750 },
  { day: "Fri", revenue: 2800 },
  { day: "Sat", revenue: 3200 },
  { day: "Sun", revenue: 2600 },
];

const bookingStatusColors: Record<string, string> = {
  Confirmed:     "bg-blue-100 text-blue-700",
  "Checked-in":  "bg-green-100 text-green-700",
  "Checked-out": "bg-gray-100 text-gray-700",
  Cancelled:     "bg-red-100 text-red-700",
};

const bookingStatusIcon: Record<string, JSX.Element> = {
  Confirmed:     <Clock className="w-3.5 h-3.5" />,
  "Checked-in":  <CheckCircle2 className="w-3.5 h-3.5" />,
  "Checked-out": <LogOut className="w-3.5 h-3.5" />,
  Cancelled:     <AlertCircle className="w-3.5 h-3.5" />,
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const showFinancials = hasPermission("invoices", "read");

  const available   = mockRooms.filter(r => r.status === "Available").length;
  const occupied    = mockRooms.filter(r => r.status === "Occupied").length;
  const cleaning    = mockRooms.filter(r => r.status === "Cleaning").length;
  const maintenance = mockRooms.filter(r => r.status === "Maintenance").length;
  const occupancyRate = Math.round((occupied / mockRooms.length) * 100);

  const checkInsToday  = mockBookings.filter(b => b.checkIn  === "2026-03-14").length;
  const checkOutsToday = mockBookings.filter(b => b.checkOut === "2026-03-14").length;
  const revenueToday   = 4280;

  const upcomingCheckIns = mockBookings.filter(b => b.status === "Confirmed").slice(0, 4);
  const recentBookings   = [...mockBookings].sort((a, b) => b.id - a.id).slice(0, 5);

  const statCards = [
    { label: "Occupancy Rate",   value: `${occupancyRate}%`,                  icon: TrendingUp, color: "bg-blue-500",    sub: `${occupied} of ${mockRooms.length} rooms`,       change: "+5%"  },
    { label: "Rooms Available",  value: available,                              icon: BedDouble,  color: "bg-green-500",   sub: `${cleaning} cleaning, ${maintenance} maintenance`, change: ""     },
    { label: "Check-ins Today",  value: checkInsToday,                          icon: LogIn,      color: "bg-indigo-500",  sub: "Scheduled arrivals",                               change: "+2"   },
    { label: "Check-outs Today", value: checkOutsToday,                         icon: LogOut,     color: "bg-orange-500",  sub: "Scheduled departures",                             change: ""     },
    ...(showFinancials
      ? [{ label: "Revenue Today", value: `$${revenueToday.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500", sub: "vs yesterday $3,820", change: "+12%" }]
      : []),
  ];

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-[14px]">Dashboard</h1>
          <p className="text-gray-500 text-[11px] mt-0.5">
            Saturday, March 14, 2026 — Welcome back, {user?.name ?? "Admin"}!
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> New Booking
          </button>
          <button
            onClick={() => navigate("/guests")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[11px] font-medium"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Guest
          </button>
          <button
            onClick={() => navigate("/rooms")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[11px] font-medium"
          >
            <BedDouble className="w-3.5 h-3.5" /> Add Room
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 min-h-[120px] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-7 h-7 ${card.color} bg-opacity-10 rounded-md flex items-center justify-center`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color.replace("bg-", "text-")}`} />
              </div>
              {card.change && (
                <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">{card.change}</span>
              )}
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">{card.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-4 break-words">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Status + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Room Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-gray-800 mb-3 text-[13px]">Room Status Summary</h2>
          <div className="space-y-2">
            {[
              { label: "Available",   count: available,   color: "bg-green-500",  pct: (available   / mockRooms.length) * 100 },
              { label: "Occupied",    count: occupied,    color: "bg-blue-500",   pct: (occupied    / mockRooms.length) * 100 },
              { label: "Cleaning",    count: cleaning,    color: "bg-yellow-500", pct: (cleaning    / mockRooms.length) * 100 },
              { label: "Maintenance", count: maintenance, color: "bg-red-500",    pct: (maintenance / mockRooms.length) * 100 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-800">{item.count} rooms</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/rooms")}
            className="mt-3 text-blue-600 text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all rooms <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Revenue Chart — LineChart avoids the recharts internal gradient/defs
            duplicate-key warning that AreaChart triggers in React Strict Mode */}
        {showFinancials && (
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-800 text-[13px]">Weekly Revenue</h2>
              <span className="text-[11px] text-gray-500">This week</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={revenueData} id="dashboard-revenue-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}`}
                />
                <Tooltip
                  formatter={(v: number) => [`$${v}`, "Revenue"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Upcoming + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Check-ins */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800 text-[13px]">Upcoming Check-ins</h2>
            <button
              onClick={() => navigate("/bookings")}
              className="text-blue-600 text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingCheckIns.map(b => (
              <div key={b.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-800 truncate">{b.guestName}</p>
                  <p className="text-[10px] text-gray-500">Room {b.room} · {b.checkIn}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${bookingStatusColors[b.status]}`}>
                  {bookingStatusIcon[b.status]} {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800 text-[13px]">Recent Bookings</h2>
            <button
              onClick={() => navigate("/bookings")}
              className="text-blue-600 text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold flex-shrink-0">
                  {b.guestName.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-800 truncate">{b.guestName}</p>
                  <p className="text-[10px] text-gray-500">Room {b.room} · ${b.amount}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${bookingStatusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
