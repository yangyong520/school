<template>
  <div class="RuleCheckSleep">
    <Title title="归寝规则"/>
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button @click="visibleRuleSleepSet" v-if="roleDataObj.isSet">批量设置</a-button>
        </div>
        <div class="btn-box" @click="visibleRuleCheck = !visibleRuleCheck">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="rule" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置弹窗-->
    <a-modal
      :maskClosable="false"
      title="归寝规则设置"
      v-model="visibleRuleCheckSet"
      @ok="handleRuleCheckSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box w50B">
        <span>晚归时间:</span>
        <a-time-picker
          class="ml20px"
          :defaultValue="moment(startTime, 'HH:mm')"
          format="HH:mm"
          @change="onChangeStartTime"
        />
      </div>
      <div class="input-box w50B">
        <span>未归时间:</span>
        <a-time-picker
          :defaultValue="moment(endTime, 'HH:mm')"
          class="ml20px"
          format="HH:mm"
          @change="onChangeEndTime"
        />
      </div>
    </a-modal>
    <!--查询弹窗-->
    <a-modal
      :maskClosable="false"
      title="筛选"
      @cancel="ruleCheckClearSearch"
      v-model="visibleRuleCheck"
      @ok="handleRuleCheckOk"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>所属区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="ruleCheckClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
import DataTable from '@/components/DataTable'
const {
  queryBuildList, //获取归寝规则列表
  selectAreaList, //查询区域列表
  selectBuildList, //获取楼栋
  settingReturnDorm //设置归寝规则
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "RuleCheckSleep",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      visibleRuleCheckSet: false, //设置弹窗
      visibleRuleCheck: false, //查询弹窗
      ids: [], // 选择的楼栋
      startTime: '00:00', //设置开始时间
      endTime: '00:00', //设置结束时间
      areaId: "", //筛选区域id
      areaList: [], //筛选区域数组
      buildId: "", //筛选楼栋id
      buildIdList: [], //筛选楼栋数组
      columns: [
        {
          title: "楼栋信息",
          customRender: (text, record, index) => {
            const areaName = record.areaName ? record.areaName + '-' : ''
            const buiName = record.buildName ? record.buildName : ''
            return `${areaName}${buiName}`
          }
        },
        {
          title: "晚归时间",
          dataIndex: "lateTime",
          customRender: (text, record, index) => {
            return record.lateTime ? record.lateTime : "未设置";
          }
        },
        {
          title: "未归时间",
          dataIndex: "noReturnTime",
          customRender: (text, record, index) => {
            return record.noReturnTime ? record.noReturnTime : "未设置";
          }
        },
        {
          title: "宿管",
          dataIndex: "phone",
          customRender: (text, record, index) => {
            if (record.sgList && record.sgList.length > 0) {
              return record.sgList.map(x => {
                if (record.sgList.length > 1) {
                  return (
                    <span class="sg-item">{x.sgName}{x.sgPhone}</span>
                  )
                } else {
                  return `${x.sgName}  ${x.sgPhone}`
                }
              })
            } else {
              return '无'
            }
          }
        },
        {
          title: "入住性别",
          dataIndex: "sex",
          // customRender: (text, record, index) => {
          //   return record.sex == 0 ? "男" : "女";
          // }
        },
        {
          title: "操作",
          dataIndex: "foolMaster",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isSet ? (
                  <span
                    onClick={() => {
                      this.ids = [];
                      this.oneRuleSet(
                        record.id,
                        record.lateTime,
                        record.noReturnTime
                      );
                    }}
                  >
                    设置
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  created() {
    this.gatAreaList(); //查询区域列表
  },
  computed: {
    queryObj () {
      return {
        areaId: this.areaId === "all" ? null : this.areaId,
        id: this.buildId === "all" ? null : this.buildId
      }
    }
  },
  methods: {
    moment,
    //设置开始时间
    onChangeStartTime(time, timeString) {
      this.startTime = timeString;
    },
    //设置结束时间
    onChangeEndTime(time, timeString) {
      this.endTime = timeString;
    },
    //获取归寝数据列表
    getRuleCheckList () {
      this.$refs.table_page.getDataTable()
    },
    //查询区域列表
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
    //点击批量设置
    visibleRuleSleepSet() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请先选择目标！");
        return;
      }
      this.ids = this.selectedRowKeys;
      this.visibleRuleCheckSet = true;
    },
    //查询楼栋列表
    handleChangeArea(id) {
      this.buildId = "";
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildIdList = data;
        }
      });
    },
    //筛选
    handleRuleCheckOk() {
      this.visibleRuleCheck = false;
      this.getRuleCheckList();
    },
    //重置
    ruleCheckClearSearch() {
      this.areaId = "";
      this.buildId = "";
      this.buildIdList = [];
    },
    //批量设置保存
    handleRuleCheckSetOk() {
      const { startTime, endTime, ids, $message } = this;
      // startTime = moment(startTime, 'HH:mm')
      // endTime = moment(endTime, 'HH:mm')
      if (!startTime || !endTime) {
        this.$message.warning('请选择时间！')
        return
      }
      settingReturnDorm({
        lateTime: startTime,
        noReturnTime: endTime,
        id: ids
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.visibleRuleCheckSet = false;
      });
    },
    //单项设置
    oneRuleSet (id, startTime, endTime) {
      if (startTime != undefined) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.visibleSeter = !this.visibleSeter;
      } else {
        this.startTime = "00:00";
        this.endTime = "00:00";
        this.visibleSeter = !this.visibleSeter;
      }
      this.ids.push(id);
      this.visibleRuleCheckSet = true;
    },
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
