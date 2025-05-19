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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  getAllCourses,
  deleteCourse,
  createCourse,
  searchCourses,
} from "../../../services/course.service";
import { getClassesByCourse } from "../../../services/class.service";
import { debounce } from "lodash";

const ManageCourses = () => {
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
    courseId: null,
    courseName: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    course: null,
  });

  const [newCourseForm, setNewCourseForm] = useState({
    name: "",
    description: "",
  });
  const [newCourseErrors, setNewCourseErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [selectedCourseClasses, setSelectedCourseClasses] = useState([]);
  const [classesDialog, setClassesDialog] = useState({
    open: false,
    courseName: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCourses = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    try {
      const res = await getAllCourses({ page, size: rowsPerPage });
      const courses = res?.data?.rows || [];
      setDataSource(
        courses.map((item, index) => ({
          id: item.courseId || `course-${index}`,
          ...item,
        }))
      );
      setPaginationInfo({
        page,
        rowsPerPage,
        total: res?.data?.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showSnackbar("Lỗi khi tải danh sách môn học", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    fetchCourses(newPage, paginationInfo.rowsPerPage, searchText);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchCourses(0, rowsPerPage, searchText);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({
      open: true,
      courseId: id,
      courseName: name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCourse(deleteDialog.courseId);
      showSnackbar("Xóa môn học thành công!");
      fetchCourses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa môn học thất bại!", "error");
    } finally {
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleEditClick = (course) => {
    setEditDialog({
      open: true,
      course: { ...course },
    });
  };

  const handleUpdateCourse = async () => {
    try {
      setLoading(true);
      await updateCourse(editDialog.course.id, editDialog.course);
      showSnackbar("Cập nhật môn học thành công!");
      fetchCourses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
      setEditDialog({ open: false, course: null });
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      showSnackbar("Cập nhật môn học thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditDialog((prev) => ({
      ...prev,
      course: {
        ...prev.course,
        [field]: value,
      },
    }));
  };

  const handleSearch = (name) => {
    setSearchText(name);
    fetchCourses(0, paginationInfo.rowsPerPage, name);
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleCreate = async () => {
    if (!validateNewCourseForm()) {
      return;
    }
    try {
      setIsCreating(true);
      await createCourse(newCourseForm);
      showSnackbar("Thêm môn học thành công!");
      setNewCourseForm({ name: "", description: "" });
      fetchCourses(paginationInfo.page, paginationInfo.rowsPerPage, searchText);
      setShowCreateCard(false);
    } catch (error) {
      console.error("Thêm thất bại:", error);
      showSnackbar("Thêm môn học thất bại!", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewCourseInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourseForm({ ...newCourseForm, [name]: value });
    setNewCourseErrors({ ...newCourseErrors, [name]: "" });
  };

  const validateNewCourseForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newCourseForm.name.trim()) {
      newErrors.name = "Vui lòng nhập tên môn học!";
      isValid = false;
    }

    setNewCourseErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseRowClick = async (courseId, courseName) => {
    setLoading(true);
    try {
      const classesData = await getClassesByCourse(courseId);
      setSelectedCourseClasses(classesData.data);
      setClassesDialog({ open: true, courseName: courseName });
    } catch (error) {
      console.error("Failed to fetch classes for course:", error);
      showSnackbar("Lỗi khi tải danh sách lớp học", "error");
    } finally {
      setLoading(false);
    }
  };

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
          placeholder="Tìm kiếm"
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

        <Button
          variant="contained"
          onClick={() => setShowCreateCard(!showCreateCard)}
          color="primary"
          startIcon={<AddIcon />}
        >
          {showCreateCard ? "Ẩn Thêm Môn Học" : "Thêm Môn Học"}
        </Button>
      </div>
      {showCreateCard && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader title="Thêm Môn Học Mới" />
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Tên môn học"
                name="name"
                value={newCourseForm.name}
                onChange={handleNewCourseInputChange}
                error={!!newCourseErrors.name}
                helperText={newCourseErrors.name}
                fullWidth
              />
              <TextField
                label="Mô tả"
                name="description"
                value={newCourseForm.description}
                onChange={handleNewCourseInputChange}
                fullWidth
              />
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
        <Table stickyHeader aria-label="course table" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Tên môn học</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
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
                <TableRow
                  key={row.id}
                  onClick={() => handleCourseRowClick(row.id, row.name)}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  <TableCell>
                    {index +
                      1 +
                      paginationInfo.page * paginationInfo.rowsPerPage}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn click lan rộng lên TableRow
                        handleDeleteClick(row.id, row.name);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(row);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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

      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa môn học{" "}
            <strong>{deleteDialog.courseName}</strong> (ID:{" "}
            {deleteDialog.courseId}) không?
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

      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, course: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin môn học</DialogTitle>
        <DialogContent>
          {editDialog.course && (
            <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
              <TextField
                label="Tên môn học"
                fullWidth
                value={editDialog.course.name || ""}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
                error={!!newCourseErrors.name}
                helperText={newCourseErrors.name}
              />
              <TextField
                label="Mô tả"
                fullWidth
                value={editDialog.course.description || ""}
                onChange={(e) =>
                  handleEditInputChange("description", e.target.value)
                }
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog({ open: false, course: null })}
            color="secondary"
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleUpdateCourse} color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={classesDialog.open}
        onClose={() => setClassesDialog({ open: false, courseName: "" })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Các lớp học của môn học {classesDialog.courseName}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress />
            </div>
          ) : selectedCourseClasses.length > 0 ? (
            <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Tên lớp</TableCell>
                    <TableCell>Giáo viên</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCourseClasses.map((clazz, index) => (
                    <TableRow key={clazz.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{clazz.id}</TableCell>
                      <TableCell>{clazz.name}</TableCell>
                      <TableCell>{clazz.teacherName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <DialogContentText>
              Không có lớp học nào cho môn học này.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClassesDialog({ open: false, courseName: "" })}
            color="primary"
          >
            Đóng
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

export default ManageCourses;
