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
} from "@mui/material";
import moment from "moment";
import { getAllBillDetailsForStudent } from "../../../services/billdetail.service";
import { useSelector } from "react-redux";

const PaidAndCancelledBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = useSelector((state) => state.auth.studentId);

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

  // Lọc hóa đơn không phải PENDING
  const filteredBills = bills.filter(
    (bill) => bill.paymentStatus !== "PENDING"
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Hóa đơn đã thanh toán hoặc đã hủy
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell> {/* updatedAt */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
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
                <TableCell colSpan={6} align="center">
                  Không tìm thấy hóa đơn
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
