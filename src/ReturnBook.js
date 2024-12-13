// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "./firebase"; // Ensure firebase is properly initialized

// const ReturnBook = () => {
//   const [issuedBooks, setIssuedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchIssuedBooks = async () => {
//       setLoading(true);
//       const user = JSON.parse(localStorage.getItem("user"));
//       // Query to fetch books where the user email matches and the status is "Reading"
//       const q = query(
//         collection(db, "book-issues"),
//         where("email", "==", user.email),
//         where("userStatus", "==", "Reading")
//       );
//       const querySnapshot = await getDocs(q);
//       const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setIssuedBooks(books);
//       setLoading(false);
//     };

//     fetchIssuedBooks();
//   }, []);

//   const handleReturn = async (id, ISBN) => {
//     try {
//       // Update outTime and set userStatus to "Book-Returned"
//       const bookIssueRef = doc(db, "book-issues", id);
//       await updateDoc(bookIssueRef, {
//         outTime: Timestamp.now(),
//         userStatus: "Book-Returned",
//       });

//       // Query the books collection to find the book by ISBN
//       const bookQuery = query(collection(db, "books"), where("ISBN", "==", ISBN));
//       const bookQuerySnapshot = await getDocs(bookQuery);

//       if (!bookQuerySnapshot.empty) {
//         const bookDoc = bookQuerySnapshot.docs[0]; // Get the first matching book document
//         const currentBook = bookDoc.data();
//         const newAvailableCount = Number(currentBook.bookavailable) + 1;

//         // Update the book availability in the books collection
//         await updateDoc(bookDoc.ref, {
//           bookavailable: newAvailableCount,
//         });
//       }

//       // Remove the returned book from the local state
//       setIssuedBooks(issuedBooks.filter((book) => book.id !== id));

//       alert("Book returned successfully!");
//     } catch (err) {
//       console.error("Error returning book:", err);
//       alert("Failed to return book.");
//     }
//   };

//   if (loading) return <Typography>Loading...</Typography>;

//   return (
//     <Box>
//       <Typography variant="h4">Return Issued Books</Typography>
//       {issuedBooks.length > 0 ? (
//         issuedBooks.map((book) => (
//           <Box key={book.id} sx={{ border: "1px solid gray", padding: 2, margin: 2 }}>
//             <Typography>Title: {book.bookTitle}</Typography>
//             <Typography>ISBN: {book.ISBN}</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleReturn(book.id, book.ISBN)}
//             >
//               Return Book
//             </Button>
//           </Box>
//         ))
//       ) : (
//         <Typography>No books issued.</Typography>
//       )}
//     </Box>
//   );
// };

// export default ReturnBook;

// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, TextField } from "@mui/material";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "./firebase"; // Ensure firebase is properly initialized

// const ReturnBook = () => {
//   const [issuedBooks, setIssuedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [usn, setUsn] = useState(""); // State for USN input
//   const [isUsnInputVisible, setIsUsnInputVisible] = useState(false); // Visibility of USN textbox
//   const [selectedBookId, setSelectedBookId] = useState(null); // Store the selected book ID for return

//   useEffect(() => {
//     const fetchIssuedBooks = async () => {
//       setLoading(true);
//       const user = JSON.parse(localStorage.getItem("user"));
//       // Query to fetch books where the user email matches and the status is "Reading"
//       const q = query(
//         collection(db, "book-issues"),
//         where("email", "==", user.email),
//         where("userStatus", "==", "Reading")
//       );
//       const querySnapshot = await getDocs(q);
//       const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setIssuedBooks(books);
//       setLoading(false);
//     };

//     fetchIssuedBooks();
//   }, []);

//   const handleReturnClick = (bookId) => {
//     setSelectedBookId(bookId);
//     setIsUsnInputVisible(true); // Show the USN input box when return button is clicked
//   };

//   const handleReturn = async (id, ISBN) => {
//     try {
//       // Query student database to validate USN
//       const studentQuery = query(collection(db, "students"), where("usn", "==", usn));
//       const studentQuerySnapshot = await getDocs(studentQuery);

//       if (studentQuerySnapshot.empty) {
//         alert("Invalid USN. Please enter the correct USN.");
//         return; // Exit if USN doesn't match
//       }

//       // Update outTime and set userStatus to "Book-Returned"
//       const bookIssueRef = doc(db, "book-issues", id);
//       await updateDoc(bookIssueRef, {
//         outTime: Timestamp.now(),
//         userStatus: "Book-Returned",
//       });

//       // Query the books collection to find the book by ISBN
//       const bookQuery = query(collection(db, "books"), where("ISBN", "==", ISBN));
//       const bookQuerySnapshot = await getDocs(bookQuery);

//       if (!bookQuerySnapshot.empty) {
//         const bookDoc = bookQuerySnapshot.docs[0]; // Get the first matching book document
//         const currentBook = bookDoc.data();
//         const newAvailableCount = Number(currentBook.bookavailable) + 1;

//         // Update the book availability in the books collection
//         await updateDoc(bookDoc.ref, {
//           bookavailable: newAvailableCount,
//         });
//       }

//       // Remove the returned book from the local state
//       setIssuedBooks(issuedBooks.filter((book) => book.id !== id));

//       alert("Book returned successfully!");
//       setIsUsnInputVisible(false); // Hide the USN input box after return
//       setUsn(""); // Clear USN input

//     } catch (err) {
//       console.error("Error returning book:", err);
//       alert("Failed to return book.");
//     }
//   };

//   if (loading) return <Typography>Loading...</Typography>;

//   return (
//     <Box>
//       <Typography variant="h4">Return Issued Books</Typography>
//       {issuedBooks.length > 0 ? (
//         issuedBooks.map((book) => (
//           <Box key={book.id} sx={{ border: "1px solid gray", padding: 2, margin: 2 }}>
//             <Typography>Title: {book.bookTitle}</Typography>
//             <Typography>ISBN: {book.ISBN}</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleReturnClick(book.id)} // Show the USN input box when clicked
//             >
//               Return Book
//             </Button>

//             {isUsnInputVisible && selectedBookId === book.id && (
//               <Box sx={{ marginTop: 2 }}>
//                 <TextField
//                   label="Enter USN"
//                   value={usn}
//                   onChange={(e) => setUsn(e.target.value)}
//                   fullWidth
//                   variant="outlined"
//                   margin="normal"
//                 />
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => handleReturn(book.id, book.ISBN)}
//                   sx={{ marginTop: 2 }}
//                 >
//                   Confirm Return
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         ))
//       ) : (
//         <Typography>No books issued.</Typography>
//       )}
//     </Box>
//   );
// };

// export default ReturnBook;

// *****************************************************************************************************************************************************************************************

// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from "@mui/material";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   updateDoc,
//   doc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "./firebase"; // Ensure firebase is properly initialized

// const ReturnBook = () => {
//   const [issuedBooks, setIssuedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [usn, setUsn] = useState(""); // State for USN input
//   const [isUsnInputVisible, setIsUsnInputVisible] = useState(false); // Visibility of USN textbox
//   const [selectedBooks, setSelectedBooks] = useState([]); // Track selected books for return

//   useEffect(() => {
//     const fetchIssuedBooks = async () => {
//       setLoading(true);
//       const user = JSON.parse(localStorage.getItem("user"));
//       // Query to fetch books where the user email matches and the status is "Reading"
//       const q = query(
//         collection(db, "book-issues"),
//         where("email", "==", user.email),
//         where("userStatus", "==", "Reading")
//       );
//       const querySnapshot = await getDocs(q);
//       const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setIssuedBooks(books);
//       setLoading(false);
//     };

//     fetchIssuedBooks();
//   }, []);

//   const handleCheckboxChange = (event, bookId) => {
//     if (event.target.checked) {
//       setSelectedBooks([...selectedBooks, bookId]);
//     } else {
//       setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
//     }
//   };

//   const handleReturnClick = () => {
//     if (selectedBooks.length === 0) {
//       alert("Please select at least one book to return.");
//       return;
//     }
//     setIsUsnInputVisible(true); // Show the USN input box when return button is clicked
//   };

//   const handleReturn = async () => {
//     try {
//       // Query student database to validate USN
//       const studentQuery = query(collection(db, "students"), where("usn", "==", usn));
//       const studentQuerySnapshot = await getDocs(studentQuery);

//       if (studentQuerySnapshot.empty) {
//         alert("Invalid USN. Please enter the correct USN.");
//         return; // Exit if USN doesn't match
//       }

//       for (const bookId of selectedBooks) {
//         const bookIssueRef = doc(db, "book-issues", bookId);
//         await updateDoc(bookIssueRef, {
//           outTime: Timestamp.now(),
//           userStatus: "Book-Returned",
//         });

//         const bookIssueDoc = await getDoc(bookIssueRef);
//         const ISBN = bookIssueDoc.data().ISBN;

//         // Query the books collection to find the book by ISBN
//         const bookQuery = query(collection(db, "books"), where("ISBN", "==", ISBN));
//         const bookQuerySnapshot = await getDocs(bookQuery);

//         if (!bookQuerySnapshot.empty) {
//           const bookDoc = bookQuerySnapshot.docs[0]; // Get the first matching book document
//           const currentBook = bookDoc.data();
//           const newAvailableCount = Number(currentBook.bookavailable) + 1;

//           // Update the book availability in the books collection
//           await updateDoc(bookDoc.ref, {
//             bookavailable: newAvailableCount,
//           });
//         }
//       }

//       // Refresh the list after returning books
//       setIssuedBooks(issuedBooks.filter((book) => !selectedBooks.includes(book.id)));
//       setSelectedBooks([]); // Reset selected books
//       alert("Books returned successfully!");
//       setIsUsnInputVisible(false); // Hide the USN input box after return
//       setUsn(""); // Clear USN input

//     } catch (err) {
//       console.error("Error returning books:", err);
//       alert("Failed to return books.");
//     }
//   };

//   if (loading) return <Typography>Loading...</Typography>;

//   return (
//     <Box>
//       <Typography variant="h4">Return Issued Books</Typography>

//       {issuedBooks.length > 0 ? (
//         <>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Book</TableCell>
//                 <TableCell>ISBN</TableCell>
//                 <TableCell>Select</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {issuedBooks.map((book) => (
//                 <TableRow key={book.id}>
//                   <TableCell>{book.bookTitle}</TableCell>
//                   <TableCell>{book.ISBN}</TableCell>
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedBooks.includes(book.id)}
//                       onChange={(e) => handleCheckboxChange(e, book.id)}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleReturnClick}
//             sx={{ marginTop: 2 }}
//           >
//             Return Selected Books
//           </Button>

//           {isUsnInputVisible && (
//             <Box sx={{ marginTop: 2 }}>
//               <TextField
//                 label="Enter USN"
//                 value={usn}
//                 onChange={(e) => setUsn(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//               />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleReturn}
//                 sx={{ marginTop: 2 }}
//               >
//                 Confirm Return
//               </Button>
//             </Box>
//           )}
//         </>
//       ) : (
//         <Typography>No books issued.</Typography>
//       )}
//     </Box>
//   );
// };

// export default ReturnBook;

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
  const [usn, setUsn] = useState(""); // State for USN input
  const [isUsnInputVisible, setIsUsnInputVisible] = useState(false); // Visibility of USN textbox
  const [selectedBooks, setSelectedBooks] = useState([]); // Track selected books for return
  const [page, setPage] = useState(0); // Page number for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      // Query to fetch books where the user email matches and the status is "Reading"
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

  //   const handleReturnClick = () => {
  //     if (selectedBooks.length === 0) {
  //       alert("Please select at least one book to return.");
  //       return;
  //     }
  //     setIsUsnInputVisible(true);
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //     // Show the USN input box when return button is clicked
  //   };
  const handleReturnClick = () => {
    if (selectedBooks.length === 0) {
      alert("Please select at least one book to return.");
      return;
    }
    setIsUsnInputVisible(true);

    // Check if inputRef.current is not null before calling focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReturn = async () => {
    try {
      // Query student database to validate USN
      const studentQuery = query(
        collection(db, "students"),
        where("usn", "==", usn)
      );
      const studentQuerySnapshot = await getDocs(studentQuery);

      if (studentQuerySnapshot.empty) {
        alert("Invalid USN. Please enter the correct USN.");
        return; // Exit if USN doesn't match
      }

      for (const bookId of selectedBooks) {
        const bookIssueRef = doc(db, "book-issues", bookId);
        await updateDoc(bookIssueRef, {
          outTime: Timestamp.now(),
          userStatus: "Book-Returned",
        });

        const bookIssueDoc = await getDoc(bookIssueRef);
        const ISBN = bookIssueDoc.data().ISBN;

        // Query the books collection to find the book by ISBN
        const bookQuery = query(
          collection(db, "books"),
          where("ISBN", "==", ISBN)
        );
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
      }

      // Refresh the list after returning books
      setIssuedBooks(
        issuedBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]); // Reset selected books
      alert("Books returned successfully!");
      setIsUsnInputVisible(false); // Hide the USN input box after return
      setUsn(""); // Clear USN input
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
    setPage(0); // Reset to the first page when rows per page is changed
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

          {isUsnInputVisible && (
            <Box sx={{ marginTop: 2 }}>
              <TextField
                inputRef={inputRef}
                label="Enter USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleReturn}
                sx={{ marginTop: 2 }}
              >
                Confirm Return
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
