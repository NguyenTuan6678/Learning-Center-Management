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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getall,
  deleteAccount,
  create,
  update,
  search,
} from "../../../services/account.service";
import AddStudentDrawer from "../../../components/drawers";
import { debounce } from "lodash";

const ManageAccounts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getall();
      const accounts = res?.data?.rows || [];
      setDataSource(
        accounts.map((item, index) => ({
          id: item.accountId || `account-${index}`,
          ...item,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      showSnackbar("Lỗi khi tải danh sách tài khoản", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (record) => {
    setSelectedRowData(record);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRowData(null);
  };

  const handleDelete = async (id, role) => {
    try {
      await deleteAccount(id, role);
      showSnackbar("Xóa tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa tài khoản thất bại!", "error");
    }
  };

  const handleUpdate = async (updatedData) => {
    setLoading(true);
    try {
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

  const handleCreate = async (values) => {
    try {
      await create(values);
      showSnackbar("Thêm tài khoản thành công!");
      setOpenDrawer(false);
      fetchAccounts();
    } catch (error) {
      console.error("Thêm thất bại:", error);
      showSnackbar("Thêm tài khoản thất bại!", "error");
    }
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
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
          variant="contained"
          startIcon={<AddIcon />}
          onClick={showDrawer}
        >
          Thêm tài khoản
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="accounts table">
          <TableHead>
            <TableRow>
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
              dataSource.map((row) => (
                <TableRow key={row.id}>
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
              type="password"
              defaultValue={selectedRowData?.password || ""}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  password: e.target.value,
                })
              }
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

      <AddStudentDrawer
        open={openDrawer}
        onClose={closeDrawer}
        onCreate={handleCreate}
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
