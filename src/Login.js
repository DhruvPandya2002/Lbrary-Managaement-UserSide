import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, query, where } from "./firebase";
// import { Celebration } from "@mui/icons-material";

const Login = ({ setUser }) => {
  const [usn, setUsn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

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
        const user = querySnapshot.docs[0].data(); 
        setUser(user); 
        localStorage.setItem("user", JSON.stringify(user)); 
        navigate("/HomePage"); 
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "83.5vh",
        textAlign: "center",
        backgroundColor: "background.default", 
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 2, boxShadow: 3 }}>
      <marquee width="100%" direction="left" height="auto">
        This Project is Currently in Development Phase
      </marquee>  
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Student Login
          </Typography>
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              inputRef={inputRef}
              label="USN"
              variant="outlined"
              fullWidth
              margin="normal"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              sx={{ mt: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5 }}              
              disabled={loading || !usn }
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>
          <Typography variant="h8" gutterBottom align="center"style={{ textAlign:"center" }}>
            Enter Usn 23MCAR0054 for login
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default Login;