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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import {
  Search as SearchIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getLocalData } from "../../../services/localStorage";
import { VNPayService } from "../../../services/vnpay.service";
import { getAllBillDetailsForStudent } from "../../../services/billdetail.service";
import * as alertService from "../../../services/alert.service";

const StudentBills = () => {
  // const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const studentId = useSelector(
    (state) => state.auth.studentId || getLocalData("studentId")
  );

  const fetchBills = async () => {
    if (!studentId) {
      console.error("StudentId is missing!");
      return;
    }

    setLoading(true);
    try {
      const res = await getAllBillDetailsForStudent(studentId);
      console.log("Fetched bills: ", res.data);
      setBills(res.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [studentId]);

  useEffect(() => {
    // Parse query parameters from the hash (since HashRouter is used)
    const hash = window.location.hash;
    if (hash.includes("?")) {
      const queryString = hash.split("?")[1];
      const params = new URLSearchParams(queryString);
      const paymentStatus = params.get("paymentStatus");

      if (paymentStatus) {
        if (paymentStatus === "success") {
          alertService.success("Thanh toán hóa đơn thành công!");
        } else {
          alertService.error("Thanh toán thất bại hoặc đã bị hủy.");
        }

        // Clean up parameters from the URL hash to avoid double alerts on page refresh
        const cleanHash = hash.split("?")[0];
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + cleanHash
        );

        // Refresh bills list
        if (studentId) {
          fetchBills();
        }
      }
    }
  }, [studentId]);

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setOpenDialog(true);
  };

  const handlePayment = async (billId) => {
    if (!billId) return;

    setPaymentLoading(true);
    try {
      const response = await VNPayService.createPayment(billId);
      if (response.data?.paymentUrl) {
        // Redirect in the same tab instead of window.open
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBill(null);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: { color: "warning", label: "Chờ thanh toán" },
      PAID: { color: "success", label: "Đã thanh toán" },
      CANCELLED: { color: "error", label: "Đã hủy" },
    };

    const { color, label } = statusMap[status] || {
      color: "default",
      label: status,
    };
    return <Chip label={label} color={color} variant="outlined" />;
  };

  // const filteredBills = bills.filter(
  //   (bill) =>
  //     bill.content?.toLowerCase().includes(searchText.toLowerCase()) ||
  //     bill.id?.toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Danh sách hóa đơn của tôi
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          placeholder="Tìm kiếm hóa đơn..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày thanh toán</TableCell>
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
            ) : bills.length > 0 ? (
              bills
                .filter((bill) => bill.paymentStatus === "PENDING")
                .map((bill) => (
                  <TableRow key={bill.billId}>
                    <TableCell>{bill.billId}</TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(bill.amount)}
                    </TableCell>
                    <TableCell>{getStatusChip(bill.paymentStatus)}</TableCell>
                    <TableCell>
                      {/* Nếu backend sau này trả về createdAt thì render ngày, nếu không thì để mặc định */}
                      {bill.createdAt
                        ? moment(bill.createdAt).format("DD/MM/YYYY HH:mm")
                        : "--"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleViewDetails(bill)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {bill.paymentStatus === "PENDING" && (
                          <IconButton
                            onClick={() => handlePayment(bill.billId)}
                            color="success"
                            disabled={paymentLoading}
                          >
                            <PaymentIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy hóa đơn nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xem chi tiết hóa đơn */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
        <DialogContent>
          {selectedBill ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin hóa đơn
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  <strong>Mã hóa đơn:</strong> {selectedBill.id}
                </Typography>
                <Typography>
                  <strong>Nội dung:</strong> {selectedBill.content}
                </Typography>
                <Typography>
                  <strong>Số tiền:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedBill.amount)}
                </Typography>
                <Typography>
                  <strong>Trạng thái:</strong>{" "}
                  {getStatusChip(selectedBill.paymentStatus)}
                </Typography>
                <Typography>
                  <strong>Ngày tạo:</strong>{" "}
                  {moment(selectedBill.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Box>

              {selectedBill.status === "PENDING" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PaymentIcon />}
                  onClick={() => handlePayment(selectedBill.id)}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Thanh toán qua VNPay"
                  )}
                </Button>
              )}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentBills;
