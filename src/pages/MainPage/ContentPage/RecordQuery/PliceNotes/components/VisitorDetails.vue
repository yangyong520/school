<template>
  <div class="VisitorDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleVisitorDSeter = !visibleVisitorDSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportVis" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleVisitorD = !visibleVisitorD">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="visList" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="访客超时推送设置"
      :maskClosable="false"
      v-model="visibleVisitorDSeter"
      @ok="handleVisitorDSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>来访人员超过&nbsp;&nbsp;</span>
        <a-time-picker
          format="HH:mm"
          @change="onChangedaysOverTime"
          :value="moment(daysOver, 'HH:mm')"
        />
        <span>&nbsp;&nbsp;未离开</span>
      </div>
      <div class="input-box">
        <p>
          向
          <span class="font_weight">宿管</span>
          <span class="font_weight">学生</span>推送消息
        </p>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      @cancel="visitorDClearSearch"
      :maskClosable="false"
      v-model="visibleVisitorD"
      @ok="handleSearchVisitorD"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>监测时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="visitorDClearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";
import DataTable from '@/components/DataTable'
import req from "@/req/req";
const {
  queryExportVisitorRecordList,
  queryVisitTimeOutList, // 获取访客超时
  insertCallalarmSet, // 设置
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "VisitorDetails",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "访客超时",

      visibleVisitorDSeter: false, // 设置弹窗
      visibleVisitorD: false, // 筛选弹窗
      offOn: true, //开启/关闭
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      daysOver: "20:30", // 设置超过天数
      columns: [
        {
          title: "访客姓名",
          dataIndex: "visitorName"
        },
        {
          title: "访客照片",
          dataIndex: "pic",
          customRender: (text, record, index) => {
            return <img class="img-header" src={record.picth} />;
          }
        },
        {
          title: "进入时间",
          dataIndex: "time",
          customRender: (text, record, index) => {
            if (record.leaveTime) {
              return (
                <span>
                  {record.inTime}~{record.leaveTime}
                </span>
              );
            } else {
              return <span>{record.inTime}~未离开</span>;
            }
          }
        },
        {
          title: "被访人信息",
          customRender: (text, row, index) => {
            const name = row.studentVo.studentName || ''
            const phone = row.studentVo.phone || ''
            return `${name} ${phone}`
          }
        },
        {
          title: "房间信息",
          dataIndex: "opinionPeople",
          customRender: (text, record, index) => {
            return (
              record.studentVo.areaName +
              "-" +
              record.studentVo.buildName +
              "-" +
              record.studentVo.roomNum +
              "室-" +
              record.studentVo.bedNum + '号床'
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    queryObj () {
      return {
        startTime: this.startTime,
        endTime: this.endTime
      }
    }
  },
  created () {
    this.getAlarmSet(); //查询设置
  },
  methods: {
    exportVis () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportVisitorRecordList(this.selectedRowKeys).then(({data: {msg, code, data}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/exportVisitorRecordList?ids=' + data
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
        type: 8
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.daysOver = data.beyondTime;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    moment,
    //设置时间
    onChangedaysOverTime(time, timeString) {
      this.daysOver = timeString;
    },
    //获取访客超时
    getVisitorDList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchVisitorD() {
      if (this.LeaveDate[0]) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD");
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD");
      }
      this.visibleVisitorD = false;
      this.getVisitorDList();
    },
    //重置
    visitorDClearSearch() {
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //设置确定
    handleVisitorDSetOk(e) {
      insertCallalarmSet({
        type: 8,
        isOpen: this.offOn ? 1 : 0,
        beyondTime: this.daysOver
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleVisitorDSeter = false;
        }
      });
      this.visibleVisitorDSeter = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.font_weight {
  font-weight: bold;
}
</style>
