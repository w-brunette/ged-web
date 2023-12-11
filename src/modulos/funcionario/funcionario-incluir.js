import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumbs, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ModuloContainer, ModuloContent, ModuloHeader } from "../../components/Modulo";
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from "../../components/TextField";
import t from '../../services/Localizacao';
import SelecaoCargo from "../shared/selecao-cargo";
import SelecaoDepartamento from "../shared/selecao-departamento";
import { incluirFuncionario } from "./funcionario-service";

export default function FuncionarioIncluir() {
    const [departamento, setDepartamento] = useState(null);
    const [cargo, setCargo] = useState(null);
    const schema = yup.object({
        codigo: yup.string().required("form.errors.required"),
        nome: yup.string().required("form.errors.required"),
        cargoId: yup.number().required("form.errors.required"),
        departamentoId: yup.number().required("form.errors.required"),
    }).required();
    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            codigo: '',
            nome: '',
            cargoId: null,
            departamentoId: null,
        }
    });

    const onSubmit = async (formData) => {
        console.log("submit");
        const response = await incluirFuncionario(formData);
        if (response.ok) {
            history(-1);
        }
    }

    const history = useNavigate();

    const handleSelecaoDepartamento = (e, newValue) => {
        setDepartamento(newValue);
        setValue("departamentoId", newValue?.departamentoId)
    }

    const handleSelecaoCargo = (e, newValue) => {
        setCargo(newValue);
        setValue("cargoId", newValue?.cargoId)
    }

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`funcionarios`)}</Typography>
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
                        label={t("codigo")} />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="nome"
                        label={t("nome")} />
                    <SelecaoDepartamento
                        inputLabel={t('departamento')}
                        helperText={errors.departamentoId?.message}
                        error={errors.departamentoId}
                        value={departamento}
                        onChange={handleSelecaoDepartamento}
                    />
                    <SelecaoCargo
                        inputLabel={t('cargo')}
                        helperText={errors.cargoId?.message}
                        error={errors.cargoId}
                        value={cargo}
                        onChange={handleSelecaoCargo}
                    />
                    <ButtonGroup variant="contained">
                        <Button type="submit">{t(`confirmar`)}</Button>
                    </ButtonGroup>
                </Form>
            </ModuloContent>
        </ModuloContainer>
    )
}


