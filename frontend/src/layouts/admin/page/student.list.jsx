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
  Typography,
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
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getall,
  deleteStudent,
  create,
  update,
  search,
  upload as uploadExcel,
} from "../../../services/student.service";
import AddStudentDrawer from "../../../components/drawers";
import { debounce } from "lodash";

const ManageStudents = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchStudents = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    try {
      const res = await getall({ page, size: rowsPerPage });
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

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      showSnackbar("Xóa sinh viên thành công!");
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      showSnackbar("Xóa sinh viên thất bại!", "error");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await update(id);
      showSnackbar("Cập nhật sinh viên thành công!");
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      showSnackbar("Cập nhật sinh viên thất bại!", "error");
    }
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

  const handleCreate = async (values) => {
    try {
      await create(values);
      showSnackbar("Thêm sinh viên thành công!");
      setOpenDrawer(false);
      fetchStudents(paginationInfo.page, paginationInfo.rowsPerPage);
    } catch (error) {
      console.error("Thêm thất bại:", error);
      showSnackbar("Thêm sinh viên thất bại!", "error");
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

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    fetchStudents();
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
          onClick={showDrawer}
          startIcon={<AddIcon />}
        >
          Thêm học sinh
        </Button>
      </div>

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
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dataSource.length > 0 ? (
              dataSource.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleUpdate(row.id)}>
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

export default ManageStudents;
