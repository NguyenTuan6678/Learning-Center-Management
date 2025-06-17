import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Select } from "antd";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const EditModal = ({ open, handleClose, rowData, onConfirm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (rowData) {
      setUsername(rowData.username || "");
      setPassword(rowData.password || "");
      setRole(rowData.role || "");
    } else {
      setUsername("");
      setPassword("");
      setRole("");
    }
  }, [rowData]);

  //   console.log("***row data: ", rowData);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleConfirm = () => {
    onConfirm({
      id: rowData.id,
      username,
      password,
      role,
    });
    handleClose();
  };

  // console.log("rowData.username:", rowData?.username);
  // console.log("rowData.password:", rowData?.password);
  // console.log("rowData.role:", rowData?.role);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={style}>
        <h2 id="edit-modal-title">Chỉnh sửa thông tin tài khoản</h2>
        <Typography id="edit-modal-description" sx={{ mt: 2 }}>
          ID: {rowData?.id}
        </Typography>
        <TextField
          label="Tên tài khoản"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Mật khẩu"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          sx={{ mt: 2 }}
        />
        <Typography sx={{ mt: 2 }}>Role:</Typography>
        <Select
          value={role}
          style={{ width: "100%" }}
          onChange={handleRoleChange}
          options={[
            { value: "ADMIN", label: "ADMIN" },
            { value: "STUDENT", label: "STUDENT" },
            { value: "TEACHER", label: "TEACHER" },
            { value: "PARENT", label: "PARENT" },
          ]}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        />
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleConfirm} variant="contained" sx={{ ml: 2 }}>
            Xác nhận thay đổi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
