import Axios from '../../services/Axios';

const axios = Axios({
    baseAddress: `http://localhost:5000/api/`
});

const obterFuncionarios = async (opts) => {
    const paged = await axios.get(`funcionarios?page=${opts.page}&pageSize=${opts.pageSize}&term=${opts.term}`);
    return paged;
}
const obterFuncionario = async (funcionarioId) => {
    const paged = await axios.get(`funcionarios/${funcionarioId}`)
    return paged;
}
const obterListaCargos = async (term) => {
    const paged = await axios.get(`cargos?page=${1}&pageSize=${10}&term=${term}`);
    return paged;
}
const obterListaDepartamentos = async (term) => {
    const paged = await axios.get(`departamentos?page=${1}&pageSize=${10}&term=${term}`);
    return paged;
}
const excluirFuncionario = async (id) => {
    const response = await axios.delete(`funcionarios/${id}`);
    return response;
}

const incluirFuncionario = async (formData) => {
    const response = await axios.post(`funcionarios`, formData);
    return response;
}

const atualizarFuncionario = async (funcionarioId, formData) => {
    const response = await axios.put(`funcionarios/${funcionarioId}`, formData);
    return response;
}

export {
    atualizarFuncionario,
    excluirFuncionario,
    incluirFuncionario,
    obterFuncionario,
    obterFuncionarios,
    obterListaCargos as obterListaCargos,
    obterListaDepartamentos as obterListaDepartamentos
};
