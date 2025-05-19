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
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  getAllClasses,
  deleteClass,
  createClass,
  searchClassByName,
  getClassesByCourse,
  getClassesByTeacher,
} from "../../../services/class.service.jsx"; // Updated import path
import { getAllCourses } from "../../../services/course.service.jsx";
import { getAllTeacherSer as getAllTeachers } from "../../../services/teacher.service.jsx";
import { getAllDays } from "../../../services/day.service.jsx";
import { getAllTimes } from "../../../services/time.service.jsx";
import { debounce } from "lodash";

const ManageClasses = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    classId: null,
    name: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    clazz: null,
    courses: [],
    teachers: [],
    days: [],
    times: [],
  });

  const [newClassForm, setNewClassForm] = useState({
    name: "",
    description: "",
    courseId: "",
    teacherId: "",
    dayId: "",
    timeId: "",
  });
  const [newClassErrors, setNewClassErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [filter, setFilter] = useState({ type: "all", value: "" });
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchClasses = async (
    page = 0,
    rowsPerPage = 10,
    searchName = "",
    courseId = "",
    teacherId = ""
  ) => {
    setLoading(true);
    try {
      let res;
      if (searchName) {
        res = await searchClassByName(searchName);
      } else if (courseId) {
        res = await getClassesByCourse(courseId);
      } else if (teacherId) {
        res = await getClassesByTeacher(teacherId);
      } else {
        res = await getAllClasses({ page, size: rowsPerPage });
      }

      const classes = res?.data?.rows || [];
      setDataSource(
        classes.map((item, index) => ({
          id: item.classId || `class-${index}`, // Corrected to classId
          ...item,
          courseName: item.courseName || "N/A",
          teacherName: item.teacherName || "N/A",
          dayName: item.dayName || "N/A",
          timeStart: item.timeStart || "N/A",
          timeEnd: item.timeEnd || "N/A",
        }))
      );
      setPaginationInfo({
        page,
        rowsPerPage,
        total: res?.data?.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      showSnackbar("Lỗi khi tải danh sách lớp học", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    fetchClasses(newPage, paginationInfo.rowsPerPage, searchText);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchClasses(0, rowsPerPage, searchText);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({
      open: true,
      classId: id,
      name: name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClass(deleteDialog.classId);
      showSnackbar("Xóa lớp học thành công!");
      fetchClasses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa lớp học thất bại!", "error");
    } finally {
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleEditClick = async (clazz) => {
    setLoading(true);
    try {
      const coursesData = await getAllCourses();
      const teachersData = await getAllTeachers();
      const daysData = await getAllDays();
      const timesData = await getAllTimes();
      setCourses(coursesData.data.rows);
      setTeachers(teachersData.data.rows);
      setDays(daysData.data.rows);
      setTimes(timesData.data.rows);

      setEditDialog({
        open: true,
        clazz: { ...clazz },
        courses: coursesData.data.rows,
        teachers: teachersData.data.rows,
        days: daysData.data.rows,
        times: timesData.data.rows,
      });
    } catch (err) {
      console.error("Error", err);
      showSnackbar("Failed to load courses or teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async () => {
    try {
      setLoading(true);
      const { courseId, teacherId, dayId, timeId, ...rest } = editDialog.clazz;
      await updateClass(editDialog.clazz.classId, {
        // Corrected to classId
        ...rest,
        courseId: courseId,
        teacherId: teacherId,
        dayId: dayId,
        timeId: timeId,
      });
      showSnackbar("Cập nhật lớp học thành công!");
      fetchClasses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
      setEditDialog({
        open: false,
        clazz: null,
        courses: [],
        teachers: [],
        days: [],
        times: [],
      });
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      showSnackbar("Cập nhật lớp học thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditDialog((prev) => ({
      ...prev,
      clazz: {
        ...prev.clazz,
        [field]: value,
      },
    }));
  };

  const handleSearch = (name) => {
    setSearchText(name);
    fetchClasses(0, paginationInfo.rowsPerPage, name);
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleCreate = async () => {
    if (!validateNewClassForm()) {
      return;
    }
    try {
      setIsCreating(true);
      const { courseId, teacherId, dayId, timeId, ...rest } = newClassForm;
      await createClass({
        ...rest,
        courseId,
        teacherId,
        dayId,
        timeId,
      });
      showSnackbar("Thêm lớp học thành công!");
      setNewClassForm({
        name: "",
        description: "",
        courseId: "",
        teacherId: "",
        dayId: "",
        timeId: "",
      });
      fetchClasses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
      setShowCreateCard(false);
    } catch (error) {
      console.error("Thêm thất bại:", error);
      showSnackbar("Thêm lớp học thất bại!", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewClassInputChange = (e) => {
    const { name, value } = e.target;
    setNewClassForm({ ...newClassForm, [name]: value });
    setNewClassErrors({ ...newClassErrors, [name]: "" });
  };

  const validateNewClassForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newClassForm.name.trim()) {
      newErrors.name = "Vui lòng nhập tên lớp học!";
      isValid = false;
    }
    if (!newClassForm.courseId) {
      newErrors.courseId = "Vui lòng chọn môn học!";
      isValid = false;
    }

    if (!newClassForm.teacherId) {
      newErrors.teacherId = "Vui lòng chọn giáo viên!";
      isValid = false;
    }
    if (!newClassForm.dayId) {
      newErrors.dayId = "Vui lòng chọn ngày học!";
      isValid = false;
    }
    if (!newClassForm.timeId) {
      newErrors.timeId = "Vui lòng chọn giờ học!";
      isValid = false;
    }

    setNewClassErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const coursesData = await getAllCourses();
        const teachersData = await getAllTeachers();
        const daysData = await getAllDays();
        const timesData = await getAllTimes();
        setCourses(coursesData.data.rows);
        setTeachers(teachersData.data.rows);
        setDays(daysData.data.rows);
        setTimes(timesData.data.rows);
        fetchClasses();
      } catch (error) {
        console.error("Failed to load initial data", error);
        showSnackbar("Failed to load initial data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchClasses(0, paginationInfo.rowsPerPage, searchText);
  }, [paginationInfo.page, paginationInfo.rowsPerPage, searchText]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    const loadFilteredData = async () => {
      setLoading(true);
      try {
        if (filter.type === "course" && filter.value) {
          await fetchClasses(
            0,
            paginationInfo.rowsPerPage,
            "",
            filter.value,
            ""
          );
        } else if (filter.type === "teacher" && filter.value) {
          await fetchClasses(
            0,
            paginationInfo.rowsPerPage,
            "",
            "",
            filter.value
          );
        } else {
          await fetchClasses(0, paginationInfo.rowsPerPage, searchText);
        }
      } catch (error) {
        console.error("Failed to load filtered data", error);
        showSnackbar("Failed to load filtered data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadFilteredData();
  }, [filter, searchText, paginationInfo.rowsPerPage]);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Tìm kiếm theo tên lớp"
          value={searchText}
          onChange={handleSearchInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          style={{ width: 250 }}
        />
        <FormControl variant="outlined" size="small" style={{ minWidth: 180 }}>
          <InputLabel id="filter-type-label">Lọc theo</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            name="type"
            value={filter.type}
            label="Lọc theo"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="course">Môn học</MenuItem>
            <MenuItem value="teacher">Giáo viên</MenuItem>
          </Select>
        </FormControl>
        {filter.type === "course" && (
          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 180 }}
          >
            <InputLabel id="filter-course-label">Chọn môn học</InputLabel>
            <Select
              labelId="filter-course-label"
              id="filter-course"
              name="value"
              value={filter.value}
              label="Chọn môn học"
              onChange={handleFilterChange}
            >
              {loading ? (
                <MenuItem>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                courses?.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}
        {filter.type === "teacher" && (
          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 180 }}
          >
            <InputLabel id="filter-teacher-label">Chọn giáo viên</InputLabel>
            <Select
              labelId="filter-teacher-label"
              id="filter-teacher"
              name="value"
              value={filter.value}
              label="Chọn giáo viên"
              onChange={handleFilterChange}
            >
              {loading ? (
                <MenuItem>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                teachers?.map((teacher) => (
                  <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.teacherName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          onClick={() => setShowCreateCard(!showCreateCard)}
          color="primary"
          startIcon={<AddIcon />}
        >
          {showCreateCard ? "Ẩn Thêm Lớp Học" : "Thêm Lớp Học"}
        </Button>
      </div>
      {showCreateCard && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader title="Thêm Lớp Học Mới" />
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Tên lớp học"
                name="name"
                value={newClassForm.name}
                onChange={handleNewClassInputChange}
                error={!!newClassErrors.name}
                helperText={newClassErrors.name}
                fullWidth
              />
              <TextField
                label="Mô tả"
                name="description"
                value={newClassForm.description}
                onChange={handleNewClassInputChange}
                fullWidth
              />
              <FormControl fullWidth error={!!newClassErrors.courseId}>
                <InputLabel id="course-label">Môn học</InputLabel>
                <Select
                  labelId="course-label"
                  id="courseId"
                  name="courseId"
                  value={newClassForm.courseId}
                  label="Môn học"
                  onChange={handleNewClassInputChange}
                >
                  {loading ? (
                    <MenuItem>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    courses?.map((course) => (
                      <MenuItem key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {newClassErrors.courseId && (
                  <FormHelperText>{newClassErrors.courseId}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={!!newClassErrors.teacherId}>
                <InputLabel id="teacher-label">Giáo viên</InputLabel>
                <Select
                  labelId="teacher-label"
                  id="teacherId"
                  name="teacherId"
                  value={newClassForm.teacherId}
                  label="Giáo viên"
                  onChange={handleNewClassInputChange}
                >
                  {loading ? (
                    <MenuItem>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    teachers?.map((teacher) => (
                      <MenuItem
                        key={teacher.teacherId}
                        value={teacher.teacherId}
                      >
                        {teacher.teacherName}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {newClassErrors.teacherId && (
                  <FormHelperText>{newClassErrors.teacherId}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={!!newClassErrors.dayId}>
                <InputLabel id="day-label">Ngày học</InputLabel>
                <Select
                  labelId="day-label"
                  id="dayId"
                  name="dayId"
                  value={newClassForm.dayId}
                  label="Ngày học"
                  onChange={handleNewClassInputChange}
                >
                  {loading ? (
                    <MenuItem>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    days?.map((day) => (
                      <MenuItem key={day.dayId} value={day.dayId}>
                        {day.day}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {newClassErrors.dayId && (
                  <FormHelperText>{newClassErrors.dayId}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={!!newClassErrors.timeId}>
                <InputLabel id="time-label">Giờ học</InputLabel>
                <Select
                  labelId="time-label"
                  id="timeId"
                  name="timeId"
                  value={newClassForm.timeId}
                  label="Giờ học"
                  onChange={handleNewClassInputChange}
                >
                  {loading ? (
                    <MenuItem>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    times?.map((time) => (
                      <MenuItem key={time.timeId} value={time.timeId}>
                        {time.timeStart} - {time.timeEnd}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {newClassErrors.timeId && (
                  <FormHelperText>{newClassErrors.timeId}</FormHelperText>
                )}
              </FormControl>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: "flex-end" }}>
            <Button
              onClick={handleCreate}
              color="primary"
              disabled={isCreating}
              startIcon={
                isCreating ? <CircularProgress size={20} /> : <AddIcon />
              }
            >
              {isCreating ? "Đang thêm..." : "Thêm"}
            </Button>
          </CardActions>
        </Card>
      )}

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
        <Table stickyHeader aria-label="class table" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Tên lớp</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Giáo viên</TableCell>
              <TableCell>Ngày học</TableCell>
              <TableCell>Giờ học</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dataSource.length > 0 ? (
              dataSource.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {index +
                      1 +
                      paginationInfo.page * paginationInfo.rowsPerPage}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.courseName}</TableCell>
                  <TableCell>{row.teacherName}</TableCell>
                  <TableCell>{row.dayName}</TableCell>
                  <TableCell>
                    {row.timeStart} - {row.timeEnd}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteClick(row.id, row.name)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(row)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={paginationInfo.total}
        rowsPerPage={paginationInfo.rowsPerPage}
        page={paginationInfo.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa lớp học{" "}
            <strong>{deleteDialog.name}</strong> (ID: {deleteDialog.classId})
            không?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Hủy bỏ</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() =>
          setEditDialog({
            open: false,
            clazz: null,
            courses: [],
            teachers: [],
            days: [],
            times: [],
          })
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin lớp học</DialogTitle>
        <DialogContent>
          {editDialog.clazz && (
            <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
              <TextField
                label="Tên lớp học"
                fullWidth
                value={editDialog.clazz.name || ""}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
              />
              <TextField
                label="Mô tả"
                fullWidth
                value={editDialog.clazz.description || ""}
                onChange={(e) =>
                  handleEditInputChange("description", e.target.value)
                }
              />
              <FormControl fullWidth>
                <InputLabel id="edit-course-label">Môn học</InputLabel>
                <Select
                  labelId="edit-course-label"
                  id="courseId"
                  name="courseId"
                  value={editDialog.clazz.courseId || ""}
                  label="Môn học"
                  onChange={(e) =>
                    handleEditInputChange("courseId", e.target.value)
                  }
                >
                  {courses?.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="edit-teacher-label">Giáo viên</InputLabel>
                <Select
                  labelId="edit-teacher-label"
                  id="teacherId"
                  name="teacherId"
                  value={editDialog.clazz.teacherId || ""}
                  label="Giáo viên"
                  onChange={(e) =>
                    handleEditInputChange("teacherId", e.target.value)
                  }
                >
                  {teachers?.map((teacher) => (
                    <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.teacherName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="edit-day-label">Ngày học</InputLabel>
                <Select
                  labelId="edit-day-label"
                  id="dayId"
                  name="dayId"
                  value={editDialog.clazz.dayId || ""}
                  label="Ngày học"
                  onChange={(e) =>
                    handleEditInputChange("dayId", e.target.value)
                  }
                >
                  {days?.map((day) => (
                    <MenuItem key={day.dayId} value={day.dayId}>
                      {day.day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="edit-time-label">Giờ học</InputLabel>
                <Select
                  labelId="edit-time-label"
                  id="timeId"
                  name="timeId"
                  value={editDialog.clazz.timeId || ""}
                  label="Giờ học"
                  onChange={(e) =>
                    handleEditInputChange("timeId", e.target.value)
                  }
                >
                  {times?.map((time) => (
                    <MenuItem key={time.timeId} value={time.timeId}>
                      {time.timeStart} - {time.timeEnd}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditDialog({
                open: false,
                clazz: null,
                courses: [],
                teachers: [],
                days: [],
                times: [],
              })
            }
            color="secondary"
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleUpdateClass} color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

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

export default ManageClasses;
