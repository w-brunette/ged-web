import Axios from '../../services/Axios';
var axios = Axios({
    baseAddress: `http://localhost:5000/api/`
});

const obterTipos = async (opts) => {
    const paged = await axios.get(`tipos?page=${opts.page}&pageSize=${opts.pageSize}&term=${opts.term}`);
    return paged;
}
const obterTipo = async (tipoId) => {
    const response = await axios.get(`tipos/${tipoId}`)
    return response;
}
const excluirTipo = async (tipoId) => {
    const response = await axios.delete(`tipos/${tipoId}`);
    return response;
}

const incluirTipo = async (formData) => {
    const response = await axios.post(`tipos`, formData);
    return response;
}

const atualizarTipo = async (tipoId, formData) => {
    const response = await axios.put(`tipos/${tipoId}`, formData);
    return response;
}
const obterAprovadores = async (id) => {
    const response = await axios.get(`tipos/${id}/aprovadores`);
    return response;
}
const incluirAprovador = async (tipoDocumentoId, jsonData) => {
    const response = await axios.post(`tipos/${tipoDocumentoId}/aprovadores`, jsonData);
    return response;
}
const excluirAprovador = async (tipoDocumentoId, id) => {
    const response = await axios.delete(`tipos/${tipoDocumentoId}/aprovadores/${id}`);
    return response;
}
const incluirDepartamento = async (tipoDocumentoId, jsonData) => {
    const response = await axios.post(`tipos/${tipoDocumentoId}/departamentos`, jsonData);
    return response;
}
const excluirDepartamento = async (tipoDocumentoId, id) => {
    const response = await axios.delete(`tipos/${tipoDocumentoId}/departamentos/${id}`);
    return response;
}
const obterDepartamentos = async (tipoDocumentoId) => {
    const response = await axios.get(`tipos/${tipoDocumentoId}/departamentos`)
    return response;
}
const obterListaAprovadores = async (term) => {
    const response = await axios.get(`funcionarios?page=1&pageSize=10&term=${term}`)
        .then(d => d.data.map((it) => {
            return {
                id: it.funcionarioId,
                nome: it.nome
            }
        }))
    return response;
}
const obterListaDepartamentos = async (term) => {
    const response = await axios.get(`departamentos?page=1&pageSize=10&term=${term}`)
        .then(d => d.data.map((it) => {
            return {
                id: it.departamentoId,
                nome: it.nome
            }
        }))
    return response;
}

const obterListaTags = async () => {
    const response = await axios.get(`tags`)
        .then(d => d.map(it => {
            return {
                id: it,
                codigo: it,
            }
        }))
    return response;
}

export {
    atualizarTipo, excluirAprovador, excluirDepartamento, excluirTipo, incluirAprovador, incluirDepartamento, incluirTipo, obterAprovadores, obterDepartamentos, obterListaAprovadores,
    obterListaDepartamentos,
    obterListaTags, obterTipo,
    obterTipos
};

