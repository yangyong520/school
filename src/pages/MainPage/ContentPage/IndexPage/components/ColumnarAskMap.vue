<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="title-box">
        <span>{{title}}</span>
        <div class="title-box-select">
          <a-select size="small" v-model="askType" style="width: 120px">
            <a-select-option :value="0">全部</a-select-option>
            <a-select-option v-if="!areaSet" :value="1">调寝</a-select-option>
            <a-select-option v-if="!areaSet" :value="2">请假</a-select-option>
            <a-select-option v-if="areaSet" :value="3">被访</a-select-option>
            <a-select-option v-if="areaSet" :value="4">报修</a-select-option>
          </a-select>
        </div>
      </div>

      <v-chart
        :forceFit="true"
        :scale="[{
        dataKey: 'queryDate',
        type: 'cat'
      }]"
        :height="height"
        :data="mapData"
        :padding="[10, 50, 80, 50]"
      >
        <v-tooltip/>
        <v-axis name="queryDate"/>
        <v-axis name="count"/>
        <v-legend/>
        <v-bar position="queryDate*count" color="type" :adjust="adjust"/>
      </v-chart>
    </a-spin>
  </div>
</template>

<script>
import DataSet from "@antv/data-set";
import req from "@/req/req";
const { statApplyInfoList, statApplyInfoListTwo } = req;

export default {
  props: ["title", "collegeId", "areaId", "buildId", 'areaSet'],
  data() {
    return {
      mapData: [],
      height: 364,
      adjust: [{ type: "dodge", marginRatio: 1 / 32 }],

      timeLanger: "weak",
      timeStatus: ["now"],
      askType: 0,
      spinning: false
    };
  },
  computed: {
    timerGet() {
      if (this.timeLanger === "weak") {
        return "周";
      } else if (this.timeLanger === "mouth") {
        return "月";
      } else if (this.timeLanger === "year") {
        return "年";
      } else {
        return "未知";
      }
    }
  },
  methods: {
    test(data) {
    },
    changeLongTime(event) {
      this.timeLanger = event.target.value;
    },
    clickTimeStatus(data) {
      this.timeStatus = [data.key];
    },
    getColumarData() {
      this.spinning = true;
      const { collegeId, areaId, buildId, askType } = this;
      if (!this.areaSet) {
        statApplyInfoList({
          type: askType,
          collegeId: collegeId === "all" ? null : collegeId,
          areaId: areaId === "all" ? null : areaId,
          buildId: buildId === "all" ? null : buildId
        }).then(
          ({ data: { msg, code, data } }) => {
            this.spinning = false;
            if (code === 0) {
              const dv = new DataSet.View().source(data);
              dv.transform({
                type: "fold",
                fields: ["dealCount", "historyCount", "todayCount"],
                key: "type",
                value: "count"
              });
              dv.rows.forEach(ele => {
                if (ele.type === "dealCount") {
                  ele.type = "今日已处理";
                } else if (ele.type === "historyCount") {
                  ele.type = "历史待处理";
                } else if (ele.type === "todayCount") {
                  ele.type = "今日新增量";
                } else {
                  ele.type = "未知";
                }
              });
              this.mapData = dv.rows;
            }
          },
          err => (this.spinning = false)
        );
      } else {
        statApplyInfoListTwo({
          type: askType,
          areaId: areaId === "all" ? null : areaId,
          buildId: buildId === "all" ? null : buildId
        }).then(
          ({ data: { msg, code, data } }) => {
            this.spinning = false;
            if (code === 0) {
              const dv = new DataSet.View().source(data);
              dv.transform({
                type: "fold",
                fields: ["dealCount", "historyCount", "todayCount"],
                key: "type",
                value: "count"
              });
              dv.rows.forEach(ele => {
                if (ele.type === "dealCount") {
                  ele.type = "今日已处理";
                } else if (ele.type === "historyCount") {
                  ele.type = "历史待处理";
                } else if (ele.type === "todayCount") {
                  ele.type = "今日新增量";
                } else {
                  ele.type = "未知";
                }
              });
              this.mapData = dv.rows;
            }
          },
          err => (this.spinning = false)
        );
      }
    }
  },
  created() {
    this.getColumarData();
  },
  watch: {
    areaSet () {
      this.askType = 0
      this.getColumarData()
    },
    collegeId() {
      this.getColumarData();
    },
    areaId() {
      this.getColumarData();
    },
    buildId() {
      this.getColumarData();
    },
    askType() {
      this.getColumarData();
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
