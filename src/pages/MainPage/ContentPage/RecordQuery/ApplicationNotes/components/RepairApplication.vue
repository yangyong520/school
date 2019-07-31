<template>
  <div class="RepairApplication">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchRepair"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleRepairSeter = !visibleRepairSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box" @click="visibleRepair = !visibleRepair">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :dataSource="RepairList" :pagination="false" rowKey="id"/>
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
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleRepair"
      @ok="handleSearchRepair"
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
          v-model="RepairDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="repairClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      :maskClosable="false"
      title="报修申请"
      v-model="visibleRepairDetails"
      @ok="handleRepairOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="repairObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{repairObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{repairObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{repairObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{repairObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{repairObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{repairObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{repairObj.studentVo.collegeName}}-{{repairObj.studentVo.proName}}-20{{repairObj.studentVo.gradeName}}级-{{repairObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{repairObj.studentVo.areaName}}-{{repairObj.studentVo.buildName}}-{{repairObj.studentVo.roomNum}}室-{{repairObj.studentVo.bedNum}}号床</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div class="visible-notes-img">
        <img v-if="repairObj.picth" :src="repairObj.picth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDivP">
          <label>报修内容：</label>
          <span>{{repairObj.content}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>审核进度：</label>
          <span v-if="repairObj.status == 0" style="color: red;">待审核</span>
          <span v-if="repairObj.status == 1" style="color: red;">驳回</span>
          <span v-if="repairObj.status == 2" style="color: red;">审核通过</span>
          <span v-if="repairObj.status == 3" style="color: red;">逾期</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="repairObj.status == 0">
          <a-radio-group v-model="status" class="fl">
            <a-radio :style="radioStyle" :value="2">同意</a-radio>
            <a-radio :style="radioStyle" :value="1">驳回</a-radio>
          </a-radio-group>
        </div>
        <div class="visibleNotesDeailDivP" v-if="repairObj.status == 0">
          <div v-if="status === 1">
            <label>审核意见：</label>
            <a-input
              size="small"
              class="input-box-item"
              placeholder="请输入审核意见（选填）"
              v-model="auditRemark"
              :style="{width: '235px'}"
            />
          </div>
        </div>
        <div v-else-if="repairObj.status != 3">
          <div class="visibleNotesDeailDivP">
            <label>审核意见：</label>
            <span>{{repairObj.auditReason || '无'}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理人：</label>
            <span v-if="repairObj.auditUserRole == 'STUDENT'">学生</span>
            <span v-if="repairObj.auditUserRole == 'TEACHER'">辅导员</span>
            <span v-if="repairObj.auditUserRole == 'super_admin'">系统管理员</span>
            <span v-if="repairObj.auditUserRole == 'SGADMIN'">宿管</span>
            <span v-if="repairObj.auditUserRole == 'DEPART'">院系管理员</span>
            <span v-if="repairObj.auditUserRole == 'PARENT'">家长</span>
            <span>-{{repairObj.auditUserName}}-{{repairObj.auditUserPhone}}</span>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="请输入过期限制天数"
      :maskClosable="false"
      v-model="visibleRepairSeter"
      @ok="handleRepairSetOk"
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
  queryRepairsRecordList, // 获取报修记录
  handleRepairsRecord // 立即处理报修申请
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "RepairApplication",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "报修",

      spinning: false, // 判断是否有数据
      RepairList: [], //报修列表
      radioStyle: {
        //详情弹窗单项样式
        display: "block",
        float: "left"
      },
      leaveSet: {
        isDisplayNo: false
      },
      RepairDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleRepair: false, // 查询弹窗
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      repairObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleRepairDetails: false, // 详情弹窗
      visibleRepairSeter: false, // 设置弹窗
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
            let areaName = record.studentVo.areaName
              ? record.studentVo.areaName + "-"
              : "";
            let buiName = record.studentVo.buildName
              ? record.studentVo.buildName + "-"
              : "";
            let roomNum = record.studentVo.roomNum
              ? record.studentVo.roomNum + '室'
              : "";
            let bedNum = record.studentVo.bedNum
              ? "-" + record.studentVo.bedNum + '号床'
              : "";
            return `${areaName}${buiName}${roomNum}${bedNum}`;
          }
        },
        {
          title: "报修内容",
          dataIndex: "content",
          customRender: (text, record, index) => {
            return <div class="repair-content">{record.content}</div>;
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
                      this.repairObj = { ...record };
                      this.visibleRepairDetails = !this.visibleRepairDetails;
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
                      this.repairObj = { ...record };
                      this.visibleRepairDetails = !this.visibleRepairDetails;
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
    this.getRepairList(); // 获取报修列表
    this.getRepairSet(); //查询设置
  },
  methods: {
    //查询设置
    getRepairSet() {
      getApplySetInfo({
        type: 2
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.day;
          }
        }
      });
    },
    //获取报修列表
    getRepairList() {
      this.spinning = true;
      queryRepairsRecordList({
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
            this.RepairList = content;
            this.pageinfo = pageinfo;
            if (this.RepairList.length === 0) {
              // this.$message.warning('未找到报修记录数据')
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
    handleSearchRepair() {
      if (this.RepairDate[0]) {
        this.startTime = this.RepairDate[0].format("YYYY-MM-DD");
        this.endTime = this.RepairDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleRepair = false;
      this.getRepairList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getRepairList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getRepairList();
    },
    //重置
    repairClearSearch() {
      this.statusSectch = "all";
      this.RepairDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //详情确定
    handleRepairOk() {
      if (this.repairObj.status == 0) {
        const { id } = this.repairObj;
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
        handleRepairsRecord({
          id,
          auditRemark: auditRemark,
          status: status
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.auditRemark = ''
            this.getRepairList();
          } else {
            this.$message.error(msg);
          }
          this.visibleRepairDetails = false;
        });
      } else {
        this.visibleRepairDetails = false;
      }
    },
    //设置确定
    handleRepairSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请输入过期限制天数！");
        return;
      }
      inertApplySetInfo({
        type: 2,
        day: this.daysOver
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleRepairSeter = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
.repair-content {
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
