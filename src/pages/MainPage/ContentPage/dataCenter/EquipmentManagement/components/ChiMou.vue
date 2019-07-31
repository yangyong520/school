<template>
  <div class="ChiMou">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="allEdit" v-if="roleDataObj.isEdit">批量编辑</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="allDelChiMou" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box" @click="visibleChiMouModal = !visibleChiMouModal">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="CHiMouListData"
        :pagination="false"
        rowKey="id">
        <template slot="action" slot-scope="action">
          <div class="todo-box">
            <span v-if="roleDataObj.isEdit" @click="edit(action)">编辑</span>
            <span v-if="roleDataObj.isDel" @click="delOne(action.id)">删除</span>
            <span v-if="roleDataObj.isDel" @click="reset(action.id)">重启</span>
            <span v-if="roleDataObj.isDel" @click="synchronization(action.id)">人员同步</span>
          </div>
        </template>
      </a-table>
    </a-spin>
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
    <!--编辑-->
    <ChiMouSet
      @okForm="bindTerminalChiMou"
      :initObj="chiMOuObj"
      @cgModal="(visible)=>{this.visibleChiMouSet = visible}"
      :visibleContry="visibleChiMouSet"
    />
    <!--批量编辑-->
    <ChiMouSetNum
      @okForm="bindTerminalChiMouNum"
      @cgModal="(visible)=>{this.visibleChiMouSetNum = visible}"
      :visibleContry="visibleChiMouSetNum"/>
    <!-- 筛选 -->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleChiMouModal"
      @ok="handleChiMouSearchOk"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>类型:</span>
        <a-select class="input-select" v-model="type" style="width: 240px">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">宿舍门禁</a-select-option>
          <a-select-option value="1">访客登记</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>状态:</span>
        <a-select v-model="status" class="input-select" style="width: 240px">
          <a-select-option :value="3">全部</a-select-option>
          <a-select-option :value="-1">离线</a-select-option>
          <a-select-option :value="1">在线</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>区域:</span>
        <a-select class="input-select" @change="handleChangeArea(areaId)" v-model="areaId" style="width: 240px">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in areaListSet" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>楼栋:</span>
        <a-select class="input-select" v-model="buildId" style="width: 240px">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in buildIdListSet" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>保修期:</span>
        <a-select class="input-select" v-model="guarenteenStatus" style="width: 240px">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">在保</a-select-option>
          <a-select-option value="1">过保</a-select-option>
          <a-select-option value="2">即将过保</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="ChiMouClearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
import ChiMouSet from "./ChiMouSet";
import ChiMouSetNum from "./ChiMouSetNum";
import { IntegerTest, test } from "@/unit/formTest";

const {
  synchronization,
  reset,
  deleteRedEyeButch,
  queryRedEyeList, // 获取赤眸列表
  updateRedEyeButch, // 修改赤眸
  selectAreaList, // 查询区域列表
  selectBuildList // 获取楼栋
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "ChiMou",
  mixins: [roleControlBtnMixin],
  components: {
    ChiMouSet,
    ChiMouSetNum
  },
  data() {
    return {
      roleName: "赤眸",

      chiMOuObj: {},
      areaIdSet: "", //区域id
      areaListSet: [], //区域数组
      buildIdSet: "", //楼栋id
      buildIdListSet: [], //楼栋数组
      spinning: false, // 判断是否有数据
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      guaranteen: [], //	保修期
      CHiMouListData: [], // 赤眸列表
      visibleChiMouModal: false, // 筛选弹窗
      type: "all", //筛选类型
      status: 3, //筛选状态
      areaId: "all", //筛选区域
      buildId: "all", //筛选楼栋
      guarenteenStatus: "all", //筛选保修期
      areaList: [], //筛选区域列表
      buildIdList: [], //筛选楼栋列表

      visibleChiMouSet: false, // 编辑弹窗
      columns: [
        {
          title: "设备名称",
          dataIndex: "name"
        },
        {
          title: "状态",
          dataIndex: "status",
          customRender: (text, row, index) => {
            return row.status === -1 ? '离线' : '在线'
          }
        },
        {
          title: "保修期",
          customRender: (text, row, index) => {
            if (row.guarenteenStatus === 0) {
              return '在保'
            }
            if (row.guarenteenStatus === 1) {
              return '过保'
            }
            if (row.guarenteenStatus === 2) {
              return '即将过保'
            }
          }
        },
        {
          title: "IP",
          dataIndex: "ip"
        },
        {
          title: "检测阈值",
          dataIndex: "detection"
        },
        {
          title: "识别阈值",
          dataIndex: "recognition"
        },
        {
          title: "操作",
          width: 400,
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      visibleModal: false,
      visitorStarttime: null, // 访客时间
      visitorEndtime: null, // 访客时间
      chimouId: null,
      visibleChiMouSetNum: false
    };
  },
  created() {
    const query = this.$route.query
    if (query.type) {
      this.status = -1
    }
    this.getChiMouList(); // 获取赤眸列表
    this.gatAreaList(); // 查询区域列表
  },
  methods: {
    moment,
    reset (id) {
      reset({
        id: id
      }).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          this.$message.success(msg)
          this.getChiMouList()
        } else {
          this.$message.warning(msg)
        }
      })
    },
    synchronization (id) {
      synchronization({
        id: id
      }).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          this.$message.success(msg)
          this.getChiMouList()
        } else {
          this.$message.warning(msg)
        }
      })
    },
    edit (record) {
      this.chimouId = [record.id]
      this.chiMOuObj = record
      this.handleChangeArea(record.areaId, record.buildId)
      this.visibleChiMouSet = !this.visibleChiMouSet
    },
    allEdit() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请先选择目标！");
        return;
      }
      this.visibleChiMouSetNum = !this.visibleChiMouSetNum;
      this.chimouId = this.selectedRowKeys;
    },
    //获取赤眸列表
    bindTerminalChiMouNum (obj) {
      const {
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
        id: this.chimouId,
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
      if (this.chimouId.length === 0) {
        $message.warning("请选择，希望批量修改数据！");
        return;
      }
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
      updateRedEyeButch(objSend).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getChiMouList()
          this.visibleChiMouSetNum = false;
        } else {
          $message.warning(msg);
        }
      });
    },
    bindTerminalChiMou (obj) {
      const {
        mark, // 进出标识
        type, // 使用类型
        buildId,
        name,
        areaId,
        door,
        // passway,
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

      let passNum = test(IntegerTest(password))
      let passLen = password.toString()
      if (passLen.length !== 6 || !passNum.status) {
        this.$message.warning('请输入正确的密码，密码必须为6位，必须是正整数！')
        return
      }
      const objSend = {
        id: this.chimouId,
        mark, // 进出标识
        type, // 使用类型
        buildId,
        areaId,
        door,
        // passway,
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
      updateRedEyeButch(objSend).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.visibleChiMouSet = false;
          this.getChiMouList()
        } else {
          $message.warning(msg);
        }
      });
    },
    getChiMouList() {
      this.spinning = true;
      queryRedEyeList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        type: this.type === "all" ? null : this.type, //筛选类型
        status: this.status === 3 ? null : this.status, //筛选状态
        areaId: this.areaId === "all" ? null : this.areaId, //筛选区域
        buildId: this.buildId === "all" ? null : this.buildId, //筛选楼栋
        guarenteenStatus: this.guarenteenStatus === "all" ? null : this.guarenteenStatus //筛选保修期
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
              // this.$message.warning("未找到赤眸管理数据");
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
      this.getChiMouList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getChiMouList();
    },

    //	运行设备开始时间
    onChangerunStarttime(time, timeString) {
      this.chiMOuObj.runStarttime = timeString;
    },
    //运行设备结束时间
    onChangerunEndtime(time, timeString) {
      this.chiMOuObj.runEndtime = timeString;
    },
    //查询区域列表
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaListSet = data;
        } else {
          $message.error(msg);
        }
      });
    },
    //查询楼栋列表
    handleChangeArea(areaId, buildId) {
      this.buildIdSet = "";
      selectBuildList({
        areaId: areaId,
        buildId: buildId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildIdListSet = data;
        }
      });
    },
    //筛选
    handleChiMouSearchOk() {
      this.pageinfo.pageNum = 1;
      this.visibleChiMouModal = false;
      this.getChiMouList();
    },
    //重置
    ChiMouClearSearch() {
      this.type = "all"; //筛选类型
      this.status = 3; //筛选状态
      this.areaId = "all"; //筛选区域
      this.buildId = "all"; //筛选楼栋
      this.buildIdListSet = [];
      this.guarenteenStatus = "all"; // 筛选保修期
    },
    // 批量删除
    allDelChiMou() {
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
              this.getChiMouList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message, getChiMouList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteRedEyeButch([id]).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getChiMouList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    //批量编辑保存
    handleChiMouSetOk (e) {
      const {
        id,
        type,
        mark,
        ip,
        guaranteen,
        version,
        safe,
        detection,
        recognition,
        areaId,
        buildId,
        volume,
        account,
        password,
        detectWindow,
        identifyGap,
        identifyRate,
        standbyTime,
        durationTime,
        freeTime,
        door,
        name,
        runStarttime,
        runEndtime,
        openDoor,
        visitorStarttime,
        visitorEndtime
      } = this.chiMOuObj
      updateRedEyeButch({
        id,
        type,
        mark,
        ip,
        guarenteenStart: this.guaranteen[0].format("YYYY-MM-DD"),
        guarenteenEnd: this.guaranteen[0].format("YYYY-MM-DD"),
        version,
        safe,
        detection,
        recognition,
        areaId,
        buildId,
        volume,
        account,
        password,
        detectWindow,
        identifyGap,
        identifyRate,
        standbyTime,
        durationTime,
        freeTime,
        door,
        name,
        runStarttime,
        runEndtime,
        openDoor,
        visitorStarttime,
        visitorEndtime
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.getChiMouList();
        } else {
          this.$message.error(msg);
        }
        this.visibleChiMouSet = false;
      });
    },
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
.input-box span {
  display: inline-block;
  width: 50px;
  text-align: right;
}
</style>
