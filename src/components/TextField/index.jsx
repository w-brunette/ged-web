import { TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export default function CustomTextField({ type, autoFocus, name, label, control, disabled, errors }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <TextField
                    {...field}
                    type={type}
                    disabled={disabled}
                    fullWidth
                    autoFocus={autoFocus}
                    label={label}
                    variant="outlined"
                    error={errors?.[name]}
                    helperText={<Typography variant="caption" color="error">{errors?.[name]?.message}</Typography>}
                />
            } />
    )
}