import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { UiSettingsProvider } from "./context/UiSettingsContext";

export default function App() {
  return (
    <AuthProvider>
      <UiSettingsProvider>
        <RouterProvider router={router} />
      </UiSettingsProvider>
    </AuthProvider>
  );
}
