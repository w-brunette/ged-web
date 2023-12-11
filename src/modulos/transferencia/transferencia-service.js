import Axios from '../../services/Axios';
const axios = Axios({
    baseAddress: `http://localhost:5000/api/`
})

const obterTransferencias = async ({ page, pageSize, term }) => {
    const paged = await axios.get(`transferencias?page=${page}&pageSize=${pageSize}&term=${term}`)
    return paged;
}

const obterTransferencia = async (transferenciaId) => {
    const paged = await axios.get(`transferencias/${transferenciaId}`)
    return paged;
}

const obterDocumentos = async (transferenciaId) => {
    const docs = await axios.get(`transferencias/${transferenciaId}/documentos`)
    return docs;
}

const incluirTransferencia = async (formData) => {
    const response = await axios.post(`transferencias`, formData);
    return response;
}

export {
    incluirTransferencia,
    obterTransferencia,
    obterTransferencias,
    obterDocumentos
};
