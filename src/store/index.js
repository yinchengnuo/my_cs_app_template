import { createStore } from 'vuex'


const Store = createStore({
    modules: Object.entries(import.meta.glob('./modules/*.js', { eager: true })).reduce((t, e) => ({ ...t, [e[0].replace('./modules/', '').replace('.js', '')]: e[1].default }), {})
})

export default Store
