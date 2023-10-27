<template>
  <div class="photo-card">
    <img :src="photo.imgPath" class="photo-img" />
    <div class="photo-bg" @click="toDetail"></div>
    <div class="photo-like">
      <span class="iconfont icon-aixin1" @click="clickLike"></span>
      <span class="like-data">99</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    photoItem: {
      default: {},
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    photo() {
      return this.photoItem
    },
  },

  methods: {
    toDetail() {
      this.$emit('toDetail')
    },
    clickLike() {
      return
      if (this.photo.islike[0].count == 0) {
        let data = {
          wallId: this.photo.id,
          userId: this.user,
          type: 0,
          moment: new Date(),
        }
        api.getInsertFeedBackApi(data).then((res) => {
          //反馈
          this.photo.like[0].count++
          this.photo.islike[0].count++
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.photo-card {
  position: relative;
  overflow-y: auto;

  .photo-img {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }

  .photo-bg {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s;
    cursor: pointer;
  }

  .photo-like {
    position: absolute;
    left: 8px;
    top: 8px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    height: 28px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    background: blur(20px);
    opacity: 0;
    transition: all 0.3s;
    cursor: pointer;

    span {
      color: #202020;
    }

    .icon-aixin1 {
      color: #949494;
      padding-right: 4px;
    }

    .islike {
      color: #f67770;
    }
  }

  &:hover {
    .photo-bg {
      opacity: 1;
    }

    .photo-like {
      opacity: 1;
    }
  }
}
</style>
