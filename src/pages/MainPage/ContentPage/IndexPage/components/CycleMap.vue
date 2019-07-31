<template>
  <div class="CycleMap">
    <div class="data-map-title">
      <div class="data-map-title-select">
        <a-select size="small" v-model="buildIdMap" style="width: 200px" class="input-map-box">
          <a-select-option
            :key="index"
            v-for="(item,index) in areaBuildArr"
            :value="item.buildId"
          >{{item.areaName}}</a-select-option>
        </a-select>
        <a-time-picker
          @change="onChange"
          size="small"
          class="input-map-box"
          :defaultOpenValue="moment('00:00:00', 'H:mm:ss')"
        />
      </div>
      <div class="data-map-title-text">
        <span>实时归寝</span>
        <span class="lieave-list" @click="visible = !visible">离寝名单</span>
      </div>
    </div>

    <a-modal
      :title="`离寝名单 ${timer}`"
      :visible="visible"
      :footer="null"
      :width="650"
      :maskClosable="false"
      @cancel="visible = !visible">
      <DataTable ref="table_page" :queryObj="queryObj" :columns="columns" reqType="cycle"></DataTable>
    </a-modal>

    <div class="cycle-map" v-if="showChart">
      <div :style="{height: '100%',width: '50%'}">
        <v-chart
          :forceFit="true"
          :width="300"
          :height="400"
          :data="dataCycle"
          :scale="scaleCycle"
          :padding="0">
          <v-tooltip/>
          <v-interval
            shape="liquid-fill-gauge"
            position="gender*value"
            color="gender"
            :v-style="{lineWidth: 6, opacity: 0.75}"
          />
          <v-guide
            v-for="(row, index) in dataCycle"
            :key="index"
            type="text"
            :top="true"
            :position="{ gender: row.gender, value: 50 }"
            :content="`${row.grade}%`"
            :v-style="{ fontSize: 40, textAlign: 'center'}"
          />
        </v-chart>
      </div>
      <div class="cycle-map-student-block">
        <ul class="student-block-ul">
          <li>
            <span class="cycle-map-item-title">当前人数</span>
            <span>{{nowPerson}}</span>
          </li>
          <li>
            <span class="cycle-map-item-title">总人数</span>
            <span>{{allPerson}}</span>
          </li>
        </ul>
        <span>当前归寝率为 {{dataCycle[0].grade}}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import req from "@/req/req";
import DataTable from '@/components/DataTable'
const {
  statRealBedTimeInfoBySg,
  getAreaBuildingFormList,
} = req;

export default {
  name: "CycleMap",
  components: {
    DataTable
  },
  data() {
    return {
      showChart: false,
      visible: false,
      spinning: false,
      scaleCycle: [
        {
          dataKey: "value",
          min: 0,
          max: 100
        }
      ],
      dataCycle: [
        {
          gender: "当前人数",
          path:
            "M381.759 0h292l-.64 295.328-100.127-100.096-94.368 94.368C499.808 326.848 512 369.824 512 415.712c0 141.376-114.56 256-256 256-141.376 0-256-114.624-256-256s114.624-256 256-256c48.8 0 94.272 13.92 133.12 37.632l93.376-94.592L381.76 0zM128.032 415.744c0 70.688 57.312 128 128 128s128-57.312 128-128-57.312-128-128-128-128 57.312-128 128z",
          value: 0,
          grade: 0
        }
      ],
      nowPerson: 0,
      allPerson: 0,
      dateFormat: "YYYY/MM/DD",
      classId: "",
      timer: moment(new Date()).format("H:mm:ss"),
      areaBuildArr: [],
      buildIdMap: "",
      selectedRowKeys: [],
      columns: [
        {
          title: "姓名",
          dataIndex: "studentName"
        },
        {
          title: "学号",
          dataIndex: "userNum"
        },
        {
          title: "房间信息",
          customRender: (text, record, index) => {
            return (
              <span>
                {`${record.areaName}-${record.buildName}-${record.areaName}-${
                  record.areaName
                }`}
              </span>
            );
          }
        },
        {
          title: "辅导员信息",
          customRender: (text, record, index) => {
            return (
              <span>{`${record.teacherName}-${record.teacherPhone}`}</span>
            );
          }
        }
      ],
      leaveList: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      }
    };
  },
  computed: {
    queryObj () {
      return {
        queryTime: this.timer,
        buildId: this.buildIdMap
      }
    }
  },
  methods: {
    moment,
    getStatRealBedTimeInfoBySg() {
      const { buildIdMap, timer } = this;
      statRealBedTimeInfoBySg({
        queryTime: timer,
        buildId: buildIdMap
      }).then(({data: {code, msg, data: { totalCount, inCount, rate }}}) => {
          if (code === 0) {
            this.showChart = true
            this.dataCycle[0].value = inCount;
            this.dataCycle[0].grade = (Number(rate) * 100).toFixed(0);
            this.nowPerson = inCount;
            this.allPerson = totalCount;
          } else {
            $message.warning(msg);
          }
        }
      );
    },
    onChange(timer) {
      this.timer = timer
        ? timer.format("H:mm:ss")
        : moment(new Date()).format("H:mm:ss");
    },
    getGetAreaBuildingFormList() {
      getAreaBuildingFormList().then(({ data: { code, msg, data } }) => {
        const { $message } = this;
        if (code === 0) {
          this.areaBuildArr = data;
        }
      });
    },
    getGetOutBedStudentInfoBySgList() {
      this.$refs.table_page.getDataTable()
    }
  },
  created() {
    const {
      getStatRealBedTimeInfoBySg,
      getGetAreaBuildingFormList,
    } = this;
    getStatRealBedTimeInfoBySg();
    getGetAreaBuildingFormList();
  },
  watch: {
    timer() {
      this.getStatRealBedTimeInfoBySg();
      this.getGetOutBedStudentInfoBySgList();
    },
    buildIdMap() {
      this.getStatRealBedTimeInfoBySg();
      this.getGetOutBedStudentInfoBySgList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.data-map-title {
  display: flex;
  align-items: center;
  .data-map-title-select {
    flex: 3;
    display: flex;
    .input-map-box {
      margin-right: 10px;
    }
  }
  .data-map-title-text {
    flex: 4;
    display: flex;
    justify-content: space-between;
    span {
      &:nth-of-type(2) {
        font-size: 14px;
      }
    }
  }
}
.lieave-list {
  cursor: pointer;
}
</style>
