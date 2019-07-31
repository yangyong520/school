<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="title-box">
        <span>{{title}}</span>
        <div class="title-box-select">
          <a-dropdown size="small">
            <a-menu slot="overlay" :selectedKeys="timeStatus" @click="clickTimeStatus">
              <a-menu-item key="now">{{timerGet === '年' ? '今' : '本'}}{{ timerGet }}</a-menu-item>
              <a-menu-item key="bofer">{{timerGet === '年' ? '去' : '上'}}{{ timerGet }}</a-menu-item>
            </a-menu>
            <a-button size="small">
              {{ (timerGet === '年' ? (timeStatus[0] === "now" ? "今" : "去" ) : (timeStatus[0] === "now" ? "本" : "上" ) )+ timerGet }}
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
          <a-radio-group size="small" :value="timeLanger" @change="changeLongTime">
            <a-radio-button value="week">周</a-radio-button>
            <a-radio-button value="month">月</a-radio-button>
            <a-radio-button value="year">年</a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <v-chart
        :force-fit="true"
        :height="364"
        :padding="[10, 50, 80, 50]"
        :data="lineDataTr"
        :scale="[0,1]">
        <v-tooltip/>
        <v-axis/>
        <v-legend/>
        <v-line position="queryDate*count" color="status"/>
        <v-point
          position="queryDate*count"
          color="status"
          :size="4"
          :v-style="style"
          :shape="'circle'"
        />
      </v-chart>
    </a-spin>
  </div>
</template>

<script>
import DataSet from "@antv/data-set";
import req from "@/req/req";
const { statAbnormalList } = req;
export default {
  props: ["title", "collegeId", "areaId", "buildId"],
  data() {
    return {
      lineDataTr: [],
      style: { stroke: "#fff", lineWidth: 1 },

      timeLanger: "week",
      timeStatus: ["now"],
      spinning: false
    };
  },
  computed: {
    timerGet() {
      if (this.timeLanger === "week") {
        return "周";
      } else if (this.timeLanger === "month") {
        return "月";
      } else if (this.timeLanger === "year") {
        return "年";
      } else {
        return "未知";
      }
    }
  },
  methods: {
    legendToString(val) {
      if (val === "lateReturnCount") {
        return "晚归";
      } else if (val === "noReturnCount") {
        return "未归";
      } else if (val === "noRecordCount") {
        return "无记录";
      } else {
        return "未知";
      }
    },
    changeLongTime(event) {
      const { getStatAbnormalList } = this;
      this.timeLanger = event.target.value;
      getStatAbnormalList();
    },
    clickTimeStatus(data) {
      const { getStatAbnormalList } = this;
      this.timeStatus = [data.key];
      getStatAbnormalList();
    },
    getStatAbnormalList() {
      // 异常行为统计数据
      this.spinning = true;
      const { collegeId, timeLanger, timeStatus, areaId, buildId } = this;
      statAbnormalList({
        type: timeStatus[0] === "now" ? 1 : 0,
        queryDate: timeLanger,
        collegeId: collegeId === "all" ? null : collegeId,
        areaId: areaId === "all" ? null : areaId,
        buildId: buildId === "all" ? null : buildId
      }).then(
        ({ data: { data, msg, code } }) => {
          this.spinning = false;
          if (code === 0) {
            const dv = new DataSet.View().source(data);
            dv.transform({
              type: "fold",
              fields: ["lateReturnCount", "noReturnCount", "noRecordCount"],
              key: "status",
              value: "count"
            });
            dv.rows.forEach(ele => {
              if (ele.status === "lateReturnCount") {
                ele.status = "晚归";
              } else if (ele.status === "noReturnCount") {
                ele.status = "未归";
              } else if (ele.status === "noRecordCount") {
                ele.status = "无记录";
              } else {
                ele.status = "未知";
              }
            });
            this.lineDataTr = dv.rows;
          }
        },
        err => (this.spinning = false)
      );
    }
  },
  created() {
    this.getStatAbnormalList();
  },
  watch: {
    collegeId() {
      this.getStatAbnormalList();
    },
    areaId() {
      this.getStatAbnormalList();
    },
    buildId() {
      this.getStatAbnormalList();
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
