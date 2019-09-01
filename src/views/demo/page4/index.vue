<template>
  <d2-container>
    <template slot="header">未绑定记录</template>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="nickName" label="微信用户名" ></el-table-column>
      <el-table-column prop="phone" label="电话" ></el-table-column>
      <el-table-column prop="trueName" label="真实姓名" ></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope" >
          <el-button size="mini"  @click="updateUserFromWx(scope.row)">确认绑定</el-button>
           <el-button size="mini" @click="deleteUserFromWx(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {
getToken,
getUserFromWx,
updateUserFromWx,
deleteUserFromWx
} from "./api";
import { mapState, mapActions } from "vuex";
export default {
  name: "page4",
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      wxToken: state => state.d2admin.account.wxToken
    }),
  },
  async created() {
    await this.loadData();
  },
  watch: {
    
  },
  methods: {
    ...mapActions("d2admin/account", ["getwxToken"]),
    async loadData() {
      let token= this.wxToken;
      let data=await getUserFromWx(token);
      this.tableData=JSON.parse(data.resp_data).res.data;
    },
    async addTrade() {
      this.tradeFormVisible = false;

      let res;
      res = await addTrade({ ...this.tradeForm, token: this.wxToken });
      if (res.errcode == 0) {
        this.tradeForm = {
          userId: "",
          listId: "",
          productId: "",
          price: "",
          truePrice: "",
          remark: ""
        };
        await this.loadData();
      }
    },
    async updateUserFromWx(row){
      let data=await updateUserFromWx(
        {
          token:this.wxToken,
          _id:row._id
        }
      );
     if(data.errcode==0){
       await this.loadData();
     }
    },
    async deleteUserFromWx(row){
      let data=await deleteUserFromWx(
        {
          token:this.wxToken,
          _id:row._id
        }
      );
     if(data.errcode==0){
       await this.loadData();
     }
    },
  }
};
</script>
