import { Box, Breadcrumbs, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ModuloContainer, ModuloContent, ModuloFooter, ModuloGroup, ModuloHeader } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import t from '../../services/Localizacao';
import * as service from "./transferencia-service";
import { DateField } from "@mui/x-date-pickers";

export default function TransferenciaEditar() {
    const { id } = useParams();
    const [transferencia, setTransferencia] = useState({
        data: new Date(),
        revisorNomeOrigem: '',
        revisorNomeDestino: ''
    });
    const [documentos, setDocumentos] = useState([]);
    useEffect(() => {
        async function fetchData() {
            var docs = await service.obterDocumentos(id);
            var transf = await service.obterTransferencia(id);
            setDocumentos(docs);
            setTransferencia({
                ...transf,
                data: new Date(),
            });
        }
        fetchData();
    }, [id])
    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`transferencias`)}</Typography>
                        <Typography variant="caption">{t(`consultando`)}</Typography>
                        <Typography variant="subtitle2"></Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>

            <ModuloGroup titulo={t(`transferencia`)} mensagem={`cabecalho`} />
            <Grid container spacing={1} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <DateField placeholder={t(`data`)} label={t(`data`)} format="dd/MM/yyyy" fullWidth disabled value={transferencia.data} />
                </Grid>
                <Grid item xs={6}>
                    <TextField placeholder={t(`revisor_origem`)} label={t(`revisor_origem`)} fullWidth disabled value={transferencia.revisorNomeOrigem} />
                </Grid>
                <Grid item xs={6}>
                    <TextField placeholder={t(`revisor_destino`)} label={t(`revisor_destino`)} fullWidth disabled value={transferencia.revisorNomeDestino} />
                </Grid>
            </Grid>

            <ModuloGroup titulo={t(`documentos`)} mensagem={`documentos transferidos`} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t(`codigo`)}</TableCell>
                        <TableCell>{t(`titulo`)}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documentos && documentos.map((it) => {
                        return (
                            <TableRow key={it.id}>
                                <TableCell>{it.codigo}</TableCell>
                                <TableCell>{it.titulo}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ModuloContainer >
    )
}

