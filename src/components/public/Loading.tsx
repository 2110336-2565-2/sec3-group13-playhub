import { CircularProgress, Modal, Stack } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Modal open={true}>
        <Stack alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
          <CircularProgress />
        </Stack>
      </Modal>
    </>
  );
}
