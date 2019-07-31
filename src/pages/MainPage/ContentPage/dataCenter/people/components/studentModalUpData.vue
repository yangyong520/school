<template>
  <a-modal :maskClosable="false" title="编辑" @cancel="cancel" v-model="visible" @ok="handleOk" okText="确定" class="modal-box boxBanModal">
    <div class="visible-notes-img" style="width: 100px;height: 100px">
      <img :src="studentImgShow" alt>
    </div>
    <div class="studentDiv" style="width: 495px">
      <div class="visibleNotesDeailDiv new-label-width">
        <label>学号:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="studentNum"
          class="input-box-item boxBanModalInput"
          placeholder="请输入学号"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>姓名:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="studentName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入姓名"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>证件类型:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="idType"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>证件号码:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="idNum"
          class="input-box-item boxBanModalInput"
          placeholder="请输入身份证号"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>手机号码:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="phone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>监护人电话:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="guardianPhone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>国籍/地区:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="country"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>民族:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="nationId"
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
          size="small"
          v-model="age"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>在读学历:</label>
        <a-input
          :disabled="true"
          size="small"
          v-model="education"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>籍贯:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="nativePlace"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>出生日期:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="birthday"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>入学时间:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="inTime"
          class="input-box-item boxBanModalInput"
        />
      </div>
      <div class="visibleNotesDeailDiv new-label-width">
        <label>婚姻状况:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="marriageStatus"
          class="input-box-item boxBanModalInput"
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
        <label>家庭地址:</label>
        <a-input
          size="small"
          :disabled="true"
          v-model="homeAaddress"
          class="input-box-item boxBanModalInput"
        />
      </div>
    </div>

    <div class="clearfix"></div>
    <div class="studentLangDiv xinhao">
      <label>班级信息:</label>
      <college-select
        :value="collegeId"
        @changeVal="(val)=>{this.collegeId = val}"
        size="default"
        :width="''"
        class="input-select-lee"/>
      <profession-select
        :value="professionId"
        @changeVal="(val)=>{this.professionId = val}"
        :collegeId="collegeId"
        size="default"
        :width="''"
        class="input-select-lee"/>
      <grade-select
        :value="gradeId"
        @changeVal="(val)=>{this.gradeId = val}"
        size="default"
        :width="''"
        class="input-select-lee"/>
      <class-select
        :value="classId"
        :gradeId="gradeId"
        :professionId="professionId"
        size="default"
        :width="''"
        @changeVal="(val)=>{this.classId = val}"
        class="input-select-lee"
      />
    </div>
    <div class="studentLangDiv xinhao">
      <label>房间信息:</label>
      <area-select
        :value="areaId"
        size="default"
        @changeVal="(val)=>{this.areaId = val}"
        class="input-select"
      />
      <build-select
        :value="buildId"
        @changeVal="val=>{this.buildId = val}"
        @getObj="obj=>{this.buildObj = obj}"
        :areaId="areaId"
        size="default"
        class="input-select"
      />
      <room-select
        :value="roomId"
        @changeVal="val=>{this.roomId = val}"
        :buildId="buildId"
        :dropdownStyle="{zIndex: 10002}"
        size="default"
      />
      <BedSelect
        :value="bedId"
        @changeVal="val=>{this.bedId = val}"
        :roomId="roomId"
        :dropdownStyle="{zIndex: 10002}"
        size="default"
      />
    </div>
    <div class="border_eeeMtB10"></div>
    <div class="clearfix"></div>
  </a-modal>
</template>

<script>
import req from "@/req/req";
import { setTimeout } from "timers";
import { type } from "os";
const { selectMzList } = req;
export default {
  name: "studentModalUpData",
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
      idType: '',
      country: '',
      marriageStatus: '',
      guardianPhone: '',
      age: '',
      birthday: '',
      inTime: '',
      education: '',
      homeAaddress: '',
      visible: false,
      professionId: '',
      studentName: '',
      studentNum: '',
      studentImg: '',
      sex: 0,
      politicsStatus: '',
      nationId: "1", // 民族
      nativePlace: "", // 籍贯
      phone: '',
      idNum: '',
      collegeId: '',
      areaId: '',
      buildId: '',
      roomId: '',
      bedId: '',
      gradeId: '',
      classId: '',
      parentsArr: [
        {
          parentName: "",
          parentPhone: "",
          parentSex: '',
          relation: "",
          parentIdNumber: ""
        },
        {
          parentName: "",
          parentPhone: "",
          parentSex: '',
          relation: "",
          parentIdNumber: ""
        }
      ],
      studentImgShow: '',
      parentImg1: '', // 家长1
      parentImg1Show: '',
      parentImg2: '', // 家长2
      parentImg2Show: '',
      id: ''
    };
  },
  methods: {
    showPoliticsStatus (num) {
      if (num === 0) {
        return '群众'
      }
      if (num === 1) {
        return '共青团员'
      }
      if (num === 2) {
        return '中共党员'
      }
      if (num === 3) {
        return '其他'
      }
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
    handleOk() {
      this.$emit("okForm", this);
    },
    initData () {
      function getArr(originObj) {
        if (originObj.parentList.length === 2) {

        } else if (originObj.parentList.length === 1) {
          originObj.parentList.push({
            parentName: "",
            parentPhone: "",
            parentSex: null,
            relation: "",
            parentIdNumber: ""
          });
        } else {
          originObj.parentList = [
            {
              parentName: "",
              parentPhone: "",
              parentSex: null,
              relation: "",
              parentIdNumber: ""
            },
            {
              parentName: "",
              parentPhone: "",
              parentSex: null,
              relation: "",
              parentIdNumber: ""
            }
          ];
        }
        return originObj.parentList
      }
      if (this.originObj) {
        const { originObj } = this
        this.id = originObj.id
        this.studentName = originObj.studentName ? originObj.studentName : '';
        this.studentNum = originObj.userNum ? originObj.userNum : '';
        this.sex = originObj.sex ? originObj.sex : '';
        this.politicsStatus = originObj.politicsStatus ? originObj.politicsStatus : '';
        this.nationId = originObj.nation ? originObj.nation : "1"; // 民族
        this.nativePlace = originObj.nativePlace ? originObj.nativePlace : ""; // 籍贯
        this.phone = originObj.phone ? originObj.phone : '';
        this.idNum = originObj.idNum ? originObj.idNum : '';
        this.collegeId = originObj.collegeId ? originObj.collegeId : '';
        this.professionId = originObj.proId ? originObj.proId : '';
        this.gradeId = originObj.gradeId ? originObj.gradeId : '';
        this.classId = originObj.classId ? originObj.classId : '';
        this.areaId = originObj.areaId ? originObj.areaId : '';
        this.buildId = originObj.buildId ? originObj.buildId : '';
        this.roomId = originObj.roomId ? originObj.roomId : '';
        this.bedId = originObj.bedId ? originObj.bedId : '';
        this.idType = originObj.idType ? originObj.idType : '',
        this.guardianPhone = originObj.guardianPhone ? originObj.guardianPhone : '',
        this.age = originObj.age ? originObj.age : '',
        this.birthday = originObj.birthday ? originObj.birthday : '',
        this.inTime = originObj.inTime ? originObj.inTime : '',
        this.education = originObj.education ? originObj.education : '',
        this.homeAaddress = originObj.homeAaddress ? originObj.homeAaddress : '',
        this.marriageStatus = originObj.marriageStatus ? originObj.marriageStatus : '',
        this.country = originObj.country ? originObj.country : '',
        this.parentsArr = getArr(originObj)
        this.studentImgShow = originObj.userPicth ? originObj.userPicth : '';
        this.parentImg1Show = this.parentsArr[0] ? this.parentsArr[0].picture : '';
        this.parentImg2Show = this.parentsArr[1] ? this.parentsArr[1].picture : '';
      }
    },
    cancel () {
      this.$emit("cancel", this);
    }
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible (newVal) {
      this.$emit("cgModal", newVal)
      if (newVal) {
        this.initData()
      }
    },
    visibleContry (newVal) {
      this.visible = newVal
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
</style>
