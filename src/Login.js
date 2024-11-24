import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const studentsRef = collection(db, "students");
      const q = query(
        studentsRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        console.log("Login successful, user data:", studentData);

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(studentData));

        setUser(studentData);
        navigate("/Dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "83.5vh",
      backgroundColor: theme.palette.background.default, // Use theme background color
    }}
  >
    <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {/* Display error message if exists */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 3 }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        {/* Optionally, you can add a link to "forgot password" or "sign up" */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Forgot your password? <a href="/reset-password">Reset it here</a>
        </Typography>
      </CardContent>
    </Card>
  </Box>
);
};

export default Login;
