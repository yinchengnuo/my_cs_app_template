import Table from './Table.vue'
import { replaceNull } from '@/utils'

const span = document.createElement('span')
span.id = 'ColumnWidth'
span.style.fontSize = '14px'
span.style.fontWeight = '400'
span.style.letterSpacing = '0px'
span.style.visibility = 'hidden'
document.body.appendChild(span)

export const error = (message) => {
    console.error(`%c ${message}`, 'font-size: 25px')
    throw new Error(message)
}

export default {
    install: (app) => {
        app.component('Table', Table)
        Object.entries(import.meta.glob('./components/*.vue', { eager: true })).forEach(([key, value]) => {
            app.component(replaceNull(key, ['./components/', '.vue']), value.default)
        })
    }
}
