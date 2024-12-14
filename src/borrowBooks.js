import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc, doc, updateDoc, getDocs, query, where, Timestamp } from "./firebase"; // Firebase functions
import Webcam from "react-webcam";

const BorrowBooks = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null); // Store the captured photo
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Handle the "Final Step" button click
  const handleFinalStep = () => {
    setCameraOpen(true);
  };

  // Capture photo using the webcam
  const handleClickPhoto = async () => {
    if (webcamRef.current) {
      const capturedPhoto = webcamRef.current.getScreenshot();
      setPhoto(capturedPhoto);
      setPhotoTaken(true);

      // Add data to the "book-borrow" database and update the "books" database
      const student = JSON.parse(localStorage.getItem("user"));
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 10); // Set return date to 10 days from today

      for (const book of cartItems) {
        try {
          // Add borrow details to the "book-borrow" collection
          await addDoc(collection(db, "book-borrow"), {
            name: student.name,
            email: student.email,
            usn: student.usn,
            branch: student.branch,
            department: student.department,
            bookTitle: book.title,
            ISBN: book.ISBN,
            borrowDate: Timestamp.now(),
            inTime: Timestamp.now(),
            returnDate: Timestamp.fromDate(returnDate), // Save return date
            photo: capturedPhoto, // Save the photo data (base64 format)
            userStatus: "Borrowed",
            penalty: 0, // Initialize penalty to 0
          });

          // Update the book availability in the "books" collection
          const booksQuery = query(
            collection(db, "books"),
            where("ISBN", "==", book.ISBN)
          );
          const booksSnapshot = await getDocs(booksQuery);

          if (!booksSnapshot.empty) {
            const bookDoc = booksSnapshot.docs[0];
            const currentBook = bookDoc.data();
            const newAvailableCount = Math.max(0, Number(currentBook.bookavailable) - 1);

            await updateDoc(doc(db, "books", bookDoc.id), {
              bookavailable: newAvailableCount,
            });
          }
        } catch (err) {
          console.error("Error processing borrow data: ", err);
        }
      }

      // Clear the cart after completing the process
      localStorage.removeItem("cart");

      // Redirect user to the home page
      navigate("/");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Borrow Books
      </Typography>

      {cartItems.length === 0 ? (
        <Typography color="textSecondary">Your cart is empty.</Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Books in Your Cart:
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <strong>Book Title</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Author</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Publisher</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>ISBN</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{item.title}</TableCell>
                    <TableCell align="left">{item.author}</TableCell>
                    <TableCell align="left">{item.publisher}</TableCell>
                    <TableCell align="left">{item.ISBN}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {!cameraOpen ? (
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinalStep}
            disabled={cartItems.length === 0}
          >
            Final Step
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Capture a photo of the borrowed books
          </Typography>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="300px" // Reduced width
            height="200px" // Reduced height
            style={{
              marginTop: 10,
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickPhoto}
            >
              Click Photo
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default BorrowBooks;
