import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { getAllBillDetailsForStudent } from "../../../services/billdetail.service";
import { useSelector } from "react-redux";
import { getLocalData } from "../../../services/localStorage";

const PaidAndCancelledBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = useSelector(
    (state) => state.auth.studentId || getLocalData("studentId")
  );

  const theme = useTheme();

  useEffect(() => {
    const fetchBills = async () => {
      if (!studentId) return;

      setLoading(true);
      try {
        const res = await getAllBillDetailsForStudent(studentId);
        setBills(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [studentId]);

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

  // Lọc hóa đơn không phải PENDING
  const filteredBills = bills.filter(
    (bill) => bill.paymentStatus !== "PENDING"
  );

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: "text.primary" }}>
          Lịch sử thanh toán
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Xem lịch sử các hóa đơn đã thanh toán hoặc đã hủy
        </Typography>
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
              <TableCell>Ngày cập nhật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
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
                    {bill.updatedAt
                      ? moment(bill.updatedAt).format("DD/MM/YYYY HH:mm")
                      : "--"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  Không tìm thấy hóa đơn nào trong lịch sử
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaidAndCancelledBills;
