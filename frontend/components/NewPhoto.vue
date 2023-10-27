<template>
  <div class="photos">
    <div class="labels">
      <!-- <p class="title">选择标签</p> -->
      <div class="label">
        <p
          v-for="(e, index) in label[1]"
          :key="index"
          class="label-item"
          :class="{ labelselected: index == labelSelected }"
          @click="changeLabel(index)"
        >
          {{ e }}
        </p>
      </div>
    </div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      action=""
      :limit="1"
      :auto-upload="false"
      :on-change="fileArr"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        支持所有类型图片、视频，将文件拖到此处，或<em>点击上传</em>，最多只能上传
        1 个文件
      </div>
      <!-- <div class="el-upload__tip" slot="tip">
        支持所有类型图片、视频
      </div> -->
    </el-upload>

    <div class="btn1">
      <IButton
        size="samll"
        class="del"
        active="secondary"
        @click.native="closeModal"
        >丢弃</IButton
      >
      <IButton size="samll" class="sbumit" @click.native="submit">确定</IButton>
    </div>
  </div>
</template>

<script>
import {
  cardColor, // 输入卡片背景色
  cardColorBlock, //颜色块
  label, //标签
} from '@/utils/data'

import { cutFile } from '@/static/cutFile'
import sparkMD5 from 'spark-md5'
const CHUNK_SIZE = 0.1 * 1024 * 1024
let chunkSize = 3
const multipleSize = 10
const uploadParams = {}
let localDataParams = {}
export default {
  name: 'NewPhoto',
  props: {
    id: {
      default: 1,
    },
  },
  data() {
    return {
      cardColorBlock: [],
      cardColor: [],
      label: [],
      //当前选中标签
      labelSelected: 0,
      BatchAddfile: [], //批量添加文件
      // 允许上传的文件类型
      fileTypeList: ['png', 'jpg', 'jpeg', 'gif'],
      chunks: [],
      hash: '',
      // file: null,
    }
  },
  mounted() {
    this.cardColorBlock = cardColorBlock
    this.cardColor = cardColor
    this.label = label
  },
  methods: {
    // 切换标签
    changeLabel(e) {
      this.labelSelected = e
    },
    closeModal() {
      this.$emit('closeModal')
    },
    fileArr(file) {
      // this.beforeUpload(file)
      this.BatchAddfile = file.raw
      console.log(this.BatchAddfile)
    },
    async submit() {
      if (this.BatchAddfile == '') {
        this.$notify({
          type: 'warning',
          position: 'top-left',
          message: '文件不能为空，请添加文件',
          duration: 2000,
          offset: 100,
        })
        return
      }
      this.isMultiple(this.BatchAddfile)
    },
    // 2.判断是不是需要分片上传, 用兆fileSizeM来进行比对，计算
    isMultiple(file, index = 0) {
      const { name, size, lastModified, type } = file
      const fileSizeM = Math.ceil(size / 1024 / 1024)
      const saveFileId = `${lastModified}_${fileSizeM}_${name}_${type}`
      if (fileSizeM < multipleSize) {
        // 直接上传
        this.directUpload({ file, name })
        // console.log('直接上传')
      } else {
        // 分片上传
        // @todo
      }
    },

    // 4.当上传得片数和所有得切片数量一致时进行合并
    async merge(name) {
      this.$http.post('/merge', { name: name }).then((res) => {
        console.log('合并上传')
      })
    },

    // 小于50兆直接上传
    async directUpload({ file, name }) {
      // 直接上传
      const formData = this.handleFormData({ file, name })
      await this.$http.post('/simpleUpload', formData).then((res) => {
        console.log(res)
        if (res.code === 200) {
          //文件上传完成后，文件依旧存在页面当中, 记得删除
          this.$refs.upload.clearFiles()

          let photoData = {
            imgPath: res.data.url,
            moment: res.data.time,
          }
          this.$emit('clickbt', photoData)
          this.$notify({
            type: 'success',
            position: 'top-left',
            message: '照片添加成功',
            duration: 2000,
            offset: 100,
          })
        }
      })
    },

    // 创建formData
    handleFormData({ file, name }) {
      const blobFile = new File([file], name)
      const formData = new FormData()
      formData.append('file', blobFile)
      formData.append('userId', this.$store.getters['user/getuserId'])
      formData.append('username', this.$store.getters['user/getusername'])
      formData.append('label', this.labelSelected)
      formData.append('moment', new Date())
      return formData
    },
    //hash抽样
    async calculateHashSample(file) {
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()
        // const file = this.file
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
    //上传之前做文件类型和大小判断
    beforeUpload(file) {
      let arr = file.name.split('.')
      let istrue = this.fileTypeList.indexOf(arr[arr.length - 1])
      if (istrue == -1) {
        this.$notify({
          type: 'warning',
          position: 'top-left',
          message: '错误！文件格式不支持',
          duration: 2000,
          offset: 100,
        })
        return false
      }
      // if (file.size > 10485760) {
      //   this.$message.warning('错误！文件大小不能超过10M')
      //   return false
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
.photos {
  // border: 1px solid #000;
  margin: 0 20px;
  height: 260px;

  .label {
    display: flex;
    flex-wrap: wrap;
    // height:20px;
    // width: 320px;
    padding-bottom: 10px;
    cursor: pointer;

    .label-item {
      padding: 2px 10px;
      border-radius: 20px;
      margin: 0 4px 0 0;
      color: #5b5b5b;
      transition: all 0.3s;
    }

    .labelselected {
      background: #ebebeb;
      font-weight: 600;
      color: #202020;
    }
  }
  .upload-demo {
    width: 400px;
    ::v-deep .el-upload-dragger {
      // background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      box-sizing: border-box;
      width: 754px;
      height: 180px;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
    }
  }

  .btn1 {
    position: fixed;
    display: flex;
    justify-content: right;
    padding: 10px;
    box-sizing: border-box;
    height: 50px;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.4);
    width: 100%;
    backdrop-filter: blur(10px);
    .del {
      width: 100px;
      background: #eee;
      border-radius: 24px;
    }
    .sbumit {
      margin-left: 20px;
      width: 100px;
      height: 50px;
    }
  }
}
</style>
