import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db, collection, getDocs, query, where } from "./firebase";

const Login = ({ setUser }) => {
    const [usn, setUsn] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate
  
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");
  
      try {
        const studentRef = collection(db, "students");
        const q = query(studentRef, where("usn", "==", usn));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          setSuccess("USN found! Redirecting...");
          const user = querySnapshot.docs[0].data(); // You can get the user details if needed
          setUser(user); // Set the user in the parent component (App.js)
          localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
          navigate("/HomePage"); // Redirect to the home page
        } else {
          setError("USN not found. Please check and try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            inputRef={inputRef}
            label="USN"
            variant="outlined"
            fullWidth
            margin="normal"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
        </form>
      </Container>
    );
  };  

export default Login;
