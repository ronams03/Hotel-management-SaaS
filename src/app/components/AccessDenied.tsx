import { ShieldX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROLE_META } from "../config/rbac";

interface AccessDeniedProps {
  module?: string;
  requiredRole?: string;
}

export function AccessDenied({ module, requiredRole }: AccessDeniedProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center mb-6">
        <ShieldX className="w-10 h-10 text-red-400" />
      </div>

      {/* Heading */}
      <h1 className="text-gray-900 mb-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
        Access Denied
      </h1>
      <p className="text-gray-500 text-sm max-w-sm mb-6">
        You don't have permission to access{module ? ` the <strong>${module}</strong> module` : " this page"}.
        {requiredRole && ` This requires <strong>${requiredRole}</strong> or higher.`}
      </p>

      {/* Role pill */}
      {user && roleMeta && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-8 ${roleMeta.bg} ${roleMeta.border} ${roleMeta.color}`}>
          <span className={`w-2 h-2 rounded-full ${roleMeta.dot}`} />
          Your role: {user.role}
        </div>
      )}

      {/* Permission table */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-left max-w-sm w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What you can access</p>
        <div className="space-y-2">
          {[
            { label: "Dashboard",    allowed: true  },
            { label: "Bookings",     allowed: true  },
            { label: "Guests",       allowed: user?.role !== "Receptionist" ? true : true },
            { label: "Rooms",        allowed: true  },
            { label: "Housekeeping", allowed: true  },
            { label: "Staff",        allowed: user?.role === "Super Admin" || user?.role === "Manager" },
            { label: "Shifts",       allowed: user?.role === "Super Admin" || user?.role === "Manager" },
            { label: "Invoices",     allowed: user?.role === "Super Admin" || user?.role === "Manager" },
            { label: "IAM & Roles",  allowed: user?.role === "Super Admin" },
            { label: "Settings",     allowed: user?.role === "Super Admin" || user?.role === "Manager" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.allowed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {item.allowed ? "Allowed" : "Restricted"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
}
