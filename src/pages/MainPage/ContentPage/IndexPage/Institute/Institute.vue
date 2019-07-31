<template>
  <div class="Institute">
    <!-- 首页—系统管理员首页-院系 -->
    <div class="institute-title">
      <Title :title="masterShow ? '学校概况' : (!areaSet ? '学校概况' : '区域概况')"/>
      <div v-if="!masterShow">
        <college-select
          v-if="!areaSet"
          :value="collegeId"
          @changeVal="(val)=>{this.collegeId = val}"
          size="small"
          :width="'120px'"
          :haveAll="true"
          class="input-select"
        />
        <template v-else>
          <area-select
            :value="areaId"
            size="small"
            width="120px"
            :haveAll="true"
            @changeVal="(val)=>{this.areaId = val}"
            class="input-select"
          />
          <build-select
            :value="buildId"
            @changeVal="val=>{this.buildId = val}"
            :areaId="areaId"
            :haveAll="true"
            size="small"
            width="120px"
            class="input-select"
          />
        </template>
        <a-switch checkedChildren="区域" unCheckedChildren="院系" v-model="areaSet"/>
      </div>
    </div>
    <template v-if="!areaSet || masterShow">
      <!-- 系统 -->
      <div class="data-block">
        <div class="UserAndStudentBlock">
          <div class="item-box">
            <BlockTopBottom title="学生/辅导员" :dataArr="studentAndAsstent"/>
          </div>
          <div class="item-box">
            <BlockTopBottom title="专业/班级" :dataArr="profemAndClass"/>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 院系 -->
      <div class="data-block">
        <div class="UserAndStudentBlock">
          <div class="item-box">
            <BlockTopBottom title="宿管人数/楼栋数" :dataArr="assBuild"/>
          </div>
          <div class="item-box">
            <BlockLeftAndRight title="房间数/床位数" :dataArr="roomBed"/>
          </div>
        </div>
      </div>
    </template>

    <Title title="数据统计" borderLeft="5px solid #35D3A7" margin="14px 0"/>

    <div class="matser-select" v-if="masterShow">
      <CollegeSelectYX
        :value="collegeIdYX"
        @changeVal="(val)=>{this.collegeIdYX = val}"
        :width="'120px'"
        :haveAll="true"
        class="input-select"
      />
      <profession-select
        :value="professionIdYX"
        @changeVal="(val)=>{this.professionIdYX = val}"
        :collegeId="collegeIdYX"
        :width="'120px'"
        :haveAll="true"
        class="input-select"
      />
      <grade-select
        :value="gradeIdYX"
        @changeVal="(val)=>{this.gradeIdYX = val}"
        :width="'120px'"
        :haveAll="true"
        class="input-select-lee"
      />
      <class-select
        :value="classIdYX"
        :gradeId="gradeIdYX"
        :professionId="professionIdYX"
        :width="'120px'"
        :haveAll="true"
        @changeVal="(val)=>{this.classIdYX = val}"
        class="input-select-lee"
      />
    </div>
    <RealTimePerCount title="实时出入人数"/>
    <div class="g-list">
      <div>
        <!-- 系统管理员 异常行为统计 -->
        <UnusualLineMap
          v-if="!masterShow"
          :collegeId="areaSet ? 'all' : collegeId"
          :areaId="areaSet ? areaId : 'all'"
          :buildId="areaSet ? buildId :  'all'"
          title="系统异常行为统计"
        />
        <!-- 院系管理员 异常行为统计 -->
        <UnusualLineYXMap
          v-else
          :collegeIdYX="collegeIdYX"
          :professionIdYX="professionIdYX"
          :gradeIdYX="gradeIdYX"
          :classIdYX="classIdYX"
          title="院系异常行为统计"
        />
      </div>
      <div v-if="!areaSet || masterShow">
        <!-- 系统管理员 违纪处理数 -->
        <ColumnarMap
          v-if="!masterShow"
          :collegeId="areaSet ? 'all' : collegeId"
          :areaId="areaSet ? areaId : 'all'"
          :buildId="areaSet ? buildId :  'all'"
          title="系统违纪处理数"
        />
        <!-- 院系管理员 违纪处理数 -->
        <ColumnarYXMap
          v-else
          :collegeIdYX="collegeIdYX"
          :professionIdYX="professionIdYX"
          :gradeIdYX="gradeIdYX"
          :classIdYX="classIdYX"
          title="院系违纪处理数"
        />
      </div>
      <div v-if="!areaSet || masterShow">
        <ReportLineMap
          v-if="!masterShow"
          :collegeId="areaSet ? 'all' : collegeId"
          :areaId="areaSet ? areaId : 'all'"
          :buildId="areaSet ? buildId :  'all'"
          title="系统报警处理数"
        />
        <ReportLineYXMap
          v-else
          :collegeIdYX="collegeIdYX"
          :professionIdYX="professionIdYX"
          :gradeIdYX="gradeIdYX"
          :classIdYX="classIdYX"
          title="院系报警处理数"
        />
      </div>
      <div>
        <!-- 系统管理员 申请处理数 -->
        <ColumnarAskMap
          v-if="!masterShow"
          :areaSet="areaSet"
          :collegeId="areaSet ? 'all' : collegeId"
          :areaId="areaSet ? areaId : 'all'"
          :buildId="areaSet ? buildId :  'all'"
          title="系统申请处理数"
        />
        <!-- 院系管理员 申请处理数 -->
        <ColumnarAskYXMap
          v-else
          :collegeIdYX="collegeIdYX"
          :professionIdYX="professionIdYX"
          :gradeIdYX="gradeIdYX"
          :classIdYX="classIdYX"
          title="院系申请处理数"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RealTimePerCount from '../components/RealTimePerCount'
import UnusualLineMap from "../components/UnusualLineMap"; // 异常行为折线统计图-系统
import UnusualLineYXMap from "../components/UnusualLineYXMap"; // 异常行为折线统计图-院系
import ReportLineMap from "../components/ReportLineMap"; // 报警处理率折线统计图-系统
import ReportLineYXMap from "../components/ReportLineYXMap"; // 报警处理率折线统计图-院系
import ColumnarMap from "../components/ColumnarMap";
import ColumnarYXMap from "../components/ColumnarYXMap";
import ColumnarAskMap from "../components/ColumnarAskMap";
import ColumnarAskYXMap from "../components/ColumnarAskYXMap";
import { mapState } from "vuex";
import req from "@/req/req";
const { statSchoolInfoBySys, statSchoolInfoByYxSys, statHouseInfo } = req;
export default {
  name: "Institute",
  components: {
    UnusualLineMap,
    UnusualLineYXMap,
    ReportLineMap,
    ReportLineYXMap,
    ColumnarMap,
    ColumnarYXMap,
    ColumnarAskMap,
    ColumnarAskYXMap,
    RealTimePerCount
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      areaSet: false, // 学院还是区域
      masterShow: false, // 是否是系统管理员

      collegeId: "all",
      areaId: "all",
      buildId: "all",
      studentAndAsstent: [
        {
          itemTitle: "学生人数(男/女)",
          dataCount: "1600/500"
        },
        {
          itemTitle: "辅导员人数",
          dataCount: 13
        }
      ],
      profemAndClass: [
        {
          itemTitle: "专业数",
          dataCount: 15
        },
        {
          itemTitle: "班级数",
          dataCount: 12
        }
      ],
      statAbnormalData: [],
      collegeIdYX: "all",
      professionIdYX: "all",
      gradeIdYX: "all",
      classIdYX: "all",
      assBuild: [
        {
          itemTitle: "宿管人数",
          dataCount: 12
        },
        {
          itemTitle: "楼栋数",
          dataCount: 13
        }
      ],
      roomBed: [
        {
          itemTitle: "房间数",
          dataCount: "25"
        },
        {
          itemTitle: "床位数（入住/空置）",
          dataCount: "995/85"
        }
      ]
    };
  },
  computed: {
    ...mapState("user", ["userData"])
  },
  methods: {
    handleChange(data) {
    },
    initInstitute() {
      this.masterShow = !(this.userData.type === 0 || this.userData.type === 3);
    },
    getSatSchoolInfoBySys() {
      const { collegeId } = this;
      statSchoolInfoBySys({
        collegeId: collegeId === "all" ? null : collegeId
      }).then(
        ({
          data: {
            code,
            msg,
            data: {
              classSum = "",
              majorSum,
              manStuSum,
              teacherSum,
              womanStuSum
            }
          }
        }) => {
          const { studentAndAsstent, profemAndClass } = this;
          studentAndAsstent[0].dataCount = `${manStuSum}/${womanStuSum}`;
          studentAndAsstent[1].dataCount = `${teacherSum}`;
          profemAndClass[0].dataCount = `${majorSum}`;
          profemAndClass[1].dataCount = `${classSum}`;
        }
      );
    },
    yxSys() {
      const { collegeIdYX, professionIdYX, gradeIdYX, classIdYX } = this;
      statSchoolInfoByYxSys({
        collegeId: collegeIdYX === "all" ? '' : collegeIdYX,
        proId: professionIdYX === "all" ? '' : professionIdYX,
        gradeId: gradeIdYX === "all" ? '' : gradeIdYX,
        classId: classIdYX === "all" ? '' : classIdYX
      }).then(
        ({
          data: {
            code,
            msg,
            data: {
              classSum = "",
              majorSum,
              manStuSum,
              teacherSum,
              womanStuSum
            }
          }
        }) => {
          const { studentAndAsstent, profemAndClass } = this;
          studentAndAsstent[0].dataCount = `${manStuSum}/${womanStuSum}`;
          studentAndAsstent[1].dataCount = `${teacherSum}`;
          profemAndClass[0].dataCount = `${majorSum}`;
          profemAndClass[1].dataCount = `${classSum}`;
        }
      );
    },
    getStatHouseInfo() {
      const { areaId, buildId } = this;
      statHouseInfo({
        areaId: areaId === "all" ? null : areaId,
        buildId: buildId === "all" ? null : buildId
      }).then(
        ({
          data: {
            code,
            msg,
            data: { sgCount, buildCount, roomCount, stayCount, vacantCount }
          }
        }) => {
          this.assBuild[0].dataCount = sgCount;
          this.assBuild[1].dataCount = buildCount;
          this.roomBed[0].dataCount = roomCount;
          this.roomBed[1].dataCount = `${stayCount}/${vacantCount}`;
        }
      );
    },
    sysComentInit() {
      // 系统管理员 执行请求
      const { getSatSchoolInfoBySys, getStatHouseInfo } = this;
      getSatSchoolInfoBySys(); // 系统
      getStatHouseInfo();
    }
  },
  created() {
    const { initInstitute, sysComentInit } = this;
    initInstitute();
    if (this.masterShow) {
      this.yxSys()
    } else {
      sysComentInit();
    }
  },
  watch: {
    collegeId() {
      this.getSatSchoolInfoBySys();
    },
    collegeIdYX () {
      this.yxSys()
    },
    classIdYX () {
      this.yxSys()
    },
    gradeIdYX () {
      this.yxSys()
    },
    professionIdYX () {
      this.yxSys()
    },
    areaId() {
      this.getStatHouseInfo();
    },
    buildId() {
      this.getStatHouseInfo();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.matser-select {
  margin-bottom: 10px;
}
.institute-title {
  display: flex;
  justify-content: space-between;
  .ant-switch {
    background-color: #1b87e2;
  }
}
.set-border {
  border-radius: 12px;
}
.data-block {
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  .UserAndStudentBlock {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .item-box {
      width: 49%;
    }
  }
}
.g-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  & > div {
    width: 49%;
    .set-border;
    background-color: #fff;
    height: 400px;
    margin-bottom: 12px;
  }
}
</style>
