<template>
  <div class="SurmountDetails">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleSurmountSeter = !visibleSurmountSeter"
            v-if="roleDataObj.isSet"
          >设置</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportSurm" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleSurmount = !visibleSurmount">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <DataTable ref="table_page" :columns="columns" reqType="error" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      title="翻越推送设置"
      :maskClosable="false"
      v-model="visibleSurmountSeter"
      @ok="handleSurmountSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <a-switch checkedChildren="开启" unCheckedChildren="关闭" v-model="offOn" defaultChecked/>
      </div>
      <div class="input-box">
        <span>一旦翻越，将向指定人员推送消息</span>
      </div>
      <div class="input-box">
        <p style="width: 170px">推送人员：</p>
        <a-select
          mode="tags"
          placeholder="选择推送人员"
          v-model="surmountDefaultValue"
          style="width: 600px"
        >
          <a-select-option value="SGADMIN">宿管</a-select-option>
          <a-select-option value="super_admin">系统管理员</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      @cancel="surmountClearSearch"
      :maskClosable="false"
      v-model="visibleSurmount"
      @ok="handleSearchSurmount"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>监控设备:</span>
        <a-select v-model="facilityId" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="item in facilityOption" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
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
        <a-button block @click="surmountClearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";
import req from "@/req/req";
const {
  ErrorList,
  facilityList,
  queryExportThrowOver,
  selectAreaList,
  selectBuildList,
  insertCallalarmSet, // 设置
  selectCallAlarmSet //查看设置
} = req;

export default {
  name: "error-list",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "翻越",
      facilityId: 'all',
      facilityOption: [],
      visibleSurmountSeter: false, // 设置弹窗
      visibleSurmount: false, // 筛选弹窗
      offOn: true, //开启/关闭
      surmountDefaultValue: ["SGADMIN"], //推送人员
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      columns: [
        {
          title: "照片",
          dataIndex: "picth",
          customRender: (text, record, index) => {
            return <img class="img-header" src={record.picth} />;
          }
        },
        {
          title: "监控设备",
          dataIndex: "facilityName"
        },
        {
          title: "监测时间",
          dataIndex: "monitorTime"
        },
        {
          title: "宿管信息",
          dataIndex: "userName",
          customRender: (text, record, index) => {
            if (record.sgAdminFormList && record.sgAdminFormList.length > 0) {
              return record.sgAdminFormList.map(x => {
                return (
                  <span class="sg-item">{x.sgName} {x.sgPhone}</span>
                )
              })
            } else {
              return '无'
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
  created() {
    this.getFacility()
    this.getAlarmSet(); //查询设置
    this.gatAreaList()
  },
  computed: {
    queryObj () {
      return {
        startTime: this.startTime,
        endTime: this.endTime,
        facilityId: this.facilityId === 'all' ? '' : this.facilityId,
        areaId: this.areaId === 'all' ? '' : this.areaId,
        buildId: this.buildId === 'all' ? '' : this.buildId
      }
    }
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
    getFacility () {
      facilityList().then(({data: {data, code ,msg}}) => {
        if (code === 0) {
          this.facilityOption = data
        } else {
          this.$message.warning(msg)
        }
      })
    },
    changeTime (time) {
      this.startTime = time[0].format("YYYY-MM-DD");
      this.endTime = time[1].format("YYYY-MM-DD");
    },
    exportSurm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportThrowOver(this.selectedRowKeys).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/callAlarm/exportThrowOverRecord?ids=' + data
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
        type: 5
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            this.surmountDefaultValue = data.roleList;
            data.isOpen == 1 ? (this.offOn = true) : (this.offOn = false);
          }
        }
      });
    },
    //获取翻越
    getSurmountList() {
      this.$refs.table_page.getDataTable()
    },
    //筛选
    handleSearchSurmount() {
      this.visibleSurmount = false;
      this.getSurmountList();
    },
    //重置
    surmountClearSearch() {
      this.LeaveDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //设置确定
    handleSurmountSetOk(e) {
      if (this.surmountDefaultValue.length == 0) {
        this.$message.warning("请选择推送人员！");
        return;
      }
      insertCallalarmSet({
        type: 5,
        isOpen: this.offOn ? 1 : 0,
        roleList: this.surmountDefaultValue
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.visibleSurmountSeter = false;
        }
      });
      this.visibleSurmountSeter = false;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
