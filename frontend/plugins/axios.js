import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'
const service = axios.create({
    baseURL: '/api'
})

export default ({ store, redirect }) => {

    /**
     * 请求拦截器
     */
    service.interceptors.request.use(
        (config) => {
            // 在请求发送之前做些什么
            // 可以在这里设置请求头等信息
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.common['Authorization'] = 'Bearer ' + token;
            }
            //config配置对象,headers属性请求头,经常给服务器端携带公共参数
            return config;
        },
        (error) => {
            // 对请求错误做些什么
            return Promise.reject(error);
        }
    );

    /**
     * 响应拦截器
     */
    service.interceptors.response.use(
        (response) => {
            let { data } = response
            if (data.code == 205) {
                MessageBox.confirm('登录已过期', '过期', {
                    confirmBttonText: '登录',
                    showCancelButton: false,
                    type: 'warning'

                }).then(() => {
                    localStorage.removeItem('token')
                    redirect({ path: '/login_register' })
                })

            }

            // 对响应数据做些什么
            return data
        },
        (error) => {
            // 对响应错误做些什么
            return Promise.reject(error);
        }
    );

}
Vue.prototype.$http = service

export const http = service