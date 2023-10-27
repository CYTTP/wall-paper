<template>
  <div class="new-card">
    <div class="colors">
      <p
        class="color-item"
        v-for="(e, index) in cardColorBlock"
        :key="index"
        :style="{ background: e }"
        @click="changeColor(index)"
        :class="{ colorselected: index == colorSelected }"
      ></p>
    </div>
    <div class="labels">
      <!-- <p class="title">选择标签</p> -->
      <div class="label">
        <p
          v-for="(e, index) in label[id]"
          :key="index"
          class="label-item"
          :class="{ labelselected: index == labelSelected }"
          @click="changeLabel(index)"
        >
          {{ e }}
        </p>
      </div>
    </div>
    <!-- 照片 -->
    <!-- <div class="add-photo" v-if="id == 1">
      <input
        type="file"
        name="file"
        id="file"
        multiple="multiple"
        @change="showPhoto"
      />
      <div class="add-bt" v-if="url == ''">
        <span class="iconfont icon-tianjia"></span>
      </div>
      <div class="change-bt" v-if="url != ''">
        <span class="iconfont icon-xiugai"></span>
      </div>
      <div class="photo-div" v-show="url != ''"><img :src="url" /></div>
    </div> -->
    <!-- 卡片 -->
    <div
      class="card-main"
      :style="{ background: id == 0 ? cardColor[colorSelected] : cardColor[5] }"
    >
      <textarea
        placeholder="最多100字哦"
        class="message"
        maxlength="100"
        v-model="message"
      ></textarea>
      <input type="text" placeholder="签名" class="name" v-model="name" />
    </div>

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
export default {
  props: {
    id: {
      default: 0,
    },
  },
  data() {
    return {
      cardColorBlock: [],
      cardColor: [],
      label: [],
      //当前选择颜色
      colorSelected: 0,
      //当前选中标签
      labelSelected: 0,
      //签名
      name: '',
      //留言内容
      message: '',
      //图片链接
      url: '',
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.cardColorBlock = cardColorBlock
    this.cardColor = cardColor
    this.label = label
  },
  watch: {},
  methods: {
    // 切换颜色
    changeColor(e) {
      this.colorSelected = e
    },
    // 切换标签
    changeLabel(e) {
      this.labelSelected = e
    },
    submit() {
      let names = '匿名'
      if (this.name) {
        names = this.name
      }
      let data = {
        type: 0,
        message: this.message,
        name: names,
        userId: this.$store.getters['user/getuserId'],
        moment: new Date(),
        label: this.labelSelected,
        color: 5,
        imgurl: '',
      }
      // console.log(data);
      if (this.message) {
        data.color = this.colorSelected
        data.label = this.labelSelected
        this.$http.post('/insertwall', data).then((res) => {
          let cardD = {
            type: this.id,
            message: this.message,
            name: names,
            userId: this.$store.getters['user/getuserId'],
            moment: new Date(),
            label: this.labelSelected,
            imgurl: '',
            id: res.data.insertId,
            islike: [{ count: 0 }],
            like: [{ count: 0 }],
            comments: [{ count: 0 }],
            report: [{ count: 0 }],
            revoke: [{ count: 0 }],
            color: this.colorSelected,
          }
          this.message = ''
          this.name = ''
          this.labelSelected = 0
          this.$emit('clickbt', cardD)
          this.$notify({
            type: 'success',
            position: 'top-left',
            message: '留言添加成功',
            duration: 2000,
            offset: 100,
          })
        })
      } else {
        this.$notify({
          type: 'warning',
          position: 'top-left',
          message: '留言不能为空！',
          duration: 2000,
          offset: 100,
        })
      }
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
}
</script>

<style scoped lang="scss">
.new-card {
  padding: 0 20px 0px;
  position: relative;
  // border: 1px solid #000;

  .colors {
    display: flex;
    align-items: center;
    // padding-bottom: 12px;

    .color-item {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      border: 1px solid transparent;
      cursor: pointer;
    }

    .colorselected {
      border: 1px solid #3b73f0;
    }
  }

  .card-main {
    position: relative;
    height: 175px;
    width: 100%;
    background: rgba(252, 175, 162, 0.31);
    padding: 12px;
    box-sizing: border-box;
    transition: all 0.3s;

    .message {
      background: none;
      border: none;
      resize: none;
      height: 100px;
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      font-size: 15px;
    }

    .name {
      width: 100%;
      line-height: 20px;
      box-sizing: border-box;
      padding: 8px;
      background: none;
      border: 1px solid #fff;
      font-size: 15px;
    }
  }

  .title {
    color: #202020;
    font-weight: 600;
    padding-top: 5px;
  }

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
      margin: 16px 4px 0 0;
      color: #5b5b5b;
      transition: all 0.3s;
    }

    .labelselected {
      background: #ebebeb;
      font-weight: 600;
      color: #202020;
    }
  }

  .mzsm {
    padding-top: 10px;
    font-size: 12px;
    color: #949494;
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
