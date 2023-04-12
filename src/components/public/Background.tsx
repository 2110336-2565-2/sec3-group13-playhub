import { Box } from "@mui/material";

type props = {
  minHeight?: string;
  minWidth?: string;
};

export default function Background(props: props) {
  const backgroungUrl: string =
    'url("https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/bg.JPG")';

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          minHeight: props.minHeight,
          minWidth: props.minWidth,
          zIndex: -9,
          opacity: 0.8,

          backgroundImage: backgroungUrl,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          minHeight: props.minHeight,
          minWidth: props.minWidth,
          zIndex: -9,
          opacity: 0.3,

          backgroundColor: "primary.main",
        }}
      ></Box>
    </>
  );
}
