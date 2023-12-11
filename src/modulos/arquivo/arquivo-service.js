import Axios from '../../services/Axios'
const axios = Axios({
    baseAddress: `http://localhost:5000/api/`
})

const obterArquivos = async ({ page, pageSize, term }) => {
    const paged = await axios.get(`arquivos?page=${page}&pageSize=${pageSize}&term=${term}`)
    return paged;
}
const obterArquivo = async (arquivoId) => {
    const paged = await axios.get(`arquivos/${arquivoId}`)
    return paged;
}
const excluirArquivo = async (arquivoId) => {
    const response = await axios.delete(`arquivos/${arquivoId}`);
    return response;
}

const incluirArquivo = async (formData) => {
    const response = await axios.postForm(`arquivos`, formData);
    return response;
}

const atualizarArquivo = async (arquivoId, formData) => {
    const response = await axios.put(`arquivos/${arquivoId}`, formData);
    return response;
}

export {
    atualizarArquivo,
    excluirArquivo,
    incluirArquivo,
    obterArquivo,
    obterArquivos
};
