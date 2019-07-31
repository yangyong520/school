<template>
  <div class="GuiaiCheckSleep">
    <Title title="归寝记录"/>
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/学号" v-model="val" @search="handleGuiaiOk" enterButton/>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="guiAiExport"  v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleGuiaiCheck = !visibleGuiaiCheck">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="guiai" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--查询弹窗-->
    <a-modal
      :maskClosable="false"
      title="筛选"
      @cancel="guiAiClearSearch"
      v-model="visibleGuiaiCheck"
      @ok="handleGuiaiOk"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>学院:</span>
        <a-select
          v-model="collegeIdList"
          @change="seachprofessionList(collegeIdList)"
          class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in collegeArrList"
            :key="item.id"
          >{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>专业:</span>
        <a-select v-model="proIdList" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in professionArrList"
            :key="item.id"
          >{{item.proName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>年级:</span>
        <a-select v-model="gradeIdList" class="input-select" @change="seachClass">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in gradeArrList"
            :key="item.id">20{{item.gradeNum}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>班级:</span>
        <a-select v-model="classid" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in classList"
            :key="item.id"
          >{{item.clName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          @change="changeTime"
          class="input-box-item breakDataPicker vistorTime"
        />
      </div>
      <div class="input-box">
        <span>状态:</span>
        <a-select v-model="status" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option :value="0">未归</a-select-option>
          <a-select-option :value="1">晚归</a-select-option>
          <a-select-option :value="2">请假</a-select-option>
          <a-select-option :value="3">正常</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="guiAiClearSearch">重置</a-button>
      </div>
    </a-modal>
    <PerDetail :showModal="visibleGUiaiLook" @change="x => visibleGUiaiLook = x" :detail="GuiaiObj"/>
    <!--分析弹窗-->
    <Analysis :showModal="visibleCheckGUiaiSet" @change="x => visibleCheckGUiaiSet = x" :detail="GuiaiObj"/>
  </div>
</template>

<script>
import { baseUrl } from "@/baseUrl";
import { roleControlBtnMixin } from "@/mixin"
import DataTable from '@/components/DataTable'
import PerDetail from './components/perDetail'
import Analysis from './components/analysis'
import req from "@/req/req";
const {
  queryExportReturnDorm, //归寝记录导出
  selectAreaList, //查询区域列表
  selectBuildList, //获取楼栋
  selectCollege, // 查询学院列表
  selectClasses, // 查询专业列表
  selectGrade // 查询年级列表
} = req;
export default {
  name: "GuiaiCheckSleep",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable, PerDetail, Analysis
  },
  data() {
    return {
			roleName: "归寝记录",

      areaId: "all", //筛选区域id
      areaList: [], //筛选区域数组
      buildId: "all", //筛选楼栋id
      buildIdList: [], //筛选楼栋数组
      collegeIdList: "all", // 查询学院id
      proIdList: "all", // 筛选专业id
      gradeIdList: "all", // 筛选年级id
      classid: "all", //筛选班级id
      status: "all", //筛选状态
      collegeArrList: [], // 筛选学院列表
      professionArrList: [], // 筛选专业列表
      gradeArrList: [], // 筛选年级列表
      classList: [], // 筛选班级列表
      visibleGuiaiCheck: false, //查询弹窗
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      val: "", //查询姓名/学号
      GuiaiObj: {
        studentVo: {} // 人员信息数据
      },
      visibleGUiaiLook: false, // 人员信息弹窗
      visibleCheckGUiaiSet: false, // 归寝分析弹窗
      columns: [
        {
          title: "姓名",
          width: 100,
          dataIndex: "studentVo.studentName"
        },
        {
          title: "学号",
          dataIndex: "studentVo.userNum"
        },
        {
          title: "时间",
          dataIndex: "modityTime"
        },
        {
          title: "归寝状态",
          dataIndex: "content",
        },
        {
          title: "房间信息",
          dataIndex: "thingType",
          customRender: (text, record, index) => {
            if (record.studentVo) {
              const areaName = record.studentVo.areaName ? record.studentVo.areaName + '-' : ''
              const buildName = record.studentVo.buildName ? record.studentVo.buildName + '-' : ''
              const roomNum = record.studentVo.roomNum ? record.studentVo.roomNum + '室-' : ''
              const bedNum = record.studentVo.bedNum ? record.studentVo.bedNum + '号床' : ''
              return (areaName + buildName + roomNum + bedNum) || '无'
            } else {
              return '无'
            }
          }
        },
        {
          title: "班级信息",
          dataIndex: "doStatus",
          customRender: (text, record, index) => {
            if (record.studentVo) {
              const collegeName = record.studentVo.collegeName ? record.studentVo.collegeName + '-' : ''
              const proName = record.studentVo.proName ? record.studentVo.proName : ''
              const gradeName = record.studentVo.gradeName ? `20${record.studentVo.gradeName}级-` : ''
              const className = record.studentVo.className ? record.studentVo.className + '班' : ''
              return (collegeName + proName + gradeName + className) || '无'
            } else {
              return '无'
            }
          }
        },
        {
          title: "操作",
          dataIndex: "toDo",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                <span
                  onClick={() => {
                    this.GuiaiObj = { ...record };
                    this.visibleGUiaiLook = !this.visibleGUiaiLook;
                  }}
                >
                  人员信息
                </span>
                <span
                  onClick={() => {
                    this.GuiaiObj = { ...record };
                    this.visibleCheckGUiaiSet = !this.visibleCheckGUiaiSet;
                  }}
                >
                  归寝分析
                </span>
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    queryObj () {
      return {
        areaId: this.areaId === "all" ? null : this.areaId,
        buildId: this.buildId === "all" ? null : this.buildId,
        collegeId: this.collegeIdList === "all" ? null : this.collegeIdList,
        professionId: this.proIdList === "all" ? null : this.proIdList,
        gradeId: this.gradeIdList === "all" ? null : this.gradeIdList,
        classId: this.classid === "all" ? null : this.classid,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status === "all" ? null : this.status,
      }
    }
  },
  created() {
    this.gatAreaList(); //查询区域列表
    this.gatCollegeClassList(); // 查询学院列表
    this.gradeList(); // 查询年级列表
  },
  methods: {
    changeTime (time) {
      this.startTime = time[0].format("YYYY-MM-DD");
      this.endTime = time[1].format("YYYY-MM-DD");
    },
    //导出
    guiAiExport() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请先选择目标！");
        return;
      }
      queryExportReturnDorm(this.selectedRowKeys).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/returnDorm/exportReturnDorm?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.error(msg);
          }
        }
      );
    },
    //获取归寝规则列表
    gaGUiaiList() {
      this.$refs.table_page.getDataTable()
    },
    //查询区域列表
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    //查询楼栋列表
    handleChangeArea(id) {
      this.buildId = "";
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildIdList = data;
        }
      });
    },
    // 查询学院列表
    gatCollegeClassList() {
      const { $message } = this;
      selectCollege().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArrList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    // 筛选专业
    seachprofessionList(id) {
      this.proIdList = "all";
      selectClasses({
        collegeId: id
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.professionArrList = data.professionList;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    // 查询年级
    gradeList() {
      this.gradeId = "";
      selectGrade({}).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.gradeArrList = data;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    //查询班级
    seachClass() {
      this.classId == "all";
      this.classList = [];
      selectClasses({
        collegeId: this.collegeIdList,
        professionId: this.proIdList,
        gradeId: this.gradeIdList
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.classList = data.classesList;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    //筛选
    handleGuiaiOk() {
      this.visibleGuiaiCheck = false;
      this.gaGUiaiList();
    },
    //重置
    guiAiClearSearch() {
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.areaId = "all";
      this.buildId = "all";
      this.buildIdList = [];
      this.status = "all";
      this.collegeIdList = "all";
      this.proIdList = "all";
      this.gradeIdList = "all";
      this.professionArrList = [];
      this.classid == "all";
      this.classList = [];
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.gui-ul-box {
  li {
    margin: 5px 0;
  }
}
</style>
