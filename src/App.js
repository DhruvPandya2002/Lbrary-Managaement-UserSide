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
import { Route, Routes, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ImageListItem from "@mui/material/ImageListItem";
import HomePage from "./HomePage";
import Login from "./Login";
import Cart from "./Cart";

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
    } else {
      navigate("/");
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

  const handleCart = () => {
    navigate("/Cart");
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
          {user && (
            <>
              <Button color="inherit" onClick={handleCart}>
                <Badge
                  badgeContent={cartCount}
                  color="secondary"
                >
                <ShoppingCartIcon />
                </Badge>
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
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
          <Route path="/HomePage" element={user ? <HomePage handleCartUpdate={handleCartUpdate} /> : <Login setUser={setUser} />} />      
          <Route path="/Cart" element={user ? <Cart handleCartUpdate={handleCartUpdate} /> : <Login />} />
          <Route path="/" element={<Login setUser={setUser} />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;