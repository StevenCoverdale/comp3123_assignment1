import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <Routes>

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected route */}
                <Route
                    path="/employees"
                    element={token ? <Employees /> : <Navigate to="/login" />}
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </Router>
    );
}