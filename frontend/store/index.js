import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

export default () => new Vuex.Store({
    // 模块化
    modules: {
        user: user
    }
});