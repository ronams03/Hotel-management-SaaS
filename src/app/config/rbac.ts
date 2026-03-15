// ─── RBAC Configuration ───────────────────────────────────────────────────────
// Defines what each role can do in each module

export type RoleName = "Super Admin" | "Manager" | "Receptionist";
export type Module =
  | "dashboard" | "bookings" | "guests" | "rooms"
  | "staff" | "shifts" | "housekeeping" | "invoices" | "iam" | "settings";
export type Action = "create" | "read" | "update" | "delete";

export type RolePermissions = Record<Module, Action[]>;
export type PermissionsMap = Record<RoleName, RolePermissions>;

export const PERMISSIONS: PermissionsMap = {
  "Super Admin": {
    dashboard:    ["create", "read", "update", "delete"],
    bookings:     ["create", "read", "update", "delete"],
    guests:       ["create", "read", "update", "delete"],
    rooms:        ["create", "read", "update", "delete"],
    staff:        ["create", "read", "update", "delete"],
    shifts:       ["create", "read", "update", "delete"],
    housekeeping: ["create", "read", "update", "delete"],
    invoices:     ["create", "read", "update", "delete"],
    iam:          ["create", "read", "update", "delete"],
    settings:     ["create", "read", "update", "delete"],
  },
  "Manager": {
    dashboard:    ["read"],
    bookings:     ["create", "read", "update", "delete"],
    guests:       ["create", "read", "update", "delete"],
    rooms:        ["read", "update"],          // can change status, not add/delete
    staff:        ["read"],                    // view-only
    shifts:       ["create", "read", "update"],// can manage shifts, no delete
    housekeeping: ["create", "read", "update", "delete"],
    invoices:     ["create", "read", "update"],// no delete invoices
    iam:          [],                          // no access
    settings:     ["read"],                   // view-only
  },
  "Receptionist": {
    dashboard:    ["read"],
    bookings:     ["create", "read", "update"],// no delete
    guests:       ["read", "update"],          // no create/delete
    rooms:        ["read"],                    // view-only
    staff:        [],                          // no access
    shifts:       [],                          // no access
    housekeeping: ["read", "update"],          // can update cleaning status
    invoices:     [],                          // no access
    iam:          [],                          // no access
    settings:     [],                          // no access
  },
};

// Helper: check if a role has a specific permission for a module
export function checkPermission(
  role: RoleName,
  module: Module,
  action: Action
): boolean {
  return PERMISSIONS[role]?.[module]?.includes(action) ?? false;
}

// Helper: check if a role can access a module at all (has 'read')
export function canAccessModule(role: RoleName, module: Module): boolean {
  return (PERMISSIONS[role]?.[module]?.length ?? 0) > 0;
}

// Nav items with their module key
export const NAV_ITEMS = [
  { path: "/",             label: "Dashboard",     module: "dashboard"    as Module, end: true  },
  { path: "/bookings",     label: "Bookings",      module: "bookings"     as Module },
  { path: "/guests",       label: "Guests",        module: "guests"       as Module },
  { path: "/rooms",        label: "Rooms",         module: "rooms"        as Module },
  { path: "/staff",        label: "Staff",         module: "staff"        as Module },
  { path: "/shifts",       label: "Staff Shifts",  module: "shifts"       as Module },
  { path: "/housekeeping", label: "Housekeeping",  module: "housekeeping" as Module },
  { path: "/invoices",     label: "Invoices",      module: "invoices"     as Module },
  { path: "/iam",          label: "IAM & Roles",   module: "iam"          as Module },
  { path: "/settings",     label: "Settings",      module: "settings"     as Module },
];

// Role display metadata
export const ROLE_META: Record<RoleName, { color: string; bg: string; border: string; dot: string; description: string }> = {
  "Super Admin": {
    color:  "text-amber-700",
    bg:     "bg-amber-50",
    border: "border-amber-200",
    dot:    "bg-amber-500",
    description: "Full system access — all modules and all actions",
  },
  "Manager": {
    color:  "text-sky-700",
    bg:     "bg-sky-50",
    border: "border-sky-200",
    dot:    "bg-sky-500",
    description: "Operational access — most modules except IAM",
  },
  "Receptionist": {
    color:  "text-emerald-700",
    bg:     "bg-emerald-50",
    border: "border-emerald-200",
    dot:    "bg-emerald-500",
    description: "Front-desk access — bookings, guests and housekeeping",
  },
};
