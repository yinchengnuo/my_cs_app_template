import CryptoJS from 'crypto-js'

const off = '3aW%^&Fd'
const password = '%SaFz$^p'

function createKey(password) {
    if (password == null) {
        password = ''
    }
    const sb = [...password]
    let s = ''

    while (sb.length < 32) {
        sb.push(' ')
    }
    s = sb.toString().replace(/,/g, '').substring(0, 32)

    return CryptoJS.enc.Utf8.parse(s)
}

function createIV(iv) {
    if (iv == null) {
        iv = ''
    }
    const sb = [...iv]
    let s = ''
    while (sb.length < 16) {
        sb.push(' ')
    }
    s = sb.toString().replace(/,/g, '').substring(0, 16)
    return CryptoJS.enc.Utf8.parse(s)
}

export default {
    en: function (word) {
        const encrypted = CryptoJS.AES.encrypt(word, createKey(password), {
            iv: createIV(off),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return CryptoJS.enc.Base64.stringify(encrypted?.ciphertext)
    },
    de: function (word) {
        const decrypt = CryptoJS.AES.decrypt(word, createKey(password), {
            iv: createIV(off),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

        return decryptedStr
    }
}
