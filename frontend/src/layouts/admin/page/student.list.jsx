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
  getall as getallStudents,
  deleteStudent,
  create,
  update,
  search,
  upload as uploadExcel,
  getAvailableAccounts,
} from "../../../services/student.service.jsx";
import { debounce } from "lodash";

const ManageStudents = () => {
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
    studentId: null,
    studentName: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    student: null,
    availableAccounts: [],
    loadingAccounts: false,
  });

  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    accountId: "",
    parentId: "",
  });
  const [newStudentErrors, setNewStudentErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchStudents = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    try {
      const res = await getallStudents({ page, size: rowsPerPage });
      const students = res?.data?.rows || [];
      setDataSource(
        students.map((item, index) => ({
          id: item.studentId || `student-${index}`,
          ...item,
        }))
      );
      setPaginationInfo({
        page,
        rowsPerPage,
        total: res?.data?.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch students:", error);
      showSnackbar("Lỗi khi tải danh sách sinh viên", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    fetchStudents(newPage, paginationInfo.rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchStudents(0, rowsPerPage);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({
      open: true,
      studentId: id,
      studentName: name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStudent(deleteDialog.studentId);
      showSnackbar("Xóa sinh viên thành công!");
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa sinh viên thất bại!", "error");
    } finally {
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleEditClick = async (student) => {
    let currentAccountId = "";
    if (student.accountId) {
      if (typeof student.accountId === "object") {
        currentAccountId = student.accountId.accountId || student.accountId.id || "";
      } else {
        currentAccountId = student.accountId;
      }
    }

    try {
      setEditDialog({
        open: true,
        student: {
          ...student,
          accountId: currentAccountId,
        },
        availableAccounts: [],
        loadingAccounts: true,
      });
      const res = await getAvailableAccounts();
      
      let accountsList = res.data || [];
      if (student.accountId && typeof student.accountId === "object") {
        const currentAccId = student.accountId.accountId || student.accountId.id;
        const currentAccUsername = student.accountId.userName || student.accountId.username || "";
        const exists = accountsList.some(acc => acc.id === currentAccId);
        if (!exists && currentAccId) {
          accountsList = [
            { id: currentAccId, username: currentAccUsername },
            ...accountsList
          ];
        }
      }

      setEditDialog((prev) => ({
        ...prev,
        availableAccounts: accountsList,
        loadingAccounts: false,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      showSnackbar("Lỗi khi lấy danh sách tài khoản", "error");
      setEditDialog((prev) => ({ ...prev, loadingAccounts: false }));
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const { student } = editDialog;
      await update(student.id, {
        name: student.name,
        phoneNumber: student.phoneNumber,
        email: student.email,
        accountId: student.accountId,
        parentId: student.parentId || "",
      });
      showSnackbar("Cập nhật sinh viên thành công!");
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
      setEditDialog({ ...editDialog, open: false });
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      showSnackbar("Cập nhật sinh viên thất bại!", "error");
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditDialog((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [field]: value,
      },
    }));
  };

  const handleSearch = async (name) => {
    try {
      const res = await search(name);
      const students = res?.data || [];
      setDataSource(
        students.map((item, index) => ({
          id: item.studentId || `student-${index}`,
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
    if (!validateNewStudentForm()) {
      return;
    }
    try {
      setIsCreating(true);
      await create(newStudentForm);
      showSnackbar("Thêm sinh viên thành công!");
      setNewStudentForm({
        name: "",
        email: "",
        phoneNumber: "",
        accountId: "",
      });
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
      setShowCreateCard(false);
    } catch (error) {
      console.error("Thêm thất bại:", error);
      showSnackbar("Thêm sinh viên thất bại!", "error");
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
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
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

  const handleNewStudentInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudentForm({ ...newStudentForm, [name]: value });
    setNewStudentErrors({ ...newStudentErrors, [name]: "" });
  };

  const validateNewStudentForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newStudentForm.name.trim()) {
      newErrors.name = "Vui lòng nhập tên sinh viên!";
      isValid = false;
    }

    if (!newStudentForm.email.trim()) {
      newErrors.email = "Vui lòng nhập email!";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newStudentForm.email)
    ) {
      newErrors.email = "Email không hợp lệ!";
      isValid = false;
    }

    if (!newStudentForm.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại!";
      isValid = false;
    } else if (!/^\d{10}$/.test(newStudentForm.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ!";
      isValid = false;
    }

    setNewStudentErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    fetchStudents();
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
          {showCreateCard ? "Ẩn Thêm Sinh Viên" : "Thêm Sinh Viên"}
        </Button>
      </div>

      {showCreateCard && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader title="Thêm Sinh Viên Mới" />
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Họ và tên"
                name="name"
                value={newStudentForm.name}
                onChange={handleNewStudentInputChange}
                error={!!newStudentErrors.name}
                helperText={newStudentErrors.name}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={newStudentForm.email}
                onChange={handleNewStudentInputChange}
                error={!!newStudentErrors.email}
                helperText={newStudentErrors.email}
                fullWidth
              />
              <TextField
                label="Số điện thoại"
                name="phoneNumber"
                value={newStudentForm.phoneNumber}
                onChange={handleNewStudentInputChange}
                error={!!newStudentErrors.phoneNumber}
                helperText={newStudentErrors.phoneNumber}
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
        <Table stickyHeader aria-label="student table" sx={{ minWidth: 800 }}>
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
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
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
            Bạn có chắc chắn muốn xóa sinh viên{" "}
            <strong>{deleteDialog.studentName}</strong> (ID:{" "}
            {deleteDialog.studentId}) không?
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
        onClose={() => setEditDialog({ open: false, student: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
        <DialogContent>
          {editDialog.student && (
            <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={editDialog.student.name || ""}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                value={editDialog.student.phoneNumber || ""}
                onChange={(e) =>
                  handleEditInputChange("phoneNumber", e.target.value)
                }
              />
              <TextField
                label="Email"
                fullWidth
                value={editDialog.student.email || ""}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel id="account-select-label">Tài khoản</InputLabel>
                <Select
                  labelId="account-select-label"
                  value={editDialog.student.accountId || ""}
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
          <Button onClick={handleUpdateStudent} color="primary">
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

export default ManageStudents;
