import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { getAllCoursesSer } from "../../../services/course.service.jsx";
import { getClassesByCourse } from "../../../services/class.service.jsx";
import {
  addStudentToClass as enrollStudentToClass,
  getClassStudentsByStudent,
} from "../../../services/classstudent.service.jsx";
import { useSelector } from "react-redux";
import { getLocalData } from "../../../services/localStorage/index.jsx";

const StudentEnrollment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const studentId = useSelector(
    (state) => state.auth.studentId || getLocalData("studentId")
  );
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [selectedCourseDescription, setSelectedCourseDescription] =
    useState("");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCoursesSer();
      if (res?.data) {
        setCourses(res.data);
      } else {
        setCourses([]);
        showSnackbar("Không có môn học nào để hiển thị.", "warning");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showSnackbar("Lỗi khi tải danh sách môn học", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassesByCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await getClassesByCourse(courseId);
      if (res?.data) {
        setClasses(res.data);
      } else {
        setClasses([]);
        showSnackbar("Không có lớp học nào cho môn học này.", "warning");
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      showSnackbar("Lỗi khi tải danh sách lớp học", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledClasses = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        console.warn("Student ID not available for fetching enrolled classes.");
        setEnrolledClasses([]);
        return;
      }
      const res = await getClassStudentsByStudent(studentId);
      setEnrolledClasses(res.data || []);
    } catch (error) {
      console.error("Failed to fetch enrolled classes", error);
      showSnackbar("Không thể tải các lớp học đã đăng ký", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    setSelectedClassId("");
    setSelectedCourseDescription("");
    if (courseId) {
      const selectedCourse = courses.find((c) => c.courseId === courseId);
      setSelectedCourseDescription(
        selectedCourse ? selectedCourse.description : ""
      );
      fetchClassesByCourse(courseId);
    } else {
      setClasses([]);
    }
  };

  const handleClassChange = (event) => {
    setSelectedClassId(event.target.value);
  };

  const handleEnroll = async () => {
    if (!selectedCourseId || !selectedClassId) {
      showSnackbar("Vui lòng chọn môn học và lớp học", "warning");
      return;
    }
    if (!studentId) {
      showSnackbar("Không thể đăng ký. Không tìm thấy ID sinh viên.", "error");
      return;
    }

    setLoading(true);
    try {
      await enrollStudentToClass({ studentId, classId: selectedClassId });
      showSnackbar("Đăng ký lớp học thành công!", "success");
      setSelectedCourseId("");
      setSelectedClassId("");
      setSelectedCourseDescription("");
      setClasses([]);
      await fetchEnrolledClasses();
    } catch (error) {
      console.error("Failed to enroll:", error);
      const errorMessage =
        error.response?.data?.message || "Đăng ký lớp học thất bại!";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    if (studentId) {
      fetchEnrolledClasses();
    }
  }, [studentId]);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Card sx={{ marginBottom: "20px" }}>
        <CardHeader title="Đăng ký lớp học" />
        <CardContent>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="course-select-label">Chọn môn học</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourseId}
                label="Chọn môn học"
                onChange={handleCourseChange}
              >
                <MenuItem value="">
                  <em>Chọn môn học</em>
                </MenuItem>
                {courses?.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseName} - {course.description}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedCourseId && (
              <Typography variant="body2" color="textSecondary">
                {selectedCourseDescription}
              </Typography>
            )}
            <FormControl fullWidth disabled={!selectedCourseId || loading}>
              <InputLabel id="class-select-label">Chọn lớp học</InputLabel>
              <Select
                labelId="class-select-label"
                id="class-select"
                value={selectedClassId}
                label="Chọn lớp học"
                onChange={handleClassChange}
              >
                <MenuItem value="">
                  <em>Chọn lớp học</em>
                </MenuItem>
                {classes?.map((clazz) => (
                  <MenuItem key={clazz.id} value={clazz.id}>
                    {" "}
                    {clazz.name} - {clazz.description}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </CardContent>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button
            onClick={handleEnroll}
            color="primary"
            disabled={
              loading || !selectedCourseId || !selectedClassId || !studentId
            }
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </CardActions>
      </Card>

      <Card>
        <CardHeader title="Các lớp học đã đăng ký" />
        <CardContent>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          ) : enrolledClasses.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên lớp</TableCell>
                    <TableCell>Môn học</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Thứ</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Giáo viên</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrolledClasses.map((enrollment, index) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{enrollment.name || "N/A"}</TableCell>{" "}
                      <TableCell>{enrollment.className || "N/A"}</TableCell>
                      <TableCell>
                        {enrollment.description || "N/A"}
                      </TableCell>{" "}
                      <TableCell>{enrollment.dayName || "N/A"}</TableCell>
                      <TableCell>
                        {enrollment.timeStart && enrollment.timeEnd
                          ? `${enrollment.timeStart} - ${enrollment.timeEnd}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{enrollment.teacherName || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>Bạn chưa đăng ký lớp học nào.</p>
          )}
        </CardContent>
      </Card>

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

export default StudentEnrollment;
