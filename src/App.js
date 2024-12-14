import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Typography,
  useTheme,
  Badge,
} from "@mui/material";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"; // Ensure Navigate is from react-router-dom
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ImageListItem from "@mui/material/ImageListItem";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import HomePage from "./HomePage";
import Login from "./Login";
import Cart from "./Cart";
import ReturnBook from "./ReturnBook";
import BorrowBooks from "./borrowBooks";


const App = ({ darkMode, toggleTheme }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Track cart items count
  const theme = useTheme();
  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (window.location.pathname !== "/Login") {
      navigate("/"); // Redirect to home only if not already on the login page
    }
    
    // Update cart count on app load
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
  }, [navigate]);
  

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  const handleLogin = () => {
    navigate("/Login");
  };

  const handleCart = () => {
    navigate("/Cart");
  };

  const handleReturn = () => {
    navigate("/ReturnBook");
  };

  const handleCartUpdate = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.palette.background.default,
        }}
      >
        <CircularProgress
          sx={{ background: theme.palette.background.default }}
        />
      </Box>
    );
  }

  const itemData = [
    {
      img: "jain.png",
      title: "logo",
    },
  ];

  return (
    <Box sx={{ display: "flex", background: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.img}?w=40&h=40 2x`}
                alt={item.title}
                loading="lazy"
                style={{ height: "40px", width: "auto", marginRight: "10px" }}
              />
            </ImageListItem>
          ))}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            University Library
          </Typography>
          <Button color="inherit" onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>

          <>
            <Button color="inherit" onClick={handleCart}>
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </Button>
            <Button color="inherit" onClick={handleReturn}>
              <AlarmAddIcon />
            </Button>
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={handleLogin}>
                Login
              </Button>
            )}
          </>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<HomePage handleCartUpdate={handleCartUpdate} />}
          />
          <Route
            path="/Cart"
            element={
              user ? <Cart handleCartUpdate={handleCartUpdate} /> : <Login />
            }
          />
          <Route
            path="/ReturnBook"
            element={user ? <ReturnBook /> : <Login />}
          />
          <Route
            path="/borrowBooks"
            element={user ? <BorrowBooks /> : <Login />}
          />
          <Route
            path="/Login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
