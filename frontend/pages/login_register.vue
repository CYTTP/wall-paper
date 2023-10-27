<template>
  <div class="log-reg">
    <!-- partial:index.partial.html -->
    <div class="container right-panel-active">
      <!-- Sign Up -->
      <div class="container__form container--signup">
        <el-form
          :model="registerData"
          class="form"
          id="form1"
          :rules="regRules"
          ref="registerData"
        >
          <h2 class="form__title">Sign Up</h2>
          <el-form-item prop="username">
            <el-input
              v-model="registerData.username"
              autocomplete="off"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerData.email"
              autocomplete="off"
              placeholder="邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="Password">
            <el-input
              v-model="registerData.password"
              autocomplete="off"
              placeholder="密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              v-model="registerData.repassword"
              autocomplete="off"
              placeholder="确认密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="captcha" class="captcha">
            <el-input
              v-model="registerData.captcha"
              autocomplete="off"
              class="captcha-input"
              placeholder="验证码"
            ></el-input>
            <div class="img">
              <img
                :src="code.captchaRegUrl"
                alt=""
                @click="updateCaptcha('reg')"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn"
              type="primary"
              @click.native="registerSubmitForm('registerData')"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- Sign In -->
      <div class="container__form container--signin">
        <el-form
          :model="loginData"
          ref="loginData"
          class="form"
          id="form2"
          :rules="loginRules"
        >
          <h2 class="form__title">Sign In</h2>
          <el-form-item prop="email">
            <el-input
              v-model="loginData.email"
              autocomplete="off"
              placeholder="邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginData.password"
              autocomplete="off"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="captcha">
            <el-input
              v-model="loginData.emailcode"
              placeholder="输入验证码"
              class="captcha-input"
            ></el-input>
            <!-- <div>
              <img
                class="img"
                :src="code.captchaLoginUrl"
                alt=""
                @click="updateCaptcha('log')"
              />
            </div> -->
            <div>
              <el-button
                class="img"
                type="primary"
                :disabled="send.timer > 0"
                @click.native="sendEmailCode"
                >{{ sendText }}</el-button
              >
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              class="btn"
              type="primary"
              @click.native="loginSubmitForm('loginData')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- Overlay -->
      <div class="container__overlay">
        <div class="overlay">
          <div class="overlay__panel overlay--left">
            <button class="btn" id="signIn">Sign In</button>
          </div>
          <div class="overlay__panel overlay--right">
            <button class="btn" id="signUp">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerData.repassword !== '') {
          this.$refs.registerData.validateField('repassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      send: {
        timer: 0, //定时器
      },
      loginData: {
        email: '499436550@qq.com',
        password: 'admin',
        emailcode: '',
      },
      registerData: {
        email: '123123123@qq.com',
        username: '王国华',
        password: '123456',
        repassword: '123456',
        captcha: '',
      },
      regRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        repassword: [{ validator: validatePass2, trigger: 'blur' }],
      },
      loginRules: {
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        emailcode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
      },
      code: {
        captchaLoginUrl: '/api/captcha',
        captchaRegUrl: '/api/captcha',
      },
    }
  },
  computed: {
    sendText() {
      if (this.send.timer <= 0) {
        return '发送验证码'
      }
      return `${this.send.timer}s后发送`
    },
  },
  methods: {
    //发送邮箱验证码
    sendEmailCode(e) {
      e.preventDefault()
      //@todo
      this.$http.get('/sendcode?email=' + this.loginData.email)
      this.$message.success('验证码发送成功')
      this.send.timer = 10
      this.timer = setInterval(() => {
        this.send.timer -= 1
        if (this.send.timer === 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    //更新验证码
    updateCaptcha(str) {
      if (str == 'reg') {
        this.code.captchaRegUrl = '/api/captcha?_t=' + new Date().getTime()
      } else if (str == 'log') {
        this.code.captchaLoginUrl = '/api/captcha?_t=' + new Date().getTime()
      }
    },
    //登录
    loginSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            email: this.loginData.email,
            password: this.loginData.password,
            emailcode: this.loginData.emailcode,
          }
          this.$http.post('/user/login', obj).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                position: 'top-left',
                message: '登录成功',
                duration: 2000,
                offset: 100,
              })
              localStorage.setItem('token', res.data.token)
              setTimeout(() => {
                this.$router.push('/wall/messpage')
              }, 1000)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //注册
    registerSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            email: this.registerData.email,
            username: this.registerData.username,
            password: this.registerData.password,
            captcha: this.registerData.captcha,
          }
          this.$http.post('/user/register', obj).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$alert('注册成功', '成功', {
                confirmButtonText: '去登录',
                callback: () => {
                  // this.$router.push('/login')
                  console.log('注册成功')
                },
              })
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
  mounted() {
    const signInBtn = document.getElementById('signIn')
    const signUpBtn = document.getElementById('signUp')
    const fistForm = document.getElementById('form1')
    const secondForm = document.getElementById('form2')
    const container = document.querySelector('.container')
    // console.log(container)
    signInBtn.addEventListener('click', (e) => {
      container.classList.remove('right-panel-active')
      e.preventDefault()
    })

    signUpBtn.addEventListener('click', (e) => {
      container.classList.add('right-panel-active')
      e.preventDefault()
    })

    fistForm.addEventListener('submit', (e) => e.preventDefault())
    secondForm.addEventListener('submit', (e) => e.preventDefault())
  },
}
</script>

<style scoped>
.captcha {
  display: flex;
  /* justify-content: space-between; */
  width: 190px;
}
.img {
  width: 100px;
  height: 40px;
  width: 50%;
  float: right;
  cursor: pointer;
}
.captcha-input {
  display: block;
  width: 50%;
  float: left;
}
</style>
