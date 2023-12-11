import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumbs, Button, ButtonGroup, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ModuloContainer, ModuloContent, ModuloHeader } from "../../components/Modulo";
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from "../../components/TextField";
import t from '../../services/Localizacao';
import { incluirTipo } from "./tipo-service";

export default function TipoIncluir() {
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        descricao: yup.string().required("form.errors.required"),
    }).required();
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            descricao: ''
        }
    });

    const onSubmit = async (formData) => {
        const response = await incluirTipo(formData);
        if (response.ok) {
            history(-1);
        }
    }

    const history = useNavigate();

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`departamentos`)}</Typography>
                        <Typography variant="caption">{t(`incluindo`)}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="codigo"
                        label={t(`codigo`)} />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="descricao"
                        label={t(`descricao`)} />
                    <ButtonGroup variant="contained">
                        <Button type="submit">{t(`confirmar`)}</Button>
                    </ButtonGroup>
                </Form>
            </ModuloContent>
        </ModuloContainer>
    )
}


