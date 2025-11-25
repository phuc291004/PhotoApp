// client/src/components/TopBar/index.jsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import "./styles.css";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const [context, setContext] = useState("PhotoShare App");

  useEffect(() => {
    async function updateContext() {
      let newContext = "PhotoShare App";

      if (pathParts.length === 0 || location.pathname === "/") {
        newContext = "PhotoShare App";
      }
      // Danh sách user
      else if (pathParts[0] === "users" && pathParts.length === 1) {
        newContext = "User List";
      }
      // Trang chi tiết user: /users/:id
      else if (pathParts[0] === "users" && pathParts[1]) {
        try {
          const user = await fetchModel(`/user/${pathParts[1]}`);
          newContext = user ? `${user.last_name}` : "User Detail";
        } catch {
          newContext = "User Detail";
        }
      }
      // Trang ảnh: /photos/:id
      else if (pathParts[0] === "photos" && pathParts[1]) {
        try {
          const user = await fetchModel(`/user/${pathParts[1]}`);
          newContext = user ? `Photos of ${user.last_name}` : "User Photos";
        } catch {
          newContext = "User Photos";
        }
      }
      // Trang comment: /comments-of/:id
      else if (pathParts[0] === "comments-of" && pathParts[1]) {
        try {
          const user = await fetchModel(`/user/${pathParts[1]}`);
          newContext = user ? `Comments by ${user.last_name}` : "User Comments";
        } catch {
          newContext = "User Comments";
        }
      }

      setContext(newContext);
    }

    updateContext();
  }, [location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Bên trái: Tên + MSSV */}
        <Typography variant="h5" color="inherit">
          Đặng Phúc - B22DCAT223
        </Typography>

        {/* Bên phải: Context đẩy ra ngoài cùng */}
        <Typography variant="h6" color="inherit" sx={{ fontWeight: 500 }}>
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
