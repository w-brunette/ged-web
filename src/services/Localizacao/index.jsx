export default function translateKey(key) {
    return `[${key}]`
}

export function displayFileSize(size) {
    return size < 1000 ? `${Number.parseFloat(size).toFixed(2)} B`
        : size < 1000000 ? `${Number.parseFloat(size / 1000).toFixed(2)} KB` 
        : size < 1000000000 ? `${Number.parseFloat(size / 1000000).toFixed(2)} MB` 
        : size < 1000000000000 ? `${Number.parseFloat(size / 1000000000).toFixed(2)} GB` 
        : ''
}