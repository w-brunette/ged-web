import { ContactEmergency, ImportContacts, TableChart } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import t from '../../services/Localizacao'
export default function Menu() {
    return (
        <List>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="arquivos">
                    <ListItemIcon>
                        <TableChart />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.arquivos`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="departamentos">
                    <ListItemIcon>
                        <TableChart />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.departamentos`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="cargos">
                    <ListItemIcon>
                        <ImportContacts />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.cargos`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="tipos">
                    <ListItemIcon>
                        <ImportContacts />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.tipos`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="funcionarios">
                    <ListItemIcon>
                        <ContactEmergency />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.funcionarios`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <Divider />
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="documentos">
                    <ListItemIcon>
                        <ContactEmergency />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.documentos`)}</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton LinkComponent={NavLink} to="transferencias">
                    <ListItemIcon>
                        <ContactEmergency />
                    </ListItemIcon>
                    <ListItemText>{t(`menu.transferencias`)}</ListItemText>
                </ListItemButton>
            </ListItem>
        </List>
    )
}