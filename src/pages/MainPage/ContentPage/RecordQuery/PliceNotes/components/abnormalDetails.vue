<template>
  <div class="abnormalDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleAbnormalSeter = !visibleAbnormalSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box" @click="visibleAbnormal = !visibleAbnormal">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--头部-->
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="abnormalDList"
        :pagination="false"
        rowKey="id"
      />
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
    <!--设置弹窗-->
    <a-modal
      title="设备异常推送设置"
      :maskClosable="false"
      v-model="visibleAbnormalSeter"
      @ok="handleAbnormalSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>一旦异常，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          v-model="AbnormalDefaultValue"
          style="width: 600px">
          <a-select-option value="SGADMIN">宿管</a-select-option>
          <a-select-option value="super_admin">系统管理员</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!--设置弹窗-->
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleAbnormal"
      @ok="handleSearchAbnormal"
      okText="查询"
      class="modal-box"
    >
      <div class="input-box">
        <span>监控设备:</span>
        <a-select v-model="equipmentStatus" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">赤眸</a-select-option>
          <a-select-option value="1">摄像头</a-select-option>
          <a-select-option value="2">大屏</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>监测时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="abnormalClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
  </div>
</template>

<script>
import req from "@/req/req";
const {
  queryFacilityExceptionList, // 获取设备异常
  insertCallalarmSet, // 设置
  selectCallAlarmSet // 查看设置
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "abnormalDetails",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "设备异常",

      visibleAbnormalSeter: false, // 设置弹窗
      visibleAbnormal: false, // 筛选弹窗
      abnormalDList: [], //设备异常列表
      spinning: false, // 判断是否有数据
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      offOn: true, //开启/关闭
      AbnormalDefaultValue: ["SGADMIN"], //设置推送人员
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      equipmentStatus: "all", //查询设备类型
      columns: [
        {
          title: "设备名称",
          dataIndex: "facilityName",
          customRender: (text, record, index) => {
            if (record.mark) {
              if (record.mark == 0) {
                return (
                  <span>
                    {record.areaName ? record.areaName + '-' : ''}
                    {record.buildName ? record.buildName + '-' : ''}
                    {record.door ? record.door + '-' : ''}
                    {record.passway ? record.passway + '-' : ''}
                    {record.facilityName ? record.facilityName : ''}-进
                  </span>
                );
              } else {
                return (
                  <span>
                    {record.areaName ? record.areaName + '-' : ''}
                    {record.buildName ? record.buildName + '-' : ''}
                    {record.door ? record.door + '-' : ''}
                    {record.passway ? record.passway + '-' : ''}
                    {record.facilityName ? record.facilityName : ''}-出
                  </span>
                );
              }
            } else {
              return (
                <span>
                  {record.areaName ? record.areaName + '-' : ''}
                  {record.buildName ? record.buildName + '-' : ''}
                  {record.door ? record.door + '-' : ''}
                  {record.passway ? record.passway + '-' : ''}
                  {record.facilityName ? record.facilityName : ''}
                </span>
              );
            }
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
    this.getAbnormalList(); // 获取设备异常
    this.getAlarmSet(); //查询设置
  },
  methods: {
    //查询设置
    getAlarmSet() {
      selectCallAlarmSet({
        type: 9
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.AbnormalDefaultValue = data.roleList
            this.daysOver = data.beyondDay;
            this.lateNotesDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取设备异常
    getAbnormalList() {
      this.spinning = true;
      queryFacilityExceptionList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        startTime: this.startTime,
        endTime: this.endTime,
        equipmentStatus: this.equipmentStatus === "all" ? null : this.equipmentStatus
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.abnormalDList = content;
            this.pageinfo = pageinfo;
            if (this.abnormalDList.length === 0) {
              // this.$message.warning('未找到设备异常记录数据')
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
    //筛选
    handleSearchAbnormal() {
      if (this.LeaveDate[0]) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD");
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleAbnormal = false;
      this.getAbnormalList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getAbnormalList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getAbnormalList();
    },
    //重置
    abnormalClearSearch() {
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
      this.equipmentStatus = "all";
    },
    //设置确定
    handleAbnormalSetOk(e) {
      if (this.AbnormalDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 9,
        isOpen: this.offOn ? 1 : 0,
        roleList: this.AbnormalDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleVisitorDSeter = false;
        }
      });
      this.visibleAbnormalSeter = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
</style>
