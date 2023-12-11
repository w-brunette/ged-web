import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Breadcrumbs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { ConfirmDialog } from "../../components/Dialog";
import { useLoading } from '../../components/Loading';
import { CancelButton, DeleteButton, EditButton, ModuloContainer, ModuloContent, ModuloHeader, SubmitButton } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from '../../components/TextField';
import t from '../../services/Localizacao';
import SelecaoCargo from '../shared/selecao-cargo';
import SelecaoDepartamento from '../shared/selecao-departamento';
import * as service from "./funcionario-service";
export default function FuncionarioEditar() {
    const history = useNavigate();
    const { id } = useParams();
    const { setLoading } = useLoading();
    const [showDialog, setShowDialog] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [form, setForm] = useState({
        funcionario: null,
        cargo: null,
        departamento: null
    });
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        nome: yup.string().required("form.errors.required"),
        cargoId: yup.number().required("form.errors.required"),
        departamentoId: yup.number().required("form.errors.required")
    }).required();
    const { handleSubmit, control, reset, formState: { errors }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            nome: '',
            cargoId: null,
            departamentoId: null
        }
    });

    useEffect(() => {
        async function fetchData() {
            if (edicao) return;
            setLoading(true);
            service.obterFuncionario(id)
                .then((f) => {
                    resetForm(f);
                })
                .finally(() =>
                    setLoading(false));
        }
        fetchData();
    }, [edicao])

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await service.atualizarFuncionario(id, formData);
            if (response.ok) history(-1);
        } finally {
            setLoading(false);
        }
    }


    const resetForm = (f) => {
        setForm({
            funcionario: f,
            cargo: { cargoId: f.cargoId, nome: f.cargoNome },
            departamento: { departamentoId: f.departamentoId, nome: f.departamentoNome }
        });
        reset(f);

    }

    const handleSelecaoCargo = (_, newValue) => {
        setForm(prev => {
            return {
                ...prev,
                cargo: newValue
            }
        });
        setValue('cargoId', newValue?.cargoId);
    }
    const handleSelecaoDepartamento = (_, newValue) => {
        setForm(prev => {
            return {
                ...prev,
                departamento: newValue
            }
        });
        setValue('departamentoId', newValue?.departamentoId);
    }

    const handleCancelarEdicao = () => {
        setEdicao(false);
        resetForm(form.funcionario);
    }
    const handleIniciarEdicao = (e) => {
        e.preventDefault();
        setEdicao(true);
    }
    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`CARGOS`)}</Typography>
                        <Typography variant="caption">{t(`EDITANDO`)}</Typography>
                        <Typography variant="subtitle2">{getValues("nome")}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)} >
                    <CustomTextField
                        control={control}
                        errors={errors}
                        disabled
                        label={t(`codigo`)}
                        name="codigo" />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        autoFocus
                        disabled={!edicao}
                        label={t(`nome`)}
                        name="nome" />
                    <SelecaoDepartamento
                        disabled={!edicao}
                        inputLabel={t('departamento')}
                        helperText={errors?.departamentoId?.message}
                        error={errors?.departamentoId}
                        value={form.departamento}
                        onChange={handleSelecaoDepartamento}
                    />
                    <SelecaoCargo
                        inputLabel={t('cargo')}
                        helperText={errors.cargoId?.message}
                        disabled={!edicao}
                        error={errors.cargoId}
                        value={form.cargo}
                        onChange={handleSelecaoCargo}
                    />
                    {edicao === true ?
                        <Box sx={{ pl: 1, pt: 2, pb: 1 }}>
                            <SubmitButton>{t(`Confirmar`)}</SubmitButton>
                            <CancelButton onClick={handleCancelarEdicao}>
                                {t(`Cancelar`)}
                            </CancelButton>
                        </Box> :
                        <Box disabled sx={{ pl: 1, pt: 2, pb: 1 }}>
                            <EditButton onClick={handleIniciarEdicao}>
                                {t(`Editar`)}
                            </EditButton>
                            <DeleteButton onClick={() => setShowDialog(true)}>
                                {t(`Excluir`)}
                            </DeleteButton>
                        </Box>
                    }
                </Form>
            </ModuloContent>
            {showDialog && <ConfirmDialog
                message={`Deseja realmente excluir esse funcionario '${getValues('codigo')} - ${getValues('nome')}'?`}
                onCancel={() => setShowDialog(false)}
                onConfirm={async () => {
                    const res = await service.excluirFuncionario(id);
                    if (res.ok) {
                        setShowDialog(false);
                        history(-1);
                    }

                }} />
            }
        </ModuloContainer>
    )
}

