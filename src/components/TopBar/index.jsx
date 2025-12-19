import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

import "./styles.css";

function TopBar() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setOpenDialog(true);
  };

  const handlePostPhoto = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile); // ✅ CHỈ GỬI ẢNH

    const res = await fetch("https://74t8mc-8081.csb.app/api/photo/new", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    // reset
    setOpenDialog(false);
    setSelectedFile(null);
    setPreview(null);

    // reload để thấy ảnh mới
    window.location.reload();
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" color="inherit">
            Photo-Sharing
          </Typography>

          <Button
            color="inherit"
            size="large"
            sx={{
              textTransform: "none",
              py: 0.5,
              px: 1.5,
              minHeight: "auto",
              fontSize: "1.05rem",
            }}
            component="label"
          >
            <b>Add Photo</b>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {currentUser ? (
            <>
              <Typography variant="subtitle1" color="inherit">
                <b>Hi {currentUser.first_name}</b>
              </Typography>
              <Button className="logout-btn" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1" color="inherit">
              Please Login
            </Typography>
          )}
        </Box>

        {/* Dialog upload ảnh */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>New Photo</DialogTitle>
          <DialogContent>
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", marginBottom: 12 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handlePostPhoto}>
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
