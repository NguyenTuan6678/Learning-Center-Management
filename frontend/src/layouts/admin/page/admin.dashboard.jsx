import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp as TrendUpIcon,
  ChatBubbleOutline as ChatIcon,
  StarBorder as StarIcon,
  EditOutlined as EditIcon,
  MoreVert as MoreIcon,
  NorthEast as ArrowUpIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { tokens } from "../../../themes/theme";
import moment from "moment";

// Import sample student images (mock placeholders)
const mockAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
];

const AdminDashboardOverview = ({ onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ p: 1, bgcolor: theme.palette.mode === "dark" ? "transparent" : "#f8fafc", minHeight: "100%" }}>
      {/* 3 Metrics Cards row at the top */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Card 1: Revenues */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
                Doanh thu
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1 }}>
                <Typography variant="h1" sx={{ fontSize: "2.8rem", fontWeight: 800 }}>
                  15%
                </Typography>
                <ArrowUpIcon sx={{ color: "#10b981", fontSize: "1.8rem", fontWeight: "bold" }} />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 3 }}>
                Tăng trưởng so với tuần trước
              </Typography>
              <Button
                variant="text"
                onClick={() => onNavigate("manageBills")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  color: "#ea580c",
                  "&:hover": { bgcolor: "transparent", opacity: 0.8 },
                }}
              >
                Báo cáo doanh thu &rarr;
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Lost deals / Retained students */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
                Tỷ lệ nghỉ học
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1 }}>
                <Typography variant="h1" sx={{ fontSize: "2.8rem", fontWeight: 800 }}>
                  2%
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 3 }}>
                Đã giữ chân thành công 98% học sinh
              </Typography>
              <Button
                variant="text"
                onClick={() => onNavigate("manageStudents")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  color: "#ea580c",
                  "&:hover": { bgcolor: "transparent", opacity: 0.8 },
                }}
              >
                Tất cả học viên &rarr;
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Quarter Goal (Gauge Chart) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", alignSelf: "flex-start", mb: 1 }}>
                Mục tiêu khóa học
              </Typography>
              
              {/* SVG Gauge */}
              <Box sx={{ position: "relative", width: 140, height: 80, mt: 1, display: "flex", justifyContent: "center" }}>
                <svg width="140" height="90" viewBox="0 0 100 50">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={theme.palette.mode === "dark" ? "#334155" : "#f1f5f9"}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#ffb020"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    strokeDashoffset="20.1" // Calculates 84% filled arc
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 800, fontSize: "1.4rem" }}>
                    84%
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="text"
                onClick={() => onNavigate("manageClasses")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  mt: 1.5,
                  color: "#ea580c",
                  "&:hover": { bgcolor: "transparent", opacity: 0.8 },
                }}
              >
                Chi tiết lớp học &rarr;
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle row: Customers List & Growth Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Customers List (Highlighted rows) */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Học sinh mới
                </Typography>
                <Button
                  endIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: "none", color: "text.secondary", fontWeight: 650, fontSize: "0.85rem" }}
                >
                  Mới nhất
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Student 1 */}
                <Box sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: "12px" }}>
                  <Avatar src={mockAvatars[0]} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Nguyễn Hoàng Long
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                      Lớp Toán Nâng Cao 12A
                    </Typography>
                  </Box>
                </Box>

                {/* Student 2 (Highlighted/Selected style like Maggie Johnson) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: "10px 16px",
                    borderRadius: "12px",
                    bgcolor: theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.15)" : "#fffbeb",
                    border: `1px solid ${theme.palette.mode === "dark" ? "#ea580c" : "#fef3c7"}`,
                  }}
                >
                  <Avatar src={mockAvatars[2]} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#b45309" }}>
                      Trần Thị Mai Anh
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d97706", fontSize: "0.75rem" }}>
                      Lớp Tiếng Anh IELTS 6.5
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" sx={{ color: "#d97706" }}><ChatIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: "#d97706" }}><StarIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: "#d97706" }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: "#d97706" }}><MoreIcon fontSize="small" /></IconButton>
                  </Box>
                </Box>

                {/* Student 3 */}
                <Box sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: "12px" }}>
                  <Avatar src={mockAvatars[1]} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Phạm Minh Đức
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                      Lớp Vật Lý 11B
                    </Typography>
                  </Box>
                </Box>

                {/* Student 4 */}
                <Box sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: "12px" }}>
                  <Avatar src={mockAvatars[3]} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Lê Hải Yến
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                      Lớp Hóa Học Cơ Bản 10
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="text"
                onClick={() => onNavigate("manageStudents")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  mt: 3,
                  color: "#ea580c",
                  "&:hover": { bgcolor: "transparent", opacity: 0.8 },
                }}
              >
                Tất cả học sinh &rarr;
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Growth Area Chart (Custom Styled SVG) */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Tăng trưởng tuyển sinh
                </Typography>
                <Button
                  endIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: "none", color: "text.secondary", fontWeight: 650, fontSize: "0.85rem" }}
                >
                  Hàng năm
                </Button>
              </Box>

              {/* Responsive SVG Chart */}
              <Box sx={{ width: "100%", height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <svg width="100%" height="180" viewBox="0 0 500 180" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="480" y2="30" stroke={theme.palette.mode === "dark" ? "#334155" : "#f8fafc"} strokeWidth="1" />
                  <line x1="30" y1="70" x2="480" y2="70" stroke={theme.palette.mode === "dark" ? "#334155" : "#f8fafc"} strokeWidth="1" />
                  <line x1="30" y1="110" x2="480" y2="110" stroke={theme.palette.mode === "dark" ? "#334155" : "#f8fafc"} strokeWidth="1" />
                  <line x1="30" y1="150" x2="480" y2="150" stroke={theme.palette.mode === "dark" ? "#475569" : "#cbd5e1"} strokeWidth="1.5" />

                  {/* Area fill */}
                  <path
                    d="M 30 150 L 30 130 Q 100 110 100 110 T 170 80 T 240 60 T 310 110 T 380 70 T 480 30 L 480 150 Z"
                    fill="url(#growthGradient)"
                  />

                  {/* Line */}
                  <path
                    d="M 30 130 Q 100 110 100 110 T 170 80 T 240 60 T 310 110 T 380 70 T 480 30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Chart Labels */}
                  <text x="30" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2020</text>
                  <text x="100" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2021</text>
                  <text x="170" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2022</text>
                  <text x="240" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2023</text>
                  <text x="310" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2024</text>
                  <text x="380" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2025</text>
                  <text x="480" y="168" fill={theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} fontSize="11" textAnchor="middle">2026</text>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Third row: Statistics Highlights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top month */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 550 }}>
                Tháng cao điểm
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: "#ea580c", mt: 2 }}>
                Tháng 10
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mt: 0.5 }}>
                Năm học 2026
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top year */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 550 }}>
                Năm tuyển sinh đỉnh điểm
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, mt: 2 }}>
                Năm 2026
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mt: 0.5 }}>
                142 học sinh đăng ký
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top student */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 550, mb: 2 }}>
                Học sinh tiêu biểu
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={mockAvatars[2]} sx={{ width: 44, height: 44 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    Trần Thị Mai Anh
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    Điểm số GPA: 9.8 / 10
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fourth row: Chat overview, Top States (Courses), New deals (Classes) */}
      <Grid container spacing={3}>
        {/* Chats overview */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Tin nhắn mới
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 3 }}>
                Có 3 tin nhắn chưa đọc
              </Typography>
              
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Box sx={{ display: "flex", "-webkit-box-pack": "start", justifyContent: "flex-start" }}>
                  <Avatar src={mockAvatars[0]} sx={{ width: 36, height: 36, border: "2px solid #fff" }} />
                  <Avatar src={mockAvatars[1]} sx={{ width: 36, height: 36, border: "2px solid #fff", marginLeft: "-10px" }} />
                  <Avatar src={mockAvatars[2]} sx={{ width: 36, height: 36, border: "2px solid #fff", marginLeft: "-10px" }} />
                </Box>
                <Typography variant="h6" sx={{ color: "#ea580c", fontWeight: 750 }}>
                  &rarr;
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top States (Top Courses) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3.5 }}>
                Môn học được đăng ký nhiều
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* State 1 */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Toán học</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>120 học sinh</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: theme.palette.mode === "dark" ? "#334155" : "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                    <Box sx={{ width: "90%", height: "100%", bgcolor: "#f59e0b", borderRadius: "3px" }} />
                  </Box>
                </Box>

                {/* State 2 */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Vật lý</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>80 học sinh</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: theme.palette.mode === "dark" ? "#334155" : "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                    <Box sx={{ width: "65%", height: "100%", bgcolor: "#f59e0b", borderRadius: "3px" }} />
                  </Box>
                </Box>

                {/* State 3 */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Hóa học</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>70 học sinh</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: theme.palette.mode === "dark" ? "#334155" : "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                    <Box sx={{ width: "55%", height: "100%", bgcolor: "#f59e0b", borderRadius: "3px" }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* New deals (New Classes) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.015)",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? colors.primary[400] : "#f1f5f9"}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Lớp học mới mở
              </Typography>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Chip label="+ Lớp Toán 12A" variant="outlined" sx={{ py: 2, px: 1, borderRadius: "10px", borderColor: "#fef3c7", bgcolor: "#fffbeb", color: "#d97706", fontWeight: "bold" }} />
                <Chip label="+ Lớp Lý 11B" variant="outlined" sx={{ py: 2, px: 1, borderRadius: "10px", borderColor: "#fef3c7", bgcolor: "#fffbeb", color: "#d97706", fontWeight: "bold" }} />
                <Chip label="+ SAT Prep" variant="outlined" sx={{ py: 2, px: 1, borderRadius: "10px", borderColor: "#fef3c7", bgcolor: "#fffbeb", color: "#d97706", fontWeight: "bold" }} />
                <Chip label="+ Tiếng Anh IELTS" variant="outlined" sx={{ py: 2, px: 1, borderRadius: "10px", borderColor: "#fef3c7", bgcolor: "#fffbeb", color: "#d97706", fontWeight: "bold" }} />
                <Chip label="+ Lớp Hóa 10" variant="outlined" sx={{ py: 2, px: 1, borderRadius: "10px", borderColor: "#fef3c7", bgcolor: "#fffbeb", color: "#d97706", fontWeight: "bold" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardOverview;
