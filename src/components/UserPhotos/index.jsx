// client/src/components/UserPhotos/index.jsx
import React, { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Typography,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData"; // ← GỌI BACKEND THẬT
import { useUser } from "../UserContext";

/**
 * UserPhotos - Lấy ảnh + comment từ backend MongoDB
 */
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const { currentUser } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [caption, setCaption] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // GỌI 2 API THẬT TỪ BACKEND
        const userData = await fetchModel(`/user/${userId}`);
        const photosData = await fetchModel(`/photo/photosOfUser/${userId}`);

        setUser(userData);
        setPhotos(photosData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu ảnh:", err);
        setError("Không thể tải ảnh của người dùng này");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  // Đang tải...
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const handleOpenMenu = (event, photoId, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment({ photoId, commentId });
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = () => {
    if (selectedComment) {
      handleDeleteComment(selectedComment.photoId, selectedComment.commentId);
    }
    setConfirmOpen(false);
  };

  // Lỗi hoặc không tìm thấy
  if (error || !user) {
    return (
      <Typography variant="h5" color="error" align="center" mt={8}>
        {error || "Không tìm thấy người dùng"}
      </Typography>
    );
  }

  const handleAddComment = async (photoId) => {
    const commentText = newComment[photoId]?.trim();
    if (!commentText) {
      alert("Please comment");
      return;
    }

    try {
      const res = await fetch(
        `https://74t8mc-8081.csb.app/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ comment: commentText }),
        }
      );

      if (!res.ok) {
        alert("Error");
        return;
      }

      const updatedPhoto = await res.json();
      setPhotos((prev) =>
        prev.map((p) => (p._id === photoId ? updatedPhoto : p))
      );

      setNewComment((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      alert("Error server");
    }
  };
  function timeAgo(date) {
    const created = new Date(date);
    const now = new Date();
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) {
      return `${seconds} giây trước`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} phút trước`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} giờ trước`;
    }
    const days = Math.floor(hours / 24);
    if (days === 1) {
      return `Hôm qua lúc ${created.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (created.getFullYear() === now.getFullYear()) {
      return `${created.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })} at ${created.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return `${created.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} at ${created.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  const handleDeleteComment = async (photoId, commentId) => {
    try {
      const res = await fetch(
        `https://74t8mc-8081.csb.app/api/photo/${photoId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete comment");
        return;
      }
      const updatedPhoto = await res.json();
      setPhotos((prev) =>
        prev.map((p) => (p._id === photoId ? updatedPhoto : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Thành công → hiển thị ảnh
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Photos of {user.last_name}
      </Typography>
      <Divider sx={{ my: 3 }} />
      {photos.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mt={4}
        >
          Người dùng này chưa đăng ảnh nào.
        </Typography>
      ) : (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 4, boxShadow: 3 }}>
            <CardMedia
              component="img"
              image={`https://74t8mc-8081.csb.app/images/${photo.file_name}`}
              alt="user photo"
              sx={{
                height: "auto",
                maxHeight: 500,
                width: "100%",
                objectFit: "contain",
                backgroundColor: "#f5f5f5",
              }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Taken at:{" "}
                {new Date(photo.date_time).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
                {" at "}
                {new Date(photo.date_time).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>

              {/* Hiển thị comment nếu có */}
              {photo.comments && photo.comments.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Comments ({photo.comments.length}):
                  </Typography>
                  {photo.comments.map((comment) => (
                    <div
                      key={comment._id}
                      style={{ margin: "8px 0", paddingLeft: 8 }}
                    >
                      <strong>
                        {comment.user_id?.first_name}{" "}
                        {comment.user_id?.last_name}
                      </strong>{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        ({timeAgo(comment.date_time)} ):
                      </Typography>
                      {currentUser &&
                        String(comment.user_id?._id) ===
                          String(currentUser._id) && (
                          <>
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleOpenMenu(e, photo._id, comment._id)
                              }
                            >
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseMenu}
                            >
                              <MenuItem onClick={handleConfirmDelete}>
                                Delete
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      <br />
                      <Typography variant="body1">{comment.comment}</Typography>
                    </div>
                  ))}
                </div>
              )}
              {/* Form thêm comment */}
              <Box mt={2} display="flex" gap={1}>
                <input
                  type="text"
                  placeholder="Comment..."
                  value={newComment[photo._id] || ""}
                  onChange={(e) =>
                    setNewComment({
                      ...newComment,
                      [photo._id]: e.target.value,
                    })
                  }
                  style={{
                    flexGrow: 1,
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />

                <Button
                  variant="contained"
                  onClick={() => handleAddComment(photo._id)}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to={`/users/${userId}`}
        sx={{ mt: 4 }}
      >
        Quay lại trang cá nhân
      </Button>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Comment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="primary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserPhotos;
