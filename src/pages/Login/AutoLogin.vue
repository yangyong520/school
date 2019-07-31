<template>
  <div></div>
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
      checkdata: true,
      phone: 'admin',
      password: '12345678',
    };
  },
  computed: {
    ...mapState(['havRoleList', 'leftSideArr'])
  },
  methods: {
    loging() {
      console.log(1111111111111)
      login({
        phone: this.phone,
        password: this.password
      }).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          // this.getRoleList();
          this.setLeftSide(data.type);
          this.setUserData(data);
          this.jumpPage(data);
          Vue.ls.set("USER_DATA", data, this.checkdata ? 15 * 24 * 60 * 60 * 1000 : 1 / 12 * 24 * 60 * 60 * 1000);
          Vue.ls.set("ACCESS_TOKEN", data.token, this.checkdata ? 15 * 24 * 60 * 60 * 1000 : 1 / 12 * 24 * 60 * 60 * 1000);
        } else {
          this.$message.error(msg);
        }
      });
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
    // window.addEventListener("keydown", this.keyEnterLogin);
    if (data && token) {
      setLeftSide(data.type);
      setUserData(data);
      jumpPage(data);
    }

    // 获取浏览器15天是否勾选
    this.checkdata = Vue.ls.get("CHECK_DATA");
  },
  mounted () {
    console.log(123)
    this.loging()
  },
  destroyed() {
    // window.removeEventListener("keydown", this.keyEnterLogin);
  },
  watch: {
    checkdata(newVal){
      Vue.ls.set("CHECK_DATA", newVal,  1000 * 24 * 60 * 60 * 1000 );
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
