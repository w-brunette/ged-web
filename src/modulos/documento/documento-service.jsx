import Axios from '../../services/Axios';
const axios = Axios({
    baseAddress: "http://localhost:5000/api/"
});

const obterDocumentos = async (opts) => {
    const paged = await axios.get(`documentos?page=${opts.page}&pageSize=${opts.pageSize}&term=${opts.term}`);
    return paged;
}
const obterDocumento = async (documentoId) => {
    const doc = await axios.get(`documentos/${documentoId}`)
    return doc;
}
const excluirDocumento = async (id) => {
    const response = await axios.delete(`documentos/${id}`);
    return response;
}

const incluirDocumento = async (formData) => {
    const response = await axios.post(`documentos`, formData);
    return response;
}

const atualizarDocumento = async (documentoId, formData) => {
    const response = await axios.put(`documentos/${documentoId}`, formData);
    return response;
}

const incluirAnexo = async (documentoId, formData) => {
    const response = await axios.postForm(`documentos/${documentoId}/anexos`, formData);
    return response;
}

const obterAnexos = async (documentoId) => {
    const response = await axios.get(`documentos/${documentoId}/anexos`);
    const obj = {
        anexo: response.find(x => x.tipo === "V"),
        anexoBase: response.find(x => x.tipo === "B"),
    };
    return obj;
}

const enviarAprovacao = async (documentoId) => {
    const response = await axios.post(`documentos/${documentoId}/enviaraprovacao`);
    return response;
}

const reenviarAprovacao = async (documentoId) => {
    const response = await axios.post(`documentos/${documentoId}/enviaraprovacao`);
    return response;
}

const cancelarAprovacao = async (documentoId) => {
    const response = await axios.post(`documentos/${documentoId}/cancelaraprovacao`);
    return response;
}

const aprovar = async (documentoId) => {
    const response = await axios.post(`documentos/${documentoId}/aprovar`);
    return response;
}
const reprovar = async (documentoId) => {
    const response = await axios.post(`documentos/${documentoId}/reprovar`);
    return response;
}

const obterAprovadoresDocumento = async (documentoId) => {
    const aprovadores = await axios.get(`documentos/${documentoId}/aprovadores`)
    return aprovadores;
}
const obterFiliaisDocumento = async (documentoId) => {
    const aprovadores = await axios.get(`documentos/${documentoId}/filiais`)
    return aprovadores;
}
const incluirFilial = async (documentoId, jsondata) => {
    const response = await axios.post(`documentos/${documentoId}/filiais`, jsondata);
    return response;
}

const excluirFilial = async (documentoId, filialId) => {
    const response = await axios.delete(`documentos/${documentoId}/filiais/${filialId}`);
    return response;
}

const obterListaAprovadores = async (term) => {
    const paged = await axios.get(`funcionarios?page=1&pageSize=10&term=${term}`)
    return paged.data?.map(it => {
        return {
            aprovadorId: it.funcionarioId,
            nome: it.nome
        }
    });
}

const obterListaTipos = async (term) => {
    const paged = await axios.get(`tipos?page=1&pageSize=10&term=${term}`)
    return paged.data?.map(it => {
        return {
            id: it.tipoDocumentoId,
            descricao: it.descricao
        }
    });
}
const obterListaFiliais = async (term) => {
    const paged = await axios.get(`filiais?page=1&pageSize=10&term=${term}`)
    return paged.data?.map(it => {
        return {
            id: it.filialId,
            nome: it.nome
        }
    });
}


export {
    aprovar, 
    reprovar,
    atualizarDocumento,
    excluirDocumento,
    incluirDocumento,
    obterDocumento,
    obterDocumentos,
    obterAprovadoresDocumento,
    enviarAprovacao,
    reenviarAprovacao,
    cancelarAprovacao,
    incluirAnexo,
    obterAnexos,
    obterFiliaisDocumento,
    incluirFilial,
    excluirFilial,
    obterListaFiliais,
    obterListaAprovadores,
    obterListaTipos,
};

