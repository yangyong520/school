<template>
  <div class="lateNotesDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchLateNotes"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleLateNotesSeter = !visibleLateNotesSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportLateNo" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleLateNotes = !visibleLateNotes">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="late" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="晚归推送设置"
      :maskClosable="false"
      v-model="visibleLateNotesSeter"
      @ok="handleLateNotesSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :max="99" :min="1"/>
        <span>日晚归，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          :maxTagCount="2"
          v-model="lateNotesDefaultValue"
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
      @cancel="lateNotesClearSearch"
      title="筛选"
      :maskClosable="false"
      v-model="visibleLateNotes"
      @ok="handleSearchLateNotes"
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
          @change="changeTime"
          v-model="LeaveDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <span>天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数:</span>
        <a-input
          size="small"
          class="input-box-item ml11px"
          v-model="startDay"
          :style="{width: '100px'}"
        />
        <span>&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;</span>
        <a-input size="small" class="input-box-item" v-model="endDay" :style="{width: '100px'}"/>
        <span>&nbsp;&nbsp;天</span>
      </div>
      <div class="input-box">
        <a-button block @click="lateNotesClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="晚归处理"
      :maskClosable="false"
      v-model="visibleLateNotesDetails"
      @ok="handleLateNotesOk"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="lateNotesObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{lateNotesObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{lateNotesObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{lateNotesObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{lateNotesObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{lateNotesObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{lateNotesObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{lateNotesObj.studentVo.collegeName}}-{{lateNotesObj.studentVo.proName}}-20{{lateNotesObj.studentVo.gradeName}}级-{{lateNotesObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{lateNotesObj.studentVo.areaName}}-{{lateNotesObj.studentVo.buildName}}-{{lateNotesObj.studentVo.roomNum}}室-{{lateNotesObj.studentVo.bedNum}}号床</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="lateNotesObj.status == 0">
          <label class="fl">处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="auditRemark"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP" v-if="lateNotesObj.status == 1">
            <label>处理人：</label>
            <span v-if="lateNotesObj.handleRole == 'STUDENT'">学生</span>
            <span v-if="lateNotesObj.handleRole == 'TEACHER'">辅导员</span>
            <span v-if="lateNotesObj.handleRole == 'super_admin'">系统管理员</span>
            <span v-if="lateNotesObj.handleRole == 'SGADMIN'">宿管</span>
            <span v-if="lateNotesObj.handleRole == 'DEPART'">院系管理员</span>
            <span v-if="lateNotesObj.handleRole == 'PARENT'">家长</span>
            <span>-{{lateNotesObj.handleName}}-{{lateNotesObj.handlePhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{lateNotesObj.reason}}</span>
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
  queryExportLateReturnList,
  handleLateReturn, // 立即处理晚归
  insertCallalarmSet, // 设置
  selectAreaList,
  selectBuildList,
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "lateNotesDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "晚归",

      lateNotesDefaultValue: ["STUDENT", "SGADMIN", "TEACHER"], //设置推送人员
      spinning: false, // 判断是否有数据
      lateNotesList: [], //调寝列表
      radioStyle: {
        //详情弹窗单项样式
        display: "block",
        float: "left"
      },
      leaveSet: {
        isDisplayNo: false
      },
      offOn: true, //开启/关闭
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      startDay: "", //查询晚归天数开始
      endDay: "", //查询晚归天数结束
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleLateNotes: false, // 查询弹窗
      lateNotesObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleLateNotesDetails: false, // 详情弹窗
      visibleLateNotesSeter: false, // 设置弹窗
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
          dataIndex: "modifyTime"
        },
        {
          title: "晚归级别",
          width: 140,
          customRender: (text, record, index) => {
            return <div style="color: red;">连续{record.level}日晚归</div>
          }
        },
        {
          title: "处理意见",
          dataIndex: "status",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return <div>——</div>;
            } else {
              return <div>{record.reason}</div>;
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
                      this.lateNotesObj = { ...record };
                      this.visibleLateNotesDetails = !this
                        .visibleLateNotesDetails;
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
                      this.lateNotesObj = { ...record };
                      this.visibleLateNotesDetails = !this
                        .visibleLateNotesDetails;
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
  created() {
    this.getAlarmSet(); //查询设置
    this.gatAreaList()
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
    exportLateNo () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportLateReturnList(this.selectedRowKeys).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/ExportLateReturnRecord?ids=' + data
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
        type: 2
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondDay;
            this.lateNotesDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取晚归列表
    getLateNotesList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchLateNotes() {
      const reg = /^[+]{0,1}(\d+)$/;
      if (this.startDay && !reg.test(this.startDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      if (this.endDay && !reg.test(this.endDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      this.visibleLateNotes = false;
      this.getLateNotesList();
    },
    //重置
    lateNotesClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.startDay = "";
      this.endDay = "";
    },
    //详情确定
    handleLateNotesOk() {
      if (this.lateNotesObj.status == 0) {
        const { id } = this.lateNotesObj;
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
        handleLateReturn({
          id,
          auditRemark: auditRemark,
          status: 1
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.$refs.table_page.refresh()
          } else {
            this.$message.error(msg);
          }
          this.visibleLateNotesDetails = false;
        });
      } else {
        this.visibleLateNotesDetails = false;
      }
    },
    //设置确定
    handleLateNotesSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请设置天数！");
        return;
      }
      if (this.lateNotesDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 2,
        isOpen: this.offOn ? 1 : 0,
        beyondDay: this.daysOver,
        roleList: this.lateNotesDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleLateNotesSeter = false;
        }
      });
      this.visibleLateNotesDetails = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
