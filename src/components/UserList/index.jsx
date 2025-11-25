// client/src/components/UserList/index.jsx
import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import "./styles.css";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData"; // ← Đây là hàm bạn vừa viết

/**
 * UserList - Lấy danh sách user từ backend thật
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const userList = await fetchModel("/user/list"); // ← GỌI BACKEND THẬT
        setUsers(userList);
        setError(null);
      } catch (err) {
        console.error("Lỗi tải danh sách user:", err);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Nếu đang tải
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Nếu có lỗi
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Nếu không có user
  if (users.length === 0) {
    return <Typography>Không có người dùng nào</Typography>;
  }

  return (
    <div>
      <Typography variant="body1" gutterBottom>
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a> and{" "}
        <a href="https://mui.com/components/dividers/">Dividers</a> to display
        your users like so:
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem component={Link} to={`/users/${user._id}`} button>
              <ListItemText primary={`${user.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
