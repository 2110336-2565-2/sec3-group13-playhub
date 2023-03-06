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
          height: "100vh",
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
          zIndex: -9,
          opacity: 0.3,

          backgroundColor: "primary.main",
        }}
      ></Box>
    </>
  );
}
