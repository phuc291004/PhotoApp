import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

import "./style.css";

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!loginName.trim() || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }
    try {
      const user = await login(loginName, password);
      navigate(`/users/${user._id}`);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleRegister = async () => {
    setError("");
    if (
      !loginName.trim() ||
      !confirmPassword.trim() ||
      !password.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError("Please fill full information register");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password conflict");
      return;
    }
    try {
      const res = await fetch("https://74t8mc-8081.csb.app/api/admin/user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          login_name: loginName,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Register failed");
      } else {
        alert("Register success!");
        setIsRegister(false);
        setLoginName("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred, please try again later");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };
  return (
    <Box className="fb-login-page">
      <div className="fb-left-box">
        <h1 className="fb-logo">Photo-Sharing</h1>
        <p className="fb-slogan">
          Kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
        </p>
      </div>

      <Paper
        elevation={3}
        className="fb-login-container"
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Login Name"
          fullWidth
          name="loginName"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          className="fb-input"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="fb-input"
        />
        {isRegister && (
          <>
            <TextField
              label="Confirm password"
              fullWidth
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="fb-input"
            />
            <TextField
              label="First name"
              fullWidth
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="fb-input"
            />
            <TextField
              label="Last name"
              fullWidth
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="fb-input"
            />
          </>
        )}

        {error && <Typography className="fb-error">{error}</Typography>}

        <Button
          type="submit"
          fullWidth
          className={isRegister ? "fb-login-btn" : "fb-login-btn"}
        >
          {isRegister ? "Sign up" : "Log in"}
        </Button>
        <hr />
        <Button
          type="button"
          fullWidth
          className="fb-create-btn"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Back to Log in" : "Create new account"}
        </Button>
      </Paper>
    </Box>
  );
}
