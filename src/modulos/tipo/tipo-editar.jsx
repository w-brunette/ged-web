import { yupResolver } from '@hookform/resolvers/yup';
import { Cancel, Done, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, ButtonGroup, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import AutocompleteCustom from '../../components/AutoComplete';
import { ConfirmDialog } from "../../components/Dialog";
import { useLoading } from '../../components/Loading';
import { CancelButton, DeleteButton, EditButton, ModuloContainer, ModuloContent, ModuloFooter, ModuloGroup, ModuloHeader, SubmitButton, TableRowWithDeletion } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from '../../components/TextField';
import t from '../../services/Localizacao';
import * as service from "./tipo-service";
export default function TipoEditar() {
    const [showDialog, setShowDialog] = useState(false);
    const { setLoading } = useLoading();
    const { id } = useParams();
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        descricao: yup.string().required("form.errors.required"),
    }).required();
    const [edicao, setEdicao] = useState(false);
    const { handleSubmit, control, reset, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            descricao: ''
        }
    });

    useEffect(() => {
        async function fetchData() {
            if (edicao) return;
            setLoading(true);
            try {
                var depto = await service.obterTipo(id);
                reset(depto);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, reset, setLoading, edicao])


    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await service.atualizarTipo(id, formData);
            if (response.ok) history(-1);
        } finally {
            setLoading(false);
        }
    }

    const history = useNavigate();

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`departamentos`)}</Typography>
                        <Typography variant="caption">{t(`editando`)}</Typography>
                        <Typography variant="subtitle2">{getValues("descricao")}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextField
                        control={control}
                        errors={errors}
                        disabled
                        label={t('codigo')}
                        name="codigo" />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        autoFocus
                        disabled={!edicao}
                        label={t('descricao')}
                        name="descricao" />
                    {edicao === true ?
                        <Box sx={{ pl: 1, pt: 2, pb: 1 }}>
                            <SubmitButton>{t(`Confirmar`)}</SubmitButton>
                            <CancelButton onClick={() => setEdicao(false)}>
                                {t(`Cancelar`)}
                            </CancelButton>
                        </Box> :
                        <Box disabled sx={{ pl: 1, pt: 2, pb: 1 }}>
                            <EditButton onClick={(e) => { e.preventDefault(); setEdicao(true); }}>
                                {t(`Editar`)}
                            </EditButton>
                            <DeleteButton onClick={() => setShowDialog(true)}>
                                {t(`Excluir`)}
                            </DeleteButton>
                        </Box>
                    }
                </Form>
            </ModuloContent>
            <ModuloFooter>
                <TabelaAprovadores tipoDocumentoId={id} />
            </ModuloFooter>
            <ModuloFooter>
                <TabelaDepartamentos tipoDocumentoId={id} />
            </ModuloFooter>
            {showDialog && <ConfirmDialog
                message={`Deseja realmente excluir esse tipo '${getValues('codigo')} - ${getValues('descricao')}'?`}
                onCancel={() => setShowDialog(false)}
                onConfirm={async () => {
                    const res = await service.excluirTipo(id);
                    if (res.ok) {
                        setShowDialog(false);
                        history(-1);
                    }

                }} />
            }
        </ModuloContainer>
    )
}


const TabelaAprovadores = ({ tipoDocumentoId }) => {
    const [refresh, setRefresh] = useState(0);
    const atualizarAprovadores = () => setRefresh(v => v + 1);

    const [aprovadores, setAprovadores] = useState([]);
    const [aprovadorSelecionado, setAprovadorSelecionado] = useState(null);
    const [listaAprovadores, setListaAprovadores] = useState([]);
    const [term, setTerm] = useState('');
    const [listaTags, setListaTags] = useState([]);
    const [tagSelecionada, setTagSelecionada] = useState(null);
    const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [termDepto, setTermDepto] = useState('');
    useEffect(() => {
        async function fetchData() {
            var data = await service.obterAprovadores(tipoDocumentoId);
            setAprovadores(data)
        }
        fetchData();
    }, [tipoDocumentoId, refresh])

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterListaTags();
            setListaTags(data)
        }
        fetchData();
    }, [])

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterListaAprovadores(term);
            setListaAprovadores(data)
        }
        fetchData();
    }, [term])

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterListaDepartamentos(termDepto);
            setListaDepartamentos(data)
        }
        fetchData();
    }, [termDepto])

    const handleExcluirAprovador = async (aprovador) => {
        const response = await service.excluirAprovador(tipoDocumentoId, aprovador.id);
        if (response.ok) {
            atualizarAprovadores();
        }
    }

    const handleIncluirAprovador = async () => {
        const response = await service.incluirAprovador(tipoDocumentoId, {
            sequencia: (aprovadores?.length ?? 0) + 1,
            tag: tagSelecionada.codigo,
            aprovadorId: aprovadorSelecionado?.id,
            departamentoId: departamentoSelecionado?.id,
        });
        if (response.ok) {
            setDepartamentoSelecionado(null);
            setAprovadorSelecionado(null);
            setTagSelecionada(null);
            atualizarAprovadores();
        }
    }

    return (
        <Box>
            <ModuloGroup titulo={t(`aprovadores`)} mensagem={`Incluir caracteristicas de aprovação para determinar quem serão os aprovadores dos documentos para este tipo em questão.
                        Por exemplo, se incluir uma caracteristica 'QUALIDADE' e selecionar o 'DEPTO QUALIDADE',
                        todos os documentos gerados para este tipo exigirá aprovação para cada caracteristica informada,
                        quando houver mais de uma caracteristica, necessário informar a ordem de aprovação pelo qual o documento necessitará.`}
            />
            <Grid container alignItems={'center'} spacing={1}>
                <Grid item xs={2}>
                    <AutocompleteCustom

                        sx={{ ml: 1 }}
                        size={'small'}
                        required
                        options={listaTags}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.codigo}
                        value={tagSelecionada}
                        onChange={(_, newValue) => {
                            setTagSelecionada(newValue);
                        }}
                        inputLabel={t('tag')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <AutocompleteCustom
                        size={'small'}
                        required
                        options={listaAprovadores}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.nome}
                        value={aprovadorSelecionado}
                        onChange={(_, newValue) => {
                            setAprovadorSelecionado(newValue);
                            if (newValue === null) setTerm('');
                        }}
                        inputLabel={t('aprovador')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <AutocompleteCustom
                        size={'small'}
                        options={listaDepartamentos}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.nome}
                        value={departamentoSelecionado}
                        onChange={(_, newValue) => {
                            setDepartamentoSelecionado(newValue);
                            if (newValue === null)
                                setTermDepto('')
                        }}
                        inputLabel={t('departamento')}
                    />
                </Grid>
                <Grid item xs={2} textAlign={'center'}>
                    <Button variant='contained' onClick={handleIncluirAprovador} disabled={!tagSelecionada}>
                        {t('incluir')}
                    </Button>
                </Grid>

            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sequencia</TableCell>
                        <TableCell>Tag</TableCell>
                        <TableCell>Funcionario aprovador</TableCell>
                        <TableCell>Departamento aprovador</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {aprovadores && aprovadores.map((it, idx) => {
                        return (
                            <TableRow key={it.id}>
                                <TableCell>{it.sequencia}</TableCell>
                                <TableCell>{it.tag}</TableCell>
                                <TableCell>{it.aprovadorNome}</TableCell>
                                <TableCell>{it.departamentoNome}</TableCell>
                                <TableCell align='right'>
                                    {it.selecionado ?
                                        <ButtonGroup variant='text' size='small' sx={{ position: 'static' }}>
                                            <IconButton color='success'
                                                onClick={() => handleExcluirAprovador(it)}><Done /></IconButton>
                                            <IconButton color="error" onClick={() => {
                                                let items = [...aprovadores]
                                                items[idx] = { ...items[idx], selecionado: false }
                                                setAprovadores(items);
                                            }}><Cancel /></IconButton>
                                        </ButtonGroup>
                                        :
                                        <IconButton size='small' variant='contained' color="error" onClick={() => {
                                            let items = [...aprovadores]
                                            items[idx] = { ...items[idx], selecionado: true }
                                            setAprovadores(items);
                                        }}><RemoveCircleOutline /></IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        );
                    })
                    }
                </TableBody>
            </Table>
        </Box >
    )
}



const TabelaDepartamentos = ({ tipoDocumentoId }) => {
    const [refresh, setRefresh] = useState(0);
    const atualizarDepartamentos = () => setRefresh(v => v + 1);
    const [departamentos, setDepartamentos] = useState([]);

    const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [term, setTerm] = useState('');
    useEffect(() => {
        async function fetchData() {
            var data = await service.obterDepartamentos(tipoDocumentoId);
            setDepartamentos(data)
        }
        fetchData();
    }, [tipoDocumentoId, refresh])

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterListaDepartamentos(term);
            setListaDepartamentos(data)
        }
        fetchData();
    }, [term])

    useEffect(() => {
        async function incluirDepartamentoSelecionado() {
            if (departamentoSelecionado === null) {
                return;
            }
            const response = await service.incluirDepartamento(tipoDocumentoId, {
                departamentoId: departamentoSelecionado?.id,
            });
            if (response.ok) {
                setDepartamentoSelecionado(null);
                setTerm('');
                atualizarDepartamentos();
            }
        }
        incluirDepartamentoSelecionado()
    }, [departamentoSelecionado, tipoDocumentoId])

    const handleExcluirDepartamento = async (it) => {
        const response = await service.excluirDepartamento(tipoDocumentoId, it.departamentoId);
        if (response.ok) {
            atualizarDepartamentos();
        }
    }

    const alternarSelecaoLinha = (idx) => {
        let items = [...departamentos]
        let item = items[idx]
        items[idx] = { ...item, selecionado: !item.selecionado }
        setDepartamentos(items);
    }

    return (
        <Box sx={{ marginBottom: 10 }}>
            <Grid container alignItems={'center'}>
                <Grid item xs={12}>
                    <ModuloGroup titulo={t(`departamentos`)} mensagem={
                        `Incluir quais departamentos terão acesso a visualização de documentos que pertecem à este tipo de documento, 
                        usual quando é necessário restringir acesso à um ou mais departamentos, 
                        quando nenhum departamento for informadot todos os departamentos terão acesso quando nenhum for selecionado.`}
                    />
                </Grid>
                <Grid item xs={4} sx={{ m: 1 }}>
                    <AutocompleteCustom
                        size={'small'}
                        options={listaDepartamentos}
                        inputValue={term}
                        onInputChange={(_, newValue) => {
                            setTerm(newValue);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.nome}
                        value={departamentoSelecionado}
                        onChange={(_, newValue) => {
                            setDepartamentoSelecionado(newValue);
                        }}
                        inputLabel={t('departamento')}
                    />
                </Grid>
            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Departamento</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departamentos && departamentos.map((it, idx) => {
                        return (
                            <TableRowWithDeletion key={idx}
                                selected={it.selecionado}
                                onSelect={() => alternarSelecaoLinha(idx)}
                                onDelete={() => handleExcluirDepartamento(it)}>
                                <TableCell  >{it.departamentoNome}</TableCell>
                            </TableRowWithDeletion>
                        );
                    })
                    }
                </TableBody>
            </Table>
        </Box>
    )
}

