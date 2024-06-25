import fs from 'fs'
import path from 'path'
import buildOptions from './env.js'
import { execSync } from 'child_process'
import { build, Platform } from 'electron-builder'

const Package = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString())

const target = process.env.npm_lifecycle_event.split(':')[1]
const env = process.env.npm_lifecycle_event.split(':')[2] || ''

const buildOption = buildOptions.find((e) => e.tag === env)
const ENVJS = fs.readFileSync(path.resolve('./main/env.js')).toString()
const INDEXJS = fs.readFileSync(path.resolve('./main/index.js')).toString()
fs.writeFileSync(path.resolve('./dist/env.js'), ENVJS)
Package.build.publish.url = buildOption.url
Package.build.appId = `${Package.build.appId}.${buildOption.tag}`
Package.build.productName = `${buildOption.name}${Package.build.productName}`
fs.writeFileSync(path.resolve('./dist/index.js'), INDEXJS.replace('appName', Package.build.productName.replace(buildOption.name, '')).replace('local', env))
Package.build.files.slice(2).forEach((file) => fs.copyFileSync(path.resolve(file.replace('dist', 'main')), path.resolve(file)))

if (buildOption.tag === 'dev') Package.build.productName = Package.build.productName.replace(buildOption.name, '集成测试环境')

try {
    execSync(`${process.platform === 'win32' ? 'rmdir /s /q' : 'rm -rf'} ${path.resolve('./build')}`)
} catch (_) {}

fs.mkdirSync(path.resolve('./build'))
fs.writeFileSync(
    path.resolve('./build/installer.nsh'),
    `!macro preInit
    SetRegView 64
      WriteRegExpandStr HKLM "\${INSTALL_REGISTRY_KEY}" InstallLocation "D:\\${Package.build.appId}"
      WriteRegExpandStr HKCU "\${INSTALL_REGISTRY_KEY}" InstallLocation "D:\\${Package.build.appId}"
      SetRegView 32
      WriteRegExpandStr HKLM "\${INSTALL_REGISTRY_KEY}" InstallLocation "D:\\${Package.build.appId}"
      WriteRegExpandStr HKCU "\${INSTALL_REGISTRY_KEY}" InstallLocation "D:\\${Package.build.appId}"
    !macroend`
)

if (target === 'mac') await build({ config: Package.build, targets: Platform.MAC.createTarget() })

if (target === 'win') await build({ config: Package.build, targets: Platform.WINDOWS.createTarget() })
