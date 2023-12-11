import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Breadcrumbs, Button, FormControl, FormLabel, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { ConfirmDialog } from "../../components/Dialog";
import { useLoading } from '../../components/Loading';
import { CancelButton, DeleteButton, EditButton, ModuloContainer, ModuloContent, ModuloHeader, SubmitButton } from '../../components/Modulo';
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from '../../components/TextField';
import Axios from '../../services/Axios';
import t from '../../services/Localizacao';
import * as service from "./arquivo-service";

export default function ArquivoEditar() {
    const [showDialog, setShowDialog] = useState(false);
    const { setLoading } = useLoading();
    const { id } = useParams();
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        nome: yup.string().required("form.errors.required"),
    }).required();
    const [edicao, setEdicao] = useState(false);
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
        getValues
    } = useForm({
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
                var arquivo = await service.obterArquivo(id);
                reset(arquivo);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [edicao])

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await service.atualizarArquivo(id, formData);
            if (response.ok) history(-1);
        } finally {
            setLoading(false);
        }
    }

    const history = useNavigate();
    const handleAbrirArquivo = () => {
        const axios = Axios({
            baseAddress: 'http://localhost:5000'
        })
        const url = getValues("url")
        axios.getBlob(url)
            .then(d => {
                let blob = window.URL.createObjectURL(d)
                window.open(blob, "_blank");
            })
    }
    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`arquivos`)}</Typography>
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
                        disabled={!edicao}
                        label={t(`codigo`)}
                        name="codigo" />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        autoFocus
                        disabled
                        label={t(`nome`)}
                        name="nome" />
                    <FormControl fullWidth>
                        <Button
                            sx={{ alignSelf: 'end' }}
                            variant='outlined'
                            onClick={handleAbrirArquivo}>
                            {t(`abrir.arquivo`)}
                        </Button>
                    </FormControl>
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
                message={`Deseja realmente excluir esse arquivo '${getValues('codigo')} - ${getValues('nome')}'?`}
                onCancel={() => setShowDialog(false)}
                onConfirm={async () => {
                    const res = await service.excluirArquivo(id);
                    if (res.ok) {
                        setShowDialog(false);
                        history(-1);
                    }

                }} />
            }
        </ModuloContainer>
    )
}

