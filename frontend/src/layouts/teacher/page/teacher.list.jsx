import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { getClassesByTeacher } from "../../../services/class.service.jsx"; // Import the correct service
import { useSelector } from "react-redux";
import { getLocalData } from "../../../services/localStorage/index.jsx";

const TeacherClasses = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const teacherId = useSelector(
    (state) => state.auth.teacherId || getLocalData("teacherId")
  );

  console.log("teacherid", teacherId);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTeacherClasses = async () => {
    setLoading(true);
    try {
      if (!teacherId) {
        showSnackbar("Teacher ID is not available.", "error");
        return;
      }
      const res = await getClassesByTeacher(teacherId);
      const classesData = res?.data || [];
      setDataSource(
        classesData.map((item, index) => ({
          id: item.classId || `class-${index}`,
          ...item,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch teacher's classes:", error);
      showSnackbar("Failed to load your classes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 300px)",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Table
          stickyHeader
          aria-label="teacher's classes table"
          sx={{ minWidth: 800 }}
        >
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dataSource.length > 0 ? (
              dataSource.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.className}</TableCell>
                  <TableCell>{row.courseName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeacherClasses;
