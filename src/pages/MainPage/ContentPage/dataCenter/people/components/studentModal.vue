<template>
  <a-modal :maskClosable="false" title="添加" :okButtonProps="{ props: {disabled: disabledBut} }" v-model="visible" @ok="handleOk" okText="确定" class="modal-box boxBanModal">
    <div class="visible-notes-img">
      <img :src="studentImgShow" alt>
      <upload-com @uploadCom="uploadCom" name="studentImg">
        <div v-if="!studentImgShow" class="uplod-btn">+</div>
      </upload-com>
    </div>
    <div class="studentDiv" style="width: 465px">
      <div class="visibleNotesDeailDiv xinhao">
        <label>姓名:</label>
        <a-input
          v-model="studentName"
          class="boxBanModalInput"
          placeholder="请输入姓名"
        />
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>学号:</label>
        <a-input
          v-model="studentNum"
          class="boxBanModalInput"
          placeholder="请输入学号"
        />
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
          :value="nationId"
          size="default"
          @changeVal="(val)=>{this.nationId = val}"
          class="input-select"
        />
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>籍贯:</label>
        <a-input
          v-model="nativePlace"
          class="input-box-item boxBanModalInput"
          placeholder="请输入籍贯"
        />
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>手机号码:</label>
        <a-input
          v-model="phone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="visibleNotesDeailDiv xinhao">
        <label>身份证号:</label>
        <a-input
          v-model="idNum"
          class="input-box-item boxBanModalInput"
          placeholder="请输入身份证号"
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
        class="input-select-lee"
      />
      <profession-select
        :value="professionId"
        @changeVal="(val)=>{this.professionId = val}"
        :collegeId="collegeId"
        size="default"
        :width="''"
        class="input-select-lee"
      />
      <grade-select
        :value="gradeId"
        @changeVal="(val)=>{this.gradeId = val}"
        size="default"
        :width="''"
        class="input-select-lee"
      />
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
    <p class="studentTitleDiv">家长信息1</p>
    <div class="visible-notes-img">
      <img :src="parentImg1Show" alt>
      <upload-com @uploadCom="uploadCom" name="parentImg1">
        <div v-if="!parentImg1Show" class="uplod-btn">+</div>
      </upload-com>
    </div>
    <div class="studentDiv">
      <div class="visibleNotesDeailDiv">
        <label>姓名:</label>
        <a-input
          v-model="parentsArr[0].parentName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入姓名"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>电话:</label>
        <a-input
          v-model="parentsArr[0].parentPhone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入电话"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>关系:</label>
        <a-input
          v-model="parentsArr[0].relation"
          class="input-box-item boxBanModalInput"
          placeholder="请输入关系"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>性别:</label>
        <a-select v-model="parentsArr[0].parentSex" class="input-select">
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </div>
      <div class="studentDivInput">
        <label>身份证号:</label>
        <a-input
          v-model="parentsArr[0].parentIdNumber"
          class="input-box-item boxBanModalInput"
          placeholder="请输入身份证号"
        />
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="border_eeeMtB10"></div>
    <p class="studentTitleDiv">家长信息2</p>
    <div class="visible-notes-img">
      <img :src="parentImg2Show" alt>
      <upload-com @uploadCom="uploadCom" name="parentImg2">
        <div v-if="!parentImg2Show" class="uplod-btn">+</div>
      </upload-com>
    </div>
    <div class="studentDiv">
      <div class="visibleNotesDeailDiv">
        <label>姓名:</label>
        <a-input
          v-model="parentsArr[1].parentName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入姓名"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>电话:</label>
        <a-input
          v-model="parentsArr[1].parentPhone"
          class="input-box-item boxBanModalInput"
          placeholder="请输入电话"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>关系:</label>
        <a-input
          v-model="parentsArr[1].relation"
          class="input-box-item boxBanModalInput"
          placeholder="请输入关系"
        />
      </div>
      <div class="visibleNotesDeailDiv">
        <label>性别:</label>
        <a-select v-model="parentsArr[1].parentSex" class="input-select">
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </div>
      <div class="studentDivInput">
        <label>身份证号:</label>
        <a-input
          v-model="parentsArr[1].parentIdNumber"
          class="input-box-item boxBanModalInput"
          placeholder="请输入身份证号"
        />
      </div>
    </div>
    <div class="clearfix"></div>
  </a-modal>
</template>

<script>
import req from "@/req/req";
import { setTimeout } from "timers";
import { type } from "os";
const { selectMzList } = req;
export default {
  name: "studentModal",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    originObj: {
      type: Object
    },
    disabledBut: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      professionId: null,
      studentName: null,
      studentNum: null,
      studentImg: null,
      sex: 0,
      politicsStatus: 0,
      nationId: "1", // 民族
      nativePlace: "", // 籍贯
      phone: null,
      idNum: null,
      collegeId: null,
      areaId: null,
      buildId: null,
      roomId: null,
      bedId: null,
      gradeId: null,
      classId: null,
      parentsArr: [
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
      ],
      studentImgShow: null,
      parentImg1: null, // 家长1
      parentImg1Show: null,
      parentImg2: null, // 家长2
      parentImg2Show: null
    };
  },
  methods: {
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
    }
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible (newVal) {
      this.$emit("cgModal", newVal);
    },
    visibleContry (newVal) {
      this.visible = newVal
      if (!this.visible) {
        this.professionId = ''
        this.studentName = ''
        this.studentNum = ''
        this.studentImg = ''
        this.sex = 0
        this.politicsStatus = 0
        this.nationId = '1'
        this.nativePlace = ''
        this.phone = ''
        this.idNum = ''
        this.collegeId = ''
        this.areaId = ''
        this.buildId = ''
        this.roomId = ''
        this.bedId = ''
        this.gradeId = ''
        this.classId = ''
        this.parentsArr = [
          {
            parentName: '',
            parentPhone: '',
            parentSex: '',
            relation: '',
            parentIdNumber: ''
          },
          {
            parentName: '',
            parentPhone: '',
            parentSex: '',
            relation: '',
            parentIdNumber: ''
          }
        ]
        this.studentImgShow = '',
        this.parentImg1 = '', // 家长1
        this.parentImg1Show = '',
        this.parentImg2 = '', // 家长2
        this.parentImg2Show = ''
      }
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
