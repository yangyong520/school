<template>
  <a-select
    v-model="roomId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :disabled="disabled">
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in roomListArr"
      :key="item.id + '-room'"
    >{{item.roomNum}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectRoomList } = req;
export default {
  name: "RoomSelect",
  props: {
    value: {
      type: String
    },
    buildId: {
      type: String
    },
    floorNum: {
      default: null
    },
    size: {
      type: String,
      default: "small"
    },
    width: {
      type: String
      // default: "100%"
    },
    haveAll: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roomListArr: [],
      roomId: ""
    };
  },
  methods: {
    getRoomList() {
      const { floorNum, buildId } = this;
      this.roomId = null;
      if (this.haveAll) {
        this.roomId = "all";
      }
      selectRoomList({
        buildId,
        floor: floorNum
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.roomListArr = data;
        }
      });
    }
  },
  computed: {
    getRoomObj() {
      const { roomListArr } = this;
      let obj = {};
      roomListArr.forEach(ele => {
        if (ele.id === this.roomId) {
          obj = ele;
        }
      });
      return obj;
    }
  },
  created() {
    if (this.buildId) {
      this.getRoomList();
    }
    this.roomId = this.value;
  },
  watch: {
    buildId() {
      if (this.buildId) {
        this.getRoomList();
      }
    },
    floorNum() {
      if (this.floorNum) {
        this.getRoomList();
      }
    },
    roomId(newVal, oldVal) {
      if (this.roomId) {
        this.$emit("changeVal", newVal);
      }
    },
    getRoomObj(newVal) {
      this.$emit("getObj", newVal);
    },
    value(newVal) {
      this.roomId = newVal;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
