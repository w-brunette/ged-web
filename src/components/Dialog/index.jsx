import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

const ConfirmDialog = ({ onConfirm, onCancel, message }) => {
    return (
        <Dialog
            open={true}
            onClose={() => console.log("FECHOU")}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onConfirm} autoFocus>
                    Confirmar
                </Button>
                <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
            </DialogActions>
        </Dialog>)
}

export { ConfirmDialog };
