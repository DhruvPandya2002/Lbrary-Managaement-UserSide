// import React, { useEffect, useState } from "react";
// import { Route, Routes, useNavigate } from "react-router-dom";
// import { AppBar, Box, Button, CssBaseline,  Toolbar, Typography, useTheme, CircularProgress } from "@mui/material";
// // import SearchIcon from '@mui/icons-material/Search';
// // import { auth } from "./firebase"; // Firebase authentication
// import HomePage from "./HomePage";
// import Login from "./Login";

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const theme = useTheme();
//   // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();

//   // Load user from localStorage on app start
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Logout functionality
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: theme.palette.background.default }}>
//         <CircularProgress sx={{ background: theme.palette.background.default }} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex", background: theme.palette.background.default }}>
//       <CssBaseline />
//       <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>Library Management</Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - 240px)` },
//         }}
//       >
//         <Routes>
//           <Route path="/HomePage" element={user ? <HomePage /> : <Login setUser={setUser} />} />
//           <Route path="/login" element={<Login setUser={setUser} />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// };

// export default App;


import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Toolbar, Typography, useTheme, CircularProgress } from "@mui/material";
import HomePage from "./HomePage";
import Login from "./Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: theme.palette.background.default }}>
        <CircularProgress sx={{ background: theme.palette.background.default }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", background: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Library Management</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <Routes>
          <Route path="/HomePage" element={user ? <HomePage /> : <Login setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
