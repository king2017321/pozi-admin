<template>
  <d2-container>
    <template slot="header">会员列表
      <el-button style="float:right" @click="dialogFormVisible=true">新增</el-button>
      <span style="float:right;width:300px;margin-right:20px">
        <el-input v-model="serachPhone">
          <el-button @click="serch" slot="append">手机号搜索</el-button>
        </el-input>
      </span>
    </template>
    <el-dialog title="新增会员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="form.trueName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-select v-model="form.sex" size="medium">
            <el-option value="man" label="男"></el-option>
            <el-option value="woman" label="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级" label-width="120px">
          <el-select v-model="form.vip_level" size="medium">
            <el-option value="normal" label="非会员"></el-option>
            <el-option value="vip" label="普通会员"></el-option>
            <el-option value="superVip" label="至尊vip会员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信用户名" label-width="120px">
          <el-input v-model="form.name" auto-complete="off" placeholder="可在使用小程序时自动绑定"></el-input>
        </el-form-item>
        <el-form-item label="会员卡号" label-width="120px">
          <el-input v-model="form.cardNumber" auto-complete="off" placeholder="会员卡号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false;form={}">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增消费" :visible.sync="tradeFormVisible">
      <el-form :model="tradeForm">
        <el-form-item label="消费人" label-width="120px">
          <el-select v-model="tradeForm.userId" filterable disabled>
            <el-option
              v-for="item in tableData"
              :key="item._id"
              :value="item._id"
              :label="item.trueName"
            >
              <span style="float: left">{{ item.trueName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phone }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" label-width="120px">
          <el-select v-model="tradeForm.listId">
            <el-option
              v-for="item in productList"
              :key="item._id"
              :value="item._id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="120px">
          <el-select v-model="tradeForm.productId">
            <el-option
              v-for="item in productInList"
              :key="item._id"
              :value="item._id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px">
          <el-input v-model="tradeForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="成交价格" label-width="120px">
          <el-input v-model="tradeForm.truePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="tradeForm.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tradeFormVisible=false;tradeForm={}">取 消</el-button>
        <el-button type="primary" @click="addTrade">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="充值" :visible.sync="chargeFormVisible">
      <el-form :model="chargeForm">
        <el-form-item label="充值金额" label-width="120px">
          <el-input v-model="chargeForm.charge" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargeFormVisible=false;chargeForm={}">取 消</el-button>
        <el-button type="primary" @click="chargeUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="费用记录" :visible.sync="feeTabVisible" :before-close="handleTabClose">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="充值记录" name="first">
          <el-table :data="chargeList" border="" style="width: 100%">
            <el-table-column prop="charge" label="充值金额" width="180"></el-table-column>
            <el-table-column
              prop="chargeTime"
              label="充值时间"
              :formatter="(row, column, cellValue, index)=>{return new Date(cellValue).toLocaleString()}"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="消费记录" name="second">
          <el-table :data="tradeList" border="" style="width: 100%">
            <el-table-column prop="userId" label="消费人" :formatter="userFormat"></el-table-column>
            <el-table-column prop="tradeTime" label="消费时间" :formatter="timeFormat"></el-table-column>
            <el-table-column prop="productId" label="商品名称" :formatter="productFormat"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <el-table-column prop="truePrice" label="成交价格"></el-table-column>
            <el-table-column prop="listId" :formatter="listFormat" label="商品分类"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="deleteAndBack(scope.row._id)">删除并回退</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-table :data="tableDataWithSerch" border="" style="width: 100%">
      <el-table-column prop="trueName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="sex" :formatter="sexFormat" label="性别" width="180"></el-table-column>
      <el-table-column
        prop="register_time"
        :formatter="(row, column, cellValue, index)=>{return new Date(cellValue).toLocaleString()}"
        label="注册时间"
        width="180"
      ></el-table-column>
      <el-table-column prop="phone" label="电话" width="180"></el-table-column>
      <el-table-column prop="name" label="微信用户名"></el-table-column>
      <el-table-column prop="money" label="账户余额"></el-table-column>
      <el-table-column prop="cardNumber" label="会员卡号"></el-table-column>
      <el-table-column prop="vip_level" label="会员等级" :formatter="vipFormat"></el-table-column>
      <el-table-column label="操作" width="360">
        <template slot-scope="scope">
          <el-button size="mini" @click="trade(scope.row._id)">新增消费</el-button>
          <el-button size="mini" @click="charge(scope.row._id)">充值</el-button>
          <el-button size="mini" @click="update(scope.row)">更新</el-button>
          <el-button size="mini" @click="getFeeList(scope.row)">费用记录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {
  getToken,
  getUser,
  addUser,
  updateUser,
  chargeUser,
  getCharge,
  getTrade,
  getProductList,
  getProduct,
  addTrade,
  deleteTrade
} from "./api";
import { mapState, mapActions } from "vuex";
export default {
  name: "page1",
  data() {
    return {
      dialogFormVisible: false,
      chargeFormVisible: false,
      tradeFormVisible: false,
      form: {},
      chargeForm: {},
      tradeForm: {},
      tableData: [],
      tableDataWithSerch: [],
      feeTabVisible: false,
      activeName: "first",
      chargeList: [],
      tradeList: [],
      currentId: "",
      productList: [],
      product: [],
      serachPhone: ""
    };
  },
  computed: {
    ...mapState({
      wxToken: state => state.d2admin.account.wxToken
    }),
    productInList() {
      return this.product.filter(item => item.listId == this.tradeForm.listId);
    }
  },
  watch: {
    "tradeForm.productId": {
      handler(newProductId, oldProductId) {
        if (newProductId) {
          this.tradeForm.price = this.product.find(
            item => item._id == newProductId
          ).price;
        }
      }
    }
  },
  async created() {
    await this.loadData();
  },
  methods: {
    ...mapActions("d2admin/account", ["getwxToken"]),
    sexFormat(row, column, cellValue, index) {
      return !cellValue ? "未定义" : cellValue == "man" ? "男" : "女";
    },
    vipFormat(row, column, cellValue, index) {
      return cellValue == "normal"
        ? "非会员"
        : cellValue == "vip"
          ? "普通会员"
          : "至尊vip";
    },
    async loadData() {
      let token = this.wxToken;
      let data = await getUser(token);
      this.tableData = JSON.parse(data.resp_data).res.data;
      this.tableDataWithSerch = this.tableData;
      let productData = await getProduct(token);
      this.product = JSON.parse(productData.resp_data).res.data;
      let productListData = await getProductList(token);
      this.productList = JSON.parse(productListData.resp_data).res.data;
    },
    charge(id) {
      this.chargeFormVisible = true;
      this.chargeForm = Object.assign({
        _id: id,
        token: this.wxToken
      });
    },
    trade(id) {
      this.tradeFormVisible = true;
      this.tradeForm = Object.assign({}, this.tradeForm, {
        userId: id
      });
    },
    async deleteAndBack(id){
      let res=await deleteTrade({
        token:this.wxToken,
        id
      });
      if(res.errcode==0){
        await this.loadData();
      }
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
    handleTabClose(done) {
      this.currentId = "";
      this.activeName = "first";
      this.chargeList = [];
      this.tradeList = [];
      done();
    },
    serch() {
      this.tableDataWithSerch = this.tableData.filter(
        item => (item.phone ? item.phone.indexOf(this.serachPhone) >= 0 : false)
      );
    },
    async add() {
      this.dialogFormVisible = false;

      let res;
      if (this.form._id) {
        res = await updateUser({ ...this.form, token: this.wxToken });
      } else {
        res = await addUser({ ...this.form, token: this.wxToken });
      }
      if (res.errcode == 0) {
        this.form = {};
        await this.loadData();
      }
    },
    update(row) {
      this.dialogFormVisible = true;
      this.form = Object.assign({}, this.form, {
        _id: row._id,
        trueName: row.trueName,
        sex: row.sex,
        phone: row.phone,
        name: row.name,
        vip_level: row.vip_level,
        cardNumber: row.cardNumber
      });
    },
    async chargeUser() {
      let res = await chargeUser(this.chargeForm);
      if (res.errcode == 0) {
        this.chargeFormVisible = false;
        this.chargeForm = {};
        await this.loadData();
      }
    },
    async getFeeList(row) {
      this.feeTabVisible = true;
      this.currentId = row._id;
      await this.getChargeList();
    },
    async getChargeList() {
      let data = await getCharge({
        userId: this.currentId,
        token: this.wxToken
      });
      this.chargeList = JSON.parse(data.resp_data).res.data;
    },
    async getTradeList() {
      let data = await getTrade({
        userId: this.currentId,
        token: this.wxToken
      });
      this.tradeList = JSON.parse(data.resp_data).res.data;
    },
    async handleTabClick(tab, event) {
      if (tab.name == "first") {
        await this.getChargeList();
      } else {
        await this.getTradeList();
      }
    },
    listFormat(row, column, cellValue, index) {
      return this.productList.find(item => item._id == cellValue).name;
    },
    timeFormat(row, column, cellValue, index) {
      return new Date(cellValue).toLocaleString();
    },
    productFormat(row, column, cellValue, index) {
      return this.product.find(item => item._id == cellValue).name;
    },
    userFormat(row, column, cellValue, index) {
      return this.tableData.find(item => item._id == cellValue).trueName;
    }
  }
};
</script>
