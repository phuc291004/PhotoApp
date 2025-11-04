import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

import "./styles.css";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  let context = "PhotoShare";
  if (pathParts[0] === "users" && pathParts.length === 1) {
    context = "User List";
  } else if (pathParts[0] === "photos" && pathParts[1]) {
    const userId = pathParts[1];
    const user = models.userModel(userId);
    context = user
      ? `Photos of ${user.first_name} ${user.last_name}`
      : "Photos";
  } else if (pathParts[0] === "users" && pathParts[1]) {
    const userId = pathParts[1];
    const user = models.userModel(userId);
    context = user ? `${user.first_name} ${user.last_name}` : "User";
  }
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          Đặng Phúc - PhotoShare
        </Typography>
        <Box>
          <Typography variant="subtitle1" color="inherit">
            {context}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
