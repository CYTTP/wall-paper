/**
 * 计算图片类型 
 * 根据图片16进制
 * 
 * @auth  
 */
//读取图片文件头部信息
const blobToString = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function () {
            const ret = reader.result
                .split('')
                .map((v) => v.charCodeAt())
                .map((v) => v.toString(16).toUpperCase())
                .map((v) => v.padStart(2, '0'))
                .join(' ')
            resolve(ret)
        }
        reader.readAsBinaryString(blob)
    })
}

const isGif = (file) => {
    const res = blobToString(file.slice(0, 6))
    const isGif = res == '47 49 46 38 39 61' || res == '47 49 46 38 37 61'
    return isGif
}

const isPng = (file) => {
    const res = blobToString(file.slice(0, 8))
    const isPng = res == '89 50 4E 47 0D 0A 1A 0A' // '89 50 4E 47 D A 1A A'
    return isPng
}
const isJpg = (file) => {
    const len = file.size
    const start = blobToString(file.slice(0, 2))
    const tail = blobToString(file.slice(-2, len))
    const isJpg = start == 'FF D8' && tail == 'FF D9'
    return isJpg
}

export const isIamge = (file) => {
    return (
        (isGif(file)) ||
        (isPng(file)) ||
        (isJpg(file))
    )
}