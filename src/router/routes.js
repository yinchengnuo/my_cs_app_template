import { replaceNull } from '@/utils'

export default Object.entries(import.meta.glob('/src/views/**/*.vue'))
    .filter(([path]) => replaceNull(path, ['.vue'], '/').at(-1) === replaceNull(path, ['.vue'], '/').at(-2))
    .map(([path, component]) => ({ path: replaceNull(path, ['/src/views', '.vue'], '/').slice(0, -1).join('/'), component }))
