// client/src/components/UserDetail/index.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData"; // ← GỌI BACKEND THẬT

/**
 * UserDetail - Lấy thông tin chi tiết user từ backend MongoDB
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // GỌI API THẬT TỪ BACKEND
        const userData = await fetchModel(`/user/${userId}`);

        setUser(userData);
      } catch (err) {
        console.error("Lỗi tải thông tin user:", err);
        setError("Không tìm thấy người dùng hoặc lỗi kết nối");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  // Đang tải...
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  // Không tìm thấy user
  if (error || !user) {
    return (
      <Typography variant="h5" color="error" align="center" mt={8}>
        {error || "Người dùng không tồn tại"}
      </Typography>
    );
  }

  // Thành công → hiển thị thông tin
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Location: </strong>
        {user.location || "Chưa cập nhật"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Description:</strong> {user.description || "Chưa có mô tả"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Occupation:</strong> {user.occupation || "Chưa cập nhật"}
      </Typography>

      <Divider style={{ margin: "20px 0" }} />

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to={`/photos/${user._id}`}
      >
        Xem tất cả ảnh của {user.first_name}
      </Button>
    </>
  );
}

export default UserDetail;
