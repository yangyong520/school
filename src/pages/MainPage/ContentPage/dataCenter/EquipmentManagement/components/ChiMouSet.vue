<template>
  <a-modal title="编辑" :maskClosable="false" class="modal-box boxBanModal" v-model="visible" @ok="handleOk" okText="确定">
    <div class="ChiMouDivTitle">基础设置</div>
    <div class="ChiMouDiv">
      <div class="ChiMouDivDeailDiv">
        <label>设备名称:</label>
        <a-input size="small" v-model="name" class="input-box-item ChiMouDivInput"/>
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>进出标识:</label>
        <a-select v-model="mark" class="input-select ChiMouDivInput">
          <a-select-option value="0">进</a-select-option>
          <a-select-option value="1">出</a-select-option>
        </a-select>
      </div>
      <div class="ChiMouDivDeailDivW100">
        <label>使用类型:</label>
        <a-select v-model="type" class="input-select ChiMouDivInput">
          <a-select-option value="0">宿舍门禁</a-select-option>
          <a-select-option value="1">访客登记</a-select-option>
        </a-select>
      </div>
      <div class="ChiMouDivDeailDivW100">
        <label>设备位置:</label>
        <area-select
          :value="areaId"
          size="default"
          @changeVal="(val)=>{this.areaId = val}"
          class="input-select ChiMouDivInput"
        />
        <build-select
          :value="buildId"
          @changeVal="val=>{this.buildId = val}"
          :areaId="areaId"
          size="default"
          class="input-select ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDivW100">
        <label></label>
        <a-input-number
          size="small"
          class="input-box-item ChiMouDivInput"
          v-model="door"
          :min="1"
          :max="9"
          placeholder="1~9"
        />号门
        <!-- <a-input-number
          size="small"
          class="input-box-item ChiMouDivInput"
          v-model="passway"
          :min="1"
          :max="9"
          placeholder="号通道(1~9)"
        /> -->
      </div>
      <div class="ChiMouDivDeailDivW100">
        <label>保修时间:</label>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="dateTime"
          class="input-box-item breakDataPicker"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>密码:</label>
        <a-input-number
          size="small"
          placeholder="密码"
          v-model="password"
          class="input-box-item ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>音量:</label>
        <a-input-number
          v-model="volume"
          placeholder="0~100"
          :min="0"
          :max="100"
          size="small"
          class="input-box-item ChiMouDivInput"
        />
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="ChiMouDivTitle">识别设置</div>
    <div class="ChiMouDiv">
      <div class="ChiMouDivDeailDiv">
        <label>检测阈值:</label>
        <a-input-number
          size="small"
          :precision="0"
          :min="0"
          v-model="detection"
          class="input-box-item ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>活体阈值:</label>
        <a-input-number
          size="small"
          :min="0"
          :max="1"
          :precision="2"
          placeholder="0~1"
          v-model="living"
          class="input-box-item ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>识别阈值:</label>
        <a-input-number
          size="small"
          :min="0"
          :max="1"
          :precision="2"
          placeholder="0~1"
          v-model="recognition"
          class="input-box-item ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>检测窗大小:</label>
        <a-input-number
          size="small"
          :precision="0"
          :min="0"
          v-model="detectWindow"
          class="input-box-item ChiMouDivInput"
        />
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>识别间隔:</label>
        <a-input-number
          size="small"
          placeholder="1~36000"
          v-model="identifyGap"
          :min="1"
          :max="36000"
          class="input-box-item ChiMouDivInput"
        />
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="ChiMouDivTitle">门禁设置</div>
    <div class="ChiMouDiv">
      <div class="ChiMouDivDeailDivW100">
        <label>设备运行时间:</label>
        <a-time-picker
          v-model="runStarttime"
          :defaultValue="moment('1995-12-04')"
          placeholder="开始时间"
        ></a-time-picker>
        <a-time-picker
          v-model="runEndtime"
          :defaultValue="moment('1995-12-04 23:59:59')"
          placeholder="结束时间"
        ></a-time-picker>
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>屏幕锁定时间:</label>
        <a-select v-model="freeTime" class="input-select ChiMouDivInput">
          <a-select-option :value="60">1分钟</a-select-option>
          <a-select-option :value="120">2分钟</a-select-option>
          <a-select-option :value="180">3分钟</a-select-option>
          <a-select-option :value="240">4分钟</a-select-option>
          <a-select-option :value="300">5分钟</a-select-option>
          <a-select-option value="never">永不</a-select-option>
        </a-select>
      </div>
      <div class="ChiMouDivDeailDiv">
        <label>开门持续时长:</label>
        <a-select v-model="durationTime" class="input-select ChiMouDivInput">
          <a-select-option :value="1">1秒</a-select-option>
          <a-select-option :value="2">2秒</a-select-option>
          <a-select-option :value="3">3秒</a-select-option>
          <a-select-option :value="4">4秒</a-select-option>
          <a-select-option :value="5">5秒</a-select-option>
          <a-select-option :value="6">6秒</a-select-option>
          <a-select-option :value="7">7秒</a-select-option>
          <a-select-option :value="8">8秒</a-select-option>
          <a-select-option :value="9">9秒</a-select-option>
          <a-select-option :value="10">10秒</a-select-option>
          <a-select-option :value="11">11秒</a-select-option>
          <a-select-option :value="12">12秒</a-select-option>
          <a-select-option :value="13">13秒</a-select-option>
          <a-select-option :value="14">14秒</a-select-option>
          <a-select-option :value="15">15秒</a-select-option>
        </a-select>
      </div>
      <div class="ChiMouDivDeailDivW100">
        <label>访客限制时间:</label>
        <a-time-picker v-model="visitorStarttime" placeholder="开始时间"></a-time-picker>
        <a-time-picker v-model="visitorEndtime" placeholder="结束时间"></a-time-picker>
      </div>
    </div>
    <div class="clearfix"></div>
  </a-modal>
</template>

<script>
import moment from "moment";
export default {
  name: "chi-mou-set",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    initObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      visible: false,

      name: "", // 设备名称
      mark: "", // 进出标识
      type: "", // 使用类型
      buildId: "",
      areaId: "",
      door: "",
      passway: "",
      dateTime: [],
      password: 666666,
      volume: 100,
      detection: 3, // 检测阈值
      recognition: 0.65, // 识别阈值
      living: 0.35, // 活体阈值
      detectWindow: 80, // 检测窗大小
      identifyGap: 10, // 识别间隔
      runStarttime: moment("1995-12-04"), // 运行设备时间
      runEndtime: moment("1995-12-04 23:59:59"), // 运行设备时间
      visitorStarttime: null, // 访客时间
      visitorEndtime: null, // 访客时间
      freeTime: 300, // 屏幕锁定时间
      durationTime: 3 // 开门持续时长
    };
  },
  methods: {
    handleOk() {
      this.$emit("okForm", this);
    },
    initSetObj (obj) {
      this.name = obj.name; // 设备名称
      this.mark = obj.mark; // 进出标识
      this.type = obj.type; // 使用类型
      this.buildId = obj.buildId;
      this.areaId = obj.areaId;
      this.door = obj.door;
      this.passway = obj.passway;
      this.dateTime = [moment(obj.guaranteenStart), moment(obj.guaranteenEnd)];
      this.password = obj.password;
      this.volume = obj.volume;
      this.detection = obj.detection; // 检测阈值
      this.recognition = obj.recognition; // 识别阈值
      this.living = obj.living; // 活体阈值
      this.detectWindow = obj.detectWindow; // 检测窗大小
      this.identifyGap = obj.identifyGgap; // 识别间隔
      this.runStarttime = moment(obj.runStarttime); // 运行设备时间
      this.runEndtime = moment(obj.runEndtime); // 运行设备时间
      this.visitorStarttime = moment(obj.visitorStarttime); // 访客时间
      this.visitorEndtime = moment(obj.visitorEndtime); // 访客时间
      this.freeTime = obj.freeTime; // 屏幕锁定时间
      this.durationTime = obj.durationTime // 开门持续时长
    },
    moment
  },
  created() {
    this.visible = this.visibleContry;
    this.initSetObj(this.initObj)
  },
  watch: {
    visible(newVal) {
      this.$emit("cgModal", newVal);
    },
    visibleContry(newVal) {
      this.visible = newVal;
    },
    initObj(newVal) {
      this.initSetObj(newVal);
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
</style>
