<template>
  <div class="VistorNotes">
    <Title title="访客记录"/>
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="被访人姓名/学号"
            v-model="val"
            @search="handleSearchVistorNotes"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="VistorExport" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleVistorSearch = !visibleVistorSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--头部-->
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="vistorNotesList"
        :pagination="false"
        rowKey="id"
      />
    </a-spin>
    <!--列表-->
    <!--分页-->
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :current="pageinfo.pageNum"
        :total="pageinfo.totalElements"
        showSizeChanger
        showQuickJumper
        :pageSize="pageinfo.pageSize"
        @change="changePage"
        @showSizeChange="changeSize"
      />
    </div>
    <!--分页-->
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleVistorSearch"
      @ok="handleSearchVistorNotes"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          class="input-box-item breakDataPicker vistorTime"
        />
      </div>
      <div class="input-box">
        <a-button block @click="vistorNotesClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <a-modal
      title="访客信息详情"
      :maskClosable="false"
      v-model="visibleVistorNotesSet"
      :footer="null"
      class="modal-box">
      <div class="visible-notes-img">
        <img v-if="VistorNotesObj.userPicth" :src="VistorNotesObj.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv">
          <label>访客姓名：</label>
          <span>{{VistorNotesObj.visitorName}}</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>关系：</label>
          <span>{{VistorNotesObj.relation}}</span>
        </div>
        <div class="visibleNotesDeailDiv" v-if="VistorNotesObj.studentVo">
          <label>访问对象：</label>
          <span>{{VistorNotesObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" v-if="VistorNotesObj.studentVo">
          <label>学号：</label>
          <span>{{VistorNotesObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="VistorNotesObj.studentVo">
          <label>访问寝室：</label>
          <span>{{VistorNotesObj.studentVo.areaName}}-{{VistorNotesObj.studentVo.buildName}}-{{VistorNotesObj.studentVo.roomNum}}室-{{VistorNotesObj.studentVo.bedNum}}号床</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>来访时间：</label>
          <span>{{VistorNotesObj.modifyTime}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>离开时间：</label>
          <span v-if="VistorNotesObj.leaveTime">{{VistorNotesObj.leaveTime}}</span>
          <span v-else>未离开</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>访问事由：</label>
          <span>{{VistorNotesObj.visitReason}}</span>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
  </div>
</template>

<script>
import { baseUrl } from "@/baseUrl";
import req from "@/req/req";
import { roleControlBtnMixin } from "@/mixin";
const {
  queryVisitorInOutList, //获取访客列表
  selectAreaList, //查询区域列表
  selectBuildList, //获取楼栋
  queryVisitorList //导出访客
} = req;
export default {
  name: "VistorNotes",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "访客记录",

      vistorNotesList: [], //被访列表
      spinning: false, // 判断是否有数据
      val: "", //被访人姓名/学号
      visibleVistorSearch: false, // 筛选弹窗
      visibleVistorNotesSet: false, // 详情弹窗
      areaId: "", //筛选区域id
      areaList: [], //筛选区域数组
      buildId: "", //筛选楼栋id
      buildIdList: [], //筛选楼栋数组
      LeaveDate: [], //查询时间数组
      visitorStartTime: "", //查询开始时间
      visitorEndTime: "", //查询结束时间
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      VistorNotesObj: {
        studentVo: {}
      },
      columns: [
        {
          title: "访客照片",
          // dataIndex: "picth",
          customRender: (text, record, index) => {
            return <img class="img-header" src={record.userPicth} />;
          }
        },
        {
          title: "访客姓名",
          dataIndex: "visitorName"
        },
        {
          title: "关系",
          dataIndex: "relation"
        },
        {
          title: "来访时间",
          dataIndex: "modifyTime",
          customRender: (text, record, index) => {
            if (record.leaveTime) {
              return (
                <span>
                  {record.modifyTime}~{record.leaveTime}
                </span>
              );
            } else {
              return <span>{record.modifyTime}~未离开</span>;
            }
          }
        },
        {
          title: "被访人",
          customRender: (text, row, index) => {
            const name = row.studentVo && row.studentVo.studentName ? row.studentVo.studentName : ''
            const phone = row.studentVo && row.studentVo.phone ? row.studentVo.phone : ''
            return `${name}  ${phone}`
          }
        },
        {
          title: "访问寝室",
          dataIndex: "room",
          customRender: (text, record, index) => {
            const areaName = record.studentVo && record.studentVo.areaName ? record.studentVo.areaName + '-' : ''
            const buildName = record.studentVo && record.studentVo.buildName ? record.studentVo.buildName + '-' : ''
            const roomNum = record.studentVo && record.studentVo.roomNum ? record.studentVo.roomNum + '室-' : ''
            const bedNum = record.studentVo && record.studentVo.bedNum ? record.studentVo.bedNum + '号床' : ''
            return `${areaName} ${buildName} ${roomNum} ${bedNum}`
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                <span
                  onClick={() => {
                    this.visibleVistorNotesSet = !this.visibleVistorNotesSet;
                    this.VistorNotesObj = { ...record };
                  }}
                >
                  详情
                </span>
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  created() {
    this.getVistirNotesList(); //获取访客数据列表
    this.gatAreaList(); //查询区域列表
  },
  methods: {
    //获取访客数据列表
    getVistirNotesList() {
      this.spinning = true;
      queryVisitorInOutList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        visitorStartTime: this.visitorStartTime,
        visitorEndTime: this.visitorEndTime,
        val: this.val,
        areaId: this.areaId,
        buildId: this.buildId
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.vistorNotesList = content;
            this.pageinfo = pageinfo;
          } else {
            this.$message.warning(msg);
          }
          this.spinning = false
        },
        () => {
          this.spinning = false;
        }
      );
      this.spinning = false
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getVistirNotesList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getVistirNotesList();
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
    //导出
    VistorExport() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请先选择目标！");
        return;
      }
      queryVisitorList(this.selectedRowKeys).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/inout/exportVisitorInOutRecord?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.error(msg);
          }
        }
      );
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
    handleSearchVistorNotes() {
      if (this.LeaveDate[0]) {
        this.visitorStartTime = this.LeaveDate[0].format("YYYY-MM-DD");
        this.visitorEndTime = this.LeaveDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleVistorSearch = false;
      this.getVistirNotesList();
    },
    //重置
    vistorNotesClearSearch() {
      this.LeaveDate = [];
      this.visitorStartTime = "";
      this.visitorEndTime = "";
      this.areaId = "";
      this.buildId = "";
      this.buildIdList = [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

td {
  vertical-align: middle !important;
}
</style>
