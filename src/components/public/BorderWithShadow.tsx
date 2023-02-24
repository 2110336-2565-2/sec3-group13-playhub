import { Card } from "@mui/material";
import { ReactNode } from "react";


type props = {
    children: ReactNode
}
export default function BorderWithShadow(props: props) {
    return <Card sx={{
        border: "solid 4px",
        borderRadius: "16px",
        boxShadow: "8px 8px #BFBFBF",
        width: "100%",
    }}>
        {props.children}
    </Card>;
}