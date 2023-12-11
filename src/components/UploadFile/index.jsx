import { UploadFile } from "@mui/icons-material";
import { Box, Button, IconButton, Link, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import { displayFileSize } from '../../services/Localizacao';
import t from '../../services/Localizacao';

export default function UploadFileInput({ onFileSelected, file, onOpen }) {
    const ref = useRef();
    const handleSelectFile = (e) => {
        ref.current?.click();
    }
    const handleSelected = (e) => {
        const fl = e.target.files[0];
        if (onFileSelected instanceof Function)
            onFileSelected(fl);
    }
    const handleOpen = (e) => {
        e.preventDefault();
        if (onOpen instanceof Function)
            onOpen();
    }
    return (
        <Stack direction={"row"}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input type="file" ref={ref} hidden onChange={handleSelected} />
                <IconButton onClick={handleSelectFile} color="primary" sx={{ p: 2 }}>
                    <UploadFile />
                </IconButton>
                {file?.size === undefined ? <Typography variant="subtitle2">{t('nenhum_selecionado')}</Typography> :
                    <Button
                        onClick={handleOpen}
                        sx={{ cursor: 'pointer', textTransform: 'uppercase' }} >
                        {`${file.name} (${displayFileSize(file.size)})`}
                    </Button>
                }
            </Box>
        </Stack>
    )
}