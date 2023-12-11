import { Add, ArrowForward } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Chip, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useLoading } from "../../components/Loading";
import { ModuloContainer, ModuloContent, ModuloHeader } from "../../components/Modulo";
import NavigationBar from "../../components/NavigationBar";
import t from '../../services/Localizacao';
import * as service from './documento-service';

function DocumentoList() {
    const [documentos, setDocumentos] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { setLoading } = useLoading();
    const term = useMemo(() => {
        return searchParams.get("term") || "";
    }, [searchParams]);

    const pagination = useMemo(() => {
        return {
            page: Number(searchParams.get("page") || "1"),
            pageSize: Number(searchParams.get("pageSize") || "10"),
            term: searchParams.get("term") || ""
        }
    }, [searchParams]);

    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const paged = await service.obterDocumentos({
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    term: pagination.term
                });
                setDocumentos(paged.data);
                setCount(paged.total);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [pagination, setLoading]);

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar>
                    <Typography variant="caption">{t(`documentos`)}</Typography>
                    <Button startIcon={<Add />} variant="contained"
                        color="primary"
                        LinkComponent={NavLink} to="../documento">{t(`incluir`)}</Button>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <TextField autoFocus defaultValue={term || ""} onChange={debounce((e) => {
                    searchParams.set("page", "1");
                    searchParams.set("term", e.target.value);
                    setSearchParams(searchParams);
                }, 250)} size="small" variant="outlined" fullWidth placeholder={t(`pesquisar`)} />
                <Table sx={{ height: 0 }}>
                    <TableHead>
                        <TableRow >
                            <TableCell style={{ fontWeight: "bold" }}>{t(`codigo`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>{t(`titulo`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>{t(`revisor`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>{t(`aprovador`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }} align="center">{t(`situacao`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documentos && documentos.map(it =>
                            <TableRow key={it.documentoId}>
                                <TableCell>{it.codigo}</TableCell>
                                <TableCell>{it.titulo}</TableCell>
                                <TableCell>{it.revisorNome}</TableCell>
                                <TableCell>{it.aprovadorNome}</TableCell>
                                <TableCell align="center">
                                    <DocumentoSituacao situacao={it.situacao} />
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup>
                                        <Button LinkComponent={NavLink} to={`../documento/${it.documentoId}`}>
                                            <ArrowForward />
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                onPageChange={(s, page) => {
                                    searchParams.set("page", (page + 1).toString());
                                    setSearchParams(searchParams);
                                }}
                                rowsPerPageOptions={[10, 20, 30]}
                                onRowsPerPageChange={(e) => {
                                    searchParams.set("page", "1");
                                    searchParams.set("pageSize", e.target.value);
                                    setSearchParams(searchParams);
                                }}
                                page={pagination.page - 1}
                                rowsPerPage={pagination.pageSize}
                                count={count} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </ModuloContent>
        </ModuloContainer>
    )
}
export function DocumentoSituacao({ situacao, box }) {
    return (
        <Box>
            {
                situacao === 3 ? <Chip size="small" color="error" label={t('REPROVADO')} />
                    : situacao === 2 ? <Chip color="success" label={t('APROVADO')} />
                        : situacao === 1 ? <Chip color="warning" label={t('APROVANDO')} />
                            : <Chip color="success" label={t('PENDENTE')} />
            }
        </Box>
    )
}

export default DocumentoList

