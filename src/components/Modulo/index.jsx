import { Cancel, Done, InfoOutlined, RemoveCircleOutline, SmartButtonOutlined } from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, Paper, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { useLoading } from "../Loading";
import styled from '@emotion/styled';
import { red } from "@mui/material/colors";
import React from "react";
export function ModuloContainer({ children }) {
    const { loading } = useLoading();
    return (
        <Box sx={loading ? { pointerEvents: 'none', opacity: 0.3 } : {}}>
            {children}
        </Box>
    )
}
export function ModuloHeader({ children }) {
    return (
        <Box sx={{ backgroundColor: 'modulo.header' }}>
            {children}
        </Box>
    )
}
export function ModuloContent({ children }) {
    return (
        <Paper sx={{ m: 1, p: 1 }}>
            {children}
        </Paper>
    )
}
export function ModuloFooter({ sx, children }) {
    return (
        <Box sx={{ ...sx, mb: 4 }}>
            {children}
        </Box>
    )
}

export function ModuloGroup({ titulo, mensagem }) {
    return (
        <Box sx={{
            p: 1,
            display: 'flex', justifyContent: 'start',
            borderTop: 0, borderBottom: 2, borderColor: "#DDD",
            backgroundColor: '#FAFAFA'
        }} >
            {mensagem &&
                <Tooltip title={mensagem} color='info'>
                    <InfoOutlined sx={{ mr: 2 }} />
                </Tooltip>
            }
            <Typography variant='subtitle2' sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                {titulo}
            </Typography>
        </Box>
    )
}


export const EditButton = (props) => (
    <Button {...props} variant="outlined" color="info" />
)
export const DeleteButton = (props) => (
    <Button sx={{ marginLeft: 2 }} {...props} variant="contained" color="error" />
)
export const CancelButton = (props) => (
    <Button sx={{ marginLeft: 2 }}  {...props} variant="outlined" color="info" />
)
export const SubmitButton = (props) => (
    <Button {...props} variant="contained" color="primary" type="submit" />
)

export const TableRowWithDeletion = ({ key, onDelete, selected, onSelect, children }) => {
    let wrappedChildren = React.Children.map(children, (c, i) => {
        const key = c.key ? `key-${c.key}` : `index-${i}`
        return (c);
    });
    return (
        <TableRow key={key}>
            {wrappedChildren}
            <TableCell align='right'>
                {selected ?
                    <ButtonGroup variant='text' size='small' sx={{ position: 'static' }}>
                        <IconButton color='success' onClick={() => onDelete()}>
                            <Done />
                        </IconButton>
                        <IconButton color="error" onClick={() => onSelect(false)}>
                            <Cancel />
                        </IconButton>
                    </ButtonGroup>
                    :
                    <IconButton size='small' variant='contained' color="error" onClick={() => onSelect(true)}>
                        <RemoveCircleOutline />
                    </IconButton>
                }
            </TableCell>

        </TableRow>
    )
}