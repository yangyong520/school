<template>
  <div class="sleepApplication">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchSleep"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visiblesleepSeter = !visiblesleepSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box" @click="visibleSleep = !visibleSleep">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--头部-->
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :dataSource="sleepList" :pagination="false" rowKey="id"/>
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
      v-model="visibleSleep"
      @ok="handleSearchSleep"
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
          v-model="sleepDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="sleeepClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <a-modal
      :maskClosable="false"
      title="调寝申请"
      v-model="visiblesleepDetails"
      @ok="handlesleepOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="sleepObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{sleepObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{sleepObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{sleepObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{sleepObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{sleepObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{sleepObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{sleepObj.studentVo.collegeName}}-{{sleepObj.studentVo.proName}}-20{{sleepObj.studentVo.gradeName}}级-{{sleepObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{sleepObj.studentVo.areaName}}-{{sleepObj.studentVo.buildName}}-{{sleepObj.studentVo.roomNum}}室-{{sleepObj.studentVo.bedNum}}号床</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div>
        <div class="visibleNotesDeailDivP">
          <label>调寝理由：</label>
          <span>{{sleepObj.reason}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>更换寝室：</label>
          <span>{{sleepObj.areaName}}-{{sleepObj.buildName}}-{{sleepObj.roomName}}-{{sleepObj.bedNum}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>原住人员：</label>
          <label v-if="sleepObj.originStudent">
            <span>{{sleepObj.originStudent.studentName}}</span>&nbsp;&nbsp;
            <span>{{sleepObj.originStudent.collegeName}}-{{sleepObj.originStudent.proName}}-20{{sleepObj.originStudent.gradeName}}级-{{sleepObj.originStudent.className}}班</span>
          </label>
          <span v-else>空置</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>审核进度：</label>
          <span v-if="sleepObj.status == 0" style="color: red;">待审核</span>
          <span v-if="sleepObj.status == 1" style="color: red;">驳回</span>
          <span v-if="sleepObj.status == 2" style="color: red;">审核通过</span>
          <span v-if="sleepObj.status == 3" style="color: red;">逾期</span>
        </div>
        <div
          class="visibleNotesDeailDivP"
          style="display: flex; align-items: center"
          v-if="sleepObj.status == 0">
          <label class="fl">审核意见：</label>
          <a-radio-group v-model="status" class="fl">
            <a-radio :value="2">同意</a-radio>
            <a-radio :value="1">驳回</a-radio>
          </a-radio-group>
          <a-input
            v-show="status === 1"
            size="small"
            class="input-box-item"
            placeholder="请输入审核意见（选填）"
            v-model="auditRemark"
            :style="{width: '235px'}"
          />
        </div>
        <div v-else-if="sleepObj.status != 3">
          <div class="visibleNotesDeailDivP">
            <label>审核意见：</label>
            <span>{{sleepObj.auditRemark || '无'}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理人：</label>
            <span v-if="sleepObj.auditUserRole == 'STUDENT'">学生</span>
            <span v-if="sleepObj.auditUserRole == 'TEACHER'">辅导员</span>
            <span v-if="sleepObj.auditUserRole == 'super_admin'">系统管理员</span>
            <span v-if="sleepObj.auditUserRole == 'SGADMIN'">宿管</span>
            <span v-if="sleepObj.auditUserRole == 'DEPART'">院系管理员</span>
            <span v-if="sleepObj.auditUserRole == 'PARENT'">家长</span>
            <span>-{{sleepObj.auditUserName}}-{{sleepObj.auditUserPhone}}</span>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
    <!--设置-->
    <a-modal
      :maskClosable="false"
      title="请输入过期限制天数"
      v-model="visiblesleepSeter"
      @ok="handleSleepSetOk"
      okText="设置"
      class="modal-box">
      <div class="input-box">
        <span>超过</span>
        <a-input-number class="input-select" v-model="daysOver" :step="1" :max="99" :min="1"/>
        <span>日未处理，则为逾期</span>
      </div>
    </a-modal>
    <!--设置-->
  </div>
</template>

<script>
import req from "@/req/req";
const {
  getApplySetInfo, //查询设置
  inertApplySetInfo, //设置
  queryChangeRoomList, // 获取调寝记录
  handleChangeRoom // 立即处理调寝申请
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "sleepApplication",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "调寝",

      spinning: false, // 判断是否有数据
      sleepList: [], //调寝列表
      radioStyle: {
        //详情弹窗单项样式
        display: "block",
        float: "left"
      },
      sleepDate: [], //查询时间数组
      leaveSet: {
        isDisplayNo: false
      },
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleSleep: false, // 查询弹窗
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      sleepObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visiblesleepDetails: false, // 详情弹窗
      visiblesleepSeter: false, // 设置弹窗
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
          title: "房间信息",
          dataIndex: "roomData",
          customRender: (text, record, index) => {
            if (record.studentVo.areaName) {
              return (
                <span>
                  {record.studentVo.areaName}-{record.studentVo.buildName}-
                  {record.studentVo.roomNum}室-{record.studentVo.bedNum}号床
                </span>
              );
            } else {
              <span>暂无</span>;
            }
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
                      this.sleepObj = { ...record };
                      this.visiblesleepDetails = !this.visiblesleepDetails;
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
                      this.sleepObj = { ...record };
                      this.visiblesleepDetails = !this.visiblesleepDetails;
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
    this.getSleepList(); // 获取调寝列表
    this.getApplySet(); //查询设置
  },
  methods: {
    //查询设置
    getApplySet() {
      getApplySetInfo({
        type: 1
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.day;
          }
        }
      });
    },
    //获取调寝列表
    getSleepList() {
      this.spinning = true;
      queryChangeRoomList({
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
            this.sleepList = content;
            this.pageinfo = pageinfo;
            if (this.sleepList.length === 0) {
              // this.$message.warning('未找到调寝记录数据')
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
    handleSearchSleep() {
      if (this.sleepDate[0]) {
        this.startTime = this.sleepDate[0].format("YYYY-MM-DD");
        this.endTime = this.sleepDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleSleep = false;
      this.getSleepList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getSleepList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getSleepList();
    },
    //重置
    sleeepClearSearch() {
      this.statusSectch = "all";
      this.sleepDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //详情确定
    handlesleepOk() {
      if (this.sleepObj.status == 0) {
        const { id } = this.sleepObj;
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
        handleChangeRoom({
          id,
          auditRemark: auditRemark,
          status
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.auditRemark = ''
            this.getSleepList();
          } else {
            this.$message.error(msg);
          }
          this.visiblesleepDetails = false;
        });
      } else {
        this.visiblesleepDetails = false;
      }
    },
    //设置确定
    handleSleepSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请输入过期限制天数！");
        return;
      }
      inertApplySetInfo({
        type: 1,
        day: this.daysOver
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visiblesleepSeter = false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import '~@/global';

.fl {
  float: left;
}
</style>
