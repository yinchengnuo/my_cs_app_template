import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Package from './package.json'
import { execSync } from 'child_process'
import { replaceNull } from './src/utils'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    base: '',
    server: {
        strictPort: true
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        {
            name: 'my',
            enforce: 'pre',
            transform(code, id) {
                if (id.startsWith(path.join(__dirname, '/src/views/').replace(/\\/g, '/')) && path.extname(id) === '.vue') {
                    const names = replaceNull(id, [`/${path.basename(id)}`, path.join(__dirname, '/src/views').replace(/\\/g, '/')], '/')
                    if (names.at(-1) === path.basename(id, '.vue')) {
                        code += `
                        <script>
                            export default {
                                name: '${names.join('/')}'
                            }
                        </script>`
                    }
                }
                return code
            },
            configureServer(server) {
                server.httpServer?.on('listening', async () => {
                    try {
                        execSync(`${process.platform === 'win32' ? 'rmdir /s /q' : 'rm -rf'} ${path.resolve('./dist')}`)
                    } catch (_) {}
                    fs.mkdirSync(path.resolve('./dist'))
                    Package.build.files.forEach((file) => fs.copyFileSync(path.resolve(file.replace('dist', 'main')), path.resolve(file)))
                })
            }
        },
        {
            name: 'version',
            apply: 'build',
            closeBundle() {
                fs.writeFileSync(path.resolve('./dist/version'), JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString()).web_version)
            }
        }
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
