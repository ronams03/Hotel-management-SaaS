import { useAuth } from "../context/AuthContext";
import { Login } from "../pages/Login";
import { Layout } from "./Layout";

/**
 * Rendered as the root route Component by react-router.
 * It lives inside <AuthProvider> (via App.tsx), so useAuth() works correctly.
 * If the user is not authenticated it renders the Login page;
 * otherwise it renders Layout which provides <Outlet /> for all child routes.
 */
export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Layout />;
}
