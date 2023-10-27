import SparkMD5 from "spark-md5";

/**
 * 
 * @param {*} file 文件
 * @param {*} index 
 * @param {*} chunkSize 
 * @returns 
 */

export function createChunks(file, index, chunkSize) {
    return new Promise((resolve, reject) => {
        const start = index * chunkSize
        const end = start + chunkSize
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            spark.append(e.target.result)
            resolve({
                start,
                end,
                index,
                hash: spark.end()
            })
        }
        fileReader.readAsArrayBuffer(file.slice(start, end))
    })

}