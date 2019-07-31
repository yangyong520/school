<template>
  <div class="blackDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleBlackSeter = !visibleBlackSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportBlack" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleBlack = !visibleBlack">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="blackInOut" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="黑名单推送设置"
      :maskClosable="false"
      v-model="visibleBlackSeter"
      @ok="handleBlackSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>一旦出现，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select mode="tags" placeholder="选择推送人员" v-model="blackDefaultValue" style="width: 600px">
          <a-select-option value="SGADMIN">宿管</a-select-option>
          <a-select-option value="super_admin">系统管理员</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleBlack"
      @cancel="blackClearSearch"
      @ok="handleSearchBlack"
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
        <span>监测时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          @change="changeTime"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <span>出现次数:</span>
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
        <a-button block @click="blackClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="黑名单处理"
      :maskClosable="false"
      v-model="visibleBlackDetails"
      @ok="handleBlackOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="blackObj.blackUser.picth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv">
          <label>姓名：</label>
          <span>{{blackObj.blackUser.userName}}</span>
        </div>
        <div class="clearfix"></div>
        <div class="visibleNotesDeailDivP" v-if="blackObj.handleStatus == 0">
          <label class="fl">处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="auditRemark"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP" v-if="blackObj.handleStatus == 1">
            <label>处理人：</label>
            <span v-if="blackObj.handleUserRole == 'STUDENT'">学生</span>
            <span v-if="blackObj.handleUserRole == 'TEACHER'">辅导员</span>
            <span v-if="blackObj.handleUserRole == 'super_admin'">系统管理员</span>
            <span v-if="blackObj.handleUserRole == 'SGADMIN'">宿管</span>
            <span v-if="blackObj.handleUserRole == 'DEPART'">院系管理员</span>
            <span v-if="blackObj.handleUserRole == 'PARENT'">家长</span>
            <span>-{{blackObj.handleUserName}}-{{blackObj.handleUserPhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{blackObj.handleReason}}</span>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--日志弹窗-->
    <a-modal
      title="日志"
      :maskClosable="false"
      v-model="JournalVisible"
      okText="确定"
      class="modal-box JournalVisibleModal setNoDisPlay">
      <a-table :columns="columnsVisible" :dataSource="dataVisible" rowKey="id" :pagination="false"/>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { roleControlBtnMixin } from "@/mixin";
import { test, WordTest } from "@/unit/formTest";
import { baseUrl } from "@/baseUrl";
import req from "@/req/req";
const {
  queryExportBlackRecordList,
  handleBlackInOut, // 立即处理黑名单
  queryBlackInOutByUserId, //黑名单日志
  insertCallalarmSet, // 设置
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "blackDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "黑名单",

      dataVisible: [], //日志数组
      offOn: true, //开启/关闭
      blackDefaultValue: ["SGADMIN"], //设置推送人员
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      startDay: "", //查询未归天数开始
      endDay: "", //查询未归天数结束
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleBlack: false, // 查询弹窗
      leaveSet: {
        isDisplayNo: false
      },
      blackObj: {
        //详情数据内容
        blackUser: {}
      },
      visibleBlackDetails: false, // 详情弹窗
      JournalVisible: false, // 日志弹窗
      visibleBlackSeter: false, // 设置弹窗
      handleStatus: 0, //详情审核状态
      auditRemark: "", //详情审核意见
      columns: [
        {
          title: "对比照片",
          dataIndex: "picth",
          customRender: (text, record, index) => {
            return (
              <div style="display: flex;justify-content: center;">
                <img class="img-header" src={record.blackUser.picth}/>
                <img class="img-header" src={record.picth}/>
              </div>
            )
          }
        },
        {
          title: "设备名称",
          // dataIndex: "facilityName"
          customRender: (text, row, index) => {
            return row.facilityName || '无'
          }
        },
        {
          title: "监测时间",
          dataIndex: "monitorTime"
        },
        {
          title: "处理意见",
          dataIndex: "handleStatus",
          customRender: (text, record, index) => {
            if (record.handleStatus === 0) {
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
            return record.hangdleTime ? record.hangdleTime : "——";
          }
        },
        {
          title: "处理人",
          dataIndex: "people",
          customRender: (text, record, index) => {
            return record.handleUserName ? record.handleUserName : "——";
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            if (record.handleStatus === 0) {
              return (
                <div class="todo-box">
                  {this.roleDataObj.isDeal ? (
                    <span
                      onClick={() => {
                        this.blackObj = { ...record };
                        this.visibleBlackDetails = !this.visibleBlackDetails;
                        this.leaveSet.isDisplayNo = false;
                      }}
                    >
                      立即处理
                    </span>
                  ) : (
                    ""
                  )}
                  <span
                    onClick={() => {
                      this.getBlackInOut(record.blackUserId);
                    }}
                  >
                    日志
                  </span>
                </div>
              );
            } else {
              return (
                <div class="todo-box">
                  <span
                    onClick={() => {
                      this.blackObj = { ...record };
                      this.visibleBlackDetails = !this.visibleBlackDetails;
                      this.leaveSet.isDisplayNo = true;
                    }}
                  >
                    查看详情
                  </span>
                  <span
                    onClick={() => {
                      this.getBlackInOut(record.blackUserId);
                    }}
                  >
                    日志
                  </span>
                </div>
              );
            }
          }
        }
      ],
      columnsVisible: [
        {
          title: "对比照片",
          dataIndex: "pic",
          customRender: (text, record, index) => {
            return (
              <div style="display: flex;justify-content: center;">
                { record.userPicth ?
                (<img class="img-header" src={record.userPicth}/>)
                : '' }
                <img class="img-header" src={record.picth}/>
              </div>
            )
          }
        },
        {
          title: "发生位置",
          dataIndex: "area",
          customRender: (text, record, index) => {
            let areaName = record.areaName ? record.areaName + '-' : ''
            let buildName = record.buildName ? record.buildName : ''
            if (areaName || buildName) {
              return areaName + buildName
            } else {
              return '无'
            }
          }
        },
        {
          title: "设备名称",
          // dataIndex: "facilityName"
          customRender: (text, row, index) => {
            return row.facilityName || '无'
          }
        },
        {
          title: "监测时间",
          dataIndex: "monitorTime"
        }
      ],
      selectedRowKeys: []
    };
  },
  created() {
    this.getAlarmSet(); //查询设置
  },
  computed: {
    queryObj () {
      return {
        handleStatus: this.statusSectch === "all" ? null : this.statusSectch,
        startTime: this.startTime,
        endTime: this.endTime,
        val: this.val,
        startDay: this.startDay,
        endDay: this.endDay
      }
    }
  },
  methods: {
    changeTime (time) {
      this.startTime = time[0].format("YYYY-MM-DD");
      this.endTime = time[1].format("YYYY-MM-DD");
    },
    exportBlack () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportBlackRecordList(this.selectedRowKeys).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/exportBlackRecordList?ids=' + data
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
        type: 7
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondDay;
            this.blackDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取黑名单列表
    getBlackList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchBlack() {
      const reg = /^[+]{0,1}(\d+)$/;
      if (this.startDay && !reg.test(this.startDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      if (this.endDay && !reg.test(this.endDay)) {
        this.$message.warning("天数只能为正整数！");
        return;
      }
      this.visibleBlack = false;
      this.getBlackList();
    },
    //重置
    blackClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.startDay = "";
      this.endDay = "";
    },
    //详情确定
    handleBlackOk () {
      if (this.blackObj.handleStatus === 0) {
        const { id } = this.blackObj
        const { auditRemark, $message } = this
        if (!auditRemark) {
          $message.warning("请输入处理意见！")
          return
        }
        const reasonObj = test(WordTest(auditRemark, "处理意见长度最长20位！"));
        if (!reasonObj.status) {
          $message.warning(reasonObj.msg);
          return;
        }
        handleBlackInOut({
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
          this.visibleBlackDetails = false;
        });
      } else {
        this.visibleBlackDetails = false;
      }
    },
    //设置确定
    handleBlackSetOk(e) {
      if (this.blackDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 7,
        isOpen: this.offOn ? 1 : 0,
        roleList: this.blackDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleBlackSeter = false;
        }
      });
      this.visibleBlackDetails = false;
    },
    //查看日志
    getBlackInOut(id) {
      this.JournalVisible = true;
      queryBlackInOutByUserId({
        userId: id
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.dataVisible = data;
        } else {
          this.$message.warning(msg);
        }
      });
    },
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

td {
  vertical-align: middle !important;
}
.JournalVisibleModal {
  width: 600px !important;
}
.setNoDisPlay .ant-modal-footer {
  display: none !important;
}
</style>
