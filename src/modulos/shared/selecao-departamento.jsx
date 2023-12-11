import { useEffect, useState } from "react";
import AutocompleteCustom from "../../components/AutoComplete";
import t from '../../services/Localizacao';
import * as service from '../funcionario/funcionario-service';


const SelecaoDepartamento = ({ disabled, value, onChange, error, helperText }) => {
    const [term, setTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const loading = open && options.length === 0;

    useEffect(() => {
        service.obterListaDepartamentos(term)
            .then(d => setOptions(d.data));
    }, [term])

    useEffect(() => {
        if (!open) {
            setOptions([]);
            return;
        }
    }, [open])

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }

        (async () => {
            const res = await service.obterListaDepartamentos('');
            if (active) {
                setOptions(res.data);
            }

        })()
        return () => {
            active = false;
        };
    }, [loading])

    const handleSelecao = (e, newValue) => {
        if (onChange instanceof Function) {
            onChange(e, newValue);
        }
    }

    const handlePesquisar = (_, newValue) => {
        setTerm(newValue ?? '');
    }

    return (
        <AutocompleteCustom
            isOptionEqualToValue={(option, value) => option.departamentoId === value.departamentoId}
            getOptionLabel={(option) => option.nome}
            disabled={disabled}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            inputValue={term}
            onInputChange={handlePesquisar}
            inputLabel={t('departamento')}
            helperText={helperText}
            error={error}
            options={options}
            value={value}
            onChange={handleSelecao}
        />
    )
}
export default SelecaoDepartamento;