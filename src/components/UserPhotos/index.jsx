// client/src/components/UserPhotos/index.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData"; // ← GỌI BACKEND THẬT

/**
 * UserPhotos - Lấy ảnh + comment từ backend MongoDB
 */
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // GỌI 2 API THẬT TỪ BACKEND
        const userData = await fetchModel(`/user/${userId}`);
        const photosData = await fetchModel(`/photosOfUser/${userId}`);

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

  // Lỗi hoặc không tìm thấy
  if (error || !user) {
    return (
      <Typography variant="h5" color="error" align="center" mt={8}>
        {error || "Không tìm thấy người dùng"}
      </Typography>
    );
  }

  // Thành công → hiển thị ảnh
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Ảnh của {user.first_name} {user.last_name}
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
              image={`/images/${photo.file_name}`} // ảnh vẫn nằm trong public/images
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
                Đăng vào: {new Date(photo.date_time).toLocaleString("vi-VN")}
              </Typography>

              {/* Hiển thị comment nếu có */}
              {photo.comments && photo.comments.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Bình luận ({photo.comments.length}):
                  </Typography>
                  {photo.comments.map((comment) => (
                    <div
                      key={comment._id}
                      style={{ margin: "8px 0", paddingLeft: 8 }}
                    >
                      <strong>
                        {comment.user?.first_name} {comment.user?.last_name}
                      </strong>{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        (
                        {new Date(comment.date_time).toLocaleDateString(
                          "vi-VN"
                        )}
                        ):
                      </Typography>
                      <br />
                      <Typography variant="body1">{comment.comment}</Typography>
                    </div>
                  ))}
                </div>
              )}
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
    </>
  );
}

export default UserPhotos;
