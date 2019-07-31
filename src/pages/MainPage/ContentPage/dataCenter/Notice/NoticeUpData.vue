<template>
  <div class="NoticeAdd">
    <Title title="公告通知"/>
    <div class="form-box">
      <div class="form-input">
        <label for>公告标题:</label>
        <div class="input-right">
          <a-input class="input-right-inpt" v-model="form.title" placeholder="请输入标题"/>
        </div>
      </div>

      <div class="form-input">
        <label for>发布时间:</label>
        <div class="input-right">
          <div class="input-right-inpt" style="display: flex;align-items: center">
            <a-radio-group v-model="form.sendStatus">
              <a-radio :value="0">立即发送</a-radio>
              <a-radio :value="1">预发送</a-radio>
            </a-radio-group>
            <a-date-picker
              showTime
              :disabledDate="disabledDate"
              :disabledTime="disabledDateTime"
              :defaultValue="moment(form.sendTime, 'YYYY-MM-DD HH:mm:ss')"
              :disabled="form.sendStatus !== 1"
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
                  v-model="form.roleId"
                  :dropdownStyle="{zIndex: 10002}">
                  <a-select-option value="-1">全部</a-select-option>
                  <a-select-option value="1">学生</a-select-option>
                  <a-select-option value="2">辅导员</a-select-option>
                  <a-select-option value="4">宿管</a-select-option>
                </a-select>
              </li>
              <li>
                <label>民族</label>
                <nation-select
                  :value="form.nation"
                  size="small"
                  @changeVal="x => form.nation = x"
                  class="li-selct-box"
                  :haveAll="true"/>
              </li>
              <li>
                <label>学历</label>
                <a-select
                  size="small"
                  class="li-selct-box"
                  :dropdownStyle="{zIndex: 10002}"
                  v-model="form.education"
                  :disabled="!(assistentMode || masterFoolMode)"
                >
                  <a-select-option value="-1">全部</a-select-option>
                  <a-select-option value="0">大专</a-select-option>
                  <a-select-option value="1">本科</a-select-option>
                  <a-select-option value="2">研究生</a-select-option>
                  <a-select-option value="3">博士</a-select-option>
                </a-select>
              </li>
              <li>
                <label>性别</label>
                <a-select
                  size="small"
                  class="li-selct-box"
                  :dropdownStyle="{zIndex: 10002}"
                  v-model="form.sex">
                  <a-select-option :value="-1">全部</a-select-option>
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                </a-select>
              </li>
              <li>
                <label>院系</label>
                <CollegeSelectMultiple
                  :value="form.collegeId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="x => form.collegeId = x"
                  class="li-selct-box"/>
              </li>
              <li>
                <label>专业</label>
                <ProfessionSelectMultiple
                  :value="form.professionId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="x => form.professionId = x"
                  :collegeId="form.collegeId"
                  class="li-selct-box"/>
              </li>
              <li>
                <label>年级</label>
                <GradeSelectMultiple
                  :value="form.gradeId"
                  :haveAll="true"
                  :disabled="!(assistentMode || studentMode)"
                  @changeVal="x => form.gradeId = x"
                  class="li-selct-box"/>
              </li>
              <li>
                <label>班级</label>
                <ClassSelectMultiple
                  :value="form.classId"
                  :haveAll="true"
                  :gradeId="form.gradeId"
                  :disabled="!(assistentMode || studentMode)"
                  :professionId="form.professionId"
                  @changeVal="x => form.classId = x"
                  class="li-selct-box"/>
              </li>
              <li>
                <label>区域</label>
                <area-select
                  :value="form.areaId"
                  :haveAll="true"
                  @changeVal="x => form.areaId = x"
                  :disabled="!(masterFoolMode || studentMode)"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>楼栋</label>
                <build-select
                  :value="form.buildId"
                  :haveAll="true"
                  @changeVal="x => form.buildId = x"
                  @getObj="x => buildObj = x"
                  :disabled="!(masterFoolMode || studentMode)"
                  :areaId="form.areaId"
                  class="li-selct-box"
                />
              </li>
              <li>
                <label>楼层</label>
                <a-select
                  v-model="form.floorId"
                  :haveAll="true"
                  :dropdownStyle="{zIndex: 10002}"
                  size="small"
                  class="li-selct-box"
                  :disabled="!(masterFoolMode || studentMode)">
                  <a-select-option value="-1">全部</a-select-option>
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
                  :value="form.roomId"
                  :haveAll="true"
                  @changeVal="x => form.roomId = x"
                  :floorNum="floorNumGet"
                  :disabled="!(masterFoolMode || studentMode)"
                  :buildId="form.buildId"
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
            id="editorElemUpdata"
            style="text-align:left; border-radius: 10px;"></div>
        </div>
      </div>
      <div>
        <a-button :disabled="disabledButton" type="primary" @click="formula">确定</a-button>
        <a-button @click="$router.back()">返回</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import req from "@/req/req";
const { insertBoard, updateBoardByPrimaryKey, getDetail } = req;
import moment from "moment"

export default {
  name: "NoticeAdd",
  data() {
    return {
      disabledButton: false,
      form: {
        title: '',
        collegeId: ['all'],
        professionId: ['all'],
        gradeId: ['all'],
        classId: ['all'],
        roleId: '-1',
        nation: 'all',
        education: '-1',
        sex: -1,
        areaId: 'all',
        buildId: 'all',
        floorId: '-1',
        roomId: 'all',
        content: '',
        sendStatus: 1,
        sendTime: moment(new Date())
      },
      buildObj: {},
      editor: null,
    };
  },
  computed: {
    floorNumGet() {
      if (this.form.floorId === "-1") {
        return null
      }
      return this.form.floorId
    },
    studentMode() {
      return this.form.roleId === "1" || this.form.roleId === "-1"
    },
    assistentMode() {
      return this.form.roleId === "2" || this.form.roleId === "-1"
    },
    masterFoolMode() {
      return this.form.roleId === "4" || this.form.roleId === "-1"
    },
    id () {
      return this.$route.query.id || ''
    },
    postUrl () {
      if (this.id) {
        return updateBoardByPrimaryKey
      }
      return insertBoard
    }
  },
  methods: {
    range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDate (current) {
      return current && current < moment().endOf('day')
    },
    disabledDateTime () {
      let timer = new Date() // 当前时间
      let sendTime = new Date(this.form.sendTime) // 选择时间
      const h = timer.getHours()
      const m = timer.getMinutes()
      const s = timer.getSeconds()
      const selectTime = this.form.sendTime
      if (sendTime.getTime() > timer.getTime()) {
        // 不进行任何操作
      } else {
        return {
          disabledHours: () => this.range(0, 24).splice(0, h),
          disabledMinutes: () => this.range(0, m),
          disabledSeconds: () => this.range(0, s),
        }
      }
    },
    moment,
    getDetail () {
      getDetail({
        id: this.id
      }).then(({ data: { code, msg, data } }) => {
        this.form = {
          id: data.id,
          title: data.title,
          sendStatus: data.sendStatus,
          content: data.content,
          sendTime: data.sendTime,
          areaId: data.areaId,
          floorId: data.floorId,
          buildId: (data.buildId === '-1' ? 'all' : data.buildId) || 'all',
          classId: (data.classId === '-1' ? 'all' : data.classId) || ['all'],
          collegeId: data.collegeName ? data.collegeName.map(x => (x.collegeId === '-1' ? 'all' : x.collegeId) || '') || ['all'] : ['all'],
          professionId: data.professionName ? data.professionName.map(x => x ? x.id : '') || ['all'] : ['all'],
          gradeId: data.gradeName ? data.gradeName.map(x => (x.id === '-1' ? 'all' : x.id) || '') || ['all'] : ['all'],
          roleId: data.roleId,
          sex: data.sex,
          nation: (data.nation === '-1' ? 'all' : data.nation) || 'all',
          education: data.education || '-1',
          roomId: data.roomId || 'all'
        }
        this.editor.txt.html(this.form.content)
      })
    },
    // 文本框初始
    init () {
      this.editor = new E('#editorElemUpdata')
      // 获取文本内容
      this.editor.customConfig.onchange = (html) => {
        this.form.content = html
      }
      this.editor.create()
    },
    formula () {
      const titleLen = this.form.title.length
      if (titleLen === 0) {
        this.$message.warning('请输入标题！')
        return
      }
      if (titleLen > 20) {
        this.$message.warning('标题长度不能超过20个字符！')
        return
      }
      if (this.form.sendStatus === 1 && !this.form.sendTime) {
        this.$message.warning("预发送请，传入时间！")
        return
      }
      if (!this.form.content) {
        this.$message.warning("公告内容不能为空！")
        return
      }
      if (this.form.sendStatus === 0) {
        this.form.sendTime = ''
      } else {
        this.form.sendTime = moment(this.form.sendTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.form.roleId === "1") {
        delete this.form["education"]
      } else if (this.form.roleId === "2") {
        delete this.form["areaId"]
        delete this.form["buildId"]
        delete this.form["roomId"]
        delete this.form.floorId
      } else if (this.form.roleId === "4") {
        delete this.form["collegeId"]
        delete this.form["professionId"]
        delete this.form["gradeId"]
        delete this.form["classId"]
      }
      this.form.content = `<div style="font-size: 14px">${this.form.content}</div>`
      let data = this.formatting(this.form)
      this.disabledButton = true
      this.postUrl(data).then(({data: {code, msg}}) => {
        if (code === 0) {
          this.$message.success(msg)
          this.$router.go(-1)
        } else {
          this.$message.warning(msg)
        }
        this.disabledButton = false
      })
    },
    formatting (data) {
      let val = {...data}
      val.collegeId = val.collegeId.some(x => x === 'all') ? ['-1'] : val.collegeId,
      val.professionId = val.professionId.some(x => x === 'all') ? ['-1'] : val.professionId,
      val.gradeId = val.gradeId.some(x => x === 'all') ? ['-1'] : val.gradeId,
      val.classId = val.classId.some(x => x === 'all') ? ['-1'] : val.classId,
      val.nation = val.nation === 'all' ? '-1' : val.nation,
      val.areaId = val.areaId === 'all' ? '-1' : val.areaId,
      val.buildId = val.buildId === 'all' ? '-1' : val.buildId,
      val.roomId = val.roomId === 'all' ? '-1' : val.roomId
      return val
    },
    onChangeDate (value, dateString) {
      this.form.sendTime = dateString
    }
  },
  created () {
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    buildObj() {
      this.floorId = '-1'
    }
  }
};
</script>

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
