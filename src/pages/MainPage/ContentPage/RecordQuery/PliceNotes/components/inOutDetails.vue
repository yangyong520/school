<template>
  <div class="inOutDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchInOut"
            enterButton
          />
        </div>
        <div class="btn-box" v-if="roleDataObj.isSet">
          <a-button class="btn-item" @click="visibleInOutSeter = !visibleInOutSeter">设置</a-button>
        </div>
        <div class="btn-box" v-if="roleDataObj.isExp">
          <a-button class="btn-item" @click="exportInOut">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleInOut = !visibleInOut">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="inOut" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="连进连出推送设置"
      :maskClosable="false"
      v-model="visibleInOutSeter"
      @ok="handleInOutSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :max="99" :min="1"/>
        <span>次进/出，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          v-model="inOutDefaultValue"
          :maxTagCount="2"
          style="width: 600px">
          <a-select-option value="STUDENT">学生</a-select-option>
          <a-select-option value="SGADMIN">宿管</a-select-option>
          <a-select-option value="TEACHER">辅导员</a-select-option>
          <a-select-option value="DEPART">院系管理员</a-select-option>
          <a-select-option value="super_admin">系统管理员</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal
      @cancel="inOutClearSearch"
      title="筛选"
      :maskClosable="false"
      v-model="visibleInOut"
      @ok="handleSearchInOut"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>处理情况:</span>
        <a-select v-model="statusSectch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">未处理</a-select-option>
          <a-select-option value="1">已处理</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in areaList" :key="item.id" :value="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in buildIdList" :key="item.id" :value="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>监测时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          @change="changeTime"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <span>连进 / 出:</span>
        <a-input
          size="small"
          class="input-box-item ml11px"
          v-model="startDay"
          :style="{width: '100px'}"
        />
        <span>&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;</span>
        <a-input size="small" class="input-box-item" v-model="endDay" :style="{width: '100px'}"/>
        <span>&nbsp;&nbsp;次</span>
      </div>
      <div class="input-box">
        <a-button block @click="inOutClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="未归处理"
      :maskClosable="false"
      v-model="visibleInOutDetails"
      @ok="handleInOutOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="inOutObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{inOutObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{inOutObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{inOutObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{inOutObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{inOutObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{inOutObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{inOutObj.studentVo.collegeName}}-{{inOutObj.studentVo.proName}}-20{{inOutObj.studentVo.gradeName}}级-{{inOutObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{inOutObj.studentVo.areaName}}-{{inOutObj.studentVo.buildName}}-{{inOutObj.studentVo.roomNum}}室-{{inOutObj.studentVo.bedNum}}号床</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="inOutObj.status == 0">
          <label class="fl">处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="auditRemark"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP" v-if="inOutObj.status == 1">
            <label>处理人：</label>
            <span v-if="inOutObj.handleRole == 'STUDENT'">学生</span>
            <span v-if="inOutObj.handleRole == 'TEACHER'">辅导员</span>
            <span v-if="inOutObj.handleRole == 'super_admin'">系统管理员</span>
            <span v-if="inOutObj.handleRole == 'SGADMIN'">宿管</span>
            <span v-if="inOutObj.handleRole == 'DEPART'">院系管理员</span>
            <span v-if="inOutObj.handleRole == 'PARENT'">家长</span>
            <span>-{{inOutObj.handleName}}-{{inOutObj.handlePhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{inOutObj.handleReason}}</span>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { test, WordTest } from "@/unit/formTest";
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";
import req from "@/req/req";
const {
  queryExportInOutRecord,
  // queryInOutRecordList, // 获取连进连出记录
  selectAreaList,
  selectBuildList,
  handleInOutRecord, // 立即处理连进连出
  insertCallalarmSet, // 设置
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "inOutDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "连进连出",

      offOn: true, //开启/关闭
      inOutDefaultValue: ["STUDENT", "SGADMIN"], //设置推送人员
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      startDay: "", //查询未归天数开始
      endDay: "", //查询未归天数结束
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleInOut: false, // 查询弹窗
      inOutObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      leaveSet: {
        isDisplayNo: false
      },
      visibleInOutDetails: false, // 详情弹窗
      visibleInOutSeter: false, // 设置弹窗
      status: 0, //详情审核状态
      auditRemark: "", //详情审核意见
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
          title: "监测时间",
          dataIndex: "monitorTime"
        },
        {
          title: "代刷级别",
          dataIndex: "grade",
          customRender: (text, record, index) => {
            if (record.level === "2") {
              return <div>连续{record.level}次</div>;
            } else {
              return <div style="color: red;">连续{record.level}次</div>;
            }
          }
        },
        {
          title: "标识",
          dataIndex: "Identification",
          customRender: (text, record, index) => {
            if (record.inOut === 0) {
              return <div style="color: red;">进</div>;
            } else {
              return <div>出</div>;
            }
          }
        },
        {
          title: "处理意见",
          dataIndex: "status",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return <div>——</div>;
            } else {
              return <div>{record.handleReason}</div>;
            }
          }
        },
        {
          title: "处理时间",
          dataIndex: "time",
          customRender: (text, record, index) => {
            return record.handleTime ? record.handleTime : "——";
          }
        },
        {
          title: "处理人",
          dataIndex: "people",
          customRender: (text, record, index) => {
            return record.handleName ? record.handleName : "——";
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return this.roleDataObj.isDeal ? (
                <div class="todo-box">
                  <span
                    onClick={() => {
                      this.inOutObj = { ...record };
                      this.visibleInOutDetails = !this.visibleInOutDetails;
                      this.leaveSet.isDisplayNo = false;
                    }}
                  >
                    立即处理
                  </span>
                </div>
              ) : (
                ""
              );
            } else {
              return (
                <div class="todo-box">
                  <span
                    style="background-color: #ffc424;"
                    onClick={() => {
                      this.inOutObj = { ...record };
                      this.visibleInOutDetails = !this.visibleInOutDetails;
                      this.leaveSet.isDisplayNo = true;
                    }}
                  >
                    查看详情
                  </span>
                </div>
              );
            }
          }
        }
      ],
      selectedRowKeys: [],
      buildIdList: [],
      areaList: [],
      areaId: 'all',
      buildId: 'all'
    };
  },
  created() {
    this.getAlarmSet(); // 查询设置
    this.gatAreaList()
  },
  computed: {
    queryObj () {
      return {
        status: this.statusSectch === "all" ? null : this.statusSectch,
        startTime: this.startTime,
        endTime: this.endTime,
        val: this.val,
        startDay: this.startDay,
        endDay: this.endDay,
        areaId: this.areaId === 'all' ? '' : this.areaId,
        buildId: this.buildId === 'all' ? '' : this.buildId
      }
    }
  },
  methods: {
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
    handleChangeArea (id) {
      this.buildId = "";
      if (id !== 'all') {
        selectBuildList({
          areaId: id
        }).then(({ data: { data = [], code, msg } }) => {
          if (code === 0) {
            this.buildIdList = data
          }
        });
      } else {
        this.buildIdList = []
        this.buildId = 'all'
      }
    },
    changeTime (time) {
      this.startTime = time[0].format("YYYY-MM-DD");
      this.endTime = time[1].format("YYYY-MM-DD");
    },
    exportInOut () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportInOutRecord(this.selectedRowKeys).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/ExportInOutRecord?ids=' + data
          elemIF.style.display = "none"
          document.body.appendChild(elemIF)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    //查询设置
    getAlarmSet() {
      selectCallAlarmSet({
        type: 4
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondDay;
            this.inOutDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取连进连出列表
    getInOutList() {
      this.$refs.table_page.getDataTable()
    },
    // 筛选
    handleSearchInOut() {
      const reg = /^[+]{0,1}(\d+)$/;
      if (this.startDay && !reg.test(this.startDay)) {
        this.$message.warning("次数只能为正整数！");
        return;
      }
      if (this.endDay && !reg.test(this.endDay)) {
        this.$message.warning("次数只能为正整数！");
        return;
      }
      this.visibleInOut = false;
      this.getInOutList();
    },
    //重置
    inOutClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.startDay = "";
      this.endDay = "";
    },
    //详情确定
    handleInOutOk() {
      if (this.inOutObj.status == 0) {
        const { id } = this.inOutObj;
        const { auditRemark, $message } = this;
        if (!auditRemark) {
          $message.warning("请输入处理意见！");
          return;
        }
        const reasonObj = test(WordTest(auditRemark, "处理意见长度最长20位！"));
        if (!reasonObj.status) {
          $message.warning(reasonObj.msg);
          return;
        }
        handleInOutRecord({
          id,
          auditRemark: auditRemark,
          status: 1
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.auditRemark = ''
            this.$refs.table_page.refresh()
          } else {
            this.$message.error(msg);
          }
          this.visibleInOutDetails = false;
        });
      } else {
        this.visibleInOutDetails = false;
      }
    },
    //设置确定
    handleInOutSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请设置天数！");
        return;
      }
      if (this.inOutDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 4,
        isOpen: this.offOn ? 1 : 0,
        beyondDay: this.daysOver,
        roleList: this.inOutDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleInOutSeter = false;
        }
      });
      this.visibleInOutDetails = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
