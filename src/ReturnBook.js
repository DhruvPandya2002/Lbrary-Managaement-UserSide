import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase"; // Ensure firebase is properly initialized

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const q = query(collection(db, "book-issues"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIssuedBooks(books);
      setLoading(false);
    };

    fetchIssuedBooks();
  }, []);

  const handleReturn = async (id, ISBN) => {
    try {
      // Update outTime for the book issue
      const bookIssueRef = doc(db, "book-issues", id);
      await updateDoc(bookIssueRef, {
        outTime: Timestamp.now(),
      });

      // Query the books collection to find the book by ISBN
      const bookQuery = query(collection(db, "books"), where("ISBN", "==", ISBN));
      const bookQuerySnapshot = await getDocs(bookQuery);

      if (!bookQuerySnapshot.empty) {
        const bookDoc = bookQuerySnapshot.docs[0]; // Get the first matching book document
        const currentBook = bookDoc.data();
        const newAvailableCount = Number(currentBook.bookavailable) + 1;

        // Update the book availability in the books collection
        await updateDoc(bookDoc.ref, {
          bookavailable: newAvailableCount,
        });
      }

      // Remove the returned book from the local state
      setIssuedBooks(issuedBooks.filter((book) => book.id !== id));

      alert("Book returned successfully!");
    } catch (err) {
      console.error("Error returning book:", err);
      alert("Failed to return book.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4">Return Issued Books</Typography>
      {issuedBooks.length > 0 ? (
        issuedBooks.map((book) => (
          <Box key={book.id} sx={{ border: "1px solid gray", padding: 2, margin: 2 }}>
            <Typography>Title: {book.bookTitle}</Typography>
            <Typography>ISBN: {book.ISBN}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleReturn(book.id, book.ISBN)}
            >
              Return Book
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No books issued.</Typography>
      )}
    </Box>
  );
};

export default ReturnBook;
