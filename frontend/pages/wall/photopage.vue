<template>
  <div class="photoPage">
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
        v-for="(item, index) in labelData[1]"
        :key="index"
        @click="selectNode(index)"
      >
        {{ item }}
      </p>
    </div>
    <div
      class="add"
      :style="{ bottom: addBottom + 'px' }"
      @click="addCard"
      v-show="!isModal"
    >
      <span class="iconfont icon-tianjia">+</span>
    </div>
    <div class="photo">
      <PhotoCard
        :photoItem="e"
        class="photo-card"
        v-for="(e, index) in images"
        :key="e.pid"
        @toDetail="selectPhoto(e.pid)"
      ></PhotoCard>
    </div>
    <!-- 测试新方法 -->
    <!-- <div class="waterFall-box" ref="box">
      <div
        class="img-box"
        v-for="(item, index) in images"
        :key="index"
        ref="img"
      >
        <img :src="item.imgPath" alt="lose" />
      </div>
      <div
        v-if="isLoad == false"
        :style="{
          position: 'absolute',
          top: Math.max(...heightArray) + 'px',
          color: 'red',
          left: '50%',
          transform: 'translateX(-50%)',
        }"
      >
        没有图片加载了...
      </div>
    </div> -->
    <RModal :title="title" @close="closeModal" :isModal="isModal">
      <NewPhoto @closeModal="closeModal" @clickbt="newPhoto"></NewPhoto>
    </RModal>
    <Viewer
      :isView="view"
      :photos="bigImg"
      :nowNumber="cardSelected"
      @viewSwitch="viewSwitch"
    ></Viewer>
  </div>
</template>

<script>
import { wallType, label, none } from '@/utils/data'
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
      // 选中标签
      nowlabel: -1,
      //当前选择卡片
      cardSelected: -1,
      isModal: false,
      addBottom: 30,
      title: '上传照片',
      //分页数据
      page: 1,
      pagesize: 30,
      isAct: false,
      view: false,
      //===============================
      images: [], //存储图片资源
      bigImg: '',
    }
  },
  mounted() {
    this.wallTypeData = wallType[1]
    this.labelData = label
    this.getPhotoPage()
    //=====================================================================
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
          that.getPhotoPage()
          // console.log('加载更多')
        }
      })
    }
  },
  methods: {
    //切换图片
    viewSwitch(e) {
      if (e == 0) {
        cardSelected.value -= 1
        return
      }
      cardSelected.value += 1
    },
    newPhoto(data) {
      this.images.unshift(data)
    },
    async getPhotoPage() {
      this.isAct = true
      if (this.page > 0) {
        let data = {
          page: this.page,
          pagesize: this.pagesize,
          userId: '',
          label: this.nowlabel,
        }
        await this.$http
          .post('/findallphoto', data)
          .then((res) => {
            console.log(res)
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
              // for (let i = 0; i < res.data.length; i++) {
              //   this.images.push(res.data)
              // }
              this.images = this.images.concat(res.data)
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
    selectNode(val) {
      // 切换标签
      this.nowlabel = val
      this.page = 1
      this.images = []
      this.getPhotoPage()
    },
    selectPhoto(e) {
      //查找元素
      const qq = this.images.filter((v) => v.pid === e)
      // console.log(qq);
      this.bigImg = qq[0].imgPath
      // console.log(this.bigImg)

      // return
      // if (e != this.cardSelected) {
      //   this.cardSelected = e
      //   // this.isModal = false
      this.view = true
      //   return
      // }
      // this.cardSelected = -1
      // this.isModal = true
      // this.view = false
    },
    closeModal() {
      this.cardSelected = -1
      this.isModal = false
      this.view = false
    },
    addCard() {
      this.isModal = true
    },
  },
}
</script>

<style lang="scss" scoped>
.photoPage {
  min-height: 700px;
  border: 1px solid #eee;
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
  .add {
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

  .photo {
    width: 88%;
    margin: 0 auto;
    columns: 6;
    column-gap: 4px;
    padding-top: 28px;

    .photo-card {
      margin-bottom: 4px;
      break-inside: avoid;
      transition: all 0.3s;

      &:hover {
        // scale: 1.03;
        transform: translateY(-3px);
        transition: transform 0.5s ease-in-out;
        box-shadow: 0 20px 20px 2px #737373;
      }
    }
  }
  // =======================================
  // .waterFall-box {
  //   position: relative;
  //   text-align: center;
  //   // overflow-y: hidden;
  //   // width: 88%;
  //   // padding-top: 20px;
  //   // margin-top: 20px;
  //   margin: 0 auto;
  //   border: 1px solid #000;
  //   .img-box {
  //     width: 219px;
  //     // vertical-align: top;
  //     display: block;
  //     float: left;
  //     img {
  //       width: 100%;
  //       animation: imgBox 0.5s ease-in-out;
  //     }
  //     img:hover {
  //       transform: translateY(-3px);
  //       transition: transform 0.5s ease-in-out;
  //       box-shadow: 0 20px 20px 2px #737373;
  //     }
  //   }
  //   @keyframes imgBox {
  //     0% {
  //       opacity: 0;
  //       transform: translateY(-100px);
  //     }
  //     100% {
  //       opacity: 1;
  //       transform: translateX(0);
  //     }
  //   }
  // }
}
</style>
