
const { fetch: originalFetch } = window;
const commomHeaders = new Headers({
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZnVsbG5hbWUiOiJXaWxsaWFtIEJydW5ldHRlIiwidXNlcm5hbWUiOiJ3YnJ1bmV0dGUiLCJlbWFpbCI6IndpbGxfYnJ1bmV0dGVAaG90bWFpbC5jb20iLCJmdW5jaW9uYXJpb0lkIjo5LCJpYXQiOjE1MTYyMzkwMjIsInJvbGVzIjpbInJldmlzb3IiLCJsZWl0b3IiXX0.-DSX02-pijeLAghc3oH4qGaiugNjBbbaV_kEegUQWYc',
    "Content-Type": "application/json; charset=UTF-8",
})

window.fetch = async (...args) => {
    const [resource, config] = args
    var response = await originalFetch(resource, config);
    if (!response.ok) {
        throw response.status + ' ' + response.statusText;
    }
    return response;
}

async function post(url, formData) {
    const r = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: commomHeaders
    });
    return r;
}
async function postForm(url, formData) {
    const r = await fetch(url, {
        method: "POST",
        body: formData,
        headers: commomHeaders
    });
    return r;
}
async function put(url, formData) {
    const r = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: commomHeaders
    });
    return r;
}

async function remove(url) {
    const r = await fetch(url, {
        method: "DELETE",
        headers: commomHeaders
    });
    return r;
}


const get = async (url, options) => {
    const r = await fetch(url, {
        headers: commomHeaders
    }).then(r => r.json());
    return r;
}

const Axios = ({ baseAddress }) => {
    return {
        post: (url, jsonData) => post(baseAddress + url, jsonData),
        postForm: (url, formData) => postForm(baseAddress + url, formData),
        getBlob: (url, options) => get(baseAddress + url, options).then(d => d.blob()),
        get: (url, options) => get(baseAddress + url, options),
        put: (url, jsonData) => put(baseAddress + url, jsonData),
        delete: (url) => remove(baseAddress + url),
    }
};


export default Axios