import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Button,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import fetchModelData from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    async function loadUser(params) {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        setEditing(false);
        const data = await fetchModelData(`/user/${userId}`);
        setUser(data);
        setLocation(data.location || "");
        setDescription(data.description || "");
        setOccupation(data.occupation || "");
      } catch (error) {
        setError("Không thể truy cập tới backend");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);
  if (loading) {
    return (
      <Box display={"flex"} justifyContent={"center"} my={4}>
        <CircularProgress />
        <Typography ml={2}></Typography>
      </Box>
    );
  }

  if (error || !user) {
    return <Typography variant="h6">{error || "NotFound"}</Typography>;
  }
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://74t8mc-8081.csb.app/api/user/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ location, description, occupation }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Update failed");
      } else {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred, please try again later");
    }
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      {!editing ? (
        <>
          <Typography variant="body1" gutterBottom>
            <strong>Location: </strong>
            {user.location}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description: </strong>
            {user.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Occupation: </strong>
            {user.occupation}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            onClick={() => setEditing(true)}
            sx={{ mr: 2 }}
            color="primary"
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/photos/${user._id}`}
          >
            View Photos
          </Button>
        </>
      ) : (
        <Box component="form" onSubmit={handleUpdate}>
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Occupation"
            fullWidth
            margin="normal"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default UserDetail;
