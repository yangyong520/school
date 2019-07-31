<template>
  <div class="manageClassSeting">
    <Title title="返回" style="cursor: pointer;" @click.native="$router.back()"/>
    <div class="warper-box">
      <div>
        <div class="select-date-title fl">
          <span>在校时间</span>
        </div>
        <a-checkbox-group class="weekListDiv fl" @change="getweekList" :value="weekList">
          <a-checkbox value="1">周一</a-checkbox>
          <a-checkbox value="2">周二</a-checkbox>
          <a-checkbox value="3">周三</a-checkbox>
          <a-checkbox value="4">周四</a-checkbox>
          <a-checkbox value="5">周五</a-checkbox>
          <a-checkbox value="6">周六</a-checkbox>
          <a-checkbox value="7">周日</a-checkbox>
        </a-checkbox-group>
        <a-button class="clearSearch" @click="clearSearch" type="primary">重置</a-button>
      </div>
      <p class="clearfix"></p>
      <div class="select-date-left">
        <div class="select-date-title fl">
          <span>放假时间</span>
        </div>
        <div class="fl">
          <div class="select-date-content" :key="index" v-for="(item, index) in leftArr">
            <a-range-picker
              format="YYYY-MM-DD"
              v-model="item.LeaveDate"
              class="input-box-item breakDataPicker"
            />
            <a-button v-if="leftArr.length !== 0" type="primary" @click="delAreaLeft(index)">删除</a-button>
          </div>
          <a-button block @click="addAreaLeft">添加放假时间</a-button>
        </div>
      </div>
      <p class="clearfix"></p>
      <div class="mt30">
        <a-button class="ButtonSearch" type="primary" @click="submitClassSet">保存</a-button>
        <a-button class="ml10" @click.native="$router.back()">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
const {
  queryClassInSchool, // 获取班级在校时间
  queryClassOutSchool, // 获取班级离校时间
  setClassInSchool, //设置班级在校时间
  setClassOutSchool //设置班级离校时间
} = req;
export default {
  name: "manageClassSeting",
  data() {
    return {
      leftArr: [], // 放假时间
      weekList: [], // 筛选在校时间
      LeaveList: [] // 转换放假时间格式
    };
  },
  computed: {
    classIds () {
      return localStorage.getItem("classIds") || ''
    },
    classIdsList () {
      return JSON.parse(localStorage.getItem("classIdsList")) || []
    }
  },
  created () {
    this.ClassInSchool()
    this.ClassOutSchool()
  },
  methods: {
    moment,
    // 获取班级在校时间
    ClassInSchool() {
      this.spinning = true;
      queryClassInSchool({
        classIds: this.classIds
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data) {
            var weekListCont = [];
            for (var i = 0; i < data.length; i++) {
              weekListCont.push(data[i].weekId);
            }
            if (weekListCont.length > 0) {
              this.weekList = weekListCont;
            } else {
              this.weekList = ['1', '2', '3', '4', '5']
            }
          } else {
            this.weekList = ['1', '2', '3', '4', '5']
          }
        } else {
          this.$message.warning(msg);
        }
      });
    },
    // 获取班级离校时间
    ClassOutSchool() {
      this.spinning = true;
      queryClassOutSchool({
        classIds: this.classIds
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          if (data && data.length > 0) {
            this.LeaveList = data
            for (var i = 0; i < data.length; i++) {
              this.leftArr.push({
                LeaveDate: []
              });
              this.leftArr[i].LeaveDate = [
                moment(data[i].outSchoolStartTime, "YYYY-MM-DD") || '',
                moment(data[i].outSchoolEndTime, "YYYY-MM-DD") || ''
              ];
            }
          }
        } else {
          this.$message.warning(msg);
        }
      });
    },
    // 选择在校时间
    getweekList (checkedValues) {
      this.weekList = checkedValues;
    },
    // 重置
    clearSearch () {
      this.weekList = [];
    },
    // 保存
    submitClassSet () {
      if (this.weekList == "") {
        this.$message.warning("请选择在校时间！");
        return;
      }
      if (this.leftArr.length > 0) {
        // this.$message.warning("请添加放假时间！")
        // return
        for (var i = 0; i < this.leftArr.length; i++) {
          if (this.leftArr[i].LeaveDate.length > 0) {
            this.LeaveList[i].outSchoolStartTime = this.leftArr[i].LeaveDate[0].format("YYYY-MM-DD");
            this.LeaveList[i].outSchoolEndTime = this.leftArr[i].LeaveDate[1].format("YYYY-MM-DD");
          } else {
            this.$message.warning("请选择放假时间！")
            return
          }
        }
      }
      //设置班级在校时间
      setClassInSchool({
        classIds: this.classIdsList,
        weekIds: this.weekList
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.ClassInSchool();
        } else {
          this.$message.error(msg);
          return;
        }
      });
      //设置班级离校时间
      setClassOutSchool({
        classIds: this.classIdsList,
        timeVoList: this.LeaveList
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.ClassOutSchool();
        } else {
          this.$message.error(msg);
          return;
        }
      });
      this.$router.go(-1);
    },
    //点击删除放假时间
    delAreaLeft (index) {
      this.leftArr.splice(index, 1);
      this.LeaveList.splice(index, 1);
    },
    //点击添加放假时间
    addAreaLeft (index) {
      this.leftArr.push({
        LeaveDate: []
      });
      this.LeaveList.push({
        outSchoolStartTime: "",
        outSchoolEndTime: ""
      });
    }
  },
  watch: {
    classIds () {
      this.ClassInSchool()
      this.ClassOutSchool()
    },
    classIdsList () {
      this.ClassInSchool()
      this.ClassOutSchool()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

.manageClassSeting {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 1000px;
}

.mt30 {
  margin-top: 30px;
}

.ButtonSearch {
  margin-left: 180px;
}

.ml10 {
  margin-left: 10px;
}

.fl {
  float: left;
}

.clearSearch {
  margin-left: 20px;
}

.weekListDiv {
  line-height: 30px;
}

.select-date-content {
  margin-bottom: 10px;
}

.warper-box {
  padding: 40px 0px;
  line-height: 30px;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 20px;
  & > div {
    padding: 20px;
    .select-date-title {
      & > span {
        font-weight: bold;
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
}
</style>
