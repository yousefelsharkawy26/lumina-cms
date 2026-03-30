import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SmartAssistant } from "../components/chat/SmartAssistant";
import { MaintenancePage } from "../pages/MaintenancePage";
import { useSettingsStore } from "../store/useSettingsStore";
import { useAuthStore } from "../store/useAuthStore";
import { HomePage } from "../pages/HomePage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";
import { SuccessPage } from "../pages/SuccessPage";
import { CancelPage } from "../pages/CancelPage";
import { ProfilePage } from "../pages/ProfilePage";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettingsStore();
  const { user } = useAuthStore();
  const location = useLocation();

  // If maintenance is active, lock out all routes EXCEPT /login so admins can authenticate
  if (settings?.maintenanceMode && user?.role !== "ADMIN" && location.pathname !== "/login") {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

function AppRouter() {

  return (
    <Router>
      <MaintenanceWrapper>
        <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<PublicRoute restricted><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute restricted><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute restricted><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute restricted><ResetPasswordPage /></PublicRoute>} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>

        </main>
        <Footer />
        <SmartAssistant />
      </div>
      </MaintenanceWrapper>
    </Router>
  )
}

export default AppRouter