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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc, doc, updateDoc, getDoc, getDocs, Timestamp, query, where } from "./firebase"; // Ensure updateDoc is imported

const Cart = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

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
    if (cartItems.length > 0) {
      for (const book of cartItems) {
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
            userStatus: "Reading",
          });
  
          // Query the books collection using ISBN to find the book
          const bookQuery = query(collection(db, "books"), where("ISBN", "==", book.ISBN));
          const bookQuerySnapshot = await getDocs(bookQuery);
  
          if (!bookQuerySnapshot.empty) {
            // Fetch the first matching book from the snapshot
            const bookDoc = bookQuerySnapshot.docs[0];
            const currentBook = bookDoc.data();
            console.log("Current book data:", currentBook);
  
            // Ensure the bookavailable field is a number and decrement it
            const currentBookAvailable = Number(currentBook.bookavailable); // Convert to number if it's a string
  
            if (currentBookAvailable > 0) {
              const newAvailableCount = currentBookAvailable - 1;
  
              // Update the book availability in the books collection
              await updateDoc(bookDoc.ref, {
                bookavailable: newAvailableCount,
              });              
              // Optionally, show a success message
              // alert(`Book ${book.title} successfully issued!`);
            } else {
              alert(`Sorry, ${book.title} is currently unavailable.`);
            }
          } else {
            alert("Book not found in the collection.");
          }
        } catch (err) {
          console.error("Error processing checkout: ", err);
        }
      }
  
      // Clear cart after checkout
      localStorage.removeItem("cart");
      // window.location.reload(); // Refresh the page to reflect the changes
      navigate("/"); 
    } else {
      alert("Your cart is empty. Please add books to your cart before checking out.");
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
          disabled={cartItems.length === 0}
          sx={{ marginRight: 2 }}
        >
          Checkout
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => alert("Book Issued functionality will be added soon.")}
        >
          Book Issued
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
