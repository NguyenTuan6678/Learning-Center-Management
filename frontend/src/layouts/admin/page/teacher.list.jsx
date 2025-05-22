import { useState, useEffect } from "react";

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
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

import {
  getall as getallTeachers,
  deleteTeacher as deleteteacher,
  create,
  update,
  search,
  upload as uploadExcel,
  getAvailableAccounts as getAvailableAccounts,
} from "../../../services/teacher.service.jsx";

import { debounce } from "lodash";

const ManageTeachers = () => {
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,

    rowsPerPage: 10,

    total: 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,

    message: "",

    severity: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,

    teacherId: null,

    teacherName: "",
  });

  const [editDialog, setEditDialog] = useState({
    open: false,

    teacher: null,

    availableAccounts: [],

    loadingAccounts: false,
  });

  const [newteacherForm, setNewteacherForm] = useState({
    teacherName: "",

    email: "",

    phoneNumber: "",

    accountId: "",
  });

  const [newteacherErrors, setNewteacherErrors] = useState({});

  const [isCreating, setIsCreating] = useState(false);

  const [showCreateCard, setShowCreateCard] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTeachers = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);

    try {
      const res = await getallTeachers({ page, size: rowsPerPage });

      const Teachers = res?.data?.rows || [];

      setDataSource(
        Teachers.map((item, index) => ({
          id: item.teacherId || `teacher-${index}`,

          ...item,
        }))
      );

      setPaginationInfo({
        page,

        rowsPerPage,

        total: res?.data?.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch Teachers:", error);

      showSnackbar("Lỗi khi tải danh sách giáo viên", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    fetchTeachers(newPage, paginationInfo.rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);

    fetchTeachers(0, rowsPerPage);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({
      open: true,

      teacherId: id,

      teacherName: name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteteacher(deleteDialog.teacherId);

      showSnackbar("Xóa giáo viên thành công!");

      fetchTeachers(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Xóa thất bại:", error);

      showSnackbar("Xóa giáo viên thất bại!", "error");
    } finally {
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleEditClick = async (teacher) => {
    try {
      setEditDialog({
        open: true,

        teacher,

        availableAccounts: [],

        loadingAccounts: true,
      });

      const res = await getAvailableAccounts();

      setEditDialog((prev) => ({
        ...prev,

        availableAccounts: res.data || [],

        loadingAccounts: false,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);

      showSnackbar("Lỗi khi lấy danh sách tài khoản", "error");

      setEditDialog((prev) => ({ ...prev, loadingAccounts: false }));
    }
  };

  const handleUpdateteacher = async () => {
    try {
      const { teacher } = editDialog;

      await update(teacher.teacherId, {
        teacherName: teacher.teacherName,

        phoneNumber: teacher.phoneNumber,

        email: teacher.email,

        accountId: teacher.accountId,
      });

      showSnackbar("Cập nhật giáo viên thành công!");

      fetchTeachers(paginationInfo.page, paginationInfo.rowsPerPage);

      setEditDialog({ ...editDialog, open: false });
    } catch (error) {
      console.error("Cập nhật thất bại:", error);

      showSnackbar("Cập nhật giáo viên thất bại!", "error");
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditDialog((prev) => ({
      ...prev,

      teacher: {
        ...prev.teacher,

        [field]: value,
      },
    }));
  };

  const handleSearch = async (name) => {
    try {
      const res = await search(name);

      const Teachers = res?.data || [];

      setDataSource(
        Teachers.map((item, index) => ({
          id: item.teacherId || `teacher-${index}`,

          ...item,
        }))
      );
    } catch (error) {
      console.error("Tìm kiếm thất bại:", error);

      showSnackbar("Tìm kiếm thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!validateNewteacherForm()) {
      return;
    }

    try {
      setIsCreating(true);

      await create(newteacherForm);

      showSnackbar("Thêm giáo viên thành công!");

      setNewteacherForm({
        teacherName: "",

        email: "",

        phoneNumber: "",

        accountId: "",
      });

      fetchTeachers(paginationInfo.page, paginationInfo.rowsPerPage);

      setShowCreateCard(false);
    } catch (error) {
      console.error("Thêm thất bại:", error);

      showSnackbar("Thêm giáo viên thất bại!", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const validTypes = [
      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/octet-stream",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/)) {
      showSnackbar("Chỉ chấp nhận file Excel (.xls, .xlsx)", "error");

      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Vui lòng chọn file trước khi tải lên.", "warning");

      return;
    }

    try {
      setLoading(true);

      const response = await uploadExcel(selectedFile);

      console.log("uploadExcel response:", response);

      showSnackbar(response.data.message || "Tải lên thành công");

      fetchTeachers(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        const errorMsg =
          error.response.data?.message || error.response.data?.error;

        showSnackbar(errorMsg || "Upload thất bại", "error");
      } else {
        showSnackbar("Lỗi kết nối đến server", "error");
      }
    } finally {
      setLoading(false);

      setSelectedFile(null);
    }
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;

    setSearchText(value);

    debouncedSearch(value);
  };

  const handleNewteacherInputChange = (e) => {
    const { name, value } = e.target;

    setNewteacherForm({ ...newteacherForm, [name]: value });

    setNewteacherErrors({ ...newteacherErrors, [name]: "" });
  };

  const validateNewteacherForm = () => {
    let isValid = true;

    const newErrors = {};

    if (!newteacherForm.name.trim()) {
      newErrors.teacherName = "Vui lòng nhập tên giáo viên!";

      isValid = false;
    }

    if (!newteacherForm.email.trim()) {
      newErrors.email = "Vui lòng nhập email!";

      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newteacherForm.email)
    ) {
      newErrors.email = "Email không hợp lệ!";

      isValid = false;
    }

    if (!newteacherForm.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại!";

      isValid = false;
    } else if (!/^\d{10}$/.test(newteacherForm.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ!";

      isValid = false;
    }

    setNewteacherErrors(newErrors);

    return isValid;
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

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
          component="label"
          startIcon={<UploadIcon />}
          disabled={loading}
        >
          Chọn file Excel
          <input
            type="file"
            hidden
            accept=".xls,.xlsx"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleFileUpload}
          disabled={!selectedFile || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Thêm từ file .xls
        </Button>

        <Button
          variant="contained"
          onClick={() => setShowCreateCard(!showCreateCard)}
          color="primary"
          startIcon={<AddIcon />}
        >
          {showCreateCard ? "Ẩn Thêm giáo viên" : "Thêm giáo viên"}
        </Button>
      </div>

      {showCreateCard && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader title="Thêm giáo viên Mới" />

          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Họ và tên"
                name="teacherName"
                value={newteacherForm.teacherName}
                onChange={handleNewteacherInputChange}
                error={!!newteacherErrors.teacherName}
                helperText={newteacherErrors.teacherName}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={newteacherForm.email}
                onChange={handleNewteacherInputChange}
                error={!!newteacherErrors.email}
                helperText={newteacherErrors.email}
                fullWidth
              />

              <TextField
                label="Số điện thoại"
                name="phoneNumber"
                value={newteacherForm.phoneNumber}
                onChange={handleNewteacherInputChange}
                error={!!newteacherErrors.phoneNumber}
                helperText={newteacherErrors.phoneNumber}
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
        <Table stickyHeader aria-label="teacher table" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>

              <TableCell>ID</TableCell>

              <TableCell>Họ tên</TableCell>

              <TableCell>Số điện thoại</TableCell>

              <TableCell>Email</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
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

                  <TableCell>{row.teacherId}</TableCell>

                  <TableCell>{row.teacherName}</TableCell>

                  <TableCell>{row.phoneNumber}</TableCell>

                  <TableCell>{row.email}</TableCell>

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
                <TableCell colSpan={6} align="center">
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
            Bạn có chắc chắn muốn xóa giáo viên{" "}
            <strong>{deleteDialog.teacherName}</strong> (ID:{" "}
            {deleteDialog.teacherId}) không?
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
        onClose={() => setEditDialog({ open: false, teacher: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>

        <DialogContent>
          {editDialog.teacher && (
            <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={editDialog.teacher.teacherName || ""}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
              />

              <TextField
                label="Số điện thoại"
                fullWidth
                value={editDialog.teacher.phoneNumber || ""}
                onChange={(e) =>
                  handleEditInputChange("phoneNumber", e.target.value)
                }
              />

              <TextField
                label="Email"
                fullWidth
                value={editDialog.teacher.email || ""}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel id="account-select-label">Tài khoản</InputLabel>

                <Select
                  labelId="account-select-label"
                  value={editDialog.teacher.accountId || ""}
                  onChange={(e) =>
                    handleEditInputChange("accountId", e.target.value)
                  }
                  label="Tài khoản"
                >
                  <MenuItem value="">
                    <em>Không chọn tài khoản</em>
                  </MenuItem>

                  {editDialog.loadingAccounts ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    editDialog.availableAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.username}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setEditDialog({ ...editDialog, open: false })}
            color="secondary"
          >
            Hủy bỏ
          </Button>

          <Button onClick={handleUpdateteacher} color="primary">
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

export default ManageTeachers;
