<template>
  <a-modal :maskClosable="false" class="boxBanModal" title="编辑" v-model="visible" @cancel="cancel" @ok="handleOk" okText="确定">
    <div class="visible-notes-img" style="width: 100px;height: 100px">
      <img :src="assistantImgShow" alt>
    </div>
    <div class="studentDiv" style="width: 495px">
      <div class="visibleNotesDeailDiv new-label-width">
        <label>姓名:</label>
        <a-input :disabled="true" v-model="teacherName" class="input-box-item boxBanModalInput" placeholder="请输入姓名"/>
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>工号:</label>
        <a-input :disabled="true" v-model="teacherNum" class="input-box-item boxBanModalInput" placeholder="请输入工号"/>
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>证件类型:</label>
        <a-input
          :disabled="true"
          v-model="idType"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>身份证号:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          placeholder="请输入身份证号"
          v-model="IdNumber"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>手机号码:</label>
        <a-input
          v-model="teacherPhone"
          :disabled="true"
          class="input-box-item boxBanModalInput"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>国籍/地区:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="country"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>民族:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="nation"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>性别:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="sex"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>年龄:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="age"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>所属机构:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="machinery"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>行政职务:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="duty"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>职称:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="dutyTitle"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>政治面貌:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="politicsStatus"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>出生日期:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="birthday"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>入职时间:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="inTime"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>聘用类型:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="hireType"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>人事状态:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="personnelStatus"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>婚姻状况:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="marriageStatus"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>学历:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="education"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>毕业院校:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="graduatedCollege"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>专业:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="profession"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>毕业时间:</label>
        <a-input
          :disabled="true"
          class="input-box-item boxBanModalInput"
          v-model="graduatedTime"
        />
      </div>
    </div>

    <div class="clearfix"></div>
    <div class="xinhao">
      <label>管理班级:</label>
    </div>
    <div class="studentLangDiv" :key="index" v-for="(item, index) in classVoList">
      <college-select
        :value="item.collegeId || ''"
        @changeVal="(val)=>{item.collegeId = val}"
        size="default"
        class="input-select"
      />
      <profession-select
        :value="item.professionId || ''"
        @changeVal="(val)=>{item.professionId = val}"
        :collegeId="item.collegeId"
        size="default"
        :width="''"
        class="input-select"
      />
      <grade-select
        :value="item.gradeId || ''"
        @changeVal="(val)=>{item.gradeId = val}"
        size="default"
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
  name: "assistant-modal-updata",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    originObj: {
      type: Object
    }
  },
  data() {
    return {
      personnelStatus: '',
      hireType: '',
      idType: '',
      idNum: '',
      country: '',
      age: '',
      machinery: '',
      duty: '',
      dutyTitle: '',
      birthday: '',
      inTime: '',
      marriageStatus: '',
      graduatedCollege: '',
      profession: '',
      graduatedTime: '',
      visible: false,

      assistantImg: null,
      assistantImgShow: null,
      teacherName: "",
      sex: 0,
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
        {
          collegeId: null,
          professionId: null,
          gradeId: null,
          classId: null
        }
      ],
      teacherNum: "",
      id: ""
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
    handleOk() {
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
    },
    initData() {
      if (this.originObj) {
        const { originObj } = this;

        this.id = originObj.id;
        this.assistantImg = null;
        this.assistantImgShow = originObj.userPicth;
        this.teacherName = originObj.teacherName;
        this.sex = originObj.sex ? originObj.sex : '';
        this.politicsStatus = originObj.politicsStatus;
        this.nation = originObj.nation;
        this.nativePlace = originObj.nativePlace ? originObj.nativePlace : '';
        this.teacherPhone = originObj.teacherPhone ? originObj.teacherPhone : '';
        this.education = originObj.education ? originObj.education : ''
        this.IdNumber = originObj.idNumber ? originObj.idNumber : '';
        this.classVoList = originObj.classVoList ? originObj.classVoList.map(x => {
          return {
            collegeId: x.collegeId,
            professionId: x.professionId,
            gradeId: x.gradeId,
            classId: x.classId
          }
        }) : [
          {
            collegeId: '',
            professionId: '',
            gradeId: '',
            classId: ''
          }
        ]
        this.idType = originObj.idType ? originObj.idType : '',
        this.country = originObj.country ? originObj.country : '',
        this.age = originObj.age ? originObj.age : '',
        this.machinery = originObj.machinery ? originObj.machinery : '',
        this.duty = originObj.duty ? originObj.duty : '',
        this.dutyTitle = originObj.dutyTitle ? originObj.dutyTitle : '',
        this.birthday = originObj.birthday ? originObj.birthday : '',
        this.inTime = originObj.inTime ? originObj.inTime : '',
        this.personnelStatus = originObj.personnelStatus ? originObj.personnelStatus : '',
        this.marriageStatus = originObj.marriageStatus ? originObj.marriageStatus : '',
        this.graduatedCollege = originObj.graduatedCollege ? originObj.graduatedCollege : '',
        this.profession = originObj.profession ? originObj.profession : '',
        this.graduatedTime = originObj.graduatedTime ? originObj.graduatedTime : '',
        this.hireType = originObj.hireType ? originObj.hireType : '',
        this.idNum = originObj.idNum ? originObj.idNum : '',
        this.teacherNum = originObj.teacherNum ? originObj.teacherNum : null;
      }
    },
    cancel () {
      this.$emit('cancel', this)
    }
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible(newVal) {
      this.$emit("cgModal", newVal);
      if (newVal) {
        this.initData();
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
