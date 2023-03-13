
import {
    Chip,
} from "@mui/material";
type props = {
    message: string,
}


export default function TagComponent(props: props) {
    return (
        <Chip
            label={props.message}
            variant="outlined"
            style={{
                minWidth: 100,
                height: 40,
                border: "3px solid rgba(0, 0, 0, 0.12)",
                fontSize: 18,
                borderRadius: "4px",
                color: "#FFA31A",
            }}
        />)
}