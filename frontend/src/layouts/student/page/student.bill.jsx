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
  useTheme,
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
      PENDING: { bg: "rgba(249, 115, 22, 0.1)", color: "#f97316", label: "Chờ thanh toán" },
      PAID: { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", label: "Đã thanh toán" },
      CANCELLED: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", label: "Đã hủy" },
    };
    const item = statusMap[status] || { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b", label: status };
    return (
      <Chip
        label={item.label}
        sx={{
          bgcolor: item.bg,
          color: item.color,
          fontWeight: 700,
          fontSize: "0.75rem",
          border: "none",
        }}
      />
    );
  };

  const filteredPendingBills = bills
    .filter((bill) => bill.paymentStatus === "PENDING")
    .filter(
      (bill) =>
        (bill.description || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (bill.billId || "").toLowerCase().includes(searchText.toLowerCase())
    );

  const theme = useTheme();

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "text.primary" }}>
            Học phí - Hoá đơn học phí
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Quản lý và thực hiện thanh toán các khoản học phí chưa hoàn thành
          </Typography>
        </Box>

        <TextField
          placeholder="Tìm kiếm hóa đơn..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#fff",
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "16px", border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredPendingBills.length > 0 ? (
              filteredPendingBills.map((bill) => (
                <TableRow key={bill.billId}>
                  <TableCell sx={{ fontWeight: 600 }}>{bill.billId}</TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(bill.amount)}
                  </TableCell>
                  <TableCell>{getStatusChip(bill.paymentStatus)}</TableCell>
                  <TableCell>
                    {bill.createdAt
                      ? moment(bill.createdAt).format("DD/MM/YYYY HH:mm")
                      : "--"}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => handleViewDetails(bill)}
                        sx={{
                          color: "#ea580c",
                          bgcolor: "rgba(234, 88, 12, 0.08)",
                          "&:hover": { bgcolor: "rgba(234, 88, 12, 0.15)" },
                          borderRadius: "8px",
                          p: 1,
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      {bill.paymentStatus === "PENDING" && (
                        <IconButton
                          onClick={() => handlePayment(bill.billId)}
                          disabled={paymentLoading}
                          sx={{
                            color: "#10b981",
                            bgcolor: "rgba(16, 185, 129, 0.08)",
                            "&:hover": { bgcolor: "rgba(16, 185, 129, 0.15)" },
                            borderRadius: "8px",
                            p: 1,
                          }}
                        >
                          {paymentLoading ? (
                            <CircularProgress size={18} color="success" />
                          ) : (
                            <PaymentIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  Không tìm thấy hóa đơn nào chờ thanh toán
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xem chi tiết hóa đơn */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1.5,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem", pb: 1 }}>
          Chi tiết hóa đơn
        </DialogTitle>
        <DialogContent>
          {selectedBill ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#f8fafc",
                  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Mã hóa đơn:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{selectedBill.billId}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Nội dung:</Typography>
                  <Typography sx={{ fontWeight: 600, textAlign: "right" }}>{selectedBill.description}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Số tiền:</Typography>
                  <Typography sx={{ fontWeight: 800, color: "#ea580c" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedBill.amount)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Trạng thái:</Typography>
                  {getStatusChip(selectedBill.paymentStatus)}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Ngày tạo:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selectedBill.createdAt ? moment(selectedBill.createdAt).format("DD/MM/YYYY HH:mm") : "--"}
                  </Typography>
                </Box>
              </Box>

              {selectedBill.paymentStatus === "PENDING" && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => handlePayment(selectedBill.billId)}
                  disabled={paymentLoading}
                  sx={{
                    py: 1.5,
                    fontSize: "0.95rem",
                    bgcolor: "#ea580c",
                    color: "#fff",
                    "&:hover": { bgcolor: "#d97706" },
                  }}
                >
                  {paymentLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Thanh toán qua VNPay"
                  )}
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", color: "text.secondary", borderColor: "divider" }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentBills;
