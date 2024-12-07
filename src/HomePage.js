// import React, { useState } from "react";
// import { TextField, MenuItem, Button, Typography, Box, Container, Card, CardContent, CircularProgress } from "@mui/material";
// import { db, collection, getDocs, query, where } from "./firebase";

// const App = () => {
//   const [searchType, setSearchType] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);
//     setBooks([]); // Clear previous results
//     try {
//       const q = query(
//         collection(db, "books"),
//         where(searchType, "==", searchText)
//       );
//       const querySnapshot = await getDocs(q);
//       const results = [];
//       querySnapshot.forEach((doc) => {
//         results.push(doc.data());
//       });
//       setBooks(results);
//     } catch (error) {
//       console.error("Error fetching books: ", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm" style={{ marginTop: "9vh" }}>
//       <Box display="flex" justifyContent="center" mb={3} flexDirection="column" alignItems="center">
//         <TextField
//           label="Search Books"
//           variant="outlined"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ marginBottom: "1rem", width: "100%" }}
//         />
//         <TextField
//           select
//           label="Select Type"
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           variant="outlined"
//           style={{ marginBottom: "1rem", width: "100%" }}
//         >
//           <MenuItem value="title">Title</MenuItem>
//           <MenuItem value="author">Author</MenuItem>
//           <MenuItem value="genre">Type</MenuItem>
//         </TextField>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSearch}
//           disabled={loading || !searchText || !searchType}
//           fullWidth
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
//         </Button>
//       </Box>

//       <Box mt={4}>
//         {loading && (
//           <Box display="flex" justifyContent="center" mb={3}>
//             <CircularProgress />
//           </Box>
//         )}

//         {books.length > 0 ? (
//           books.map((book, index) => (
//             <Card key={index} variant="outlined" style={{ marginBottom: "1.5rem", borderRadius: "8px" }}>
//               <CardContent>
//                 <Typography variant="h6" color="primary" gutterBottom>
//                   {book.title}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary">
//                   <strong>Author:</strong> {book.author}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary">
//                   <strong>Genre:</strong> {book.genre}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           !loading && (
//             <Typography textAlign="center" color="textSecondary">
//               No results found
//             </Typography>
//           )
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default App;

import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { db, collection, getDocs, query, where } from "./firebase";

const App = () => {
  const [searchType, setSearchType] = useState("");
  const [bookType, setBookType] = useState(""); // New state for book type
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setBooks([]); // Clear previous results
    try {
      const q = query(
        collection(db, "books"),
        where(searchType, "==", searchText)
        // where("type", "==", bookType) // Filtering by book type as well
      );
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setBooks(results);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "3rem" }}>
      <Box textAlign="center" mb={3}>
        <marquee width="100%" direction="left" height="100px">
          This Project is Currently in Development Phase
        </marquee>
        <Typography variant="h4" gutterBottom color="primary">
          Library Search
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        mb={3}
        flexDirection="column"
        alignItems="center"
      >
        <TextField
          label="Search Books"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <Box display="flex" justifyContent="space-between" width="100%">
          <TextField
            select
            label="Select Field"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            variant="outlined"
            style={{ marginBottom: "1rem", width: "48%" }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="genre">ISBN</MenuItem>
          </TextField>

          <TextField
            select
            label="Select Type"
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            variant="outlined"
            style={{ marginBottom: "1rem", width: "48%" }}
          >
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Reference">Reference</MenuItem>
            <MenuItem value="ResearchPaper">Research Paper</MenuItem>
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading || !searchText || !searchType} // Disable until all fields are selected
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
        </Button>
      </Box>

      <Box mt={4}>
        {loading && (
          <Box display="flex" justifyContent="center" mb={3}>
            <CircularProgress />
          </Box>
        )}

        {books.length > 0
          ? books.map((book, index) => (
              <Card
                key={index}
                variant="outlined"
                style={{ marginBottom: "1.5rem", borderRadius: "8px" }}
              >
                <CardMedia
                  component="img"
                  alt={book.title}
                  height="140px" // You can adjust the height of the image as needed
                  image={book.url} // Assuming the book data contains an imageURL field
                  style={{
                    height: "400px",
                    width: "auto",
                    marginRight: "10px",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Author:</strong> {book.author}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>ISBN:</strong> {book.ISBN}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Type:</strong> {book.type}
                  </Typography>
                </CardContent>
              </Card>
            ))
          : !loading && (
              <Typography textAlign="center" color="textSecondary">
                No results found
              </Typography>
            )}
      </Box>
    </Container>
  );
};

export default App;
