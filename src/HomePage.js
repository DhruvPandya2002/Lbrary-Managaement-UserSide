  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
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
  import { db, collection, getDocs } from "./firebase";
  import Grid from "@mui/material/Grid2";
  // import handleCartUpdate from "./App";
  const App = ({handleCartUpdate}) => {
    const [bookType, setBookType] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookTypes, setBookTypes] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    // Fetching book types
    useEffect(() => {
      const fetchBookTypes = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "books"));
          const types = new Set(
            querySnapshot.docs.map((doc) => doc.data().type).filter(Boolean)
          );
          setBookTypes([...types]);
        } catch (error) {
          console.error("Error fetching book types: ", error);
        }
      };

      fetchBookTypes();
    }, []);

    // Add Book To cart
    const handleAddToCart = (book) => {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

      const isBookInCart = existingCart.some((item) => item.ISBN === book.ISBN);

      if (isBookInCart) {
        alert(`${book.title} is already in your cart.`);
        return;
      } else {
      existingCart.push(book);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      // alert(`${book.title} added to cart.`);
      }
      handleCartUpdate();
    };
    
    // search Book
    const handleSearch = async () => {
      if (!bookType && !searchText.trim()) {
        alert("Please provide either a search text or select a book type.");
        return;
      }

      setLoading(true);
      setSearched(true);
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const results = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((book) => {
            const matchesType = bookType ? book.type === bookType : true;
            const matchesSearch =
              !searchText.trim() ||
              [
                book.title,
                book.author,
                book.publisher,
                book.ISBN,
                ...(book.tags || []),
              ]
                .filter(Boolean)
                .some((field) =>
                  field.toLowerCase().includes(searchText.toLowerCase())
                );
            return matchesType && matchesSearch;
          });

        setFilteredBooks(results);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container style={{ marginTop: "3rem" }} maxWidth="xl">
        <Box textAlign="center" mb={3} mt={8}>
          <Typography variant="h4" gutterBottom color="primary">
            Library Search
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingLeft="150px"
          paddingRight="150px"
        >
          <TextField
            label="Search Books, Authors, Publishers or ISBN"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "350px" }}
          />
          <TextField
            select
            label="Select Type"
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            variant="outlined"
            style={{ width: "350px" }}
          >
            {bookTypes.length > 0 ? (
              bookTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading...</MenuItem>
            )}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            // disabled={loading}
            style={{ width: "350px", height: "56px", fontSize: "16px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Filter by Type"
            )}
          </Button>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" justifyContent="center">
          {loading ? (
            <Box display="flex" justifyContent="center" mb={3}>
              <CircularProgress />
            </Box>
          ) : searched && filteredBooks.length === 0 ? (
            <Typography textAlign="center" color="textSecondary">
              No results found.
            </Typography>
          ) : (
            <Grid container spacing={2} display="flex" justifyContent="center">
              {filteredBooks.map((book, index) => (
                <Grid xs={4} key={index} size={4}>
                  <Card
                    variant="outlined"
                    style={{
                      marginBottom: "1.5rem",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      border:
                        localStorage.getItem("theme") === "dark"
                          ? "2px solid lightgray"
                          : "2px solid gray",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                      <CardMedia
                        component="img"
                        alt={book.title}
                        image={book.url || ""}
                        style={{
                          height: "300px",
                          width: "200px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          objectFit: "contain",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          color="primary"
                          gutterBottom
                          sx={{
                            fontFamily: "Oswald",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            fontSize: "auto",
                          }}
                        >
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Author:</strong> {book.author || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Publisher:</strong> {book.publisher || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Type:</strong> {book.type || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>ISBN:</strong> {book.ISBN || "N/A"}
                        </Typography>
                      </CardContent>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(book)} 
                      style={{
                        width: "95%",
                        height: "auto",
                        fontSize: "14px",
                        marginBottom: "10px",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Add To Cart"
                      )}
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    );
  };
  export default App;