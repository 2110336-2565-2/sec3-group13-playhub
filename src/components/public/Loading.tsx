import { CircularProgress, Modal, Stack } from "@mui/material";

type props = {
  isLoading: boolean;
};

export default function Loading(props: props) {
  return (
    <>
      <Modal open={props.isLoading}>
        <Stack alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
          <CircularProgress />
        </Stack>
      </Modal>
    </>
  );
}
