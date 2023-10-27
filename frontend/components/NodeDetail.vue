<template>
  <div class="card-detail">
    <div class="top-bt">
      <p class="revoke" @click="delete_card">联系墙主撕掉该便签</p>
      <p class="report">举报</p>
    </div>
    <NodeCard :height="130" :note="cards"></NodeCard>
    <div class="formxx">
      <textarea
        class="message"
        placeholder="请输入评论..."
        v-model="discuss"
        maxlength="50"
      ></textarea>
      <div class="bt">
        <!-- <input type="text" class="name" placeholder="签名" v-model="name" /> -->
        <IButton :class="{ notallowed: !isDiss }" @click.native="submit"
          >确定</IButton
        >
      </div>
    </div>
    <p class="title">评论 {{ cards.comments[0].count }}</p>
    <div class="comment">
      <div class="comment-item" v-for="(e, index) in comment" :key="index">
        <div class="user-head">
          <!-- :style="{ backgroundImage: portrait[e.imgurl] }" -->
          <img :src="e.imgUrl" alt="" />
        </div>
        <div class="comment-content">
          <div class="comment-top">
            <p class="name">{{ e.name }}</p>
            <p class="time">{{ e.moment | timeFormat }}</p>
          </div>
          <div class="comment-message">{{ e.comment }}</div>
        </div>
      </div>
      <p class="more" @click="getComment" v-show="page > 0">加载更多</p>
    </div>
  </div>
</template>

<script>
import { portrait } from '@/utils/data'
export default {
  props: {
    card: {
      default: {},
    },
  },
  data() {
    return {
      //评论内容
      discuss: '',
      //签名
      name: '',
      //按钮是否可点击
      isDiss: true,
      //评论
      comment: [],
      page: 1,
      pagesize: 10,
      //评论头像背景
      portrait: [],
    }
  },
  computed: {
    cards() {
      return this.card
    },
    isDis() {
      if (this.discuss != '') {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    // discuss(current, prev) {
    //   console.log('现在的值：', current)
    //   console.log('变化前的值：', prev)
    // },
  },
  created() {},
  mounted() {
    this.portrait = portrait
    this.getComment()
    // console.log(this.isDis)
  },
  watch: {
    cards() {
      this.page = 1
      this.comment = []
      this.getComment()
    },
  },
  methods: {
    delete_card() {
      this.$message.success('已成功通知到墙主！')
    },
    async submit() {
      if (this.isDis) {
        // console.log('chufa ')
        //有用户就用头像，没有就随机头像
        // let img
        // if (this.$store.getters.getIsLogin) {
        //   img = this.$store.getters.getUserAvatar
        // } else {
        //   img = Math.floor(Math.random() * 14)
        // }
        // return
        let data = {
          wallId: this.cards.id,
          userId: this.$store.getters['user/getuserId'],
          imgUrl: this.$store.getters['user/getUserAvatar'],
          moment: new Date(),
          comment: this.discuss,
          name: this.$store.getters['user/getusername'],
        }
        await this.$http.post('/insertcomment', data).then((res) => {
          this.comment.unshift(data)
          this.cards.comments[0].count++
          this.discuss = ''
          this.$notify({
            type: 'success',
            position: 'top-left',
            message: '评论成功',
            duration: 2000,
            offset: 100,
          })
        })
      } else {
        this.$notify({
          type: 'warning',
          position: 'top-left',
          message: '评论不能为空哦',
          duration: 2000,
          offset: 100,
        })
      }
    },
    //获取评论
    async getComment() {
      if (this.page > 0) {
        let data = {
          id: this.cards.id,
          page: this.page,
          pagesize: this.pagesize,
        }
        await this.$http
          .post('/findComments', data)
          .then((res) => {
            // console.log(res)
            this.comment = this.comment.concat(res.data.info)
            if (res.data.info.length) {
              this.page++
            } else {
              this.page = 0
              // this.isAct = true
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.card-detail {
  position: relative;
  padding: 0 20px;

  .top-bt {
    position: fixed;
    top: 0;
    left: 0;
    padding: 20px;
    display: flex;

    .revoke {
      color: #3b73f0;
      cursor: pointer;
      padding-right: 30px;
      font-size: 16px;
    }

    .report {
      font-size: 16px;
      cursor: pointer;
      color: #f67770;
    }
  }

  .formxx {
    .message {
      background: none;
      height: 50px;
      border: 1px solid rgba(148, 148, 148, 1);
      resize: none;
      width: 100%;
      padding-top: 10px;
      padding-left: 10px;
      box-sizing: border-box;
      margin-top: 12px;
      font-size: 18rewwqwpx;
    }

    .bt {
      display: flex;
      padding-top: 6px;
      justify-content: right;

      .name {
        width: 200px;
        line-height: 20px;
        box-sizing: border-box;
        padding: 8px;
        background: none;
        border: 1px solid rgba(148, 148, 148, 1);
      }
    }
  }

  .more {
    color: #5b5b5b;
    text-align: center;
    cursor: pointer;
    padding: 20px;
  }

  .title {
    font-weight: 600;
    padding-top: 30px;
    padding-bottom: 20px;
  }

  .comment-item {
    display: flex;
    padding-bottom: 30px;

    .user-head {
      flex: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      // background-image: linear-gradient(180deg, #ffa9d9 0%, #e83d3d 100%);
      overflow: hidden;
      img {
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }

    .comment-content {
      padding-left: 8px;
    }

    .comment-top {
      display: flex;
      align-items: center;

      .name {
        font-weight: 600;
      }

      .time {
        font-size: 12px;
        padding-left: 4px;
        color: #949494;
      }

      .comment-message {
        padding-top: 4px;
      }
    }
  }
}

.notallowed {
  opacity: 0.6;
  cursor: not-allowed;
  // background:#eee;
}
</style>
