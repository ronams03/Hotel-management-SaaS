import { createBrowserRouter } from "react-router";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Dashboard } from "./pages/Dashboard";
import { Bookings } from "./pages/Bookings";
import { Guests } from "./pages/Guests";
import { Rooms } from "./pages/Rooms";
import { Staff } from "./pages/Staff";
import { StaffShifts } from "./pages/StaffShifts";
import { Housekeeping } from "./pages/Housekeeping";
import { Invoices } from "./pages/Invoices";
import { IAM } from "./pages/IAM";
import { Settings } from "./pages/Settings";
import { ForgotPassword } from "./pages/ForgotPassword";
import { SignUp } from "./pages/SignUp";

export const router = createBrowserRouter([
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: ProtectedLayout,   // renders Login when not authenticated, redirects when authenticated
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true,            Component: Dashboard    },
      { path: "bookings",       Component: Bookings     },
      { path: "guests",         Component: Guests       },
      { path: "rooms",          Component: Rooms        },
      { path: "staff",          Component: Staff        },
      { path: "shifts",         Component: StaffShifts  },
      { path: "housekeeping",   Component: Housekeeping },
      { path: "invoices",       Component: Invoices     },
      { path: "iam",            Component: IAM          },
      { path: "settings",       Component: Settings     },
    ],
  },
]);