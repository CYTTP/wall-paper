<template>
  <div>
    <transition name="modal">
      <div
        class="i-modal"
        v-if="isModal"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <div class="i-modal-head">
          <p class="modal-name">{{ title }}</p>
          <span class="iconfont icon-guanbi" @click="closeModal">x</span>
        </div>
        <div class="i-modal-main">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: '留言墙',
    },
    isModal: {
      default: false,
    },
    width: {
      default: 800,
    },
    height: {
      default: 400,
    },
  },
  data() {
    return {}
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.modal {
  &-enter {
    &-from {
      transform: translateX(360px);
    }
    &-active {
      transition: all 0.2s easy-out;
    }

    &-to {
      transform: translateX(0px);
    }
  }

  &-leave {
    &-from {
      transform: translateX(0px);
    }

    &-active {
      transition: all 0.2s easy-in;
    }

    &-to {
      transform: translateX(360px);
    }
  }
}

.i-modal {
  // width: 800px;
  // height: 400px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  box-sizing: border-box;
  transition: all 0.3s;
  overflow: hidden;

  .i-modal-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;

    .modal-name {
      font-size: 20px;
      color: #202020;
      font-weight: 600;
    }

    .icon-guanbi {
      color: #5b5b5b;
      cursor: pointer;
      padding-left: 8px;
    }
  }

  .i-modal-main {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 116px;
    box-sizing: border-box;
    overflow-x: auto;
    margin: 2px;
  }

  .i-modal-main::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .i-modal-main::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.2);
  }

  .i-modal-main::-webkit-scrollbar-track {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0);
  }
}
</style>
