<template>
  <a-modal :maskClosable="false" class="boxBanModal" :okButtonProps="{ props: {disabled: disabledAdd} }" title="添加" v-model="visible" @ok="handleOk" okText="确定">
    <div class="visible-notes-img">
      <img :src="assistantImgShow" alt>
      <upload-com @uploadCom="uploadCom" name="assistantImg">
        <div v-if="!assistantImgShow" class="uplod-btn">+</div>
      </upload-com>
    </div>
    <div class="studentDiv">
      <div class="visibleNotesDeailDiv xinhao">
        <label>姓名:</label>
        <a-input v-model="teacherName" class="input-box-item boxBanModalInput" placeholder="请输入姓名"/>
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>工号:</label>
        <a-input v-model="teacherNum" class="input-box-item boxBanModalInput" placeholder="请输入工号"/>
      </div>
      <div class="visibleNotesDeailDiv">
        <label>性别:</label>
        <a-select v-model="sex" class="input-select">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </div>
      <div class="visibleNotesDeailDiv">
        <label>政治面貌:</label>
        <a-select v-model="politicsStatus" class="input-select">
          <a-select-option :value="0">群众</a-select-option>
          <a-select-option :value="1">共青团员</a-select-option>
          <a-select-option :value="2">中共党员</a-select-option>
          <a-select-option :value="3">其他</a-select-option>
        </a-select>
      </div>

      <div class="visibleNotesDeailDiv">
        <label>民族:</label>
        <nation-select
          :value="nation"
          size="default"
          @changeVal="(val)=>{this.nation = val}"
          class="input-select"
        />
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>籍贯:</label>
        <a-input v-model="nativePlace" class="input-box-item boxBanModalInput" placeholder="请输入籍贯"/>
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>手机号码:</label>
        <a-input
          v-model="teacherPhone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>学历:</label>
        <a-select v-model="education" class="input-select">
          <!-- <a-select-option value="all">全部</a-select-option> -->
          <a-select-option :value="0">大专</a-select-option>
          <a-select-option :value="1">本科</a-select-option>
          <a-select-option :value="2">研究生</a-select-option>
          <a-select-option :value="3">博士</a-select-option>
        </a-select>
      </div>
      <div class="visibleNotesDeailDiv xinhao" style="width: 100%;display: flex;align-items: center;">
        <label>身份证号:</label>
        <a-input
          style="flex: 1;margin-left: 15px"
          placeholder="请输入身份证号"
          v-model="IdNumber"
        />
      </div>
    </div>

    <div class="clearfix"></div>
    <div class="xinhao">
      <label>管理班级:</label>
    </div>
    <div class="studentLangDiv" :key="index" v-for="(item,index) in classVoList">
      <college-select
        :value="item.collegeId"
        @changeVal="(val)=>{item.collegeId = val}"
        size="default"
        :width="''"
        class="input-select"
      />
      <profession-select
        :value="item.professionId"
        @changeVal="(val)=>{item.professionId = val}"
        :collegeId="item.collegeId"
        size="default"
        :width="''"
        class="input-select"
      />
      <grade-select
        :value="item.gradeId"
        @changeVal="(val)=>{item.gradeId = val}"
        size="default"
        :width="''"
        class="input-select"
      />
      <class-select
        :value="item.classId"
        :gradeId="item.gradeId"
        :professionId="item.professionId"
        size="default"
        :width="''"
        @changeVal="(val)=>{item.classId = val}"
        class="input-select"
      />
      <a-button type="primary" @click="addArea">添加</a-button>
      <a-button v-if="(classVoList.length - 1) !== 0" @click="delArea(index)" class="del-btn">删除</a-button>
    </div>
    <div class="border_eeeMtB10"></div>
  </a-modal>
</template>

<script>
export default {
  name: "ass-modal",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    disabledAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,

      assistantImg: null,
      assistantImgShow: null,
      teacherName: "",
      sex: '男',
      politicsStatus: 0,
      nation: "1",
      nativePlace: "",
      teacherPhone: "",
      education: 1,
      IdNumber: "",
      classVoList: [
        {
          collegeId: null,
          professionId: null,
          gradeId: null,
          classId: null
        },
      ],
      teacherNum: ""
    };
  },
  computed: {
    showClassErrMsg () {
      let arr = this.classVoList.map(x => {
        return x.classId
      })
      let hash = {}
      for (let key in arr) {
        if (hash[arr[key]]) {
          return true
        }
        hash[arr[key]] = true
      }
      return false
    }
  },
  methods: {
    handleOk () {
      if (this.showClassErrMsg) {
        this.$message.warning('请勿选择相同班级！')
        return
      }
      this.$emit("okForm", this);
    },
    uploadCom(file, name) {
      // 获取图片
      this[name] = file;
      const reader = new FileReader();
      reader.onload = event => {
        this[name + "Show"] = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    delArea(index) {
      this.classVoList.splice(index, 1);
    },
    addArea(index) {
      this.classVoList.push({
        collegeId: null,
        professionId: null,
        gradeId: null,
        classId: null
      });
    }
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible(newVal) {
      this.$emit("cgModal", newVal);
    },
    visibleContry(newVal) {
      this.visible = newVal;
    },
    showClassErrMsg (newVal) {
      if (newVal) {
        this.$message.warning('请勿选择相同班级！')
      }
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
</style>
