import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function Alerts() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="success">Success.</Alert>
      <Alert severity="info">Info.</Alert>
      <Alert severity="warning">Warning.</Alert>
      <Alert severity="error">Error.</Alert>
    </Stack>
  );
}
