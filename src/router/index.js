import Store from '@/store'
import routes from './routes'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { getObjectByKeyInTree } from '@/utils'
import { createRouter, createWebHashHistory } from 'vue-router'

NProgress.configure({
    showSpinner: false
})

const Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/首页',
            component: () => import('@/layout/Layout.vue'),
            children: [
                { path: '/登录', component: () => import('@/pages/登录/登录.vue') },
                {
                    path: '/',
                    redirect: '/首页',
                    component: () => import('@/layout/components/ViewBar/ViewBar.vue'),
                    children: [
                        { path: '/首页', meta: { auth: false }, component: () => import('@/pages/首页/首页.vue') },
                        { path: '/刷新', meta: { auth: false }, component: () => import('@/pages/刷新/刷新.vue') },
                        { path: '/401', meta: { auth: false }, component: () => import('@/pages/401/401.vue') },
                        { path: '/404', meta: { auth: false }, component: () => import('@/pages/404/404.vue') },
                        ...routes
                    ]
                },
                { path: '/忘记密码', meta: { auth: false }, component: () => import('@/pages/忘记密码/忘记密码.vue') }
            ]
        }
    ]
})

Router.beforeEach(async ({ path, meta }) => {
    NProgress.start()
    if (path !== decodeURIComponent(path)) {
        return {
            replace: true,
            path: decodeURIComponent(path)
        }
    }
    if (path === '/登录' || path === '/忘记密码') {
        sessionStorage.clear()
        return true
    } else {
        if (sessionStorage.length) {
            if (!Store.state.userinfo.all) {
                try {
                    await Store.dispatch('userinfo/getToken')
                    await Store.dispatch('userinfo/getUserInfo')
                    await Store.dispatch('auth/getMenus')
                } catch (error) {
                    return { path: '/登录', replace: true }
                }
            } else {
                if (!Router.getRoutes().find((e) => e.path === path)) {
                    const redirect = getObjectByKeyInTree(Store.state.auth.menus, 'url', path)
                    if (redirect && redirect.children && redirect.children.length) {
                        return { path: redirect.children[0].path, replace: true }
                    }
                    return { path: '/404', replace: true }
                }
                if (getObjectByKeyInTree(Store.state.auth.menus, 'url', path) === null && meta.auth !== false) {
                    return { path: '/401', replace: true }
                }
            }
            Store.commit('tab/ADD_TAB', { path })
            return true
        } else {
            return { path: '/登录', replace: true }
        }
    }
})

Router.afterEach(() => {
    NProgress.done()
})

export default Router
