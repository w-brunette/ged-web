import { yupResolver } from '@hookform/resolvers/yup';
import { CancelOutlined, MoreVert, RestoreOutlined, SendOutlined } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, ButtonGroup, Grid, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import AutocompleteCustom from '../../components/AutoComplete';
import CustomDateField from '../../components/DateField';
import { ConfirmDialog } from "../../components/Dialog";
import { useLoading } from '../../components/Loading';
import { CancelButton, DeleteButton, EditButton, ModuloContainer, ModuloContent, ModuloFooter, ModuloGroup, ModuloHeader, SubmitButton, TableRowWithDeletion } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from '../../components/TextField';
import UploadFileInput from '../../components/UploadFile';
import Axios from '../../services/Axios';
import t from '../../services/Localizacao';
import * as service from './documento-service';
export default function DocumentoEdit() {
    const [showDialog, setShowDialog] = useState(false);
    const { setLoading } = useLoading();
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [term, setTerm] = useState('');
    const [data, setData] = useState({
        documento: null,
        aprovador: null
    });
    const [situacao, setSituacao] = useState(null);
    const [aprovadores, setAprovadores] = useState([]);
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        titulo: yup.string().required("form.errors.required"),
        aprovadorId: yup.number().integer().required("form.errors.required"),
        vigenciaInicio: yup.date().nullable(),
        vigenciaFim: yup.date().nullable()
    }).required();
    const [edicao, setEdicao] = useState(false);
    const { handleSubmit, watch, control, reset, formState: { errors }, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            titulo: '',
            revisorId: null,
            revisorNome: '',
            aprovadorId: null,
            situacao: null,
            aprovadorNome: '',
            vigenciaInicio: null,
            vigenciaFim: null
        }
    });
    const history = useNavigate();

    const resetData = (doc) => {
        doc = {
            ...doc,
            vigenciaInicio: doc.vigenciaInicio ? new Date(doc.vigenciaInicio) : null,
            vigenciaFim: doc.vigenciaFim ? new Date(doc.vigenciaFim) : null
        }
        setData(prev => {
            return {
                documento: doc,
                aprovador: doc.aprovadorId ? { aprovadorId: doc.aprovadorId, nome: doc.aprovadorNome } : null,
            }
        })
        reset(doc);

    }

    useEffect(() => {
        if (!open) return;
        service.obterListaAprovadores(term)
            .then(d => setAprovadores(d));
    }, [term, open])

    useEffect(() => {
        async function fetchData() {
            if (edicao) return;
            setLoading(true);
            try {
                var doc = await service.obterDocumento(id);
                resetData(doc);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, edicao, situacao])

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await service.atualizarDocumento(id, formData);
            if (response.ok) setEdicao(false);
        } finally {
            setLoading(false);
        }
    }

    const handleCancelarEdicao = () => {
        setEdicao(false);
        resetData(data.documento);
    }

    const handlePesquisaAprovador = (_, term) => {
        setTerm(term || '');
    }

    const handleSelecaoAprovador = (_, aprovador) => {
        setData(prev => {
            return {
                ...prev,
                aprovador: aprovador
            }
        });
        setValue('aprovadorId', aprovador?.aprovadorId);
    }

    const handleEnviarAprovacao = async () => {
        const response = await service.enviarAprovacao(id);
        if (response.ok)
            setSituacao(1);
    }
    const handleReenviarAprovacao = async () => {
        const response = await service.reenviarAprovacao(id);
        if (response.ok)
            resetData(data.documento)
    }

    const handleCancelarAprovacao = async () => {
        const response = await service.cancelarAprovacao(id);
        if (response.ok)
            setSituacao(0);
    }

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`documentos`)}</Typography>
                        <Typography variant="caption">{t(`editando`)}</Typography>
                        <Typography variant="subtitle2">{getValues("codigo") + ' - ' + getValues("titulo")}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <CustomTextField
                                control={control}
                                errors={errors}
                                disabled
                                name="codigo"
                                label={t(`codigo`)} />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomTextField
                                control={control}
                                errors={errors}
                                disabled
                                name="revisorNome"
                                label={t(`revisor`)} />
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <SituacaoDocumento
                                disabled={edicao}
                                situacao={watch(`situacao`)}
                                onEnviar={handleEnviarAprovacao}
                                onReenviar={handleReenviarAprovacao}
                                onCancelar={handleCancelarAprovacao}
                            >
                            </SituacaoDocumento>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                control={control}
                                errors={errors}
                                disabled={!edicao}
                                name="titulo"
                                label={t(`titulo`)} />
                        </Grid>
                        <Grid item xs={4}>
                            <AutocompleteCustom
                                onOpen={(v) => setOpen(v)}
                                name='aprovadorId'
                                disabled={!edicao}
                                options={aprovadores}
                                error={errors.aprovadorId}
                                helperText={errors.aprovadorId?.message}
                                isOptionEqualToValue={(option, value) => option.aprovadorId === value.aprovadorId}
                                getOptionLabel={(option) => option.nome}
                                value={data.aprovador}
                                onChange={handleSelecaoAprovador}
                                inputValue={term}
                                onInputChange={handlePesquisaAprovador}
                                inputLabel={t(`aprovador`)} />
                        </Grid>
                        <Grid item xs={4}>
                            <CustomDateField
                                control={control}
                                name='vigenciaInicio'
                                disabled={!edicao}
                                label={t('vigenciaInicio')}
                                helperText={errors.vigenciaFim?.message}
                                error={errors.vigenciaFim}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <CustomDateField
                                control={control}
                                name='vigenciaFim'
                                disabled={!edicao}
                                label={t('vigenciaFim')}
                                helperText={errors.vigenciaFim?.message}
                                error={errors.vigenciaFim}
                            />
                        </Grid>
                    </Grid>
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
                <Anexos documentoId={id} />
            </ModuloFooter>

            <ModuloFooter>
                <TabelaAprovadores documentoId={id} situacao={situacao} />
            </ModuloFooter>

            <ModuloFooter>
                <TabelaFiliais documentoId={id} />
            </ModuloFooter>

            {
                showDialog && <ConfirmDialog
                    message={`Deseja realmente excluir esse documento '${getValues('codigo')} - ${getValues('titulo')}'?`}
                    onCancel={() => setShowDialog(false)}
                    onConfirm={async () => {
                        const res = await service.excluirDocumento(id);
                        if (res.ok) {
                            setShowDialog(false);
                            history(-1);
                        }

                    }} />
            }
        </ModuloContainer >
    )
}



const SituacaoDocumento = ({ disabled, situacao, onEnviar, onCancelar, onReenviar }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button variant='outlined'
                disabled={disabled}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >

                {
                    t(situacao === 3 ? 'reprovado'
                        : situacao === 2 ? 'aprovado'
                            : situacao === 1 ? 'em_aprovacao'
                                : 'pendente')}
                <MoreVert />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {situacao === 0 &&
                    <MenuItem sx={{ m: 0, p: 0, pl: 2, pr: 2 }} onClick={() => {
                        onEnviar();
                        setAnchorEl(null);
                    }}>
                        <SendOutlined sx={{ mr: 2 }} />{t('enviar_aprovacao')}
                    </MenuItem>
                }
                {situacao === 1 &&
                    <MenuItem sx={{ m: 0, p: 0, pl: 2, pr: 2 }} onClick={() => {
                        onCancelar();
                        setAnchorEl(null);
                    }}>
                        <CancelOutlined sx={{ mr: 2 }} />{t('cancelar_aprovacao')}
                    </MenuItem>
                }
                {situacao === 3 &&
                    <MenuItem sx={{ m: 0, p: 0, pl: 2, pr: 2 }} onClick={() => {
                        onReenviar();
                        setAnchorEl(null);
                    }}>
                        <RestoreOutlined sx={{ mr: 2 }} />{t('reenviar_aprovacao')}
                    </MenuItem>
                }
            </Menu>
        </div >
    );
}


const Anexos = ({ documentoId }) => {
    const axios = Axios({ baseAddress: 'http://localhost:5000' })
    const [count, setCount] = useState(0);
    const [anexo, setAnexo] = useState({ name: '', size: 0 });
    const [anexoBase, setAnexoBase] = useState({ name: '', size: 0 });
    const forceUpdate = () => setCount(x => x + 1);

    useEffect(() => {
        service.obterAnexos(documentoId)
            .then(d => {
                setAnexo({ size: d.anexo?.tamanho, name: d.anexo?.nome, url: d.anexo?.url });
                setAnexoBase({ size: d.anexoBase?.tamanho, name: d.anexoBase?.nome, url: d.anexoBase?.url });
            })
    }, [documentoId, count])

    const handleArquivoSelecionado = (file) => {
        const formData = new FormData();
        formData.append("arquivo", file)
        formData.append("tipoAnexo", "V")
        service.incluirAnexo(documentoId, formData)
            .then(d => forceUpdate())
    }
    const handleArquivoBaseSelecionado = (file) => {
        const formData = new FormData();
        formData.append("arquivo", file)
        formData.append("tipoAnexo", "B")
        service.incluirAnexo(documentoId, formData)
            .then(d => forceUpdate())
    }

    const handleAbrirAnexo = () => {
        axios.getBlob(anexo.url)
            .then(d => {
                let blob = window.URL.createObjectURL(d)
                window.open(blob, "_blank");
            })
    }
    const handleAbrirAnexoBase = () => {
        axios.getBlob(anexoBase.url)
            .then(d => {
                let blob = window.URL.createObjectURL(d)
                window.open(blob, "_blank");
            })
    }
    return (
        <Grid container>
            <Grid item xs={6}>
                <ModuloGroup titulo={t(`anexo`)} mensagem={`Incluir anexo que será utilizado na consulta apóes aprovação`} />
                <UploadFileInput onOpen={handleAbrirAnexo} file={anexo} sx={{ m: 1 }} onFileSelected={handleArquivoSelecionado} />
            </Grid>
            <Grid item xs={6}>
                <ModuloGroup titulo={t(`anexo_base`)} mensagem={`Incluir anexo base`} />
                <UploadFileInput onOpen={handleAbrirAnexoBase} file={anexoBase} sx={{ m: 1 }} onFileSelected={handleArquivoBaseSelecionado} />
            </Grid>
        </Grid>
    )
}



const TabelaAprovadores = ({ documentoId, situacao }) => {
    const [aprovadores, setAprovadores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            var aprovadores = await service.obterAprovadoresDocumento(documentoId);
            setAprovadores(aprovadores);
        }
        fetchData();
    }, [situacao])

    const handleAprovar = async (e) => {
        e.preventDefault();
        await service.aprovar(documentoId);
    }
    const handleReprovar = async (e) => {
        e.preventDefault();
        await service.reprovar(documentoId);
    }
    return (
        <Box>
            <ModuloGroup titulo={t(`aprovadores`)}
                mensagem={`
                    Informar aprovadores que poderão participar do processo de aprovacao de um documento
                    onde a caracteristica de aprovação for informado somente o departamento
                `}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t(`funcionario`)}</TableCell>
                        <TableCell>{t(`departamento`)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {aprovadores && aprovadores.map((it, idx) =>
                        <TableRow key={idx}>
                            <TableCell >{it.aprovadorNome}</TableCell>
                            <TableCell >{it.departamentoNome}</TableCell>
                            <TableCell align='right'>
                                <ButtonGroup>
                                    <Button onClick={handleAprovar}>{t(`aprovar`)}</Button>
                                    <Button onClick={handleReprovar}>{t(`Reprovar`)}</Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}

const TabelaFiliais = ({ documentoId }) => {
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount(v => v + 1);
    const [filiaisDocumento, setFiliaisDocumento] = useState([]);

    const [filialSelecionada, setFilialSelecionada] = useState(null);
    const [listaFiliais, setListaFiliais] = useState([]);
    const [term, setTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterFiliaisDocumento(documentoId);
            setFiliaisDocumento(data)
        }
        fetchData();
    }, [documentoId, count])

    useEffect(() => {
        async function fetchData() {
            var data = await service.obterListaFiliais(term);
            setListaFiliais(data)
        }
        fetchData();
    }, [term])

    useEffect(() => {
        async function incluirFilial() {
            if (filialSelecionada === null) {
                return;
            }
            const response = await service.incluirFilial(documentoId, {
                filialId: filialSelecionada?.id,
            });
            if (response.ok) {
                setFilialSelecionada(null);
                setTerm('');
                forceUpdate();
                return;
            }
        }
        incluirFilial()
    }, [filialSelecionada, documentoId])

    const handleExcluirFilial = async (it) => {
        const response = await service.excluirFilial(documentoId, it.filialId);
        if (response.ok) {
            forceUpdate();
        }
    }

    const alternarSelecaoLinha = (idx) => {
        let items = [...filiaisDocumento]
        let item = items[idx]
        items[idx] = { ...item, selecionado: !item.selecionado }
        setFiliaisDocumento(items);
    }

    return (
        <Box sx={{ marginBottom: 10 }}>
            <Grid container alignItems={'center'}>
                <Grid item xs={12}>
                    <ModuloGroup titulo={t(`filiais`)} mensagem={
                        `Incluir quais departamentos terão acesso a visualização de documentos que pertecem à este tipo de documento, 
                        usual quando é necessário restringir acesso à um ou mais departamentos, 
                        quando nenhum departamento for informadot todos os departamentos terão acesso quando nenhum for selecionado.`}
                    />
                </Grid>
                <Grid item xs={4} sx={{ m: 1 }}>
                    <AutocompleteCustom
                        size={'small'}
                        options={listaFiliais}
                        inputValue={term}
                        onInputChange={(_, newValue) => {
                            setTerm(newValue);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.nome}
                        value={filialSelecionada}
                        onChange={(_, newValue) => {
                            setFilialSelecionada(newValue);
                        }}
                        inputLabel={t('filial')}
                    />
                </Grid>
            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Filial</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filiaisDocumento && filiaisDocumento.map((it, idx) => {
                        return (
                            <TableRowWithDeletion key={idx}
                                selected={it.selecionado}
                                onSelect={() => alternarSelecaoLinha(idx)}
                                onDelete={() => handleExcluirFilial(it)}>
                                <TableCell>{it.nome}</TableCell>
                            </TableRowWithDeletion>
                        );
                    })
                    }
                </TableBody>
            </Table>
        </Box>
    )
}

