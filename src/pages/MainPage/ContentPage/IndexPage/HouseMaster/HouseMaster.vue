<template>
  <div class="HouseMaster">
    <div class="warper-box">
      <div class="data-box">
        <div class="data-box-item">
          <Askfor :dataArr="askArr"/>
        </div>
        <div class="data-box-item">
          <TodayData :dataArr="dayArr"/>
        </div>
      </div>
      <div class="map-box">
        <CycleMap/>
      </div>
    </div>
    <Title title="楼栋概况" borderLeft="5px solid #FFB540" margin="14px 0"/>
    <div class="foolr-data">
      <div class="item-student-block" v-for="(item,index) in buildArr" :key="index">
        <div class="item-student-block">
          <BlockLeftAndRight :title="`${item.areaName}/${item.buildName}`" :dataArr="item.dataArr"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CycleMap from "../components/CycleMap";
import Askfor from "../components/Askfor";
import TodayData from "../components/TodayData";
import req from "@/req/req";
const {
  statApplyFormByAdminExt, // 待处理申请
  getBuildNameByAdminExt, // 楼栋概况
  statThisProfileInfo, // 今日概况
  statRealBedTimeInfoBySg,
  getOutBedStudentInfoBySgList
} = req;
export default {
  name: "HouseMaster",
  components: {
    CycleMap,
    Askfor,
    TodayData
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      arr: [
        {
          class: 1,
          dataArr: [
            {
              itemTitle: "房间数",
              dataCount: 0
            },
            {
              itemTitle: "床位数（入住/空置）",
              dataCount: "58/98"
            },
            {
              itemTitle: "学生人数",
              dataCount: 0
            },
            {
              itemTitle: "宿管人数",
              dataCount: 0
            }
          ]
        },
        {
          class: 2,
          dataArr: [
            {
              itemTitle: "房间数",
              dataCount: 0
            },
            {
              itemTitle: "床位数（入住/空置）",
              dataCount: "58/98"
            },
            {
              itemTitle: "学生人数",
              dataCount: 0
            },
            {
              itemTitle: "宿管人数",
              dataCount: 0
            }
          ]
        },
        {
          class: 3,
          dataArr: [
            {
              itemTitle: "房间数",
              dataCount: 0
            },
            {
              itemTitle: "床位数（入住/空置）",
              dataCount: "58/98"
            },
            {
              itemTitle: "学生人数",
              dataCount: 0
            },
            {
              itemTitle: "宿管人数",
              dataCount: 0
            }
          ]
        },
        {
          class: 4,
          dataArr: [
            {
              itemTitle: "房间数",
              dataCount: 0
            },
            {
              itemTitle: "床位数（入住/空置）",
              dataCount: "58/98"
            },
            {
              itemTitle: "学生人数",
              dataCount: 0
            },
            {
              itemTitle: "宿管人数",
              dataCount: 0
            }
          ]
        },
        {
          class: 4,
          dataArr: [
            {
              itemTitle: "房间数",
              dataCount: 0
            },
            {
              itemTitle: "床位数（入住/空置）",
              dataCount: "58/98"
            },
            {
              itemTitle: "学生人数",
              dataCount: 0
            },
            {
              itemTitle: "宿管人数",
              dataCount: 0
            }
          ]
        }
      ],

      askArr: [
        {
          title: `报修申请`,
          val: 0,
          icon: `icondengdai`,
          iconColor: "#2693FA"
        },
        {
          title: `被访申请`,
          val: 0,
          icon: "iconqingjia1",
          iconColor: "#FFB540"
        }
      ],
      buildArr: [],
      dayArr: [
        {
          itemName: "未归人数",
          count: 0,
          icon: "iconriqi",
          iconColor: "#2693FA"
        },
        {
          itemName: "进出人数",
          count: 0,
          icon: "iconiconzhengli-",
          iconColor: "#FFB540"
        },
        {
          itemName: "访客人数",
          count: 0,
          icon: "iconwinfo-icon-weiguijilu",
          iconColor: "rgb(147,88,210)"
        },
        {
          itemName: "报警数",
          count: 0,
          icon: "icon5",
          iconColor: "rgb(90,215,207)"
        }
      ]
    };
  },
  methods: {
    getBuildData() {
      getBuildNameByAdminExt().then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.buildArr = data;
          const { buildArr } = this;
          buildArr.forEach(ele => {
            let arr = [];
            arr.push({
              itemTitle: "房间数",
              dataCount: ele.dormCount
            });
            arr.push({
              itemTitle: "床位数（入住/空置）",
              dataCount: `${ele.useBedCount}/${ele.nuseBedCount}`
            });
            arr.push({
              itemTitle: "学生人数",
              dataCount: ele.studentCount
            });
            arr.push({
              itemTitle: "宿管人数",
              dataCount: ele.sgCount
            });
            ele.dataArr = arr;
          });
        }
      });
    },
    getAskData() {
      statApplyFormByAdminExt().then(
        ({
          data: {
            msg,
            code,
            data: { repairCount, visitCount }
          }
        }) => {
          if (code === 0) {
            this.askArr[0].val = repairCount;
            this.askArr[1].val = visitCount;
          }
        }
      );
    },
    getStatThisProfileInfo() {
      statThisProfileInfo().then(
        ({
          data: {
            msg,
            code,
            data: {
              alramCount,
              breakRulSum,
              inOutCount,
              lateReturnSum,
              noRecordSum,
              noReturnSum,
              visitorCount
            }
          }
        }) => {
          this.dayArr[0].count = noReturnSum;
          this.dayArr[1].count = inOutCount;
          this.dayArr[2].count = visitorCount;
          this.dayArr[3].count = alramCount;
        }
      );
    },
    getStatRealBedTimeInfoBySg() {
      statRealBedTimeInfoBySg().then(
        ({
          data: {
            code,
            msg,
            data: { totalCount, inCount, rate }
          }
        }) => {
        }
      );
    },
    getGetOutBedStudentInfoBySgList() {
      getOutBedStudentInfoBySgList().then(res => {
      });
    }
  },
  created() {
    const {
      getAskData,
      getBuildData,
      getStatThisProfileInfo,
      getStatRealBedTimeInfoBySg,
      getGetOutBedStudentInfoBySgList
    } = this;
    getAskData();
    getBuildData();
    getStatThisProfileInfo();
    getStatRealBedTimeInfoBySg();
    getGetOutBedStudentInfoBySgList();
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.warper-box {
  display: flex;
  justify-content: space-between;
  height: 450;
  & > div {
    width: 49%;
    .border-set;
    &:nth-of-type(1) {
    }
    &:nth-of-type(2) {
      padding: 15px 20px;
    }
  }
  .data-box {
    display: flex;
    flex-direction: column;
    .data-box-item {
      flex: 1;
      background-color: #fff;
      &:nth-of-type(1) {
        margin-bottom: 10px;
        .border-set;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        .border-set;
      }
    }
  }
  .map-box {
    background-color: #fff;
  }
}

.foolr-data {
  display: flex;
  flex-wrap: wrap;
}
.item-student-block {
  flex-basis: 25%;
  padding-right: 10px;
  margin-bottom: 10px;
}

.student-block {
  .box-shadowSet;
  .tb-flex-between;
  .set-border;
  background-color: #fff;
  color: #424242;
  font-size: 12px;
  box-sizing: border-box;
  border-left: 24px solid transparent;
  padding: 13px 10px;
  margin-bottom: 10px;
  & > span {
    font-weight: bold;
    color: @styleColor;
  }
  .student-block-ul {
    display: flex;
    text-align: center;
    flex-direction: column;
    li {
      display: flex;
      width: 80%;
      justify-content: space-between;
      padding: 14px 0 0 0;
      &:nth-of-type(1) {
        span {
          &:nth-of-type(1) {
            &::before {
              background-color: @styleColor;
            }
          }
        }
      }
      &:nth-of-type(2) {
        span {
          &:nth-of-type(1) {
            &::before {
              background-color: @closeColor;
            }
          }
        }
      }
      &:nth-of-type(3) {
        span {
          &:nth-of-type(1) {
            &::before {
              background-color: #ea0060;
            }
          }
        }
      }
      &:nth-of-type(4) {
        span {
          &:nth-of-type(1) {
            &::before {
              background-color: #af4fd5;
            }
          }
        }
      }
      span {
        &:nth-of-type(1) {
          display: flex;
          align-items: center;
          &::before {
            content: " ";
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
