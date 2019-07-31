<template>
  <div class="NoDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/学号" v-model="val" @search="handleSearchNo" enterButton/>
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleNoSeter = !visibleNoSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportNoDetail" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleNo = !visibleNo">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="noLogs" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      :maskClosable="false"
      title="无记录推送设置"
      v-model="visibleNoSeter"
      @ok="handleNoSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :max="99" :min="1"/>
        <span>日无记录，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          v-model="noDefaultValue"
          :maxTagCount="2"
          style="width: 600px"
        >
          <a-select-option value="STUDENT">学生</a-select-option>
          <a-select-option value="SGADMIN">宿管</a-select-option>
          <a-select-option value="TEACHER">辅导员</a-select-option>
          <a-select-option value="DEPART">院系管理员</a-select-option>
          <a-select-option value="super_admin">系统管理员</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal @cancel="noClearSearch" :maskClosable="false" title="筛选" v-model="visibleNo" @ok="handleSearchNo" okText="查询" class="modal-box">
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
          @change="changeTime"
          format="YYYY-MM-DD"
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
        <a-button block @click="noClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="无记录处理"
      :maskClosable="false"
      v-model="visibleNoDetails"
      @ok="handleNotesOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="noObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{noObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{noObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{noObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{noObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{noObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{noObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{noObj.studentVo.collegeName}}-{{noObj.studentVo.proName}}-20{{noObj.studentVo.gradeName}}级-{{noObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{noObj.studentVo.areaName}}-{{noObj.studentVo.buildName}}-{{noObj.studentVo.roomNum}}室-{{noObj.studentVo.bedNum}}号床</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="noObj.status == 0">
          <label class="fl">处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="auditRemark"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP" v-if="noObj.status == 1">
            <label>处理人：</label>
            <span v-if="noObj.handleRole == 'STUDENT'">学生</span>
            <span v-if="noObj.handleRole == 'TEACHER'">辅导员</span>
            <span v-if="noObj.handleRole == 'super_admin'">系统管理员</span>
            <span v-if="noObj.handleRole == 'SGADMIN'">宿管</span>
            <span v-if="noObj.handleRole == 'DEPART'">院系管理员</span>
            <span v-if="noObj.handleRole == 'PARENT'">家长</span>
            <span>-{{noObj.handleName}}-{{noObj.handlePhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{noObj.reason}}</span>
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
  queryExportNoRecordList,
  handleNoRecord, // 立即处理无记录
  insertCallalarmSet, // 设置
  selectAreaList,
  selectBuildList,
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "NoDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "无记录",

      offOn: true, //开启/关闭
      noDefaultValue: ["STUDENT", "SGADMIN", "TEACHER"], //设置推送人员
      leaveSet: {
        isDisplayNo: false
      },
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      startDay: "", //查询未归天数开始
      endDay: "", //查询未归天数结束
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleNo: false, // 查询弹窗
      noObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleNoDetails: false, // 详情弹窗
      visibleNoSeter: false, // 设置弹窗
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
          title: "无记录级别",
          width: 140,
          customRender: (text, record, index) => {
            return <div style="color: red;">连续{record.level}日无记录</div>;
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
          dataIndex: "modifyTime",
          // customRender: (text, record, index) => {
          //   return record.handleTime ? record.handleTime : "——";
          // }
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
                      this.noObj = { ...record };
                      this.visibleNoDetails = !this.visibleNoDetails;
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
                      this.noObj = { ...record };
                      this.visibleNoDetails = !this.visibleNoDetails;
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
    exportNoDetail () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportNoRecordList(this.selectedRowKeys).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/ExportNoRecord?ids=' + data
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
        type: 3
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondDay;
            this.noDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取无记录列表
    getNoList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchNo() {
      const reg = /^[+]{0,1}(\d+)$/;
      if (this.startDay && !reg.test(this.startDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      if (this.endDay && !reg.test(this.endDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      this.visibleNo = false;
      this.getNoList();
    },
    //重置
    noClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.startDay = "";
      this.endDay = "";
    },
    //详情确定
    handleNotesOk() {
      if (this.noObj.status == 0) {
        const { id } = this.noObj;
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
        handleNoRecord({
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
          this.auditRemark = ''
          this.visibleNoDetails = false;
        });
      } else {
        this.visibleNoDetails = false;
      }
    },
    //设置确定
    handleNoSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请设置天数！");
        return;
      }
      if (this.noDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 3,
        isOpen: this.offOn ? 1 : 0,
        beyondDay: this.daysOver,
        roleList: this.noDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleNoSeter = false;
        }
      });
      this.visibleNoDetails = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
