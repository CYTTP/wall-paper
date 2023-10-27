

const CHUNK_SIZE = 1024 * 1024 * 1 //5M
const THREAD_COUNT =  4 //线程数量 开启4个webworker

export function cutFile(file) {
    return new Promise((resolve) => {
        const result = []
        const chunkCount = Math.ceil(file.size / CHUNK_SIZE) //分片总数
        //每一个线程处理的分片数量
        const workerChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
        const finishCount = 0 //判断线程是否完成
        for (let index = 0; index < THREAD_COUNT; index++) {
            //创建一个新的 worker线程
            const worker = new Worker('/worker.js', {
                type: 'module'
            })
            // console.log(worker);
            //计算每个线程的开始索引和结束索引
            const startIndex = index * workerChunkCount
            let endIndex = startIndex + workerChunkCount
            if (endIndex > chunkCount) {
                endIndex = chunkCount
            }
            worker.postMessage({
                file,
                CHUNK_SIZE,
                startIndex,
                endIndex
            })
            worker.onmessage = (e) => {
                console.log(e.data);
                for (let i = startIndex; i < endIndex; i++) {
                    result[i] = e.data[i - startIndex];
                }
                worker.terminate()
                finishCount++
                if (finishCount === THREAD_COUNT) {
                    console.log(result);
                    resolve(result)
                }
            }
        }
        // for (let index = 0; index < chunkCount; index++) {
        //     // console.log(chunkCount);
        //     const chunk = await createChunks(file, index, CHUNK_SIZE)
        //     result.push(chunk)
        // }
    })
}





