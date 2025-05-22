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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { getall } from "../../../services/bill.service";
import {
  get as getBillDetail,
  update as updateBillDetail,
} from "../../../services/billdetail.service";
import { getall as getAllParents } from "../../../services/parent.service";
import { getall as getAllStudents } from "../../../services/student.service";
import moment from "moment";
import { debounce } from "lodash";

const ManageBills = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [billDetailData, setBillDetailData] = useState(null);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedBillStatus, setSelectedBillStatus] = useState("");
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

  const billStatusOptions = ["PENDING_PAYMENT", "PAID", "CANCELLED"];

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await getall();
      const bills = res?.data?.rows || [];
      setDataSource(
        bills.map((item) => ({
          id: item.billId || `bill-${item.id}`,
          ...item,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch bills:", error);
      showSnackbar("Lỗi khi tải danh sách hóa đơn!", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetail = async (billId) => {
    setLoading(true);
    try {
      const res = await getBillDetail(billId);
      setBillDetailData(res?.data);
      setSelectedStudentId(res?.data?.studentId || "");
      setSelectedParentId(res?.data?.parentId || "");
      setSelectedBillStatus(res?.data?.paymentStatus || "");
    } catch (error) {
      console.error("Failed to fetch bill detail:", error);
      showSnackbar("Lỗi khi tải chi tiết hóa đơn!", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res?.data?.rows || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      showSnackbar("Lỗi khi tải danh sách học sinh!", "error");
    }
  };

  const fetchParents = async () => {
    try {
      const res = await getAllParents();
      setParents(res?.data?.rows || []);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      showSnackbar("Lỗi khi tải danh sách phụ huynh!", "error");
    }
  };

  const handleEditClick = (record) => {
    setSelectedRowData(record);
    setOpenDialog(true);
    fetchBillDetail(record.id);
  };

  const handleUpdateBillDetail = async () => {
    setLoading(true);
    try {
      await updateBillDetail({
        id: billDetailData?.billId,
        description: billDetailData?.description,
        amount: billDetailData?.amount,
        currency: billDetailData?.currency,
        studentId: selectedStudentId,
        parentId: selectedParentId,
        paymentStatus: selectedBillStatus,
      });
      showSnackbar("Cập nhật hóa đơn thành công!");
      setOpenDialog(false);
      setBillDetailData(null);
      fetchBills();
    } catch (error) {
      console.error("Failed to update bill detail:", error);
      showSnackbar("Lỗi khi cập nhật hóa đơn!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setBillDetailData(null);
    setSelectedStudentId("");
    setSelectedParentId("");
    setSelectedBillStatus("");
  };

  const handleStudentChange = (event) => {
    setSelectedStudentId(event.target.value);
  };

  const handleParentChange = (event) => {
    setSelectedParentId(event.target.value);
  };

  const handleBillStatusChange = (event) => {
    setSelectedBillStatus(event.target.value);
  };

  const getStatusChip = (status) => {
    let color = "default";
    let label = "";

    switch (status) {
      case "PENDING":
        color = "warning";
        label = "Chờ thanh toán";
        break;
      case "PAID":
        color = "success";
        label = "Đã thanh toán";
        break;
      case "CANCELLED":
        color = "error";
        label = "Đã huỷ";
        break;
      default:
        label = status;
    }

    return <Chip label={label} color={color} variant="outlined" />;
  };

  useEffect(() => {
    fetchBills();
    fetchStudents();
    fetchParents();
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
          onChange={(e) => setSearchText(e.target.value)}
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

        {/* <Button variant="contained" startIcon={<AddIcon />} onClick={() => {}}>
          Thêm hoá đơn
        </Button> */}
      </div>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="bills table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Thời gian cập nhật</TableCell>
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
              dataSource.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleEditClick(row)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>
                    {row.createdAt
                      ? moment(row.createdAt).format("HH:mm DD-MM-YY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.updatedAt
                      ? moment(row.updatedAt).format("HH:mm DD-MM-YY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        /* Handle delete */
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
                      color="primary"
                    >
                      <EditIcon />
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

      {/* Bill Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
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
              value={billDetailData?.billId || ""}
              disabled
              fullWidth
              margin="normal"
            />

            <TextField
              label="Nội dung"
              value={billDetailData?.description || ""}
              onChange={(e) =>
                setBillDetailData({
                  ...billDetailData,
                  description: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Số tiền"
              type="number"
              value={billDetailData?.amount || ""}
              onChange={(e) =>
                setBillDetailData({
                  ...billDetailData,
                  amount: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Đơn vị tiền tệ"
              value={billDetailData?.currency || ""}
              onChange={(e) =>
                setBillDetailData({
                  ...billDetailData,
                  currency: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái hóa đơn</InputLabel>
              <Select
                value={selectedBillStatus}
                onChange={handleBillStatusChange}
                label="Trạng thái hóa đơn"
              >
                {billStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === "PENDING_PAYMENT"
                      ? "Chờ thanh toán"
                      : status === "PAID"
                      ? "Đã thanh toán"
                      : status === "CANCELLED"
                      ? "Đã huỷ"
                      : status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Học sinh</InputLabel>
              <Select
                value={selectedStudentId}
                onChange={handleStudentChange}
                label="Học sinh"
                required
              >
                <MenuItem value="" disabled>
                  Chọn học sinh
                </MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Phụ huynh</InputLabel>
              <Select
                value={selectedParentId}
                onChange={handleParentChange}
                label="Phụ huynh"
                required
              >
                <MenuItem value="" disabled>
                  Chọn phụ huynh
                </MenuItem>
                {parents.map((parent) => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateBillDetail}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Lưu"}
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

export default ManageBills;
