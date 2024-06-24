import SSTable from './index.vue'
import STable from '@surely-vue/table'
import '@surely-vue/table/dist/index.less'



export const numberToLocaleString = (number) => number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })

export const getElementById = (id) => document.getElementById(id)

export const error = (message) => {
    setTimeout(() => {
        console.clear()
        console.error(`%c ${message}`, 'font-size: 66px')
    })
    throw new Error(message)
}

export const emptyText = (scope) => {
    return scope.column.dataIndex && scope.column.dataIndex !== 'action' && (scope.value === null || scope.value === undefined) && '-'
}

export default {
    install: (app) => {
        app.use(STable)
        app.component('SSTable', SSTable)
    }
}
