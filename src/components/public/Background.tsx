import { Box } from "@mui/material";

export default function Background() {
  const backgroungUrl: string =
    'url("https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/bg.JPG")';

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          minWidth: "320px",
          height: "100vh",
          minHeight: "868px",
          zIndex: -9,
          opacity: 0.8,

          backgroundImage: backgroungUrl,
          backgroundRepeat: "no-repeat",
          // backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          minWidth: "320px",
          height: "100vh",
          minHeight: "868px",
          zIndex: -9,
          opacity: 0.3,

          backgroundColor: "primary.main",
        }}
      ></Box>
    </>
  );
}
