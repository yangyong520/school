<template>
  <div class="VisitApplication">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchVisit"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleVisitSeter = !visibleVisitSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box" @click="visibleVisit = !visibleVisit">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :dataSource="visitList" :pagination="false" rowKey="id"/>
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
      v-model="visibleVisit"
      @ok="handleSearchVisit"
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
          v-model="visitDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="VisitClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal
      title="被访申请"
      :maskClosable="false"
      v-model="visibleVisitDetails"
      @ok="handleVisitOk"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img :src="visitObj.studentVo.userPicth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{visitObj.studentVo.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{visitObj.studentVo.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{visitObj.studentVo.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{visitObj.studentVo.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{visitObj.studentVo.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{visitObj.studentVo.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{visitObj.studentVo.collegeName}}-{{visitObj.studentVo.proName}}-20{{visitObj.studentVo.gradeName}}级-{{visitObj.studentVo.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{visitObj.studentVo.areaName}}-{{visitObj.studentVo.buildName}}-{{visitObj.studentVo.roomNum}}室-{{visitObj.studentVo.bedNum}}号床</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div class="visible-notes-img">
        <img :src="visitObj.picth" alt>
      </div>
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDivP">
          <label>来访事由：</label>
          <span>{{visitObj.visitReason}}</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>来访人员：</label>
          <span>{{visitObj.visitName}}</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>关系：</label>
          <span>{{visitObj.relation}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>审核进度：</label>
          <span v-if="visitObj.status == 0" style="color: red;">待审核</span>
          <span v-if="visitObj.status == 1" style="color: red;">驳回</span>
          <span v-if="visitObj.status == 2" style="color: red;">审核通过</span>
          <span v-if="visitObj.status == 3" style="color: red;">逾期</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="visitObj.status == 0">
          <a-radio-group v-model="status" class="fl">
            <a-radio :style="radioStyle" :value="2">同意</a-radio>
            <a-radio :style="radioStyle" :value="1">驳回</a-radio>
          </a-radio-group>
        </div>
        <div class="visibleNotesDeailDivP" v-if="visitObj.status == 0">
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
        <div v-else-if="visitObj.status != 3">
          <div class="visibleNotesDeailDivP">
            <label>审核意见：</label>
            <span>{{visitObj.reason || '无'}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理人：</label>
            <span v-if="visitObj.auditUserRole == 'STUDENT'">学生</span>
            <span v-if="visitObj.auditUserRole == 'TEACHER'">辅导员</span>
            <span v-if="visitObj.auditUserRole == 'super_admin'">系统管理员</span>
            <span v-if="visitObj.auditUserRole == 'SGADMIN'">宿管</span>
            <span v-if="visitObj.auditUserRole == 'DEPART'">院系管理员</span>
            <span v-if="visitObj.auditUserRole == 'PARENT'">家长</span>
            <span>-{{visitObj.auditUserName}}-{{visitObj.auditUserPhone}}</span>
          </div>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>预约时间：</label>
          <span>{{visitObj.bookTime}}</span>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
    <a-modal :maskClosable="false" title="请输入过期限制天数" v-model="visibleVisitSeter" @ok="handleSleepSetOk" class="modal-box">
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
  queryVisiAccessRecordList, // 获取被访记录
  handleVisiAccessRecord // 立即处理被访申请
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "VisitApplication",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "被访",

      spinning: false, // 判断是否有数据
      visitList: [], //调寝列表
      radioStyle: {
        //详情弹窗单项样式
        display: "block",
        float: "left"
      },
      leaveSet: {
        isDisplayNo: false
      },
      visitDate: [], //查询时间数组
      daysOver: "", //设置超过天数
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      statusSectch: "all", //查询状态
      val: "", //查询姓名/学号
      visibleVisit: false, // 查询弹窗
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      visitObj: {
        //详情数据内容
        studentVo: {},
        originStudent: {}
      },
      visibleVisitDetails: false, // 详情弹窗
      visibleVisitSeter: false, // 设置弹窗
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
            const areaName = record.studentVo && record.studentVo.areaName ? record.studentVo.areaName + '-' : ''
            const buildName = record.studentVo && record.studentVo.buildName ? record.studentVo.buildName + '-' : ''
            const roomNum = record.studentVo && record.studentVo.roomNum ? record.studentVo.roomNum + '室' : ''
            const bedNum = record.studentVo && record.studentVo.bedNum ? record.studentVo.bedNum + '号床' : ''
            return (areaName + buildName + roomNum + bedNum) || '无'
          }
        },
        {
          title: "预定访问时间",
          dataIndex: "bookTime"
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
                      this.visitObj = { ...record };
                      this.visibleVisitDetails = !this.visibleVisitDetails;
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
                      this.visitObj = { ...record };
                      this.visibleVisitDetails = !this.visibleVisitDetails;
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
    this.getVisitList(); // 获取被访列表
    this.getVisitSet(); //查询设置
  },
  methods: {
    //查询设置
    getVisitSet() {
      getApplySetInfo({
        type: 3
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.day;
          }
        }
      });
    },
    //获取被访列表
    getVisitList() {
      this.spinning = true;
      queryVisiAccessRecordList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        status: this.statusSectch === "all" ? '' : this.statusSectch,
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
            this.visitList = content;
            this.pageinfo = pageinfo;
            if (this.visitList.length === 0) {
              // this.$message.warning('未找到被访记录数据')
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
    handleSearchVisit() {
      if (this.visitDate[0]) {
        this.startTime = this.visitDate[0].format("YYYY-MM-DD");
        this.endTime = this.visitDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleVisit = false;
      this.getVisitList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getVisitList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getVisitList();
    },
    //重置
    VisitClearSearch() {
      this.statusSectch = "all";
      this.visitDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //详情确定
    handleVisitOk() {
      if (this.visitObj.status == 0) {
        const { id } = this.visitObj;
        const { auditRemark, status, $message } = this;
        if (!status) {
          $message.warning("请选择同意或驳回！");
          return;
        }
        if (auditRemark && auditRemark.length > 20) {
          $message.warning("处理意见长度最长20位！");
          return;
        }
        if (status === 2) {
          this.auditRemark = "";
        }
        handleVisiAccessRecord({
          id,
          auditRemark: auditRemark,
          status
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg)
            this.getVisitList()
            this.auditRemark = ''
          } else {
            this.$message.error(msg);
          }
          this.visibleVisitDetails = false;
        });
      } else {
        this.visibleVisitDetails = false;
      }
    },
    //设置确定
    handleSleepSetOk(e) {
      if (!this.daysOver) {
        this.$message.warning("请输入过期限制天数！");
        return;
      }
      inertApplySetInfo({
        type: 3,
        day: this.daysOver
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleVisitSeter = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
