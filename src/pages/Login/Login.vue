<template>
  <div class="Login" :style="{backgroundImage: `url(./static/Group.png)`}">
    <img :src="'./static/Bitmap.png'" alt>
    <div class="login-box">
      <div class="input-warper">
        <input
          type="text"
          class="text-style"
          placeholder="请输入手机号"
          :style="{flex: 1}"
          v-model="phone"
        >
      </div>
      <div class="input-warper">
        <input
          type="password"
          v-model="password"
          :style="{flex: 2}"
          class="text-style"
          placeholder="请输入密码"
          name
          id
        >
        <!-- <button class="btn" :style="{flex: 1}">获取验证码</button> -->
      </div>
      <div class="input-warper rember">
        <label>
          <div class="checkbox-style" :class="{'checkbox-btn': checkdata}"></div>
          <input type="checkbox" v-model="checkdata" name id>
        </label>
        15天内自动登录
      </div>
      <div class="input-warper rember">
        <button class="btn" @click="loging" :style="{flex: 1}" @keyup.enter="loging">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapMutations, mapActions, mapState } from "vuex";
import req from "@/req/req";
import { roleControlMixin } from "@/mixin";
const { login } = req;
export default {
  name: "Login",
  mixins: [roleControlMixin],
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      checkdata: false,
      phone: '',
      password: '',
      logingStatus: false
    };
  },
  computed: {
    ...mapState(['havRoleList', 'leftSideArr'])
  },
  methods: {
    loging() {
      const {
        phone,
        password,
        $message,
        $router,
        setUserData,
        setLeftSide,
        jumpPage,
        getRoleList,
        logingStatus
      } = this;
      if (logingStatus) {
        $message.warning('请勿重复点击登录按钮！')
        return;
      }
      this.logingStatus = true;
      const hide = $message.loading("登陆中...", 0);
      login({
        phone,
        password
      }).then(
        ({ data: { code, data, msg } }) => {
          this.logingStatus = false;
          hide();
          if (code === 0) {
            $message.success("登陆成功");
            // setLeftSideArrIndex("Institute");
            getRoleList();
            setLeftSide(data.type);
            setUserData(data);
            jumpPage(data);
            Vue.ls.set("USER_DATA", data, this.checkdata ? 15 * 24 * 60 * 60 * 1000 : 1 / 12 * 24 * 60 * 60 * 1000);
            Vue.ls.set("ACCESS_TOKEN", data.token, this.checkdata ? 15 * 24 * 60 * 60 * 1000 : 1 / 12 * 24 * 60 * 60 * 1000);
          } else {
            $message.error(msg);
          }
        },
        err => (this.logingStatus = false)
      );
    },
    keyEnterLogin(e) {
      if (e.keyCode === 13) {
        this.loging();
      }
    },
    jumpPage(data) {
      const { $router, $message } = this;
      if (data.type === 3 || data.type === 0) {
        $router.push({ name: "Institute", params: { master: true } });
      } else if (data.type === 5) {
        $router.push({ name: "Institute", params: { master: false } });
      } else if (data.type === 4) {
        $router.push({ name: "HouseMaster" });
      } else if (data.type === 2) {
        $router.push({ name: "Assistant" });
      } else if (data.type === 1) {
        $message.warning("学生不能登录该系统！");
      } else {
        $message.warning("用户信息缺少必要参数！");
      }
    },
    ...mapActions(["setLeftSide"]),
    ...mapMutations("user", ["setUserData"])
  },
  created() {
    const { setUserData, setLeftSide, jumpPage } = this;
    const data = Vue.ls.get("USER_DATA");
    const token = Vue.ls.get("ACCESS_TOKEN");
    window.addEventListener("keydown", this.keyEnterLogin);
    if (data && token) {
      setLeftSide(data.type);
      setUserData(data);
      jumpPage(data);
    }

    // 获取浏览器15天是否勾选
    this.checkdata = Vue.ls.get("CHECK_DATA");
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyEnterLogin);
  },
  watch: {
    checkdata(newVal){
      Vue.ls.set("CHECK_DATA", newVal,  1000 * 24 * 60 * 60 * 1000 );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

@loginColor: rgba(158, 160, 162, 1);
.Login {
  background-color: #141d2c;
  height: 100vh;
  width: 100vw;
  color: @loginColor;
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: right top;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 350px;
    margin-bottom: 30px;
  }
  .login-box {
    width: 440px;
    // height: 330px;
    background-color: #212c3d;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 25px;
    box-sizing: border-box;
    label {
      .checkbox-style {
        height: 14px;
        width: 14px;
        border: 1px solid @loginColor;
        display: flex;
        justify-content: center;
        align-items: center;
        & + input {
          display: none;
        }
      }
      .checkbox-btn {
        &::before {
          content: " ";
          height: 8px;
          width: 5px;
          box-sizing: border-box;
          border-bottom: 2px solid @loginColor;
          border-right: 2px solid @loginColor;
          transform: rotate(45deg);
          margin-bottom: 1px;
        }
      }
    }
  }
}
.input-warper {
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  .text-style {
    padding: 8px 5px;
    &:focus {
      outline: none;
    }
  }
  .btn {
    border: 1px solid @loginColor; //自定义边框
    outline: none; //消除默认点击蓝色边框效果
    border-radius: 5px;
    background-color: transparent;
    box-sizing: border-box;
    &:active {
      background-color: rgb(100, 100, 100);
    }
  }
}
.text-style {
  border: 0;
  background-color: #4b515b;
  border-radius: 5px;
}
.rember {
  margin-top: 15px;
  .btn {
    padding: 10px;
    background-color: #fff;
  }
}
</style>
