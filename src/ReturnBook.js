import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TableContainer,
  TablePagination,
} from "@mui/material";
import Webcam from "react-webcam";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase"; // Ensure firebase is properly initialized

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const q = query(
        collection(db, "book-issues"),
        where("email", "==", user.email),
        where("userStatus", "==", "Reading")
      );
      const querySnapshot = await getDocs(q);
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssuedBooks(books);
      setLoading(false);
    };

    fetchIssuedBooks();
  }, []);

  const handleCheckboxChange = (event, bookId) => {
    if (event.target.checked) {
      setSelectedBooks([...selectedBooks, bookId]);
    } else {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    }
  };

  const handleReturnClick = () => {
    if (selectedBooks.length === 0) {
      alert("Please select at least one book to return.");
      return;
    }
    setIsCameraVisible(true);
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      setCapturedPhoto(photo);
    }
  };

  const handleReturn = async () => {
    if (!capturedPhoto) {
      alert("Please capture your photo for validation.");
      return;
    }

    try {
      for (const bookId of selectedBooks) {
        const bookIssueRef = doc(db, "book-issues", bookId);
        await updateDoc(bookIssueRef, {
          outTime: Timestamp.now(),
          userStatus: "Book-Returned",
          returnPhoto: capturedPhoto, // Save the captured photo to the database
        });

        const bookIssueDoc = await getDoc(bookIssueRef);
        const ISBN = bookIssueDoc.data().ISBN;

        const bookQuery = query(
          collection(db, "books"),
          where("ISBN", "==", ISBN)
        );
        const bookQuerySnapshot = await getDocs(bookQuery);

        if (!bookQuerySnapshot.empty) {
          const bookDoc = bookQuerySnapshot.docs[0];
          const currentBook = bookDoc.data();
          const newAvailableCount = Number(currentBook.bookavailable) + 1;

          await updateDoc(bookDoc.ref, {
            bookavailable: newAvailableCount,
          });
        }
      }

      setIssuedBooks(
        issuedBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
      alert("Books returned successfully!");
      setIsCameraVisible(false);
      setCapturedPhoto(null);
    } catch (err) {
      console.error("Error returning books:", err);
      alert("Failed to return books.");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Return Issued Books
      </Typography>

      {issuedBooks.length > 0 ? (
        <>
          <TableContainer
            sx={{ border: "1px solid #ddd", borderRadius: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Book Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ISBN</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Select</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issuedBooks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.bookTitle}</TableCell>
                      <TableCell>{book.ISBN}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedBooks.includes(book.id)}
                          onChange={(e) => handleCheckboxChange(e, book.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReturnClick}
            >
              Return Selected Books
            </Button>
          </Box>

          {isCameraVisible && (
            <Box sx={{ marginTop: 2 }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={capturePhoto}
                sx={{ marginTop: 2 }}
              >
                Capture Photo
              </Button>

              {capturedPhoto && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography>Captured Photo:</Typography>
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleReturn}
                    sx={{ marginTop: 2 }}
                  >
                    Confirm Return
                  </Button>
                </Box>
              )}
            </Box>
          )}

          <TablePagination
            component="div"
            count={issuedBooks.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{ marginTop: 2 }}
          />
        </>
      ) : (
        <Typography>No books issued.</Typography>
      )}
    </Box>
  );
};

export default ReturnBook;
