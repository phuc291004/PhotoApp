import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Alert,
} from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import fetchModelData from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchModelData("/user/list");
        const userList = data.data || data;
        setUsers(userList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách user", error);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
        <Typography ml={2}>Đang tải danh sách người dùng...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }
  if (!users || users.length === 0) {
    return (
      <Typography textAlign={"center"} mt={4}>
        Không có người dùng nào
      </Typography>
    );
  }
  return (
    <div>
      <Typography variant="body1">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a> and{" "}
        <a href="https://mui.com/components/dividers/">Dividers</a> to display
        your users like so:
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem component={Link} to={`/users/${user._id}`} button>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
