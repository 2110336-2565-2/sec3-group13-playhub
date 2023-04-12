import VerifiedIcon from "@mui/icons-material/Verified";
import { Chip } from "@mui/material";

export default function VerifyChip() {
  return <Chip icon={<VerifiedIcon sx={{ color: "white" }} />} color="primary" label="Verified" />;
}
