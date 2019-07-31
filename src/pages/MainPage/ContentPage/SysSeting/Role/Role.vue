<template>
  <div class="Role">
    <Title title="角色管理"/>
    <a-spin :spinning="spinningTable">
      <a-table
        class="roleTable"
        rowKey="id"
        :columns="columns"
        :dataSource="roleList"
        :pagination="false"
      />
    </a-spin>
    <a-modal
      :maskClosable="false"
      title="权限分析"
      :columnWidth="200"
      v-model="visibleAttendance"
      @ok="updataRemark"
      okText="确定"
      class="modal-box">
      <ul>
        <li>
          <span>角色名：</span>
          <span>{{roleNameShow}}</span>
        </li>
        <li>
          <span style="display: inline-block;width: 5em">角色描述：</span>
          <a-textarea placeholder="请描述" v-model="remark" :rows="4"/>
        </li>
      </ul>
    </a-modal>

    <RoleAuthority
      @okForm="setAuthorye"
      @cgModal="(visible)=>{this.visibleRoleSet = visible}"
      :visibleContry="visibleRoleSet"
      :moduleList="moduleList"
      :spinning="spinning"
    />
  </div>
</template>

<script>
import RoleAuthority from "./RoleAuthority";
import req from "@/req/req";
import { mapMutations } from "vuex";
const {
  getSystemRoleList,
  getRoleModuleList,
  editRoleModule,
  editDescribe
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "Role",
  mixins: [roleControlBtnMixin],
  components: {
    RoleAuthority
  },
  data() {
    return {
      roleName: "角色管理",

      columns: [
        {
          title: "角色名称",
          dataIndex: "roleName"
        },
        {
          title: "角色描述",
          dataIndex: "remark"
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                <span
                  onClick={() => {
                    this.remark = record.remark || "";
                    this.roleNameShow = record.roleName;
                    this.updataRemarkId = record.id;
                    this.visibleAttendance = !this.visibleAttendance;
                  }}
                >
                  查看
                </span>
                {this.roleDataObj.isPermission ? (
                  <span
                    onClick={() => {
                      this.getModList(record.id);
                    }}
                  >
                    权限设置
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          }
        }
      ],
      visibleAttendance: false,
      visibleRoleSet: false,
      roleList: [],
      remark: "",
      moduleList: [{}],
      spinning: false,
      roleNameShow: "",
      updataRemarkId: null,
      spinningTable: false
    };
  },
  methods: {
    updataRemark() {
      const { remark, updataRemarkId, getSysList,$message } = this
      this.spinningTable = true
      editDescribe({
        id: updataRemarkId,
        remark
      }).then(({ data: { code, msg} }) => {
        this.spinningTable = false
        if(code === 0){
          getSysList()
          this.visibleAttendance = false
          $message.success(msg)
        }
      },()=>{
        this.spinningTable = false
      })
    },
    getAuthoryeArr(arr, arrSend) {
      const { getAuthoryeArr } = this;
      arr.forEach(ele => {
        if (!ele.childrenList || ele.childrenList.length === 0) {
          let obj = {};
          obj.id = ele.id;
          obj.roleId = ele.roleId;
          obj.moduleId = ele.moduleId;
          for (let key in ele) {
            if (key.indexOf("Str") !== -1) {
              let str = key.replace("Str", "");
              obj[str] = ele[str];
            }
          }
          arrSend.push(obj);
        } else {
          getAuthoryeArr(ele.childrenList, arrSend);
        }
      });
    },
    setAuthorye(arr) {
      const { moduleList, getAuthoryeArr } = this;
      const arrSend = [];
      getAuthoryeArr(moduleList, arrSend);
      editRoleModule(arrSend).then(({ data: { code, msg } }) => {
        const { $message } = this;
        if (code === 0) {
          $message.success(msg);
          this.visibleRoleSet = false;
        } else {
          $message.warning(msg);
        }
      });
    },
    getModList(id) {
      this.visibleRoleSet = !this.visibleRoleSet;
      this.spinning = true;
      getRoleModuleList({
        roleId: id
      }).then(({ data: { code, data, msg } }) => {
        this.spinning = false;
        if (code === 0) {
          this.moduleList = data;
        }
      });
    },
    getSysList() {
      getSystemRoleList().then(({ data: { code, data, msg } }) => {
        const { $message } = this;
        if (code === 0) {
          this.roleList = data;
        } else {
          $message.warning(msg);
        }
      });
    }
  },
  created() {
    this.getSysList();
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.roleTable {
  margin-top: 10px;
}
</style>
