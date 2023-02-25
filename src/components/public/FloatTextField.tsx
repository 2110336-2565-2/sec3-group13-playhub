import { Box, FormHelperText, TextField, Typography } from "@mui/material";
type props = {
    header?: string;
    label?: string;
    placeholder?: string;
    value: string;
    handleValueChange?: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    isMultiLine?: boolean;
    char_limit?: number;
    isErr: boolean;
    errMsg: string;
    mediumSize?: boolean;
    isUnClick?: boolean
};

const helperText = {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
};
const textboxShadow = {
    border: "solid 4px",
    borderRadius: "16px",
    boxShadow: "8px 8px #BFBFBF",
};

export default function FloatTextField(props: props) {
    const exceedChar: boolean = props.char_limit
        ? props.value.length > props.char_limit
        : false;

    return (
        <>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>{props?.header}</Typography>
            <TextField
                disabled={props.isUnClick}
                sx={{ ...textboxShadow, bgcolor: props.isUnClick ? '#9797971A' : null }}
                label={props?.label}
                placeholder={props?.placeholder}
                error={props.isErr || exceedChar}
                value={props.value}
                onChange={props.handleValueChange}
                multiline={props.isMultiLine || false}
                rows={props.isMultiLine ? 4 : 1}
                fullWidth
                size={props.mediumSize ? "medium" : "small"}
            />
            <Box sx={helperText}>
                <FormHelperText error={exceedChar}>
                    {props.char_limit && `${props.value.length}/${props.char_limit}`}
                </FormHelperText>
                {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
            </Box>
        </>
    );
}