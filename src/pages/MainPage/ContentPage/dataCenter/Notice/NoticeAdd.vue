<template>
  <div class="NoticeAdd">
    <Title title="公告通知"/>
    <div class="form-box">
      <div class="form-input">
        <label for>公告标题:</label>
        <div class="input-right">
          <a-input class="input-right-inpt" v-model="title" placeholder="请输入标题"/>
        </div>
      </div>

      <div class="form-input">
        <label for>发布时间:</label>
        <div class="input-right">
          <div class="input-right-inpt" style="display: flex;align-items: center">
            <a-radio-group @change="onChange" v-model="sendStatus">
              <a-radio :value="0">立即发送</a-radio>
              <a-radio :value="1">预发送</a-radio>
            </a-radio-group>
            <a-date-picker
              showTime
              :disabled="sendStatus !== 1"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择时间"
              @change="onChangeDate"
              :style="{flex: 1}"
              :popupStyle="{zIndex: 10002}"
            />
          </div>
        </div>
      </div>

      <div class="form-input">
        <label for>发布对象:</label>
        <div class="input-right">
          <div class="input-right-inpt">
            <ul class="ul-list">
              <li>
                <label>角色</label>
                <a-select
                  size="small"
                  class="li-selct-box"
                  @change="handleChange"
                  v-model="roleId"
                  :dropdownStyle="{zIndex: 10002}"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option :value="1">学生</a-select-option>
                  <a-select-option :value="2">辅导员</a-select-option>
                  <a-select-option :value="4">宿管</a-select-option>
                </a-select>
              </li>
              <li>
                <label>民族</label>
                <nation-select
                  :value="nation"
                  size="small"
                  @changeVal="(val)=>{this.nation = val}"
                  class="li-selct-box"
                  :haveAll="true"
                />
              </li>
              <li>
                <label>学历</label>
                <a-select
                  size="small"
                  class="li-selct-box"
                  @change="handleChange"
                  :dropdownStyle="{zIndex: 10002}"
                  v-model="education"
                  :disabled="!(assistentMode || masterFoolMode)"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option :value="0">大专</a-select-option>
                  <a-select-option :value="1">本科</a-select-option>
                  <a-select-option :value="2">研究生</a-select-option>
                  <a-select-option :value="3">博士</a-select-option>
                </a-select>
              </li>
              <li>
                <label>性别</label>
                <a-select
                  size="small"
                  class="li-selct-box"
                  @change="handleChange"
                  :dropdownStyle="{zIndex: 10002}"
                  v-model="sex"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                </a-select>
              </li>
              <li>
                <label>院系</label>
                <CollegeSelectMultiple
                  :value="collegeId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="(val)=>{this.collegeId = val}"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>专业</label>
                <ProfessionSelectMultiple
                  :value="professionId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="(val)=>{this.professionId = val}"
                  :collegeId="collegeId"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>年级</label>
                <GradeSelectMultiple
                  :value="gradeId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="(val)=>{this.gradeId = val}"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>班级</label>
                <ClassSelectMultiple
                  :value="classId"
                  :haveAll="true"
                  :gradeId="gradeId"
                  :disabled="!(assistentMode || studentMode)"
                  :professionId="professionId"
                  @changeVal="(val)=>{this.classId = val}"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>区域</label>
                <area-select
                  :value="areaId"
                  :haveAll="true"
                  @changeVal="(val)=>{this.areaId = val}"
                  :disabled="!(masterFoolMode || studentMode)"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>楼栋</label>
                <build-select
                  :value="buildId"
                  :haveAll="true"
                  @changeVal="val=>{this.buildId = val}"
                  @getObj="obj=>{this.buildObj = obj}"
                  :disabled="!(masterFoolMode || studentMode)"
                  :areaId="areaId"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>楼层</label>
                <a-select
                  v-model="floorNum"
                  :haveAll="true"
                  :dropdownStyle="{zIndex: 10002}"
                  size="small"
                  class="li-selct-box"
                  :disabled="!(masterFoolMode || studentMode)"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option
                    :value="item"
                    v-for="(item) in buildObj.floor"
                    :key="item + '-floor'"
                  >{{item}}</a-select-option>
                </a-select>
              </li>
              <li>
                <label>房间</label>
                <room-select
                  :value="roomId"
                  :haveAll="true"
                  @changeVal="val=>{this.roomId = val}"
                  :floorNum="floorNumGet"
                  :disabled="!(masterFoolMode || studentMode)"
                  :buildId="buildId"
                  :dropdownStyle="{zIndex: 10002}"
                  size="small"
                  class="li-selct-box"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="form-input">
        <label for>发布内容:</label>
        <div class="input-right">
          <div
            class="input-right-inpt"
            id="editorElem"
            style="text-align:left; border-radius: 10px;"
          ></div>
        </div>
      </div>

      <div>
        <a-button type="primary" @click="formula">确定</a-button>
        <a-button @click="$router.back()">返回</a-button>
      </div>
    </div>

    <!-- <button v-on:click="getContent">发表</button> -->
  </div>
</template>

<script>
import E from "wangeditor";
import req from "@/req/req";
const { insertBoard } = req;
export default {
  name: "NoticeAdd",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      editorContent: "",
      sendStatus: 1,
      roleId: "all",
      collegeId: ["all"],
      professionId: ["all"],
      gradeId: ["all"],
      classId: ["all"],
      areaId: "all",
      buildId: "all",
      buildObj: {},
      floorNum: "all",
      roomId: "all",
      title: "",
      nation: "all",
      education: "all",
      sex: "all",
      sendTime: ""
    };
  },
  computed: {
    floorNumGet() {
      if (this.floorNum === "all") {
        return null;
      }
      return this.floorNum;
    },
    studentMode() {
      const { roleId } = this;
      return roleId === 1 || roleId === "all"; // .some(ele => ele === 1 || ele === "all");
    },
    assistentMode() {
      const { roleId } = this;
      return roleId === 2 || roleId === "all"; // .some(ele => ele === 2 || ele === "all");
    },
    masterFoolMode() {
      const { roleId } = this;
      return roleId === 4 || roleId === "all"; // .some(ele => ele === 4 || ele === "all");
    }
  },
  methods: {
    getContent: function() {
    },
    onChange(data) {
    },
    handleChange() {},

    formula() {
      const {
        title,
        sendStatus,
        sendTime,
        roleId,
        nation,
        education,
        sex,
        collegeId,
        professionId,
        classId,
        areaId,
        buildId,
        gradeId,
        roomId,
        editorContent
      } = this;
      const sendObj = {
        title,
        sendStatus,
        sendTime,
        roleId: roleId === "all" ? -1 : roleId,
        nation: nation === "all" ? -1 : nation,
        education: education === "all" ? -1 : education,
        sex: sex === "all" ? -1 : sex,
        collegeId: collegeId.some(ele => ele === "all") ? [-1] : collegeId,
        professionId: professionId.some(ele => ele === "all")
          ? [-1]
          : professionId,
        classId: classId.some(ele => ele === "all") ? [-1] : classId,
        areaId: areaId === "all" ? -1 : areaId,
        buildId: buildId === "all" ? -1 : buildId,
        gradeId: gradeId.some(ele => ele === "all") ? [-1] : gradeId,
        roomId: roomId === "all" ? -1 : roomId,
        content: editorContent
      };
      if (sendObj.sendStatus === 1) {
        if (!sendObj.sendTime) {
          this.$message.warning("预发送请，传入时间！");
          return;
        }
      }
      if(!sendObj.content){
        this.resetDate()
        this.$message.warning("公告内容不能为空！");
        return;
      }
      if (sendObj.roleId === 1) {
        delete sendObj["education"];
      } else if (sendObj.roleId === 2) {
        delete sendObj["areaId"];
        delete sendObj["buildId"];
        delete sendObj["roomId"];
      } else if (sendObj.roleId === 4) {
        delete sendObj["collegeId"];
        delete sendObj["professionId"];
        delete sendObj["gradeId"];
        delete sendObj["classId"];
      }
      insertBoard(sendObj).then(({ data: { code, msg } }) => {
        const { $message, $router } = this;
        if (code === 0) {
          $message.success(msg);
          $router.back();
        } else {
          $message.warning(msg);
        }
      });
    },
    onChangeDate(value, dateString) {
      this.sendTime = dateString;
    },
    resetDate() {
      this.editorContent = "";
      this.sendStatus = 1;
      this.roleId = "all";
      this.collegeId = ["all"];
      this.professionId = ["all"];
      this.gradeId = ["all"];
      this.classId = ["all"];
      this.areaId = "all";
      this.buildId = "all";
      this.buildObj = {};
      this.floorNum = "all";
      this.roomId = "all";
      this.title = "";
      this.nation = "all";
      this.education = "all";
      this.sex = "all";
      this.sendTime = ""
    }
  },
  mounted() {
    var editor = new E("#editorElem");
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.create();
  },
  watch: {
    buildObj() {
      this.floorNum = "all";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.NoticeAdd {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 800px;
  min-width: 1500px;
}
.form-box {
  flex: 1;
  background-color: #fff;
  background-clip: content-box;
  border: 20px solid transparent;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .form-input {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    & > label {
      white-space: nowrap;
      line-height: 32px;
      margin-right: 10px;
      flex: 2;
      text-align: right;
    }
    .input-right {
      flex: 15;
      .input-right-inpt {
        width: 80%;
      }
    }
  }
  .ul-list {
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;

    li {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 25%;
      label {
        width: 4em;
        text-align: right;
        padding: 0 10px;
      }
      .li-selct-box {
        width: 250px;
      }
    }
  }
}
</style>
