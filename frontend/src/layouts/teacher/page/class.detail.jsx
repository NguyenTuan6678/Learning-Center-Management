// src/components/class_details/ClassDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams và useNavigate
import {
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { getClassById } from "../../../services/class.service";
// import { getClassById } from "../../services/class.service.jsx"; // Import API lấy chi tiết lớp học

const ClassDetail = () => {
  const { classId } = useParams(); // Lấy classId từ URL
  const navigate = useNavigate(); // Để quay lại trang trước

  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        const res = await getClassById(classId);
        setClassDetail(res?.data); // res.data sẽ là ClassDTO
      } catch (error) {
        console.error("Failed to fetch class details:", error);
        showSnackbar("Không thể tải chi tiết lớp học.");
        setClassDetail(null); // Đặt null nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassDetails();
    } else {
      setLoading(false);
      showSnackbar("Không tìm thấy ID lớp học.");
    }
  }, [classId]); // Fetch lại khi classId thay đổi

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" style={{ marginLeft: "10px" }}>
          Đang tải chi tiết lớp học...
        </Typography>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div style={{ padding: "20px" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // Quay lại trang trước
          sx={{ marginBottom: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h5" color="error">
          Không tìm thấy thông tin lớp học.
        </Typography>
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
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} // Quay lại trang trước
        sx={{ marginBottom: 2 }}
      >
        Quay lại
      </Button>

      <Typography variant="h4" gutterBottom>
        Chi tiết lớp học: {classDetail.name}
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Thông tin cơ bản:</Typography>
          <Typography>
            <strong>ID Lớp:</strong> {classDetail.id}
          </Typography>
          <Typography>
            <strong>Tên Lớp:</strong> {classDetail.name}
          </Typography>
          <Typography>
            <strong>Mô tả:</strong> {classDetail.description || "N/A"}
          </Typography>
          <Typography>
            <strong>Môn học:</strong> {classDetail.courseName || "N/A"}
          </Typography>
          <Typography>
            <strong>Giáo viên:</strong> {classDetail.teacherName || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Thời gian & Lịch trình:</Typography>
          <Typography>
            <strong>Ngày học:</strong> {classDetail.dayName || "N/A"}
          </Typography>
          <Typography>
            <strong>Thời gian:</strong> {classDetail.timeStart || "N/A"} -{" "}
            {classDetail.timeEnd || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Danh sách học sinh
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID Học sinh</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Tài khoản</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classDetail.students && classDetail.students.length > 0 ? (
              classDetail.students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.username || "N/A"}</TableCell>{" "}
                  {/* Hiển thị username */}
                  <TableCell>{student.email || "N/A"}</TableCell>
                  <TableCell>{student.phoneNumber || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Chưa có học sinh nào trong lớp này.
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

export default ClassDetail;
