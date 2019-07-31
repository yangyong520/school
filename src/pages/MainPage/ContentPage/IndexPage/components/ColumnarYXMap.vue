<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="title-box">
        <span>{{title}}</span>
      </div>

      <v-chart
        :forceFit="true"
        :scale="[{
        dataKey: 'queryDate',
        type: 'cat'
      }]"
        :height="height"
        :data="mapData"
        :padding="[10, 50, 80, 50]">
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
const { statBreakRuleList } = req;

export default {
  props: ["title", "collegeIdYX", "professionIdYX", "gradeIdYX", "classIdYX"],
  data() {
    return {
      mapData: [],
      height: 364,
      adjust: [{ type: "dodge", marginRatio: 1 / 32 }],

      timeLanger: "weak",
      timeStatus: ["now"],
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
      const { collegeId, collegeIdYX, professionIdYX, classIdYX } = this;
      statBreakRuleList({
        collegeId: collegeIdYX === "all" ? null : collegeIdYX,
        proId: professionIdYX === "all" ? null : professionIdYX,
        classId: classIdYX === "all" ? null : classIdYX
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
                ele.type = "处理数量";
              } else if (ele.type === "historyCount") {
                ele.type = "历史待处理";
              } else if (ele.type === "todayCount") {
                ele.type = "今日待处理";
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
  },
  created() {
    this.getColumarData();
  },
  watch: {
    collegeIdYX() {
      this.getColumarData();
    },
    professionIdYX() {
      this.getColumarData();
    },
    gradeIdYX() {
      this.getColumarData();
    },
    classIdYX() {
      this.getColumarData();
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
