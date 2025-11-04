import React from "react";
import { Typography, Divider, Button } from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);
  if (!user) {
    return <Typography variant="h6">NotFound</Typography>;
  }
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Location: </strong>
        {user.location}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Description:</strong>
        {user.description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Occupation:</strong>
        {user.occupation}
      </Typography>
      <Divider style={{ margin: "16px 0" }} />
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
      >
        {" "}
        View Photos{" "}
      </Button>
    </>
  );
}

export default UserDetail;
