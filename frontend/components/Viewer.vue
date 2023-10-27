<template>
  <transition name="views" key="box1">
    <div class="viewer" v-if="isView">
      <div class="bg"></div>
      <div class="viewer-photo">
        <img :src="img" alt="" @click="canelImg" />
      </div>
      <!-- <div class="switch sw-left" @click="changeNumber(0)" v-show="_nowNumber > 0">
        <span class="iconfont icon-xiangzuo"></span>
      </div>
      <div
        class="switch sw-right"
        @click="changeNumber(1)"
        v-show="_nowNumber < _photos.length - 1"
      >
        <span class="iconfont icon-xiangyou"></span> -->
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    photos: {
      default: '',
    },
    nowNumber: {
      type: Number,
      default: 0,
    },
    isView: {
      default: false,
    },
  },
  data() {
    return {
      img:this.photos
    }
  },
  watch:{
    photos(o,v){
      this.photos = o
      this.img = o
    }
  },
  computed: {
    // _isview() {
    //   return this.isView
    // },
    // _nowNumber() {
    //   return this.nowNumber
    // },
    // _photos() {
    //   return this.photos
    // },
  },
  mounted(){
  },
  methods: {
    canelImg(e){
      this.isView = false
    
    },
    changeNumber(e) {
      this.$emits('viewSwitch', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.views {
  &-enter {
    &-from {
      opacity: 0;
    }

    &-active {
      transition: all 0.2s ease-in;
    }

    &-to {
      opacity: 1;
    }
  }

  &-leave {
    &-from {
      opacity: 1;
    }

    &-active {
      transition: all 0.2s ease-out;
    }

    &-to {
      opacity: 0;
    }
  }
}

.viewer {
  border:10px solid #000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255,.5);
    backdrop-filter: blur(20px);
    height: 100%;
    width: 100%;
  }

  .viewer-photo {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    // padding: 82px 454px 5px 96px;
    box-sizing: border-box;
    width: 70%;
    overflow-y: auto;
    // display: flex;
    // justify-content: center;

    img {
      max-width: 100%;
      margin: 0;
      padding: 0;
      display: inline;
    }
  }

  .switch {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #949494;
    color: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
    transition: all 0.3s;
    cursor: pointer;

    .iconfont {
      font-size: 24px;
    }

    &:hover {
      opacity: 1;
    }
  }

  .sw-left {
    left: 20px;
  }

  .sw-right {
    right: 380px;
  }
}
</style>
