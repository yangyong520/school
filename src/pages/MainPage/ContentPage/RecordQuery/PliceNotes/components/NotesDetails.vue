<template>
  <div class="NotesDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchNotes"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleNotesSeter = !visibleNotesSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportNoRetu" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleNotes = !visibleNotes">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="notes" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="未归推送设置"
      :maskClosable="false"
      v-model="visibleNotesSeter"
      @ok="handleNotesSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :max="99" :min="1"/>
        <span>日未归，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          v-model="notesDefaultValue"
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
      title="筛选"
      :maskClosable="false"
      v-model="visibleNotes"
      @cancel="notesClearSearch"
      @ok="handleSearchNotes"
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
        <span>未归天数:</span>
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
        <a-button block @click="notesClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="未归处理"
      :maskClosable="false"
      v-model="visibleNotesDetails"
      @ok="handleNotesOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="notesObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{notesObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{notesObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{notesObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{notesObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{notesObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{notesObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{notesObj.studentVo.collegeName}}-{{notesObj.studentVo.proName}}-20{{notesObj.studentVo.gradeName}}级-{{notesObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{notesObj.studentVo.areaName}}-{{notesObj.studentVo.buildName}}-{{notesObj.studentVo.roomNum}}室-{{notesObj.studentVo.bedNum}}号床</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="notesObj.status == 0">
          <label class="fl">处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="auditRemark"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP" v-if="notesObj.status == 1">
            <label>处理人：</label>
            <span v-if="notesObj.handleRole == 'STUDENT'">学生</span>
            <span v-if="notesObj.handleRole == 'TEACHER'">辅导员</span>
            <span v-if="notesObj.handleRole == 'super_admin'">系统管理员</span>
            <span v-if="notesObj.handleRole == 'SGADMIN'">宿管</span>
            <span v-if="notesObj.handleRole == 'DEPART'">院系管理员</span>
            <span v-if="notesObj.handleRole == 'PARENT'">家长</span>
            <span>-{{notesObj.handleName}}-{{notesObj.handlePhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{notesObj.reason}}</span>
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
  queryExportNoReturnList,
  handleNoReturn, // 立即处理未归
  insertCallalarmSet, // 设置
  selectAreaList,
  selectBuildList,
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "NotesDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "未归",
      leaveSet: {
        isDisplayNo: false
      },
      selectedRowKeys: [],
      notesDefaultValue: ["STUDENT", "SGADMIN", "TEACHER"], //设置推送人员
      offOn: true, //开启/关闭
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      startDay: "", //查询未归天数开始
      endDay: "", //查询未归天数结束
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleNotes: false, // 查询弹窗
      notesObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleNotesDetails: false, // 详情弹窗
      visibleNotesSeter: false, // 设置弹窗
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
          title: "未归级别",
          width: 140,
          customRender: (text, record, index) => {
            return <div style="color: red;">连续{record.level}日未归</div>;
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
                      this.notesObj = { ...record };
                      this.visibleNotesDetails = !this.visibleNotesDetails;
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
                      this.notesObj = { ...record };
                      this.visibleNotesDetails = !this.visibleNotesDetails;
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
    this.getAlarmSet() //查询设置
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
      this.startTime = time[0].format("YYYY-MM-DD")
      this.endTime = time[1].format("YYYY-MM-DD")
    },
    exportNoRetu () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportNoReturnList(this.selectedRowKeys).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/ExportNoReturnRecord?ids=' + data
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
        type: 1
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondDay;
            this.notesDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取未归列表
    getNotesList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchNotes() {
      const reg = /^[+]{0,1}(\d+)$/;
      if (this.startDay && !reg.test(this.startDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      if (this.endDay && !reg.test(this.endDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      this.visibleNotes = false;
      this.getNotesList();
    },
    //重置
    notesClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.startDay = "";
      this.endDay = "";
    },
    //详情确定
    handleNotesOk() {
      if (this.notesObj.status == 0) {
        const { id } = this.notesObj;
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
        handleNoReturn({
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
          this.visibleNotesDetails = false;
        });
      } else {
        this.visibleNotesDetails = false;
      }
    },
    //设置确定
    handleNotesSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请设置天数！");
        return;
      }
      if (this.notesDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 1,
        isOpen: this.offOn ? 1 : 0,
        beyondDay: this.daysOver,
        roleList: this.notesDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleNotesSeter = false;
        }
      });
      this.visibleNotesDetails = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
