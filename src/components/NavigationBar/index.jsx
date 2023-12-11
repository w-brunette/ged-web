import { ArrowBackOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar = ({ children, showBackButton }) => {
    const history = useNavigate();
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pr: 2, height: "50px" }}>
            {children}
            {showBackButton &&
                <IconButton onClick={() => history(-1)} size="medium">
                    <ArrowBackOutlined />
                </IconButton>
            }
        </Box>
    )
}


export default NavigationBar;