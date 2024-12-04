import React from "react";
import { Typography, Container } from "@mui/material";

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to the Home Page!
      </Typography>
      <Typography variant="body1" align="center">
        You have successfully logged in.
      </Typography>
    </Container>
  );
};

export default HomePage;
