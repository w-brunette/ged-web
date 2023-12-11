import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
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
import * as service from "./cargo-service";

export default function CargoEditar() {
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
                var depto = await service.obterCargo(id);
                reset(depto);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [edicao])

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await service.atualizarCargo(id, formData);
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
                        <Typography variant="caption">{t(`CARGOS`)}</Typography>
                        <Typography variant="caption">{t(`EDITANDO`)}</Typography>
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
                        label={t(`codigo`)}
                        name="codigo" />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        autoFocus
                        disabled={!edicao}
                        label={t(`nome`)}
                        name="nome" />
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
            {showDialog && <ConfirmDialog
                message={`Deseja realmente excluir esse cargo '${getValues('codigo')} - ${getValues('nome')}'?`}
                onCancel={() => setShowDialog(false)}
                onConfirm={async () => {
                    const res = await service.excluirCargo(id);
                    if (res.ok) {
                        setShowDialog(false);
                        history(-1);
                    }

                }} />
            }
        </ModuloContainer>
    )
}

