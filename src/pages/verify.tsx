import Navbar from "@/components/public/Navbar";
import { Chip, Typography, Stack, Box } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import Link from "next/link";

export default function Verify() {
    return (
        <>
            <Navbar />
            <Stack
                spacing={8}
                width="35vw"
                minWidth="270px"
                minHeight="90vh"
                justifyContent="center"
                sx={{
                    margin: "auto"
                }}
            >
                <Box>
                    <Typography gutterBottom variant="h1">Verify คืออะไร</Typography>
                    <Typography variant="body1">คือ ระบบการยืนยันตัวตน เพื่อสร้างความอุ่นใจและปลอดภัยแก่ท่านและสมาชิกชาว PlayHub ที่เข้ามาใช้บริการเว็บไซต์ของเรา รวมไปถึงการได้รับสิทธิพิเศษต่าง ๆ จาก PlayHub</Typography>
                </Box>

                <Box>
                    <Typography gutterBottom variant="h1">Verify แล้วได้อะไร</Typography>
                    <Typography variant="body1">ท่านจะสามารถสร้างกิจกรรมเพื่อหาเพื่อนๆมาร่วมสนุกกับท่านได้
                        ท่านจะได้รับเครื่องหมายยืนยันตัวตนสุดเท่ในหน้าโปรไฟล์ของท่าน</Typography>
                </Box>

                <Box>
                    <Typography gutterBottom variant="h1">Verify อย่างไร</Typography>
                    <Typography variant="body1">
                        ส่ง
                        <Link href="/" style={{ color: "blue", textDecorationLine: "underline" }}>
                            อีเมล
                        </Link>
                        นี้ พร้อมแนบ
                        <Typography display="inline" variant="body1" color="red">
                            รูปถ่ายบัตรประจำตัวประชาชน
                        </Typography>
                        แล้วรอการตรวจสอบประมาณ 1 สัปดาห์ หากการยืนยันตัวตนสำเร็จจะมีสัญลักษณ์
                        &nbsp;
                        <Chip
                            icon={<VerifiedIcon sx={{ color: "white" }} />}
                            color="primary"
                            label={"Verified"}
                        />
                        &nbsp;
                        ปรากฎขึ้นในหน้าโปร์ไฟล์ของท่าน
                    </Typography>
                </Box>
            </Stack>
        </>
    )
}