import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, collection, addDoc, Timestamp } from "./firebase"; // Ensure Timestamp is imported

const Cart = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checkedBooks, setCheckedBooks] = useState([]);

  // Handle checkbox toggle for Book-Reading
  const handleCheckboxChange = (ISBN) => {
    setCheckedBooks((prevCheckedBooks) =>
      prevCheckedBooks.includes(ISBN)
        ? prevCheckedBooks.filter((item) => item !== ISBN)
        : [...prevCheckedBooks, ISBN]
    );
  };

  // Handle deletion of a book from the cart
  const handleDelete = (ISBN) => {
    const updatedCart = cartItems.filter((item) => item.ISBN !== ISBN);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload(); // Reload the page to reflect the updated cart
  };

  // Handle page change in pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Checkout
  const handleCheckout = async () => {
    if (checkedBooks.length > 0) {
      for (const ISBN of checkedBooks) {
        const book = cartItems.find((item) => item.ISBN === ISBN);
        if (book) {
          const student = JSON.parse(localStorage.getItem("user")); // Assuming user info is stored in localStorage

          try {
            // Add to book-issues database
            await addDoc(collection(db, "book-issues"), {
              name: student.name,
              email: student.email,
              usn: student.usn,
              branch: student.branch,
              department: student.department,
              bookTitle: book.title,
              ISBN: book.ISBN,
              inTime: Timestamp.now(),
              outTime: Timestamp.now(), // You can update this when the user finishes reading
            });

            // Optionally, show a success message
            alert(`Book ${book.title} successfully issued!`);
          } catch (err) {
            console.error("Error adding document: ", err);
            alert("Error occurred while issuing the book.");
          }
        }
      }

      // Clear cart after checkout
      localStorage.removeItem("cart");
      window.location.reload(); // Refresh the page to reflect the changes
    } else {
      alert("Please select books for reading before checking out.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography color="textSecondary">Your cart is empty.</Typography>
      ) : (
        <TableContainer sx={{ border: "1px solid #ddd", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left"><strong>Book Title</strong></TableCell>
                <TableCell align="left"><strong>Author</strong></TableCell>
                <TableCell align="left"><strong>Publisher</strong></TableCell>
                <TableCell align="left"><strong>ISBN</strong></TableCell>
                <TableCell align="left"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{item.title}</TableCell>
                    <TableCell align="left">{item.author}</TableCell>
                    <TableCell align="left">{item.publisher}</TableCell>
                    <TableCell align="left">{item.ISBN}</TableCell>
                    <TableCell align="left">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedBooks.includes(item.ISBN)}
                            onChange={() => handleCheckboxChange(item.ISBN)}
                          />
                        }
                        label="Book Reading"
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.ISBN)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={cartItems.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{ marginTop: 2 }}
      />

      <Box textAlign="right" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || checkedBooks.length === 0}
        >
          Checkout
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
