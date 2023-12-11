import { Autocomplete, TextField } from "@mui/material";
export const AutoCompleteCustom = ({disabled, inputValue, onInputChange, value, onChange, options, renderOption, getOptionLabel, isOptionEqualToValue, inputLabel }) => {
    return (
        <Autocomplete
            size="small"
            disabled={disabled}
            options={options}
            getOptionLabel={getOptionLabel}
            onInputChange={onInputChange}
            onChange={onChange}
            value={value}
            inputValue={inputValue}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={renderOption}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label={inputLabel} />
            )}
        />
    )
}
