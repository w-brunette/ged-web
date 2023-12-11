import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";
const AutocompleteCustom = ({
    size,
    open,
    onOpen,
    onClose,
    loading,
    disabled,
    error,
    helperText,
    inputLabel,
    inputValue,
    onInputChange,
    value,
    onChange,
    sx,
    options,
    renderOption,
    getOptionLabel,
    isOptionEqualToValue,
}) => {
    return (
        <Autocomplete
            open={open}
            sx={sx}
            onOpen={onOpen}
            onClose={onClose}
            disabled={disabled}
            loading={loading}
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
                    size={size}
                    error={error}
                    helperText={helperText}
                    fullWidth
                    label={inputLabel}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                />
            )}
        />
    )
}
export default AutocompleteCustom