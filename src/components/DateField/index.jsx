import { DateField } from "@mui/x-date-pickers"
import { Controller } from "react-hook-form"

export default function CustomDateField({ name, control, disabled, helperText, error, label, format }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <DateField
                    {...field}
                    format={format || 'dd/MM/yyyy'}
                    fullWidth
                    disabled={disabled}
                    slotProps={{
                        textField: {
                            helperText: helperText,
                            error: error
                        }
                    }}

                    label={label}
                />
            }
        />
    )
}