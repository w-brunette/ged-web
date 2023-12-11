import { Add, ArrowForward } from "@mui/icons-material";
import { Button, ButtonGroup, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useLoading } from "../../components/Loading";
import { ModuloContainer, ModuloContent, ModuloHeader } from "../../components/Modulo";
import NavigationBar from "../../components/NavigationBar";
import * as service from './departamento-service';
import t from '../../services/Localizacao';

function DepartamentoConsultar() {
    const [departamentos, setDepartamentos] = useState([]);
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
                const paged = await service.obterDepartamentos({
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    term: pagination.term
                });
                setDepartamentos(paged.data);
                setCount(paged.total);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [pagination]);

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar>
                    <Typography variant="caption">{t(`departamentos`)}</Typography>
                    <Button startIcon={<Add />} variant="contained"
                        color="primary"
                        LinkComponent={NavLink} to="../departamento">{t(`incluir`)}</Button>
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
                            <TableCell style={{ fontWeight: "bold" }}>{t(`nome`)}</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departamentos && departamentos.map(it =>
                            <TableRow key={it.departamentoId}>
                                <TableCell>{it.codigo}</TableCell>
                                <TableCell>{it.nome}</TableCell>
                                <TableCell align="right">
                                    <ButtonGroup>
                                        <Button LinkComponent={NavLink} to={`../departamento/${it.departamentoId}`}>
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


export default DepartamentoConsultar

