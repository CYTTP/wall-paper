<template>
  <div>
    用户信息
    <i class="el-icon-loading"></i>
    <div ref="drag" id="drag">
      <input
        placeholder=""
        placeholder-class="input-placeholder"
        @change="handleFileChange"
        type="file"
        name="file"
      />
    </div>
    <el-progress :percentage="uploadPer" :status="perStatus"></el-progress>
    hash: <el-progress :percentage="hashProgress"></el-progress>
    <div>
      <el-button type="" @click="uploadFile">上传</el-button>
    </div>

    <div class="cube-con" :style="{ width: cubeWidth + 'px' }">
      <div class="cube" v-for="chunk in chunks" :key="chunk.name">
        <div
          :class="{
            uploading: chunk.progress > 0 && chunk.progress < 100,
            success: chunk.progress == 100,
            error: chunk.progress < 0,
          }"
          :style="{ height: chunk.progress + '%' }"
        >
          <i
            class="el-icon-loading"
            v-if="chunk.progress < 100 && chunk.progress > 0"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sparkMD5 from 'spark-md5'
const CHUNK_SIZE = 0.1 * 1024 * 1024
import { isIamge } from '../utils/getImgTypeUtil.js'
export default {
  data() {
    return {
      file: null,
      // uploadPer: 0, //进度百分百
      perStatus: null,
      hashProgress: 0,
      chunks: [],
      hash: '',
    }
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16
    },
    uploadPer() {
      if (!this.file || this.chunks.length) {
        return 0
      }
      const loaded = this.chunks
        .map((item) => item.chunk.size * item.progress)
        .reduce((arr, cur) => arr + crr, 0)
      return Number(((loaded * 100) / this.file.size).toFixed(2))
    },
  },
  methods: {
    //拖拽上传
    bindEvent() {
      const drag = this.$refs.drag
      drag.addEventListener('dragover', (e) => {
        drag.style.borderColor = 'red'
        e.preventDefault()
      })
      drag.addEventListener('dragleave', (e) => {
        drag.style.borderColor = '#eee'
        e.preventDefault()
      })
      drag.addEventListener('drop', (e) => {
        const fileList = e.dataTransfer.files
        drag.style.borderColor = '#eee'
        this.file = fileList[0]
        e.preventDefault()
      })
    },
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = []
      let cur = 0
      while (cur < this.file.size) {
        chunks.push({
          index: cur,
          file: this.file.slice(cur, cur * size),
        })
        cur += size
      }
      return chunks
    },
    async calculateHashWorker() {
      return new Promise((resolve, reject) => {
        this.worker = new Worker('/hash.js')
        this.worker.postMessage({ chunks: this.chunks })
        this.worker.onmessage = (e) => {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress.toFixed(2))
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    async calculateHashIdle() {
      const chunks = this.chunks
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0
        const appendToSpark = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file) //以数组方式读取
            reader.onload = (e) => {
              spark.append(e.target.result)
              resolve()
            }
          })
        }
        const workLoop = async (deadline) => {
          // console.log(count < chunks.length);
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            console.log('出发')
            await appendToSpark(chunks[count].file)
            count++
            if (count < chunks.length) {
              this.hashProgress = Number(
                ((100 * count) / chunks.length).toFixed(2)
              )
            } else {
              this.hashProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workLoop)
        }
        window.requestIdleCallback(workLoop)
      })
    },
    //hash抽样
    async calculateHashSample() {
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()
        const file = this.file
        const size = file.size
        const offset = 2 * 1024 * 1024
        //第一个2m 最后i一个区块数据全要
        let chunks = [file.slice(0, offset)]
        let cur = offset
        while (cur < size) {
          if (cur + offset >= size) {
            //最后一个区块
            chunks.push(file.slice(cur, cur + offset))
          } else {
            //中间的区块
            const mid = cur + offset / 2
            const end = cur + offset
            chunks.push(file.slice(cur, cur + 2))
            chunks.push(file.slice(mid, mid + 2))
            chunks.push(file.slice(end - 2, end))
          }
          cur += offset
        }
        // 中间的取前后各2字节
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = (e) => {
          spark.append(e.target.result)
          this.hashProgress = 100
          resolve(spark.end())
        }
      })
    },
    async uploadFile() {
      if (!this.file) return this.$message('请添加文件')
      // if (!(await isIamge(this.file))) {
      //   return this.$message.warning('文件格式不对,请上传图片类型文件')
      // }
      const chunks = this.createFileChunk(this.file)
      // this.chunks = chunks
      // console.log(chunks);
      // const hash1 = await this.calculateHashWorker()
      // const hash1 = await this.calculateHashIdle()
      // console.log(hash1)

      // return

      const hash = await this.calculateHashSample()
      // console.log(hash)
      this.hash = hash

      //询问后端文件是否上传过 如果没有 是否存在切片
      await this.$http
        .post('/checkfile', {
          hash: this.hash,
          ext: this.file.name.split('.').pop(),
        })
        .then((res) => {
          console.log(res)
          let { uploaded, uploadList } = res.data
          if (uploaded) {
            this.$message.success('秒传成功')
          }

          // console.log(hash2)
          this.chunks = chunks.map((v, index) => {
            //切片名字 hash+index
            const name = hash + '-' + index
            return {
              hash,
              name,
              index,
              chunk: v.file,
              progress: uploadList.indexOf(name) > -1 ? 100 : 0,
            }
          })
          this.uploadChunks(uploadList)
        })
    },
    //上传切片的文件
    async uploadChunks(uploadList) {
      // console.log(uploadList, this.chunks)
      const request = this.chunks
        .filter((chunk) => uploadList.indexOf(chunk.name) == -1)
        .map((v, index) => {
          //转成promise
          const form = new FormData()
          form.append('chunk', v.chunk)
          form.append('hash', v.hash)
          form.append('name', v.name)
          return { form, index: v.index, error: 0 }
        })
      // await Promise.all(request)
      //@todo
      // 尝试申请tcp过多也会造成卡顿
      // 异步的并发控制
      await this.sendAllResquest(request)
      await this.mergeRequset()
    },
    //处理并发 每次发请求限制3个
    async sendAllResquest(parms, limit = 3) {
      //limit 并发数
      return new Promise((resolve, reject) => {
        const len = parms.length
        let count = 0
        let isStop = false
        //启动任务
        const start = async () => {
          if (isStop) return
          let task = parms.shift()
          if (task) {
            const { form, index } = task
            try {
              await this.$http.post('/uploadfile', form, {
                onUploadProgress: (progress) => {
                  this.chunks[index].progress = Number(
                    ((progress.loaded / progress.total) * 100).toFixed(2)
                  )
                },
              })
              if (count == len - 1) {
                //最后一个任务
                resolve()
              } else {
                count++
                // console.log(count)
                //启动下一个任务
                start()
              }
            } catch (e) {
              this.chunks[index].progress = -1
              if (task.error < 3) {
                task.error++
                //错误一次会从新请求发送
                parms.unshift(task)
                start()
              } else {
                //错误三次就停止
                isStop = true
                reject()
              }
            }
          }
        }

        while (limit > 0) {
          //启动任务
          setTimeout(() => {
            start()
          }, Math.random() * 2000)

          limit -= 1
        }
      })
    },
    //合并请求
    async mergeRequset() {
      this.$http.post('/mergefile', {
        ext: this.file.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash,
      })
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      // console.log(file);
      if (!file) return
      this.file = file
    },
  },
  async mounted() {
    await this.$http.get('/user/info').then((res) => {
      console.log(res)
    })
    this.bindEvent()
  },
}
</script>

<style>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
}
.cube-con .cube {
  width: 14px;
  height: 14px;
  line-height: 12px;
  border: 1px solid black;
  background: #eee;
  float: left;
}
.uploading {
  background: blue;
}
.success {
  background: green;
}
.error {
  background: red;
}
</style>
