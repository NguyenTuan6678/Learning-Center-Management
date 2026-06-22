import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Button,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  School as ClassIcon,
  Grade as GradeIcon,
  CheckCircle as AttendanceIcon,
  ReceiptLong as BillIcon,
  CalendarToday as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { tokens } from "../../../themes/theme";
import { getAllBillDetailsForStudent } from "../../../services/billdetail.service";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLocalData } from "../../../services/localStorage";

const StudentDashboardOverview = ({ onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const studentId = useSelector(
    (state) => state.auth.studentId || getLocalData("studentId")
  );

  const [pendingBills, setPendingBills] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingBills = async () => {
      if (!studentId) return;
      try {
        const res = await getAllBillDetailsForStudent(studentId);
        const pending = (res.data || []).filter((b) => b.paymentStatus === "PENDING").length;
        setPendingBills(pending);
      } catch (error) {
        console.error("Failed to load student bills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBills();
  }, [studentId]);

  // Mock static student schedule and announcements
  const schedule = [
    { time: "08:00 - 10:00", subject: "Toán học nâng cao", room: "Phòng A101", teacher: "Thầy Nguyễn Văn A", day: "Hôm nay" },
    { time: "14:00 - 16:00", subject: "Vật lý lý thuyết", room: "Phòng B203", teacher: "Cô Lê Thị B", day: "Ngày mai" },
    { time: "10:00 - 12:00", subject: "Hóa học hữu cơ", room: "Phòng C12", teacher: "Thầy Trần Văn C", day: "Thứ 6, 26/06" },
  ];

  const announcements = [
    { title: "Thông báo lịch nghỉ lễ Quốc Khánh", date: "22/06/2026", desc: "Trung tâm nghỉ học từ ngày 02/09 đến hết ngày 04/09..." },
    { title: "Đăng ký kỳ thi thử THPT Quốc Gia", date: "18/06/2026", desc: "Học sinh đăng ký thi thử trước ngày 30/06 tại phòng đào tạo..." },
  ];

  const cards = [
    {
      title: "Lớp học đã đăng ký",
      value: "4 Lớp",
      sub: "Kỳ học Summer 2026",
      icon: <ClassIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#2196f3",
      action: () => onNavigate("enrollmentClass"),
    },
    {
      title: "Điểm trung bình (GPA)",
      value: "8.4 / 10",
      sub: "Xếp loại: Giỏi",
      icon: <GradeIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#4caf50",
      action: () => onNavigate("record"),
    },
    {
      title: "Tỷ lệ chuyên cần",
      value: "96.5 %",
      sub: "Nghỉ có phép: 1 buổi",
      icon: <AttendanceIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#ff9800",
      action: null,
    },
    {
      title: "Hóa đơn học phí",
      value: pendingBills > 0 ? `${pendingBills} Chờ thanh toán` : "Đã hoàn thành",
      sub: pendingBills > 0 ? "Vui lòng đóng đúng hạn" : "Không có công nợ",
      icon: <BillIcon sx={{ fontSize: "1.8rem" }} />,
      color: pendingBills > 0 ? "#f44336" : "#9e9e9e",
      action: () => onNavigate("manageBills"),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: "16px",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(20, 27, 45, 0.4) 100%)"
              : "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.3)" : "rgba(234, 88, 12, 0.15)"}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: theme.palette.mode === "dark" ? "#ffedd5" : "#7c2d12" }}>
            Xin chào, Học viên! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#cbd5e1" : "#9a3412" }}>
            Học tập là hành trình trọn đời. Chúc bạn có một ngày học tập thật hiệu quả!
          </Typography>
        </Box>
        <Chip
          icon={<ScheduleIcon style={{ color: theme.palette.mode === "dark" ? "#fdba74" : "#ea580c", fontSize: 16 }} />}
          label="Học Kỳ: Summer 2026"
          sx={{
            fontWeight: "bold",
            px: 1.5,
            bgcolor: theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.08)",
            color: theme.palette.mode === "dark" ? "#fdba74" : "#ea580c",
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.4)" : "rgba(234, 88, 12, 0.2)"}`,
          }}
        />
      </Box>

      {/* Grid Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              onClick={card.action || undefined}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
                cursor: card.action ? "pointer" : "default",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
                "&:hover": card.action
                  ? {
                      transform: "translateY(-4px)",
                      boxShadow: theme.palette.mode === "dark"
                        ? "0 12px 25px rgba(0,0,0,0.4)"
                        : "0 12px 25px rgba(234, 88, 12, 0.08)",
                      borderColor: "#ea580c",
                    }
                  : {},
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: `${card.color}15`, color: card.color, width: 52, height: 52 }}>
                  {card.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 550, fontSize: "0.85rem" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color: "text.primary" }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", mt: 0.5 }}>
                    {card.sub}
                  </Typography>
                </Box>
                {card.action && <ChevronRightIcon sx={{ color: "text.secondary", opacity: 0.5 }} />}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dynamic Schedule & Announcements */}
      <Grid container spacing={3}>
        {/* Class schedule list */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Lịch học trong tuần
                </Typography>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate("manageStudents")} // Map to Calendar
                  sx={{ textTransform: "none", fontWeight: 600, color: "#ea580c", "&:hover": { color: "#d97706" } }}
                >
                  Xem chi tiết
                </Button>
              </Box>

              <List disablePadding>
                {schedule.map((item, i) => (
                  <Box key={i}>
                    <ListItem sx={{ py: 2, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "rgba(234, 88, 12, 0.1)", color: "#ea580c", borderRadius: "10px" }}>
                          <ScheduleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {item.subject}
                            </Typography>
                            <Chip
                              label={item.day}
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                bgcolor: item.day === "Hôm nay"
                                  ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.25)" : "rgba(234, 88, 12, 0.1)")
                                  : (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                                color: item.day === "Hôm nay" ? "#ea580c" : "text.secondary",
                                border: `1px solid ${item.day === "Hôm nay" ? "rgba(234, 88, 12, 0.2)" : "transparent"}`,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            Thời gian: <strong>{item.time}</strong> | Lớp: <strong>{item.room}</strong> | GV: <strong>{item.teacher}</strong>
                          </Typography>
                        }
                      />
                    </ListItem>
                    {i < schedule.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Thông báo mới nhất
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {announcements.map((ann, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.01)" : "#fafafa",
                      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "rgba(234, 88, 12, 0.3)",
                        bgcolor: theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.02)" : "#fffaf7",
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#ea580c" }}>
                        {ann.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {ann.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineBreak: "anywhere" }}>
                      {ann.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboardOverview;
