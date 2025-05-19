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
  TablePagination,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  DialogContentText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility,
  VisibilityOff,
  Warning as WarningIcon, // Thêm icon cảnh báo
} from "@mui/icons-material";
import {
  getall,
  deleteAccount,
  create,
  update,
  search,
} from "../../../services/account.service";
import { debounce } from "lodash";

const ManageAccounts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0,
  });

  const [newAccountForm, setNewAccountForm] = useState({
    username: "",
    password: "",
    role: "STUDENT",
  });
  const [newAccountErrors, setNewAccountErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false); // Track creation state
  const [showCreateCard, setShowCreateCard] = useState(false); // State để hiển thị/ẩn thẻ tạo tài khoản
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    // State cho dialog xác nhận xóa
    open: false,
    id: null,
    role: null,
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAccounts = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    try {
      const res = await getall({ page, size: rowsPerPage });
      const accounts = res?.data?.rows || [];
      setDataSource(
        accounts.map((item, index) => ({
          id: item.accountId || `account-${index}`,
          ...item,
        }))
      );
      setPaginationInfo({
        page,
        rowsPerPage,
        total: res?.data?.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      showSnackbar("Lỗi khi tải danh sách tài khoản", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    fetchAccounts(newPage, paginationInfo.rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchAccounts(0, rowsPerPage);
  };

  const handleEditClick = (record) => {
    if (record.role === "ADMIN") {
      showSnackbar("Không được phép chỉnh sửa tài khoản ADMIN.", "error");
      return;
    }
    setSelectedRowData(record);
    setOpenDialog(true);
    setShowPassword(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRowData(null);
  };

  const handleDelete = (id, role) => {
    if (role === "ADMIN") {
      showSnackbar("Không được phép xóa tài khoản ADMIN.", "error");
      return;
    }
    setDeleteConfirmation({ open: true, id, role }); // Mở dialog xác nhận
  };

  const confirmDelete = async () => {
    // Hàm này được gọi khi người dùng xác nhận xóa trong dialog
    try {
      await deleteAccount(deleteConfirmation.id, deleteConfirmation.role);
      showSnackbar("Xóa tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa tài khoản thất bại!", "error");
    } finally {
      setDeleteConfirmation({ open: false, id: null, role: null }); // Đóng dialog
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null, role: null }); // Đóng dialog
  };

  const handleUpdate = async (updatedData) => {
    setLoading(true);
    try {
      if (updatedData.role === "ADMIN") {
        showSnackbar("Không được phép cập nhật vai trò thành ADMIN.", "error");
        return;
      }
      await update({
        id: updatedData.id,
        username: updatedData.username,
        password: updatedData.password,
        role: updatedData.role,
      });
      showSnackbar("Cập nhật tài khoản thành công!");
      fetchAccounts();
      setOpenDialog(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      showSnackbar("Cập nhật tài khoản thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (name) => {
    try {
      const res = await search(name);
      const accounts = res?.data || [];
      setDataSource(
        accounts.map((item, index) => ({
          id: item.accountId || `account-${index}`,
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

  const debouncedSearch = debounce(handleSearch, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleNewAccountInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountForm({ ...newAccountForm, [name]: value });
    setNewAccountErrors({ ...newAccountErrors, [name]: "" }); // Clear errors
  };

  const validateNewAccountForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newAccountForm.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập!";
      isValid = false;
    } else if (newAccountForm.username.includes(" ")) {
      newErrors.username = "Tên đăng nhập không được chứa khoảng trắng";
      isValid = false;
    }

    if (!newAccountForm.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
      isValid = false;
    } else if (newAccountForm.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
      isValid = false;
    }

    setNewAccountErrors(newErrors);
    return isValid;
  };

  const handleCreateAccount = async () => {
    if (!validateNewAccountForm()) {
      return;
    }

    try {
      if (newAccountForm.role === "ADMIN") {
        showSnackbar(
          "Không được phép tạo tài khoản ADMIN từ giao diện này.",
          "error"
        );
        return;
      }
      setIsCreating(true);
      await create(newAccountForm);
      showSnackbar("Tạo tài khoản thành công!", "success");
      setNewAccountForm({ username: "", password: "", role: "STUDENT" }); // Reset
      fetchAccounts(); // Refresh the table
      setShowCreateCard(false); // Ẩn thẻ sau khi tạo thành công
    } catch (error) {
      console.error("Failed to create account:", error);
      showSnackbar("Tạo tài khoản thất bại!", "error");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Đẩy nút sang bên phải
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <TextField
          placeholder="Tìm kiếm tài khoản"
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
          onClick={() => setShowCreateCard(!showCreateCard)} // Toggle hiển thị thẻ
          color="primary"
          startIcon={<AddIcon />}
        >
          {showCreateCard ? "Ẩn Thêm Tài Khoản" : "Thêm Tài Khoản"}
        </Button>
      </div>
      {showCreateCard && ( // Chỉ hiển thị thẻ khi showCreateCard là true
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader title="Thêm Tài Khoản Mới" />
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Tên đăng nhập"
                name="username"
                value={newAccountForm.username}
                onChange={handleNewAccountInputChange}
                error={!!newAccountErrors.username}
                helperText={newAccountErrors.username}
                fullWidth
              />
              <TextField
                label="Mật khẩu"
                type="password"
                name="password"
                value={newAccountForm.password}
                onChange={handleNewAccountInputChange}
                error={!!newAccountErrors.password}
                helperText={newAccountErrors.password}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Vai trò</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role"
                  value={newAccountForm.role}
                  onChange={handleNewAccountInputChange}
                  label="Vai trò"
                >
                  <MenuItem value="STUDENT">Sinh viên</MenuItem>
                  <MenuItem value="TEACHER">Giáo viên</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: "flex-end" }}>
            <Button
              onClick={handleCreateAccount}
              color="primary"
              disabled={isCreating}
              startIcon={
                isCreating ? <CircularProgress size={20} /> : <AddIcon />
              }
            >
              {isCreating ? "Đang tạo..." : "Thêm"}
            </Button>
          </CardActions>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="accounts table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Mật khẩu</TableCell>
              <TableCell>Vai trò</TableCell>
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
                <TableRow key={row.id}>
                  <TableCell>
                    {index +
                      1 +
                      paginationInfo.page * paginationInfo.rowsPerPage}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>••••••••</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDelete(row.id, row.role)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditClick(row)}
                      color="primary"
                    >
                      <EditIcon />
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

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật tài khoản</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: "16px",
            }}
          >
            <TextField
              label="ID"
              value={selectedRowData?.id || ""}
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tên đăng nhập"
              defaultValue={selectedRowData?.username || ""}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  username: e.target.value,
                })
              }
            />
            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              defaultValue={selectedRowData?.password || ""}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  password: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Vai trò"
              defaultValue={selectedRowData?.role || ""}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  role: e.target.value,
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={() => handleUpdate(selectedRowData)}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <WarningIcon color="warning" />
            <span>Xác nhận xóa</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa tài khoản này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="secondary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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

export default ManageAccounts;
