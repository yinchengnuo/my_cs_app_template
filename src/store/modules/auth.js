import Store from '@/store'
import { apiGetUserInfo } from '@/api/登录'

const auth = {
    namespaced: true,
    state: {
        menus: [],
        buttons: []
    },
    actions: {
        getMenus({ state }) {
            return new Promise((resolve, reject) => {
                Promise.all([apiGetUserInfo({ menuType: 0, projectCode: Store.state.app.name }), apiGetUserInfo({ menuType: 1, projectCode: Store.state.app.name })])
                    .then((res) => {
                        state.menus = res[0].menus
                        state.buttons = res[1].menus
                        resolve(state)
                    })
                    .catch(reject)
            })
        }
    }
}

export default auth
