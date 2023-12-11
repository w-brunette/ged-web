import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumbs, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ModuloContainer, ModuloContent, ModuloHeader } from "../../components/Modulo";
import NavigationBar from "../../components/NavigationBar";
import CustomTextField from "../../components/TextField";
import t from '../../services/Localizacao';
import * as service from './documento-service';
import AutocompleteCustom from "../../components/AutoComplete";

export default function DocumentoAdd() {
    const [term, setTerm] = useState('')
    const [listaTipos, setListaTipos] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    
    const schema = yup.object({
        titulo: yup.string().required("form.errors.required"),
        tipoDocumentoId: yup.number().integer().required("form.errors.required"),
    }).required();

    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            titulo: '',
            tipoDocumentoId: null
        }
    });
    useEffect(() => {
        service.obterListaTipos(term)
            .then(d => setListaTipos(d))
    }, [term])

    useEffect(() => {
        setValue('tipoDocumentoId', tipoSelecionado?.id);
    }, [tipoSelecionado, setValue])

    

    const onSubmit = async (formData) => {
        const response = await service.incluirDocumento(formData);
        if (response.ok) {
            history(-1);
        }
    }

    const handleSelecaoTipo = (_, newValue) => {
        setTipoSelecionado(newValue);
        if (newValue === null) setTerm('');
    }


    const history = useNavigate();

    return (
        <ModuloContainer>
            <ModuloHeader>
                <NavigationBar showBackButton={true}>
                    <Breadcrumbs>
                        <Typography variant="caption">{t(`documentos`)}</Typography>
                        <Typography variant="caption">{t(`incluindo`)}</Typography>
                    </Breadcrumbs>
                </NavigationBar>
            </ModuloHeader>
            <ModuloContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <AutocompleteCustom
                        options={listaTipos}
                        value={tipoSelecionado}
                        onChange={handleSelecaoTipo}
                        error={errors?.tipoDocumentoId}
                        helperText={errors?.tipoDocumentoId?.message}
                        inputLabel={t('tipo_documento')}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(options) => options.descricao}
                    />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="titulo"
                        label={t(`titulo`)} />
                    <ButtonGroup variant="contained">
                        <Button type="submit">{t(`confirmar`)}</Button>
                    </ButtonGroup>
                </Form>
            </ModuloContent>
        </ModuloContainer>
    )
}


