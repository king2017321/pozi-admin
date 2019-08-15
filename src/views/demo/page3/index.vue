<template>
  <d2-container>
    <template slot="header">
      消费记录
      <el-button style="float:right" @click="tradeFormVisible=true">新增消费</el-button>
    </template>
    <el-dialog title="新增消费" :visible.sync="tradeFormVisible">
      <el-form :model="tradeForm">
        <el-form-item label="消费人" label-width="120px">
          <el-select v-model="tradeForm.userId" filterable>
            <el-option
              v-for="item in user"
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="userId" label="消费人" :formatter="userFormat"></el-table-column>
      <el-table-column prop="tradeTime" label="消费时间" :formatter="timeFormat"></el-table-column>
      <el-table-column prop="productId" label="商品名称" :formatter="productFormat"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="truePrice" label="成交价格"></el-table-column>
      <el-table-column prop="listId" :formatter="listFormat" label="商品分类"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {
  getToken,
  getProductList,
  getProduct,
  getUser,
  getTrade,
  addTrade
} from "./api";
import { mapState, mapActions } from "vuex";
export default {
  name: "page3",
  data() {
    return {
      tradeFormVisible: false,
      user: [],
      tradeForm: {
        userId: "",
        listId: "",
        productId: "",
        price: "",
        truePrice: "",
        remark: ""
      },
      tableData: [],
      productList: [],
      product: []
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
  async created() {
    await this.loadData();
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
  methods: {
    ...mapActions("d2admin/account", ["getwxToken"]),
    listFormat(row, column, cellValue, index) {
      return this.productList.find(item => item._id == cellValue).name;
    },
    timeFormat(row, column, cellValue, index) {
      return new Date(cellValue).toLocaleString();
    },
    productFormat(row, column, cellValue, index) {
      return this.product.find(item => item._id == cellValue)
        ? this.product.find(item => item._id == cellValue).name
        : "";
    },
    userFormat(row, column, cellValue, index) {
      return this.user.find(item => item._id == cellValue).trueName;
    },
    async loadData() {
      let token;
      if (!this.wxToken) {
        token = await this.getwxToken();
      } else {
        token = this.wxToken;
      }
      let userData = await getUser(token);
      this.user = JSON.parse(userData.resp_data).res.data;
      console.log(this.user);
      let productListData = await getProductList(token);
      this.productList = JSON.parse(productListData.resp_data).res.data;
      let productData = await getProduct(token);
      this.product = JSON.parse(productData.resp_data).res.data;
      let tradeData = await getTrade(token);
      this.tableData = JSON.parse(tradeData.resp_data).res.data;
      console.log(this.tableData);
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
    }
  }
};
</script>
