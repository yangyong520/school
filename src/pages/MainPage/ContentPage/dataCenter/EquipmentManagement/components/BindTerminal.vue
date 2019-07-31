<template>
  <div class="BindTerminal">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="设备名称"
            v-model="val"
            @search="handleBindSearchOk"
            enterButton
          />
        </div>
        <div class="btn-box" @click="visibleBindModal = !visibleBindModal">
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
        :dataSource="CHiMouListData"
        :pagination="false"
        rowKey="id"
      />
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
    </a-spin>
    <!--列表-->
    <!--绑定-->
    <BindTerminalSet
      ref="reset_data"
      @okForm="bindTerminalChiMou"
      :termName="termName"
      @cgModal="(visible)=>{this.visibleBinding = visible}"
      :visibleContry="visibleBinding"
    />
    <!--绑定-->
    <!-- 筛选 -->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleBindModal"
      @ok="handleBindSearchOk"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>设备状态:</span>
        <a-select class="input-select" v-model="status">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">离线</a-select-option>
          <a-select-option value="1">在线</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属区域:</span>
        <a-select class="input-select" @change="handleChangeArea(areaId)" v-model="areaId">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属楼栋:</span>
        <a-select class="input-select" v-model="buildId">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>获取时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          style="margin-left: 11px"
          class="input-box-item breakDataPicker"
        />
      </div>
      <div class="input-box">
        <span>保&nbsp;&nbsp;修&nbsp;&nbsp;期:</span>
        <a-select class="input-select" v-model="guarenteenStatus">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">在保</a-select-option>
          <a-select-option value="1">过保</a-select-option>
          <a-select-option value="2">即将过保</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="BindClearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import BindTerminalSet from "./BindTerminalSet";
const {
  queryNoBandingList, // 获取未绑定终端列表
  selectAreaList, //查询区域列表
  selectBuildList, //获取楼栋
  deleteRedEyeButch, // 批量删除
  bandingRedEye
} = req;
import { roleControlBtnMixin } from "@/mixin";
import moment from "moment"

export default {
  name: "BindTerminal",
  mixins: [roleControlBtnMixin],
  components: {
    BindTerminalSet
  },
  data() {
    return {
      roleName: "未绑定终端",

      CHiMouListData: [], //未绑定终端列表
      spinning: false, // 判断是否有数据
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      val: "", //筛选设备名称
      status: "all", //筛选状态
      areaId: "all", //筛选区域
      buildId: "all", //筛选楼栋
      guarenteenStatus: "all", //筛选保修期
      areaList: [], //筛选区域列表
      buildIdList: [], //筛选楼栋列表
      visibleBindModal: false, //筛选弹窗
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      visibleBinding: false, // 绑定弹窗
      columns: [
        {
          title: "设备名称",
          dataIndex: "name"
        },
        {
          title: "IP",
          dataIndex: "ip"
        },
        {
          title: "获取时间",
          dataIndex: "modifyTime"
        },
        {
          title: "操作",
          dataIndex: "password",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isBinding ? (
                  <span
                    onClick={() => {
                      this.bindId = record.id;
                      this.termName = record.name;
                      this.visibleBinding = !this.visibleBinding;
                    }}
                  >
                    绑定
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
                {this.roleDataObj.isDel ? (
                  <span
                    onClick={() => {
                      this.delOne(record.id);
                    }}
                  >
                    删除
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          }
        }
      ],
      termName: "",
      selectedRowKeys: [],
      bindId: null
    };
  },
  created() {
    this.getBindList(); // 获取未绑定终端列表
  },
  mounted() {
    this.gatAreaList(); // 查询区域列表
  },
  methods: {
    //获取未绑定终端列表
    getBindList() {
      this.spinning = true;
      queryNoBandingList({
        val: this.val,
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        status: this.status === "all" ? null : this.status, //筛选状态
        areaId: this.areaId === "all" ? null : this.areaId, //筛选区域
        buildId: this.buildId === "all" ? null : this.buildId, //筛选楼栋
        guarenteenStatus: this.guarenteenStatus === "all" ? null : this.guarenteenStatus, //筛选保修期
        startTime: this.startTime,
        endTime: this.endTime
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.CHiMouListData = content;
            this.pageinfo = pageinfo;
            if (this.CHiMouListData.length === 0) {
              // this.$message.warning("未找到未绑定终端数据");
            }
          } else {
            this.$message.warning(msg);
          }
          this.spinning = false;
        },
        () => {
          this.spinning = false;
        }
      );
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getBindList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getBindList();
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
    handleBindSearchOk(e) {
      if (this.LeaveDate[0]) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD");
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleBindModal = false;
      this.getBindList();
    },
    //重置
    BindClearSearch() {
      this.status = "all"; //筛选状态
      this.areaId = "all"; //筛选区域
      this.buildId = "all"; //筛选楼栋
      this.buildIdList = [];
      this.guarenteenStatus = "all"; //筛选保修期
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    // 单项删除
    delOne (id) {
      // 删除一个
      const { $confirm, $message, getBindList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteRedEyeButch([id]).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getBindList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    dleList() {
      const { selectedRowKeys, $message, $confirm } = this;
      if (selectedRowKeys.length === 0) {
        $message.warning("请先选择目标！");
        return;
      }
      $confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          let ids = "";
          selectedRowKeys.forEach((ele, index) => {
            if (index === selectedRowKeys.length - 1) {
              ids += ele;
            } else {
              ids += ele + ",";
            }
          });
          deleteRedEyeButch(selectedRowKeys).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.pageinfo.pageNum = 1;
              this.getBindList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    bindTerminalChiMou(obj) {
      const {
        mark, // 进出标识
        type, // 使用类型
        buildId,
        name,
        areaId,
        door,
        passway,
        dateTime: [guaranteenStart, guaranteenEnd],
        password,
        volume,
        detection, // 检测阈值
        recognition, // 识别阈值
        living, // 活体阈值
        detectWindow, // 检测窗大小
        identifyGap, // 识别间隔
        runStarttime, // 运行设备时间
        runEndtime, // 运行设备时间
        visitorStarttime, // 访客时间
        visitorEndtime, // 访客时间
        freeTime, // 屏幕锁定时间
        durationTime, // 开门持续时长
        $message
      } = obj;
      const objSend = {
        id: this.bindId,
        mark, // 进出标识
        type, // 使用类型
        buildId,
        areaId,
        door,
        passway,
        guaranteenStart: moment(guaranteenStart).format('YYYY-MM-DD'),
        guaranteenEnd: moment(guaranteenEnd).format('YYYY-MM-DD'),
        name,
        password,
        volume,
        detection, // 检测阈值
        recognition, // 识别阈值
        living, // 活体阈值
        detectWindow, // 检测窗大小
        identifyGap, // 识别间隔
        runStarttime: moment(runStarttime).format('H:mm:ss'), // 运行设备时间
        runEndtime: moment(runEndtime).format('H:mm:ss'), // 运行设备时间
        visitorStarttime: moment(visitorStarttime).format('H:mm:ss'), // 访客时间
        visitorEndtime: moment(visitorEndtime).format('H:mm:ss'), // 访客时间
        freeTime, // 屏幕锁定时间
        durationTime // 开门持续时长
      };
      for (let key in objSend) {
        if (
          String(objSend[key]) === "undefined" ||
          String(objSend[key]) === "null" ||
          !String(objSend[key])
        ) {
          $message.warning("请完善数据");
          return;
        }
      }
      bandingRedEye(objSend).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.visibleBinding = false;
          this.getBindList()
          this.$refs.reset_data.refresh()
        } else {
          $message.warning(msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

// .input-box span {
//   display: inline-block;
//   width: 50px;
//   text-align: right
// }
</style>
