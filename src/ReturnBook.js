import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TableContainer,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Webcam from "react-webcam";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [returnType, setReturnType] = useState("Reading"); // Default mode: Reading
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssuedBooks();
  }, [returnType]); // Re-fetch books whenever the return type changes

  const fetchIssuedBooks = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const collectionName = returnType === "Reading" ? "book-issues" : "book-borrow";
    const q = query(
      collection(db, collectionName),
      where("email", "==", user.email),
      where("userStatus", "==", returnType === "Reading" ? "Reading" : "Borrowed")
    );
    const querySnapshot = await getDocs(q);
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIssuedBooks(books);
    setLoading(false);
  };

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
    if (returnType === "Reading") {
      setIsCameraVisible(true); // Only enable camera for "Reading" type
    } else {
      captureAndReturnBooks(); // Directly return books without photo for "Borrowing"
      navigate("/"); 
    }
  };

  const checkPenaltyForBorrowing = async (bookId, returnDate) => {
    const currentDate = new Date();
    
    // Convert the Firebase Timestamp returnDate to JavaScript Date object
    const returnDateObj = returnDate instanceof Timestamp ? returnDate.toDate() : new Date(returnDate);
  
    // Calculate the difference in time (milliseconds)
    const timeDifference = currentDate - returnDateObj;
  
    // Convert time difference from milliseconds to days
    const daysLate = Math.floor(timeDifference / (1000 * 3600 * 24));
  
    // If the book is returned late (i.e., after the return date)
    if (daysLate > 0) {
      try {
        const bookRef = doc(db, "book-borrow", bookId);
  
        // Update penalty based on the number of late days (capped at a max of 10 days fine)
        const penalty = daysLate <= 10 ? daysLate : 10;
        const newppenalty= penalty * 5;
        console.log(" penalty"+newppenalty);
        await updateDoc(bookRef, {
          penalty: newppenalty, // Set the penalty to the number of late days, capped at 10
        });
  
        console.log(`Penalty updated to ${newppenalty} for bookId: ${bookId}`);
      } catch (error) {
        console.error("Error updating penalty:", error);
      }
    }
  };
  
  

  const captureAndReturnBooks = async () => {
    let capturedPhoto = null;

    if (returnType === "Reading" && webcamRef.current) {
      capturedPhoto = webcamRef.current.getScreenshot();
      if (!capturedPhoto) {
        alert("Please capture your photo for validation.");
        return;
      }
    }

    const collectionName = returnType === "Reading" ? "book-issues" : "book-borrow";

    try {
      for (const bookId of selectedBooks) {
        const bookIssueRef = doc(db, collectionName, bookId);
        const bookIssueDoc = await getDoc(bookIssueRef);
        const returnDate = bookIssueDoc.data().returnDate; // Get returnDate from the document

        // If the returnType is "Borrowing", check and update penalty if needed
        if (returnType === "Borrowing" && returnDate) {
          await checkPenaltyForBorrowing(bookId, returnDate);
        }

        // Continue with the return process
        await updateDoc(bookIssueRef, {
          outTime: Timestamp.now(),
          userStatus: "Book-Returned",
          ...(capturedPhoto && { returnPhoto: capturedPhoto }), // Add photo only if captured
        });

        const ISBN = bookIssueDoc.data().ISBN;
        const bookQuery = query(collection(db, "books"), where("ISBN", "==", ISBN));
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

      <FormControl sx={{ marginBottom: 2, minWidth: 200 }}>
        <InputLabel id="return-type-label">Return Type</InputLabel>
        <Select
          labelId="return-type-label"
          value={returnType}
          onChange={(e) => setReturnType(e.target.value)}
        >
          <MenuItem value="Reading">Reading</MenuItem>
          <MenuItem value="Borrowing">Borrowing</MenuItem>
        </Select>
      </FormControl>

      {issuedBooks.length > 0 ? (
        <>
          <TableContainer sx={{ border: "1px solid #ddd", borderRadius: "8px" }}>
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
            <Button variant="contained" color="primary" onClick={handleReturnClick}>
              Return Selected Books
            </Button>
          </Box>

          {isCameraVisible && returnType === "Reading" && (
            <Box sx={{ marginTop: 2 }}>
              <Box
                sx={{
                  width: "500px",
                  height: "400px",
                  margin: "0 auto",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "user",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={captureAndReturnBooks}
                sx={{ marginTop: 2 }}
              >
                Capture Photo and Return
              </Button>
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
