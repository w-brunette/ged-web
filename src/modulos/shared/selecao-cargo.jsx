import { useEffect, useState } from "react";
import AutocompleteCustom from "../../components/AutoComplete";
import t from '../../services/Localizacao';
import * as service from '../funcionario/funcionario-service';


 const SelecaoCargo = ({ disabled, value, onChange, error, helperText }) => {
    const [term, setTerm] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (term === '') return;
        service.obterListaCargos(term)
            .then(d => setOptions(d.data));
    }, [term])

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
            isOptionEqualToValue={(option, value) => option.cargoId === value.cargoId}
            getOptionLabel={(option) => option.nome}
            disabled={disabled}
            inputValue={term}
            onInputChange={handlePesquisar}
            inputLabel={t('cargo')}
            helperText={helperText}
            error={error}
            options={options}
            value={value}
            onChange={handleSelecao}
        />
    )
}
export default SelecaoCargo;