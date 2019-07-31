<template>
  <div class="dormitoryBedDetails">
    <div class="back-handle" @click="goBack">
      <a-icon type="left"/>
      <span
        style="font-size: 18px;font-weight: bold;"
        @click.native="$router.back()"
        class="title-box">床位分配</span>
    </div>

    <a-steps :current="currentCont">
      <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
    </a-steps>

    <div class="steps-action">
      <a-button v-if="currentCont > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
      <a-button v-if="currentCont < steps.length - 1" type="primary" @click="next">下一步</a-button>
      <a-button
        v-if="currentCont == steps.length - 1"
        type="primary"
        @click="submit">完成</a-button>
    </div>
    <div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import req from "@/req/req"

const {
  postAssignDormList
} = req

export default {
  name: "dormitoryBedDetails",
  data() {
    return {
      currentCont: 0,
      steps: [
        {
          title: "选择床位",
          content: "1"
        },
        {
          title: "选择人员",
          content: "2"
        },
        {
          title: "分配规则",
          content: "3"
        }
      ],
      selectList: [],
      badList: [],
      peoList: []
    };
  },
  computed: {
    routeName () {
      return this.$route.name || ''
    },
    bedList () {
      return this.$store.state.Bad.bedList
    }
  },
  mounted () {
    if (this.routeName) {
      this.getCurrent()
    }
  },
  methods: {
    getCurrent () {
      if (this.routeName) {
        this.currentCont = {
          'FirstStep': 0,
          'SeconseStep': 1,
          'ThredStep': 2
        }[this.routeName]
      }
    },
    goBack () {
      this.$router.push("/mainPage/dormitory/3")
    },
    getBadList () {
      this.badList = Vue.ls.get('bad_list') || []
    },
    getPeoList () {
      this.peoList = Vue.ls.get('peo_list') || []
    },
    next () {
      this.getBadList()
      this.getPeoList()
      if (this.currentCont === 0) {
        if (this.badList.length > 0) {
          this.currentCont = ++this.currentCont
          // return
        } else {
          this.$message.warning('请选择数据')
        }
        return
      }
      if (this.currentCont === 1) {
        if (this.peoList.length > 0 && this.peoList.length <= this.badList.length) {
          this.currentCont = ++this.currentCont
          return
        } else {
          this.$message.warning('选择人数和床位数不相符！请重新选择！')
          return
        }
        this.$message.warning('请选择数据')
      }
    },
    prev () {
      this.currentCont = --this.currentCont;
    },
    submit () {
      const type = Vue.ls.get('bad_type')
      const peoList = Vue.ls.get('peo_list') || []
      const badList = Vue.ls.get('bad_list') || []
      postAssignDormList({
        userIdList: peoList,
        bedIdList: badList,
        type: type
      }).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          this.$message.success(msg)
          this.$router.push('/mainPage/dormitory/3')
        } else {
          this.$message.warning(msg)
        }
      })
    }
  },
  watch: {
    $route () {
      this.getCurrent()
    },
    currentCont (newVal) {
      if (newVal === 0) {
        this.$router.push("/mainPage/dormitoryBedDetails/FirstStep")
      } else if (newVal === 1) {
        this.$router.push("/mainPage/dormitoryBedDetails/SeconseStep")
      } else if (newVal === 2) {
        this.$router.push("/mainPage/dormitoryBedDetails/ThredStep")
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/global';

.steps-action {
  margin-top: 24px;
}
.back-handle {
  cursor: pointer;
  margin-bottom: 24px;
}
</style>
