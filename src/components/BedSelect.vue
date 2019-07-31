<template>
  <a-select
    v-model="bedId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :disabled="disabled"
  >
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in bedArrList"
      :key="item.id + 'bed'"
    >{{item.bedNum}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectRoomList, selectBedByRoomId } = req;
export default {
  name: "ProfessionSelect",
  props: {
    value: {
      type: String
    },
    roomId: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    width: {
      type: String
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
      bedArrList: [],
      bedId: ""
    };
  },
  methods: {
    getBedArrList() {
      const { roomId } = this;
      this.bedId = null;
      if (this.haveAll) {
        this.bedId = "all";
      }
      selectBedByRoomId({
        roomId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.bedArrList = data;
        }
      });
    }
  },
  created() {
    this.getBedArrList();
    this.bedId = this.value;
  },
  watch: {
    roomId() {
      if (this.roomId) {
        this.getBedArrList()
      }
    },
    bedId(newVal, oldVal) {
      if (this.bedId) {
        this.$emit("changeVal", newVal);
      }
    },
    value(newVal) {
      this.bedId = newVal;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
