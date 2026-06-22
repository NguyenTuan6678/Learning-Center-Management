import * as React from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import authSlice from "../../toolkits/auth/slice";
import alertSlice from "../../toolkits/alert/slice";
import { AuthWrapper } from "./login.style";
import * as Yup from "yup";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import artwork from "../../assets/imgs/login_artwork.png";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

const SignInSide = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onLoginBtnClicked = (values) => {
    if (values.username === "") {
      dispatch(alertSlice.actions.error("Chưa nhập username!"));
    } else if (values.password === "") {
      dispatch(alertSlice.actions.error("Chưa nhập mật khẩu!"));
    } else {
      login(values);
    }
  };

  const login = (values) => {
    dispatch(authSlice.actions.login(values));
  };

  return (
    <AuthWrapper artworkSrc={artwork}>
      <Stack sx={{ height: "100%", justifyContent: "space-between" }} spacing={4}>
        {/* Welcome Header */}
        <Stack spacing={1.5}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.1rem" },
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            Welcome Back <span style={{ display: "inline-block" }}>👋</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#4b5563",
              lineHeight: 1.6,
              maxWidth: 320,
              fontSize: "0.85rem",
            }}
          >
            Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
          </Typography>
        </Stack>

        {/* Login Form */}
        <Box>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .max(20)
                .required("Tên đăng nhập là bắt buộc"),
              password: Yup.string().max(20).required("Mật khẩu là bắt buộc"),
            })}
            onSubmit={(values) => onLoginBtnClicked(values)}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  {/* Username Field */}
                  <Stack spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "0.85rem",
                      }}
                    >
                      Username
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Example username"
                      name="username"
                      value={values.username}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          bgcolor: "#f9fafb",
                          height: "48px",
                          "& fieldset": {
                            borderColor: "#e5e7eb",
                          },
                          "&:hover fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ea580c",
                          },
                        },
                      }}
                    />
                  </Stack>

                  {/* Password Field */}
                  <Stack spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "0.85rem",
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      name="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{ color: "#9ca3af" }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon sx={{ fontSize: 18 }} />
                              ) : (
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          bgcolor: "#f9fafb",
                          height: "48px",
                          "& fieldset": {
                            borderColor: "#e5e7eb",
                          },
                          "&:hover fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ea580c",
                          },
                        },
                      }}
                    />
                  </Stack>

                  {/* Forgot Password Link */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1.5 }}>
                    <Typography
                      variant="caption"
                      component="a"
                      href="#"
                      sx={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ marginTop: "16px" }}
                  >
                    <Button
                      disableElevation
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#0f172a",
                        color: "#ffffff",
                        "&:hover": {
                          bgcolor: "#1e293b",
                        },
                        textTransform: "none",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        boxShadow: "none",
                      }}
                    >
                      Sign in
                    </Button>
                  </motion.div>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontWeight: 500,
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            © 2026 ALL RIGHTS RESERVED
          </Typography>
        </Box>
      </Stack>
    </AuthWrapper>
  );
};

export default SignInSide;
