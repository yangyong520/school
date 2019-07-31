<template>
  <div class="leaveApplication">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchLeave"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleLeaveSeter = !visibleLeaveSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box" @click="visibleLeave = !visibleLeave">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :dataSource="leaveList" :pagination="false" rowKey="id"/>
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
      v-model="visibleLeave"
      @ok="handleSearchLeave"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>处理情况:</span>
        <a-select v-model="statusSectch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">待审核</a-select-option>
          <a-select-option value="1">驳回</a-select-option>
          <a-select-option value="2">审核通过</a-select-option>
          <a-select-option value="3">逾期</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>申请时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="leaveClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <a-modal
      title="请假申请"
      :maskClosable="false"
      v-model="visibleLeaveDetails"
      @ok="handleLeaveOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="leaveObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{leaveObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{leaveObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{leaveObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{leaveObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{leaveObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{leaveObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{leaveObj.studentVo.collegeName}}-{{leaveObj.studentVo.proName}}-20{{leaveObj.studentVo.gradeName}}级-{{leaveObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{leaveObj.studentVo.areaName}}-{{leaveObj.studentVo.buildName}}-{{leaveObj.studentVo.roomNum}}室-{{leaveObj.studentVo.bedNum}}号床</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div>
        <div class="visibleNotesDeailDivP">
          <label>请假事由：</label>
          <span>{{leaveObj.reason}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>请假时间：</label>
          <span>{{leaveObj.startTime}}~{{leaveObj.endTime}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>审核进度：</label>
          <span v-if="leaveObj.status == 0" style="color: red;">待审核</span>
          <span v-if="leaveObj.status == 1" style="color: red;">驳回</span>
          <span v-if="leaveObj.status == 2" style="color: red;">审核通过</span>
          <span v-if="leaveObj.status == 3" style="color: red;">逾期</span>
        </div>
        <div
          class="visibleNotesDeailDivP"
          style="display: flex; align-items: center "
          v-if="leaveObj.status == 0"
        >
          <label class="fl">审核意见：</label>
          <a-radio-group v-model="status" class="fl">
            <a-radio :style="radioStyle" :value="2">同意</a-radio>
            <a-radio :style="radioStyle" :value="1">驳回</a-radio>
          </a-radio-group>
          <a-input
            v-if="status === 1"
            size="small"
            class="input-box-item"
            placeholder="请输入审核意见（选填）"
            v-model="auditRemark"
            :style="{width: '235px'}"
          />
        </div>
        <div v-else-if="leaveObj.status != 3">
          <div class="visibleNotesDeailDivP">
            <label>审核意见：</label>
            <!-- <span v-if="leaveObj.status == 2" style="color: red;">同意</span>
            <span v-if="leaveObj.status == 1" style="color: red;">驳回</span>-->
            <span>{{leaveObj.auditReason || '无'}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理人：</label>
            <span v-if="leaveObj.auditUserRole == 'STUDENT'">学生</span>
            <span v-if="leaveObj.auditUserRole == 'TEACHER'">辅导员</span>
            <span v-if="leaveObj.auditUserRole == 'super_admin'">系统管理员</span>
            <span v-if="leaveObj.auditUserRole == 'SGADMIN'">宿管</span>
            <span v-if="leaveObj.auditUserRole == 'DEPART'">院系管理员</span>
            <span v-if="leaveObj.auditUserRole == 'PARENT'">家长</span>
            <span>-{{leaveObj.auditUserName}}-{{leaveObj.auditUserPhone}}</span>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="请输入过期限制天数"
      :maskClosable="false"
      v-model="visibleLeaveSeter"
      @ok="handleLeaveSetOk"
      okText="设置"
      class="modal-box">
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :step="1" :max="99" :min="1"/>
        <span>日未处理，则为逾期</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
const {
  getApplySetInfo, //查询设置
  inertApplySetInfo, //设置
  queryBegOffRecordList, // 获取请假记录
  handleBegOffRecord // 立即处理请假申请
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "leaveApplication",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "请假",

      spinning: false, // 判断是否有数据
      leaveList: [], //调寝列表
      radioStyle: {
        //详情弹窗单项样式
        display: "block",
        float: "left"
      },
      leaveSet: {
        isDisplayNo: false
      },
      LeaveDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleLeave: false, // 查询弹窗
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      leaveObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleLeaveDetails: false, // 详情弹窗
      visibleLeaveSeter: false, // 设置弹窗
      status: 2, //详情审核状态
      auditRemark: "", //详情审核意见
      columns: [
        {
          title: "姓名",
          dataIndex: "studentVo.studentName"
        },
        {
          title: "学号",
          dataIndex: "studentVo.userNum"
        },
        {
          title: "班级信息",
          dataIndex: "classData",
          customRender: (text, record, index) => {
            return (
              record.studentVo.collegeName +
              "-" +
              record.studentVo.proName +
              "-20" +
              record.studentVo.gradeName +
              "级-" +
              record.studentVo.className +
              "班"
            );
          }
        },
        {
          title: "请假事由",
          dataIndex: "reason",
          customRender: (text, record, index) => {
            return <div class="overHiddenWord">{record.reason}</div>;
          }
        },
        {
          title: "处理状态",
          dataIndex: "status",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return <div style="color: red;">待审核</div>;
            } else if (record.status === 1) {
              return <div>驳回</div>;
            } else if (record.status === 2) {
              return <div>审核通过</div>;
            } else if (record.status === 3) {
              return <div>逾期</div>;
            }
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return this.roleDataObj.isAuditing ? (
                <div class="todo-box">
                  <span
                    onClick={() => {
                      this.leaveObj = { ...record };
                      this.visibleLeaveDetails = !this.visibleLeaveDetails;
                      this.leaveSet.isDisplayNo = false;
                    }}
                  >
                    立即审核
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
                      this.leaveObj = { ...record };
                      this.visibleLeaveDetails = !this.visibleLeaveDetails;
                      this.leaveSet.isDisplayNo = true;
                    }}
                  >
                    查看
                  </span>
                </div>
              );
            }
          }
        }
      ],
      selectedRowKeys: []
    };
  },

  created() {
    this.getLeaveList(); // 获取请假列表
    this.getLeaveSet(); //查询设置
  },
  methods: {
    //查询设置
    getLeaveSet() {
      getApplySetInfo({
        type: 4
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.day;
          }
        }
      });
    },
    //获取请假列表
    getLeaveList() {
      this.spinning = true;
      queryBegOffRecordList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        status: this.statusSectch === "all" ? null : this.statusSectch,
        startTime: this.startTime,
        endTime: this.endTime,
        val: this.val
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.leaveList = content;
            this.pageinfo = pageinfo;
            if (this.leaveList.length === 0) {
              // this.$message.warning('未找到请假记录数据')
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
    //筛选
    handleSearchLeave() {
      if (this.LeaveDate[0]) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD");
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleLeave = false;
      this.getLeaveList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getLeaveList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getLeaveList();
    },
    //重置
    leaveClearSearch() {
      this.statusSectch = "all";
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //详情确定
    handleLeaveOk() {
      if (this.leaveObj.status == 0) {
        const { id } = this.leaveObj;
        const {
          auditRemark, //
          status,
          $message
        } = this;
        if (!status) {
          $message.warning("请选择同意或驳回！");
          return;
        }
        if (this.status === 2) {
          this.auditRemark = "";
        }
        if (auditRemark && auditRemark.length > 20) {
          $message.warning("处理意见长度最长20位！");
          return;
        }
        handleBegOffRecord({
          id,
          auditRemark: auditRemark,
          status
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.auditRemark = ''
            this.getLeaveList();
          } else {
            this.$message.error(msg);
          }
          this.visibleLeaveDetails = false;
        });
      } else {
        this.visibleLeaveDetails = false;
      }
    },
    //设置确定
    handleLeaveSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请输入过期限制天数！");
        return;
      }
      inertApplySetInfo({
        type: 4,
        day: this.daysOver
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleLeaveSeter = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
