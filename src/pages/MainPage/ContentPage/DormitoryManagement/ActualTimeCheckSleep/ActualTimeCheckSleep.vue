<template>
  <div class="ActualTimeCheckSleep">
    <Title title="实时查寝" margin="0 0 10px 0"/>
    <div class="inner-style">
      <div class="box-left">
        <div class="layout-flex">
          <div class="suqer blue"></div>
          <div>在宿舍</div>
        </div>
        <div class="layout-flex">
          <div class="suqer red"></div>
          <div>未在宿舍</div>
        </div>
        <div>总人数{{num.totalCount || 0}}，</div>
        <div>在寝人数{{num.inCount || 0}}，</div>
        <div>离寝人数{{num.outCount || 0}}</div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/学号" v-model="val" @search="searchInput" enterButton/>
        </div>
        <div class="btn-box">
          <a-button @click="derive" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleActualCheck = !visibleActualCheck">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <div class="sleep-room-box" v-for="(item,index) in foolArr" :key="index+'ul'">
      <div class="sleep-room-title">
        <ActualCheckedRadio :fool="item.floor" @changeRadio="x => item.checked = x"/>
        <div>
          <span>{{item.floor}}层</span>
          <span>房间数：{{item.roomNum}}</span>
        </div>
      </div>
      <ul class="sleep-ul-box">
        <li v-for="(elem, i) in item.roomInfoList" :key="i">
          <span>{{elem.roomNum}}</span>
          <dl>
            <dt
              class="stu-name"
              v-for="per in elem.studentInOutFormList"
              :key="per.id"
              :style="{color: per.inOutInfo === 0 ? '#199ed8' : '#990000'}"
              @click="getUserDetail(per.userId)">{{per.studentName}}</dt>
            <dt v-if="elem.studentInOutFormList.length === 0">暂无数据</dt>
          </dl>
        </li>
      </ul>
    </div>
    <div class="no-data" v-if="foolArr.length === 0">暂无数据</div>
    <!--查询弹窗-->
    <a-modal
      :maskClosable="false"
      title="筛选"
      v-model="visibleActualCheck"
      @ok="handleActualOk"
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
        <a-button block @click="actualClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <a-modal
      :footer="null"
      :maskClosable="false"
      title="信息详情"
      v-model="visibleSeter"
      @ok="handleOk"
      okText="确定"
      class="modal-box">
      <img class="visibleNotesImg" :src="userDetail.userPicth">
      <div class="visibleNotesDeail">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{userDetail.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机：</label>
          <span>{{userDetail.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>学号：</label>
          <span>{{userDetail.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>性别：</label>
          <span>{{userDetail.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{userDetail.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>手机号：</label>
          <span>{{userDetail.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span v-if="userDetail.collegeName && userDetail.proName && userDetail.gradeName && userDetail.className">
            {{userDetail.collegeName}}-
            {{userDetail.proName}}-
            20{{userDetail.gradeName}}级-
            {{userDetail.className}}班
          </span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{userDetail.areaName}}-{{userDetail.buildName}}-{{userDetail.roomNum + '室'}}-{{userDetail.bedNum + '号床'}}</span>
        </div>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--详情弹窗-->
  </div>
</template>

<script>
import ActualCheckedRadio from "@/components/ActualCheckedRadio";
import req from "@/req/req";
const {
  searchExportQs,
  countNumReal, // 获取统计
  queryRealTimeReturnDoemList, // 获取实时查寝
  selectAreaList, // 查询区域列表
  selectBuildList, // 获取楼栋
  studentInfo, // 获取学生信息
  getCheckQueryInfoByUserId, // 获取筛选条件
  realCheckList // 实时归寝的查询
} = req;
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";

export default {
  name: "ActualTimeCheckSleep",
  components: { ActualCheckedRadio },
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "实时查寝",

      val: "",
      areaId: "", // 筛选区域id
      areaList: [], // 筛选区域数组
      buildId: "", // 筛选楼栋id
      buildIdList: [], // 筛选楼栋数组
      foolArr: [],
      visibleSeter: false, // 用户信息
      visibleActualCheck: false, // 查询

      userDetail: {}, // 学生信息
      num: {},
      single: false
    };
  },
  computed: {
    exportCheckArr () {
      let arr = []
      this.foolArr.map(x => {
        if (x.checked) {
          arr.push({
            floor: x.floor,
            buildId: x.buildId
          })
        }
      })
      return arr
    }
  },
  created() {
    this.gatAreaList(); // 查询区域列表
    this.getFilter(); // 获取筛选条件
  },
  methods: {
    getCountNum (area, bui, queryInfo = '') {
      countNumReal({
        areaId: area,
        buildId: bui,
        queryInfo: queryInfo
      }).then(({data: {code, msg, data}}) => {
        if (code === 0) {
          this.num = data
        } else {
          this.$message.warning(msg)
        }
      })
    },
    derive () {
      if (this.exportCheckArr.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      searchExportQs(this.exportCheckArr).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/returnDorm/exportRealReturnDorm?ids=' + data
          elemIF.style.display = "none"
          document.body.appendChild(elemIF)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    changeCheckBox(e) {
      this.single = e.target.checked;
    },
    getUserDetail(id) {
      studentInfo({
        userId: id
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.visibleSeter = true;
          this.userDetail = data;
        }
      });
    },
    getFilter() {
      getCheckQueryInfoByUserId().then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.areaId = data.areaId || "";
          this.handleChangeArea(data.areaId);
          this.buildId = data.buildId || "";
          this.getList(this.areaId, this.buildId);
          this.getCountNum(this.areaId, this.buildId);
        } else {
          this.$message.warning(msg);
        }
      });
    },
    getList(area, bui, queryInfo = "") {
      realCheckList({
        areaId: area,
        buildId: bui,
        queryInfo: queryInfo
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.foolArr = data.map(x => {
            return {...x, checked: false}
          })
        } else {
          this.$message.warning(msg)
        }
      });
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
    handleActualOk() {
      this.visibleActualCheck = false;
      this.getList(this.areaId, this.buildId);
      this.getCountNum(this.areaId, this.buildId);
    },
    searchInput() {
      this.getList(this.areaId, this.buildId, this.val);
      this.getCountNum(this.areaId, this.buildId, this.val);
    },
    //重置
    actualClearSearch() {
      this.areaId = "";
      this.buildId = "";
    },
    handleOk() {
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.sleep-room-box {
  background-color: #ffffff;
  width: 100%;
  border-radius: 10px;
  .sleep-room-title {
    padding: 15px 10px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
  }
  .sleep-ul-box {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    li {
      flex: 0 0 6.666666666%;
      text-align: center;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      margin-bottom: 10px;
      span {
        padding: 15px 0;
        // border-top: 1px solid #EDEDED;
        // border-bottom: 1px solid #EDEDED;
        background-color: rgb(238, 238, 238);
        box-sizing: border-box;
      }
      dl {
        .stu-name {
          cursor: pointer;
        }
        dt {
          padding-top: 15px;
          &:nth-last-of-type(1) {
            padding-bottom: 15px;
          }
        }
      }
    }
  }
}

.no-data {
  color: #999;
  font-size: 16px;
  text-align: center;
}
.box-left {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
  .suqer {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    margin-right: 5px;
  }
  .red {
    background: rgba(153, 0, 0, 1);
  }
  .blue {
    background: rgba(25, 158, 216, 1);
  }
  .layout-flex {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
}
</style>
