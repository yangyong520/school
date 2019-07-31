<template>
  <div class="CycleMap">
    <div class="data-map-title">
      <div class="data-map-title-select">
        <a-select size="small" v-model="classIdMap" style="width: 200px" class="input-map-box">
          <a-select-option
            :key="index"
            v-for="(item,index) in grClassArr"
            :value="item.id"
          >{{`20${item.gradeName}级-${item.className}班`}}</a-select-option>
        </a-select>
        <a-time-picker
          @change="onChange"
          size="small"
          class="input-map-box"
          :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')"
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
      <DataTable ref="table_page" :columns="columns" reqType="cycleAss" :queryObj="queryObj"></DataTable>
    </a-modal>

    <div class="cycle-map">
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
            :v-style="{ fontSize: 40, textAlign: 'center' }"
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
import DataTable from '@/components/DataTable'
import moment from "moment";
import req from "@/req/req";
const {
  statRealBedTimeInfoByTeacher,
  getGradeClassList
} = req;

export default {
  name: "CycleMap",
  components: {
    DataTable
  },
  data() {
    return {
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
      timer: moment().format("HH:mm:ss"),
      grClassArr: [],
      classIdMap: "",
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
            const areaName = record.areaName ? record.areaName + '-' : ''
            const buildName = record.buildName ? record.buildName + '-' : ''
            const roomNum = record.roomNum ? `${record.roomNum}室-` : ''
            const bedNum = record.bedNum ? `${record.bedNum}号床` : ''
            return (areaName + buildName + roomNum + bedNum) || '无'
          }
        },
        {
          title: "班级信息",
          customRender: (text, record, index) => {
            const collegeName = record.collegeName ? record.collegeName + '-' : ''
            const proName = record.proName ? record.proName + '-' : ''
            const gradeName = record.gradeName ? `20${record.gradeName}级-` : ''
            const className = record.className ? `${record.className}班` : ''
            return (collegeName + proName + gradeName + className) || '无'
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
        classId: this.classIdMap
      }
    }
  },
  methods: {
    moment,
    getClassList() {
      getGradeClassList().then(({ data: { data, msg, code } }) => {
        if (code === 0) {
          this.grClassArr = data;
        }
      });
    },
    getStatRealBedTimeInfoByTeacher() {
      const { classIdMap, timer } = this;
      statRealBedTimeInfoByTeacher({
        queryTime: timer,
        classId: classIdMap
      }).then(
        ({
          data: {
            code,
            msg,
            data: { totalCount, inCount, rate }
          }
        }) => {
          if (code === 0) {
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
      this.timer = timer ? timer.format("HH:mm:ss") : moment().format("HH:mm:ss")
    },
    getGetOutBedStudentInfoByTeacherList() {
      this.$refs.table_page.getDataTable()
    }
  },
  created() {
    const {
      getStatRealBedTimeInfoByTeacher,
      getClassList
    } = this;
    getStatRealBedTimeInfoByTeacher();
    getClassList();
  },
  watch: {
    timer() {
      this.getStatRealBedTimeInfoByTeacher();
      this.getGetOutBedStudentInfoByTeacherList();
    },
    classIdMap() {
      this.getStatRealBedTimeInfoByTeacher();
      this.getGetOutBedStudentInfoByTeacherList();
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
