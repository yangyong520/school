<template>
  <div id="app">
    <a-spin :spinning="spinningRole">
      <a-locale-provider :locale="locale">
        <router-view/>
      </a-locale-provider>
    </a-spin>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Vue from "vue";
import { mapMutations, mapActions, mapState } from "vuex";
import { roleControlMixin } from "@/mixin";
export default {
  name: "App",
  mixins: [roleControlMixin],
  data() {
    return {
      locale: zhCN,
    };
  },
  methods: {
    ...mapActions(["setLeftSide"]),
    ...mapMutations("user", ["setUserData"])
  },
  computed: {
    ...mapState(['spinningRole'])
  },
  created() {
    const { setLeftSide, setUserData, getRoleList } = this;
    const data = Vue.ls.get("USER_DATA");
    const token = Vue.ls.get("ACCESS_TOKEN");
    if (data) {
      getRoleList();
      setLeftSide(data.type);
      setUserData(data);
    } else {
      const url = window.location.hash
      if (url && url !== '#/auto/login') {
        this.$router.push('Login')
      } else {
        this.$router.push('/auto/login')
      }
    }
  }
};
</script>

<style lang="less">
#app {
  height: 100%;
}
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* 全局样式Ant（蚂蚁） */
/* .ant-select-selection,.ant-input {
  border: 0;
} */
/* 操作栏样式 */
@import url(./global.less);
.todo-box {
  display: flex;
  justify-content: center;
  span {
    cursor: pointer;
    margin-right: 8px;
    user-select: none;
    font-weight: bold;
    &:hover {
      color: @styleColor;
    }
    &:active {
      color: brown;
    }
  }
}
.pagination-page-box {
  display: flex;
  justify-content: flex-end;
  .pagination-page {
    padding: 10px 0;
  }
}

// 筛选哪一行样式
.inner-style {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  .box-left {
    display: flex;
    align-items: center;
    .btn-box {
      margin-right: 10px;
    }
  }
  .box-right {
    display: flex;
    align-items: center;
    .btn-box {
      margin-left: 10px;
    }
  }
}

// 表格操作
div.todo-box {
  color: #424242;
  display: flex;
  span {
    padding: 6px 10px;
    box-sizing: border-box;
    width: 6em;
    text-align: center;
    border-radius: 5px;
    border: 1px solid rgb(204, 204, 204);
    transition: all ease 0.6s;
    color: #fff;
    &:nth-of-type(1) {
      background-color: #1b87e2;
    }
    &:nth-of-type(2) {
      background-color: #ffc424;
    }
    &:nth-of-type(3) {
      background-color: #ff7400;
    }
    &:nth-of-type(4) {
      background-color: #ff5926;
    }
    &:hover {
      color: #ffffff !important;
      border: 1px solid #fff;
    }
    &:active {
      color: #424242 !important;
      border: 1px solid #fff;
    }
  }
}

// 角色权限
.widthRole {
  min-width: 1100px !important;
}

// 改样式
.studentDiv .ant-select-selection--single {
  width: 150px !important;
  margin-left: 11px !important;
}
.boxBanModalInput {
  width: 170px !important;
  line-height: 32px !important;
  height: 32px !important;
  margin-left: 11px !important;
}
.boxInput {
  line-height: 32px !important;
  height: 32px !important;
  margin-left: 11px !important;
}
.boxDiv {
  width: 50% !important;
  float: left;
}
.w_270px {
  width: 270px !important;
}
.studentDiv input {
  width: 150px !important;
}
.btn-item {
  min-width: 6em;
}
// .w_200px {
//   width: 200px !important;
// }
// .w_420px {
//   width: 420px !important;
// }

.ChiMouDiv {
  float: right;
  width: 530px !important;
}

.ChiMouDivDeailDiv {
  float: left;
  width: 46% !important;
  margin-bottom: 10px !important;
  margin-left: 18px !important;
}

.ChiMouDivDeailDivW100 {
  width: 80% !important;
  margin-bottom: 10px !important;
  margin-left: 18px !important;
}

.ChiMouDivInput {
  width: 150px !important;
  line-height: 32px !important;
  height: 32px !important;
}

.ChiMouDivDeailDiv label {
  text-align: right;
  width: 88px !important;
  display: inline-block;
}

.ChiMouDivDeailDivW100 label {
  text-align: right;
  width: 88px !important;
  display: inline-block;
}

.boxSpanSelect {
  width: 60px !important;
  display: inline-block;
  text-align: right !important;
}

.ChiMouDivTitle {
  float: left !important;
  line-height: 32px !important;
}

.boxInput {
  line-height: 32px !important;
  height: 32px !important;
  margin-left: 11px !important;
}
.ml20px {
  margin-left: 20px !important;
}
.w50B {
  width: 50% !important;
}
.ant-table-thead > tr > th{
  white-space: nowrap;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  text-align: center !important;
}
p {
  margin-bottom: 0 !important
}
</style>
