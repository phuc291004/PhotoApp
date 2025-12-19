import "./App.css";

import React from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { UserProvider, useUser } from "./components/UserContext";

// ---------------------- WRAPPER ----------------------
// Tách phần logic login ra để dùng UserContext bên trong Router
function AppContent() {
  const { currentUser, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  // ❗CHƯA LOGIN → HIỂN THỊ TRANG LOGINREGISTER
  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<LoginRegister />} />
      </Routes>
    );
  }

  // ĐÃ LOGIN → HIỂN THỊ APP
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TopBar />
      </Grid>

      <div className="main-topbar-buffer" />

      <Grid item sm={3}>
        <Paper className="main-grid-item">
          <UserList />
        </Paper>
      </Grid>

      <Grid item sm={9}>
        <Paper className="main-grid-item">
          <Routes>
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos />} />
            <Route path="/users" element={<UserList />} />

            {/* Nếu URL không hợp lệ → điều hướng về danh sách */}
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  );
}

// ---------------------- MAIN APP ----------------------

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
