import axios from 'axios';

// 定义一个httpClient axios实例
const httpClient = axios.create({
    baseURL: '',
    timeout: 30000,
});

export default httpClient;