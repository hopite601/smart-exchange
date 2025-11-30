import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedLayout } from "./layouts/ProtectedLayout";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LanguageProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedLayout />}>
                            <Route path="/" element={<HomePage />} />
                        </Route>
                    </Routes>
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
