<template>
  <a-layout class="main-page-warper">
    <LeftSide ref="left_side" @changeNum="x => countNum = x" :collapsed="this.collapsed" @pushRouterObj="pushRouterObj"/>
    <a-layout class="main-right-group">
      <a-layout-header
        class="header-style"
        :style="{width: `calc( 100vw - ${collapsed ? 80 : 200}px )`}">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <div class="icon-box">
          <div class="div-icon-box" @click="$router.push({name:'MessageCenter', query: {num: 0}})">
            <a-badge :count="countNum" :style="{fontSize: '10px'}">
              <i class="iconfont iconxiaoxi"></i>
            </a-badge>
          </div>
          <div class="div-icon-box">
            <a-dropdown>
              <span class="ant-dropdown-link" href="#">
                <i class="iconfont icontuichu"></i>
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="visiblePassword = !visiblePassword">修改密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="showConfirm">退出</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <div :style="{width: `calc( 100vw - ${collapsed ? 80 : 200}px )`,height: `40px`}"></div>
      <a-layout-content
        class="content-box"
        :style="{width: `calc( 100vw - ${collapsed ? 80 : 200}px )`}">
        <div class="tag-list">
          <a-icon
            type="left"
            class="left-icon"
            @click="leftMove"
            :style="{fontSize: '20px'}"
            v-if="haveScroll"
          />
          <ul style="margin: 0 5px;" ref="tagListBox">
            <li
              :style="{backgroundColor: item.setIng?'#1b87e2' : '' }"
              :class="item.setIng ? 'color-write' : 'color-blak'"
              v-for="(item,index) in routerPath"
              :key="index"
              @click="backPath(item)"
            >
              {{item.name}}
              <a-icon
                type="reload"
                v-if="item.setIng"
                :style="{fontSize: '10px',marginLeft: '3px'}"
                @click.stop="roloadPage(index)"
              />
              <a-icon
                type="close"
                :style="{fontSize: '10px',marginLeft: '3px'}"
                @click.stop="closePage(index)"
              />
            </li>
          </ul>
          <a-icon
            type="right"
            v-if="haveScroll"
            @click="rightMove"
            :style="{fontSize: '20px'}"
            class="rignt-icon"
          />
        </div>
        <!-- 删除缓存keepLiveList， 需要增加的时候把他加入到include中 -->
        <!-- <keep-alive :include="keepLiveList" exclude="manageClassSeting, AttendanceDetails"> -->
          <router-view></router-view>
        <!-- </keep-alive> -->
      </a-layout-content>
      <a-modal :maskClosable="false" title="修改密码" :visible="visiblePassword" @ok="handleOkUpdata" @cancel="handleCancel">
        <div class="input-box-password">
          <a-input placeholder="原密码" v-model="oldPassword" type="password" class="password-style"/>
          <a-input placeholder="新密码" v-model="newPassword" type="password" class="password-style"/>
          <a-input placeholder="确认新密码" v-model="mkShurePassword" type="password" class="password-style"/>
        </div>
      </a-modal>
    </a-layout>
    <WebSocketModal/>
  </a-layout>
</template>
<script>
import WebSocketModal from '@/components/WebSocketModal'
import LeftSide from "./LeftSide/LeftSide";
import { mapState } from "vuex";
import { setInterval, setTimeout } from "timers";
import Vue from "vue";
import req from "@/req/req";
const { updatePassword, getCountNum } = req;
export default {
  name: "MainPage",
  components: {
    LeftSide, WebSocketModal
  },
  data() {
    return {
      countNum: 0,
      collapsed: false,
      routerPath: [],
      haveScroll: false,
      visiblePassword: false,
      id: null,
      oldPassword: null,
      newPassword: null,
      mkShurePassword: null
    };
  },
  methods: {
    showConfirm() {
      const { logOut } = this;
      logOut();
    },
    handleCancel() {
      this.visiblePassword = false;
    },
    handleOkUpdata() {
      const { oldPassword,newPassword,mkShurePassword,$message } = this;
      const userData = Vue.ls.get("USER_DATA")
      if(!oldPassword || !newPassword || !mkShurePassword){
        $message.warning('请完善修改密码！')
        return;
      }
      if(newPassword !== mkShurePassword){
        $message.warning('新密码两次，不相同！')
        return;
      }
      updatePassword({
        id: userData.id,
        oldPassword,
        newPassword
      }).then(({ data: { msg, code } }) => {
        if(code === 0){
          this.$message.success(msg);
          this.visiblePassword = false;
          Vue.ls.set("USER_DATA", null, 0);
          Vue.ls.set("ACCESS_TOKEN", null, 0);
          this.$router.push({ name: "Login" });
        }else{
          this.$message.warning(msg);
        }
      });
      // a
    },
    pushRouterObj(obj) {
      if (!obj.keyName || !obj.name) {
        // 确保数据有效
        return;
      }
      this.checkSize();
      this.routerPath.forEach((ele, index) => {
        ele.setIng = false;
      });
      for (let item of this.routerPath) {
        // 判断是否存在
        if (item.keyName === obj.keyName) {
          item.setIng = true;
          return;
        }
      }
      obj.setIng = true;
      this.routerPath.push(obj);
    },
    backPath(obj) {
      // 点击回退
      this.routerPath.forEach((ele, index) => {
        ele.setIng = false
      });
      for (let item of this.routerPath) {
        // 判断是否存在
        if (item.keyName === obj.keyName) {
          item.setIng = true
        }
      }
      this.$router.push({
        name: obj.keyName,
        params: {
          id: obj.id ? obj.id : 0
        }
      })
    },
    roloadPage (index) {
      location.reload()
    },
    closePage(index) {
      if (this.routerPath.length === 1) {
        return;
      }
      this.routerPath.splice(index, 1);
      if (this.routerPath[index]) {
        this.backPath(this.routerPath[index]);
      } else {
        this.backPath(this.routerPath[index - 1]);
      }
      this.checkSize();
    },
    firstTag() {
      // 第一次进入页面第一个Tag
      let name = "";
      for (let item of this.leftSideArr) {
        if (item.children) {
          for (let ite of item.children) {
            if (ite.keyName === this.$route.name) {
              name = ite.name;
            }
          }
        } else {
          if (item.keyName === this.$route.name) {
            name = item.name;
          }
        }
      }
      if (!name) {
        return;
      }
      this.routerPath.push({ keyName: this.$route.name, name, setIng: true });
    },
    checkSize() {
      this.haveScroll =
        this.$refs.tagListBox.scrollWidth > this.$refs.tagListBox.clientWidth;
    },
    rightMove() {
      this.$refs.tagListBox.scrollLeft += 80;
    },
    leftMove() {
      this.$refs.tagListBox.scrollLeft -= 80;
    },
    logOut() {
      const { $confirm, $router } = this;
      $confirm({
        title: "确认退出？",
        content: "",
        onOk: () => {
          Vue.ls.set("USER_DATA", null, 0);
          Vue.ls.set("ACCESS_TOKEN", null, 0);
          $router.push({ name: "Login" });
        },
        onCancel: () => {}
      });
    },
    getCountNum () {
      console.log(this.$refs)
      getCountNum().then(({data: {data, code, msg}}) => {
        this.countNum = data
      })
    },
  },
  computed: {
    count () {
      return this.$route.query.num || this.countNum
    },
    keepLiveList() {
      let str = "";
      this.routerPath.forEach((ele, index) => {
        str = str + ele.keyName + ",";
      });
      return str;
    },
    ...mapState(["sendTapData", "leftSideArr", 'havRoleList'])
  },
  created() {
    this.getCountNum()
    this.firstTag();
    window.addEventListener("resize", this.checkSize);
    setTimeout(()=>{
      if(!this.havRoleList.some(ele=>ele.moduleName === '首页')){
        for(let key in this.routerPath){
          if(this.routerPath[key].name === '首页'){
            this.routerPath.splice(key,1)
            // console.log(this.leftSideArr[0].children[0].keyName)
            if(this.leftSideArr[0].children && this.leftSideArr[0].children[0]){
              this.$router.push(this.leftSideArr[0].children[0].keyName)
            }
          }
        }
      }
    },1000)
  },
  watch: {
    sendTapData: {
      handler(newVal) {
        for (let item of this.routerPath) {
          // 判断是否存在
          if (item.keyName === newVal.keyName) {
            item.id = newVal.id;
            return;
          }
        }
      }
    },
    havRoleList(newVal) {
      if(!newVal.some(ele=>ele.moduleName === '首页')){
        for(let key in this.routerPath){
          if(this.routerPath[key].name === '首页'){
            this.routerPath.splice(key,1)
            this.$router.push(this.leftSideArr[0].children[0].keyName)
          }
        }
      }
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.checkSize);
  }
};
</script>
<style scoped lang="less">
@import '~@/global';

.main-page-warper {
  height: 100%;
  overflow: hidden;
}
.header-style {
  background: #fff;
  height: 40px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #d4d4d4;
  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff !important;
    }
  }
  .icon-box {
    display: flex;
    // width: 100px;
    justify-content: space-between;
    .div-icon-box {
      margin: 0 10px;
      cursor: pointer;
      i {
        // padding: 0 12px;
        font-size: 16px;
      }
    }
  }
}
.main-right-group {
  min-width: 1000px;
  .content-box {
    padding: 0 16px 24px 16px;
    height: calc(100vh - 40px);
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      /* 滚动条整体样式 */
      width: 4px; /* 高宽分别对应横竖滚动条的尺寸 */
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      /* 滚动条里面小方块 */
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px #d4d4d4;
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      /* 滚动条里面轨道 */
      -webkit-box-shadow: inset 0 0 5px #d4d4d4;
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
.tag-list {
  margin: 10px 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  // position: relative;
  ul {
    width: 100%;
    word-wrap: none;
    margin-top: -20px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      // width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
      // height: 1px;
      display: none;
    }
    li {
      user-select: none;
      display: inline-block;
      background-color: rgb(255, 255, 255);
      padding: 5px 6px;
      margin-right: 10px;
      border-radius: 5px;
      box-sizing: border-box;
      transition: all ease.61s;
      white-space: nowrap;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      border: 1px solid rgb(212, 212, 212);
      &.color-blak {
        color: #424242;
        &:hover {
          // background-color: rgb(248, 248, 248);
          color: #1b87e2;
        }
      }
      &.color-write {
        color: #ffffff;
      }
    }
  }
  .left-icon {
    // position: absolute;
    left: 0;
    cursor: pointer;
  }
  .right-icon {
    // position: absolute;
    right: 0;
    cursor: pointer;
  }
}
.password-style {
  margin-bottom: 15px;
  width: 60%
}
.input-box-password{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
