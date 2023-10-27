<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/images/favicon.svg" alt="" />
      <p class="logo-name">wallpaper</p>
    </div>
    <div class="menu">
      <nuxt-link to="/wall/messpage">
        <IButton
          @click.native="changeWall(0)"
          :active="id == 0 ? 'cprimary' : 'pncolor'"
          class="menu-message"
        >
          留言墙
        </IButton>
      </nuxt-link>
      <nuxt-link to="/wall/photopage">
        <IButton
          @click.native="changeWall(1)"
          :active="id == 1 ? 'csecondary' : 'pncolor'"
          class="menu-photo"
          >照片墙
        </IButton>
      </nuxt-link>
    </div>
    <div class="user">
      <div class="user-head" @click="showPrefile">
        <img :src="prefile.avatar" alt="周杰伦" title="周杰伦" />
      </div>
      <RModal
        :title="title"
        class="contanier"
        :isModal="isModal"
        :width="350"
        :height="600"
      >
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="hanleChange"
          :http-request="uploadFile"
        >
          <img v-if="prefile.avatar" :src="prefile.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="text-align: center; padding: 5px 0">点击上传头像</p>
        <div class="content">
          <p class="name">
            <span class="left">用户名</span>
            <span class="right">{{ prefile.username }}</span>
          </p>
          <p class="name">
            <span class="left">邮箱</span>
            <span class="right">{{ prefile.email }}</span>
          </p>
        </div>
      </RModal>
    </div>
  </div>
</template>

<script>
import RModal from './RModal'
import { mapActions } from 'vuex'
export default {
  components: { RModal },
  props: {},
  data() {
    return {
      imageUrl: '',
      id: 0,
      isModal: false,
      title: '个人信息',
      prefile: {
        username: '',
        email: '',
        avatar: '',
        id: '',
      },
      // file: {},
    }
  },
  computed: {
    // ...mapActions(['setLogin', 'setPrefile']),
  },
  created() {},
  mounted() {
    this.getUserInfo()
    // console.log(this.$store.getters.getuname);
  },
  methods: {
    async getUserInfo() {
      await this.$http.get('/user/info').then(async (res) => {
        if (res.code == 200) {
          this.prefile = res.data
          await this.$store.dispatch('user/setLogin', true)
          await this.$store.dispatch('user/setPrefile', this.prefile)
        }
      })
    },
    async uploadFile(item) {
      const formData = new FormData()
      formData.append('file', item.file)
      formData.append('userId', this.prefile.id)
      await this.$http.post('/user/uploadAvatar', formData).then((res) => {
        if (res.code === 200) {
          this.prefile.avatar = res.data.url
          this.getUserInfo()
          this.$notify({
            type: 'success',
            position: 'top-left',
            message: '头像添加成功',
            duration: 2000,
            offset: 100,
          })
        }
      })
    },
    showPrefile() {
      this.isModal = !this.isModal
    },
    hanleChange(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$notify({
          type: 'error',
          position: 'top-left',
          message: '上传头像图片只能是 JPG 或 PNG 格式!',
          duration: 2000,
          offset: 100,
        })
      }
      if (!isLt2M) {
        this.$notify({
          type: 'error',
          position: 'top-left',
          message: '上传头像图片大小不能超过 2MB!',
          duration: 2000,
          offset: 100,
        })
      }
      return isJPG && isLt2M
    },
    changeWall(e) {
      this.id = e
      // console.log(this.id)
      // if (e == 0) {
      //   this.$router.push('/wall/messpage')
      // }else if(e== 1){
      //   this.$router.push('/wall/photopage')
      // }
    },
  },
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;

  .logo {
    display: flex;
    align-items: center;
    width: 200px;

    .logo-name {
      font-size: 20px;
      color: #202020;
      font-weight: 600;
      padding-left: 10px;
    }
  }

  .menu {
    display: flex;

    .menu-message {
      margin-right: 24px;
    }
  }

  .user {
    width: 200px;
    position: relative;

    .user-head {
      float: right;
      border-radius: 50%;
      height: 36px;
      width: 36px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .contanier {
    position: absolute;
    right: 320px;
    bottom: -315px;

    .prefile {
      // text-align: center;
      font-size: 16px;
    }

    .avatar-uploader {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      border: 2px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader :hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 8px;
      line-height: 80px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .content {
      width: 100%;
      height: 100px;
      // border: 1px solid #000;
      padding: 0 20px;
      .name {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        font-weight: 600;
        // background: #fff;
        margin: 5px 0;
        .left {
          float: left;
        }
        .right {
          float: right;
          color: #5b5b5b;
        }
      }
    }
  }
}
</style>
<!-- <style>
.el-popover .popover-style {
  border: 1px soild #202020;
}
.content {
  border: 1px soild #202020;
  // box-sizing: border-box;
  width: 100%;
  padding: 10px;
}

</style> -->
