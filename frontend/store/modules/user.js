
const state = () => ({
    userInfo: {
        username: '',
        email: '',
        id: '',
        avatar: ''
    },
    isLogin: false
});
const mutations = {
    SET_PREFILE(state, platform) {
        state.userInfo = platform;
    },
    SET_LOGIN(state, params) {
        state.isLogin = params;
    }
}

const actions = {

    setLogin({ commit }, params) {
        commit('SET_LOGIN', params);
    },
    setPrefile({ commit }, platform) {
        commit('SET_PREFILE', platform);
    }
}

const getters = {
    getusername: (state) => state.userInfo.username,
    getuserId: (state) => state.userInfo.id,
    getIsLogin: (state) => state.isLogin,
    getUserAvatar: (state) => state.userInfo.avatar
}

export default {
    namespaced: true, // 正确写法

    state,
    mutations,
    actions,
    getters
}

