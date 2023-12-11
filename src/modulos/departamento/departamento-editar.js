import { yupResolver } from '@hookform/resolvers/yup';
import { Cancel, Done, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Breadcrumbs, ButtonGroup, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { red } from '@mui/material/colors';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { ConfirmDialog } from "../../components/Dialog";
import { useLoading } from '../../components/Loading';
import { CancelButton, DeleteButton, EditButton, ModuloContainer, ModuloContent, ModuloFooter, ModuloGroup, ModuloHeader, SubmitButton } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from '../../components/TextField';
import t from '../../services/Localizacao';
import { AutoCompleteCustom } from '../shared';
import * as service from './departamento-service';

export default function DepartamentoEditar() {
    const [showDialog, setShowDialog] = useState(false);
    const { setLoading } = useLoading();
    const { id } = useParams();
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        nome: yup.string().required("form.errors.required"),
    }).required();
    const [edicao, setEdicao] = useState(false);
    const { handleSubmit, control, reset, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            nome: ''
        }
    });

    useEffect(() => {
        async function fetchData() {
            if (edicao) return;
            setLoading(true);
            try {
                var depto = await service.obterDepartamento(id);
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
            const response = await service.atualizarDepartamento(id, formData);
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
                        <Typography variant="subtitle2">{getValues("nome")}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextField
                        control={control}
                        errors={errors}
                        disabled
                        name="codigo"
                        label={t(`codigo`)} />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        autoFocus
                        disabled={!edicao}
                        name="nome"
                        label={t(`nome`)} />
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
                <TabelaAprovadores departamentoId={id} />
            </ModuloFooter>


            {showDialog && <ConfirmDialog
                message={`Deseja realmente excluir esse departamento '${getValues('codigo')} - ${getValues('nome')}'?`}
                onCancel={() => setShowDialog(false)}
                onConfirm={async () => {
                    const res = await service.excluirDepartamento(id);
                    if (res.ok) {
                        setShowDialog(false);
                        history(-1);
                    }

                }} />
            }
        </ModuloContainer>
    )
}
const useForceUpdate = () => {
    const [count, setCount] = useState(0);
    return {
        countUpdate: count,
        forceUpdate: () => setCount(c => c + 1)
    }
}
const TabelaAprovadores = ({ departamentoId }) => {
    const { countUpdate, forceUpdate } = useForceUpdate();
    const [aprovadores, setAprovadores] = useState([]);
    const [aprovador] = useState(null);
    const [term] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            var aprovadores = await service.obterAprovadores(departamentoId);
            setAprovadores(aprovadores);
        }
        fetchData();
    }, [countUpdate])

    const handleExcluirAprovador = async (aprovador) => {
        const response = await service.excluirAprovador(aprovador.departamentoId, aprovador.aprovadorId);
        if (response.ok) {
            forceUpdate();
        }
    }

    const handleSelecaoAprovador = async (aprovador) => {
        const response = await service.incluirAprovador(departamentoId, aprovador.aprovadorId);
        if (response.ok) {
            forceUpdate();
        }
    }

    useEffect(() => {
        (async (text) => {
            var response = await fetch(`http://localhost:5000/api/funcionarios?page=1&pageSize=10&term=${text}`)
                .then((res) => res.json());
            setOptions(response.data.map((it) => {
                return {
                    aprovadorId: it.funcionarioId,
                    nome: it.nome
                }
            }));
        })(term);
    }, [term])

    const alternarSelecaoLinha = (idx) => {
        let items = [...aprovadores]
        let item = items[idx]
        items[idx] = { ...item, selecionado: !item.selecionado }
        setAprovadores(items);
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
                        <TableCell colSpan={2}>
                            <AutoCompleteCustom
                                isOptionEqualToValue={(option, value) => option.aprovadorId === value.aprovadorId}
                                inputLabel={t('incluir_aprovador')}
                                getOptionLabel={(option) => option.nome}
                                filterOptions={(x) => x}
                                inputValue={term}
                                options={options}
                                value={aprovador}
                                onChange={(event, newValue) => handleSelecaoAprovador(newValue)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{t(`nome`)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {aprovadores && aprovadores.map((it, idx) =>
                        <TableRow key={it.aprovadorId}
                            sx={it.selecionado ? {
                                fontWeight: 'bold',
                                backgroundColor: red[100],
                                color: red[900]
                            } : {}}>
                            <TableCell >{it.nome}</TableCell>
                            <TableCell align='right'>
                                {it.selecionado ?
                                    <ButtonGroup variant='text' size='small'>
                                        <IconButton color='success'
                                            onClick={() => handleExcluirAprovador(it)}><Done /></IconButton>
                                        <IconButton color="error" onClick={() => {
                                            alternarSelecaoLinha(idx);
                                        }}><Cancel /></IconButton>
                                    </ButtonGroup>
                                    :
                                    <IconButton size='small' variant='contained' color="error" onClick={() => {
                                        alternarSelecaoLinha(idx);
                                    }}><RemoveCircleOutline />
                                    </IconButton>
                                }
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}