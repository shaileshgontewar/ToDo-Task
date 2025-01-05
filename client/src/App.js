import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Auth/LoginForm";
import AppNavbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import UserDashboard from "./components/Dashboard/UserDashboard";
import Unauthorized from "./pages/Unauthorized";
import Register from "./components/Auth/RegisterForm";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute allowedRoles={["user", "admin"]} />}
        >
          <Route index element={<UserDashboard />} />
        </Route>
        <Route
          path="/admin"
          element={<PrivateRoute allowedRoles={["admin"]} />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="user-task/:userId" element={<UserDashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
