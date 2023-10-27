import { createChunks } from "./createChunks.js";


onmessage = async (e) => {
    const proms = []
    const { file, CHUNK_SIZE, startIndex, endIndex } = e.data
    // console.log(file, CHUNK_SIZE, startIndex, endIndex);
    console.log(e.data)
    
    for (let index = startIndex; index < endIndex; index++) {
        proms.push(createChunks(file, index, CHUNK_SIZE))

    }
    const chunks = await Promise.all(proms)
    //提交给主线程
    postMessage(chunks)
}