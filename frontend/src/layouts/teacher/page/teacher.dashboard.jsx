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
  People as StudentIcon,
  Schedule as HoursIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Today as TodayIcon,
  AssignmentTurnedIn as AttendanceIcon,
} from "@mui/icons-material";
import { tokens } from "../../../themes/theme";
import moment from "moment";

const TeacherDashboardOverview = ({ onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stats, setStats] = useState({
    classes: 3,
    students: 48,
    hours: 12,
    rating: "4.9 / 5",
  });

  const todaySchedule = [
    { time: "08:00 - 10:00", subject: "Toán học nâng cao - Lớp TNA01", room: "Phòng A101", studentCount: 18 },
    { time: "14:00 - 16:00", subject: "Vật lý lý thuyết - Lớp VLT02", room: "Phòng B203", studentCount: 15 },
  ];

  const announcements = [
    { title: "Nộp nhận xét giữa kỳ Summer 2026", date: "23/06/2026", desc: "Giáo viên lưu ý hoàn thành nhận xét học sinh trước ngày 28/06..." },
    { title: "Họp chuyên môn tổ tự nhiên", date: "21/06/2026", desc: "Cuộc họp chuyên môn định kỳ sẽ diễn ra vào lúc 16:30 chiều thứ 5 tại phòng hội đồng..." },
  ];

  const cards = [
    {
      title: "Lớp học đang dạy",
      value: `${stats.classes} Lớp`,
      sub: "Kỳ học Summer 2026",
      icon: <ClassIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#3f51b5",
      action: () => onNavigate("teacherClasses"),
    },
    {
      title: "Học sinh quản lý",
      value: `${stats.students} Học sinh`,
      sub: "Sĩ số trung bình: 16/lớp",
      icon: <StudentIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#009688",
      action: () => onNavigate("teacherClasses"),
    },
    {
      title: "Giờ dạy tuần này",
      value: `${stats.hours} Giờ`,
      sub: "Đã hoàn thành: 4 giờ",
      icon: <HoursIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#ff9800",
      action: null,
    },
    {
      title: "Đánh giá từ phụ huynh",
      value: stats.rating,
      sub: "Xếp loại: Xuất sắc",
      icon: <StarIcon sx={{ fontSize: "1.8rem" }} />,
      color: "#ffc107",
      action: null,
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
              ? `linear-gradient(100deg, ${colors.primary[600]} 0%, ${colors.primary[500]} 100%)`
              : "linear-gradient(100deg, #f0fdf4 0%, #dcfce7 100%)",
          border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#bbf7d0"}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: theme.palette.mode === "dark" ? "#fff" : "#166534" }}>
            Chào mừng trở lại, Giáo viên! 📚
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#cbd5e1" : "#15803d" }}>
            Chúc thầy/cô có một ngày lên lớp ngập tràn niềm vui và truyền cảm hứng tốt đẹp đến học sinh.
          </Typography>
        </Box>
        <Chip
          icon={<TodayIcon style={{ color: "#166534", fontSize: 16 }} />}
          label="Lịch dạy ngày hôm nay"
          sx={{
            fontWeight: "bold",
            px: 1,
            bgcolor: "rgba(255,255,255,0.6)",
            color: "#166534",
            border: "1px solid rgba(22, 101, 52, 0.2)",
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
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                cursor: card.action ? "pointer" : "default",
                transition: "all 0.25s ease",
                bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
                "&:hover": card.action
                  ? {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      borderColor: card.color,
                    }
                  : {},
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: `${card.color}15`, color: card.color, width: 52, height: 52 }}>
                  {card.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.85rem" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color: "text.primary" }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", mt: 0.5 }}>
                    {card.sub}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Schedule & Announcements */}
      <Grid container spacing={3}>
        {/* Class schedule list */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Lịch dạy hôm nay
                </Typography>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate("teacherClasses")}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Quản lý lớp
                </Button>
              </Box>

              <List disablePadding>
                {todaySchedule.map((item, i) => (
                  <Box key={i}>
                    <ListItem
                      sx={{ py: 2, px: 0 }}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AttendanceIcon />}
                          onClick={() => onNavigate("teacherClasses")}
                          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                        >
                          Điểm danh
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "success.main", color: "#fff", borderRadius: "10px" }}>
                          <TodayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {item.subject}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            Thời gian: <strong>{item.time}</strong> | Lớp: <strong>{item.room}</strong> | Sĩ số: <strong>{item.studentCount} HS</strong>
                          </Typography>
                        }
                      />
                    </ListItem>
                    {i < todaySchedule.length - 1 && <Divider />}
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
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Tin tức & Sự kiện giáo viên
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {announcements.map((ann, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#f8fafc",
                      border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "success.main" }}>
                        {ann.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {ann.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
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

export default TeacherDashboardOverview;
