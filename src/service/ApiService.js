import axios from 'axios'

const httpClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? "http://api.hro.int/":"http://api.hro.int/",
})

class ApiService {

    constructor(apiurl, headers){
        this.apiurl = apiurl;
        this.headers = headers;
    }

    post(url, objeto){
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.post(requestUrl, objeto, {headers:this.headers})
    }

    patch(url, objeto){
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.patch(requestUrl, objeto, {headers:this.headers})
    }

    put(url, objeto){
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.put(requestUrl, objeto, {headers:this.headers})
    }

    delete(url){
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.delete(requestUrl, {headers:this.headers})
    }

    get(url){
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.get(requestUrl, {headers:this.headers})
    }
}

export default ApiService