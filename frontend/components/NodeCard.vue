<template>
  <div
    class="i-node-card"
    :style="{ width: width + 'px', height: height + 'px', background: cardColor[cardImage.color] }"
  >
    <div class="top">
      <!-- <p class="time">2023.2.18</p> -->
      <p class="time">{{ cardImage.moment | timeFormat }}</p>
      <p class="label">{{ labels[cardImage.label] }}</p>
      <!-- <p class="label">现在</p> -->
    </div>
    <p class="message" @click="toDetail">{{ cardImage.message }}</p>
    <div class="foot">
      <div class="foot-left">
        <div class="icon" @click="clickLike">
          <i class="iconfont icon-aixin1 el-icon-star-off"></i>
          <span class="value">{{ cardImage.like[0].count }}</span>
        </div>
        <div class="icon">
          <span class="iconfont icon-liuyan el-icon-chat-line-square"></span>
          <span class="value">{{ cardImage.comments[0].count }}</span>
        </div>
      </div>
      <div class="name">{{ cardImage.name }}</div>
    </div>
  </div>
</template>

<script>
import { label, cardColor } from '@/utils/data'
// import api from '@/api'
// import { mapState } from 'vuex'
export default {
  props: {
    width: {
      default: '100%',
    },
    height: {
      default: 240,
    },
    note: {
      default: {
        type: Number,
        label: Number,
      },
    },
  },
  data() {
    return {
      cardColor: [],
      labels: [],
    }
  },
  computed: {
    cardImage() {
      return this.note
    },
    // ...mapState(['user']),
  },
  created() {},
  mounted() {
    this.cardColor = cardColor
    this.labels = label[0]
  },
  watch: {},
  methods: {
    toDetail() {
      this.$emit('toDetail')
    },
    async clickLike() {
      if (this.cardImage.islike[0].count == 0) {
        let data = {
          wallId: this.cardImage.id,
          userId: this.$store.getters['user/getuserId'],
          type: 0,
          moment: new Date(),
        }
        await this.$http.post('/insertfeedback', data).then((res) => {
          //反馈
          this.cardImage.like[0].count++
          this.cardImage.islike[0].count++
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.i-node-card {
  padding: 10px 20px 16px;
  box-sizing: border-box;
  position: relative;
  background: yellow;

  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;

    p {
      font-size: 12px;
      color: #949494;
    }
  }

  .message {
    height: 140px;
    font-size: 14px;
    color: #202020;
    cursor: pointer;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0;
    bottom: 16px;
    box-sizing: border-box;
    width: 100%;
    padding: 0 20px;

    .foot-left {
      display: flex;

      .value {
        font-size: 12px;
        color: #949494;
        line-height: 16px;
        padding-left: 4px;
      }

      .iconfont {
        font-size: 16px;
        color: #949494;
      }

      .icon {
        padding-right: 8px;
        display: flex;
        align-items: center;

        .icon-aixin1 {
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            color: #f67770;
          }
        }

        .islike {
          color: #f67770;
        }

        .icon-liuyan {
          cursor: pointer;
        }
      }
    }

    .name {
      font-size: 16px;
      color: #202020;
    }
  }
}
</style>
