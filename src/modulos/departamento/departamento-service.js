import Axios from '../../services/Axios';
const axios = Axios({ baseAddress: `http://localhost:5000/api/` });

const obterDepartamentos = async (opts) => {
    const paged = await axios.get(`departamentos?page=${opts.page}&pageSize=${opts.pageSize}&term=${opts.term}`);
    return paged;
}
const obterDepartamento = async (departamentoId) => {
    const paged = await axios.get(`departamentos/${departamentoId}`);
    return paged;
}
const excluirDepartamento = async (id) => {
    const response = await axios.delete(`departamentos/${id}`);
    return response;
}

const incluirDepartamento = async (formData) => {
    const response = await axios.post(`departamentos`, formData);
    return response;
}

const atualizarDepartamento = async (departamentoId, formData) => {
    const response = await axios.put(`departamentos/${departamentoId}`, formData);
    return response;
}

const obterAprovadores = async (departamentoId) => {
    const aprovadores = await axios.get(`departamentos/${departamentoId}/aprovadores`)
    return aprovadores;
}
const excluirAprovador = async (departamentoId, aprovadorId) => {
    const aprovadores = await axios.delete(`departamentos/${departamentoId}/aprovadores/${aprovadorId}`)
    return aprovadores;
}

const incluirAprovador = async (departamentoId, aprovadorId) => {
    const aprovadores = await axios.post(`departamentos/${departamentoId}/aprovadores`, {
        aprovadorId
    })
    return aprovadores;
}


export {
    atualizarDepartamento,
    excluirAprovador,
    excluirDepartamento,
    incluirAprovador,
    incluirDepartamento,
    obterAprovadores,
    obterDepartamento,
    obterDepartamentos
};

