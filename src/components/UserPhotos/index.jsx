import React from "react";
import {
  Typography,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);
  const user = models.userModel(userId);
  if (!user) {
    return <Typography variant="h6">Not Found</Typography>;
  }
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {photos.map((photo) => (
        <Card key={photo._id}>
          <CardMedia
            component="img"
            image={require(`../../images/${photo.file_name}`)}
            alt="user-photo"
            sx={{
              height: "auto",
              maxHeight: 400,
              width: "100%",
              objectFit: "contain",
            }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Taken at: {photo.date_time}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        component={Link}
        to={`/users/${userId}`}
        sx={{ mt: 3 }}
      >
        Back to {user.first_name}'s profile
      </Button>
    </>
  );
}

export default UserPhotos;
