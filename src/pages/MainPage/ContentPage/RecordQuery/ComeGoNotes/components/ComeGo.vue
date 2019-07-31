<template>
  <div class="ComeGo">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/学号" v-model="val" @search="handleSearchComeGo" enterButton/>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="comeGoExport" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleComeGoSearch = !visibleComeGoSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="data_page" :queryObj="queryObj" :columns="columns" reqType="come" @change="x => selectedRowKeys = x"></DataTable>
    <!--查询弹窗-->
    <a-modal @cancel="comeGoClearSearch" title="筛选" :maskClosable="false" v-model="visibleComeGoSearch" @ok="handleSearchComeGo" okText="查询" class="modal-box" >
      <div class="input-box">
        <span>所属区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>识别时间:</span>
        <a-range-picker
          @ok="changeTime"
          @change="changeTime"
          :showTime="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          v-model="LeaveDate"
          class="input-select" />
      </div>
      <div class="input-box">
        <span>进出标识:</span>
        <a-select v-model="inOut" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">进</a-select-option>
          <a-select-option value="1">出</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>身份类别:</span>
        <a-select v-model="type" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="1">学生</a-select-option>
          <a-select-option value="2">辅导员</a-select-option>
          <a-select-option value="3">系统管理员</a-select-option>
          <a-select-option value="4">宿管</a-select-option>
          <a-select-option value="5">院系管理员</a-select-option>
          <a-select-option value="6">家长</a-select-option>
          <a-select-option value="7">其他</a-select-option>
          <a-select-option value="8">访客</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="comeGoClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
  </div>
</template>

<script>
import { baseUrl } from "@/baseUrl";
import { roleControlBtnMixin } from "@/mixin";
import req from "@/req/req";
import DataTable from '@/components/DataTable'
const {
  selectAreaList, // 查询区域列表
  selectBuildList, // 获取楼栋
  queryList // 导出出入记录
} = req;
export default {
  name: "ComeGo",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data () {
    return {
      inOut: "all", //查询进出标识
      type: "all", //身份类别
      val: "", //被访人姓名/学号
      visibleComeGoSearch: false, // 筛选弹窗
      areaId: "", //筛选区域id
      areaList: [], //筛选区域数组
      buildId: "", //筛选楼栋id
      buildIdList: [], //筛选楼栋数组
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      columns: [
        {
          title: "对比照片",
          dataIndex: "picth",
          customRender: (text, record, index) => {
            return <img class="img-header" src={record.picth} />;
          }
        },
        {
          title: "姓名",
          dataIndex: "userName"
        },
        {
          title: "学号/工号",
          dataIndex: "userNum",
          customRender: (text, record, index) => {
            return record.userNum ? record.userNum : "——";
          }
        },
        {
          title: "身份类型",
          dataIndex: "idName",
          customRender: (text, record, index) => {
            if (record.type == 1) {
              return <span>学生</span>;
            } else if (record.type == 2) {
              return <span>辅导员</span>;
            } else if (record.type == 3) {
              return <span>系统管理员</span>;
            } else if (record.type == 4) {
              return <span>宿管</span>;
            } else if (record.type == 5) {
              return <span>院系管理员</span>;
            } else if (record.type == 6) {
              return <span>家长</span>;
            } else if (record.type == 7) {
              return <span>其他</span>;
            } else if (record.type == 8) {
              return <span>访客</span>;
            }
          }
        },
        {
          title: "识别时间",
          dataIndex: "modifyTime"
        },
        {
          title: "楼栋信息",
          dataIndex: "roomCon",
          customRender: (text, record, index) => {
            let areaName = record.areaName ? `${record.areaName}-` : ''
            let buildName = record.buildName ? record.buildName : ''
            return areaName + buildName
          }
        },
        {
          title: "进出标识",
          dataIndex: "inOut",
          customRender: (text, record, index) => {
            if (record.inOut === 0) {
              return <div style="color: red;">进</div>;
            } else {
              return <div>出</div>;
            }
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    queryObj () {
      return {
        startTime: this.startTime,
        endTime: this.endTime,
        val: this.val,
        areaId: this.areaId,
        buildId: this.buildId,
        inOut: this.inOut === "all" ? null : this.inOut,
        type: this.type === "all" ? null : this.type
      }
    }
  },
  created() {
    this.gatAreaList(); //查询区域列表
  },
  methods: {
    changeTime (e) {
      this.startTime = e[0].format("YYYY-MM-DD HH:mm");
      this.endTime = e[1].format("YYYY-MM-DD HH:mm");
    },
    //获取出入数据列表
    getComeGoList() {
      this.$refs.data_page.getDataTable()
    },
    //导出
    comeGoExport() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请先选择目标！");
        return;
      }
      queryList(this.selectedRowKeys).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe");
          elemIF.src = baseUrl + "/inout/exportInOutRecord?ids=" + data;
          elemIF.style.display = "none";
          document.body.appendChild(elemIF);
        } else {
          this.$message.error(msg);
        }
      });
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
    //筛选
    handleSearchComeGo () {
      if (this.LeaveDate.length > 0) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD HH:mm");
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD HH:mm");
      }
      this.visibleComeGoSearch = false;
      this.getComeGoList();
    },
    //重置
    comeGoClearSearch() {
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.areaId = "";
      this.buildId = "";
      this.buildIdList = [];
      this.inOut = "all";
      this.type = "all";
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

// .input-box {
//   width: 75% !important;
// }

// td {
//   vertical-align: middle !important;
// }
</style>
