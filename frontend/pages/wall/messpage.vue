<template>
  <div class="cont-all">
    <div class="messPage">
      <p class="title">{{ wallTypeData.name }}</p>
      <p class="slogan">{{ wallTypeData.slogan }}</p>
      <div class="label">
        <p
          class="label-list"
          :class="{ lbselected: nowlabel == -1 }"
          @click="selectNode(-1)"
        >
          全部
        </p>
        <p
          class="label-list"
          :class="{ lbselected: nowlabel == index }"
          v-for="(item, index) in labelData[0]"
          :key="index"
          @click="selectNode(index)"
        >
          {{ item }}
        </p>
      </div>
      <!-- 每一个小卡片 -->
      <div class="card" :style="{ width: nowWidth + 'px' }">
        <NodeCard
          :width="288"
          class="card-inner"
          :note="item"
          @toDetail="selectCard(index)"
          :class="{ cardselected: index === cardSelected }"
          v-for="(item, index) in nodeCards"
          :key="index"
        ></NodeCard>
      </div>
      <!-- 左下角添加卡片 -->
      <div
        class="addCard"
        v-show="!isModal"
        :style="{ bottom: addBottom + 'px' }"
        @click="addCard"
      >
        <span class="iconfont icon-tianjia">+</span>
      </div>
      <!-- 创建新卡片 -->
      <RModal :title="title" @close="closeModal" :isModal="isModal">
        <NewCard
          :id="0"
          @closeModal="closeModal"
          @clickbt="newCard"
          v-if="cardSelected == -1"
        ></NewCard>
        <NodeDetail :card="nodeCards[cardSelected]" v-else></NodeDetail>
      </RModal>
    </div>
  </div>
</template>

<script>
import { wallType, label, none } from '@/utils/data'
import { nextTick } from "vue";
export default {
  data() {
    return {
      wallTypeData: [
        {
          name: '',
          slogan: '',
        },
      ],
      labelData: [],
      // 当前选中标签 -1 就是全部
      nowlabel: -1,
      //卡片模块宽度
      nowWidth: 0,
      //当前选择卡片
      cardSelected: -1,
      //add按钮距离底部高度
      addBottom: 30,
      //弹出层是否关闭
      isModal: false,
      title: '',
      //卡片数据
      nodeCards: [],
      //分页数据
      page: 1,
      pagesize: 15,
      isAct: false,
    }
  },
  mounted() {
    this.wallTypeData = wallType[0]
    this.labelData = label
    const that = this
    if (process.client) {
      //监听屏幕宽度变化
      window.addEventListener('resize', function () {
        //获取页面宽度
        let pWidth = document.body.clientWidth
        // console.log(pWidth)
        that.nowWidth = Math.floor((pWidth - 120) / 300) * 300
      })
      //监听滚动
      window.addEventListener('scroll', function () {
        //距离顶部高度
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        //屏幕高度
        let clientHeight = document.documentElement.clientHeight
        //内容高度
        let scrollHeight = document.documentElement.scrollHeight
        if (scrollTop + clientHeight + 220 >= scrollHeight) {
          that.addBottom = scrollTop + clientHeight + 230 - scrollHeight
        } else {
          that.addBottom = 30
        }
        //加载更多
        if (
          Math.ceil(scrollTop) + clientHeight >= scrollHeight - 20 &&
          !that.isAct
        ) {
          that.getFindWallPage()
          // console.log('加载更多')
        }
      })
    }
    this.noteWidth()
    this.getFindWallPage()
  },
  // unmounted() {
  //   window.removeEventListener('resize', this.noteWidth())
  //   window.removeEventListener('scroll', this.scrollBottom())
  // },
  watch: {},
  computed: {},
  methods: {
    newCard(data) {
      this.nodeCards.unshift(data)
    },
    selectCard(e) {
      //
      this.title = ''
      if (e != this.cardSelected) {
        this.cardSelected = e
        this.isModal = true
        // if (this.ids == 1) {
        //   this.view = true
        // }
        return
      }
      this.cardSelected = -1
      this.isModal = false
      // if (this.ids == 1) {
      //   this.view = false
      // }
    },
    selectNode(val) {
      // 切换标签
      this.nowlabel = val
      this.nodeCards = []
      this.page = 1
      this.getFindWallPage()
    },
    //查找全部数据
    async getFindWallPage() {
      this.isAct = true
      if (this.page > 0) {
        let data = {
          type: 0,
          page: this.page,
          pagesize: this.pagesize,
          userId: '',
          label: this.nowlabel,
        }
        await this.$http
          .post('/messWalls', data)
          .then((res) => {
            if (res.code === 200) {
              if (res.data.length === 0) {
                this.$notify({
                  type: 'info',
                  position: 'top-left',
                  message: '暂时没有数据',
                  duration: 2000,
                  offset: 100,
                })
              }
              this.nodeCards = this.nodeCards.concat(res.data)
              if (res.data.length) {
                this.page++
              } else {
                this.page = 0
                this.isAct = true
              }
              this.isAct = false
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    closeModal() {
      this.cardSelected = -1
      this.isModal = false
    },
    //添加卡片
    addCard() {
      this.title = '写留言'
      this.isModal = true
    },
    noteWidth() {
      //获取页面宽度
      let pWidth = document.body.clientWidth
      this.nowWidth = Math.floor((pWidth - 120) / 300) * 300
    },
    loading() {
      if (this.isloading == -1) {
        nextTick(async () => {
          var params1 = {
            container: document.getElementById('lottile'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loadings,
          }
          lottie.loadAnimation(params1)
        })
      }
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.messPage {
  min-height: 700px;
  // border: 1px solid #eee;
  // overflow-y: hidden;
  // position: relative;
  // padding-top: 60px;
  .title {
    padding-top: 48px;
    padding-bottom: 8px;
    font-size: 56px;
    color: #202020;
    text-align: center;
    font-weight: 600;
  }
  .slogan {
    color: #5b5b5b;
    text-align: center;
  }
  .label {
    margin-top: 40px;
    display: flex;
    justify-content: center;

    .label-list {
      padding: 0 14px;
      height: 28px;
      display: flex;
      align-items: center;
      margin: 4px;
      color: #5b5b5b;
      box-sizing: border-box;
      border: 1px solid transparent;
      cursor: pointer;
    }

    .lbselected {
      color: #202020;
      font-weight: 600;
      border: 1px solid #202020;
      border-radius: 14px;
    }
    .lbselected {
      color: #202020;
      font-weight: 600;
      border: 1px solid #202020;
      border-radius: 14px;
    }
  }
  .card {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    // height:400px;

    margin: auto;
    // border: 1px solid #eee;
    // overflow-y: hidden;
    .card-inner {
      margin: 6px;
      border: 1px solid transparent;
      transition: all 0.3s;

      &:hover {
        scale: 1.05;
      }
    }

    .cardselected {
      border: 1px solid #3b73f0;
    }
  }
  .addCard {
    width: 56px;
    height: 56px;
    background: #202020;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 28px;
    position: fixed;
    right: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    z-index: 10000;
    cursor: pointer;

    &:hover {
      scale: 1.3;
    }

    .icon-tianjia {
      color: #ffffff;
      font-size: 24px;
    }
  }
}
</style>
