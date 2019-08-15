<template>
  <d2-container>
    <template slot="header">
      商品列表
      <el-button style="float:right" @click="listFormVisible=true">新增分类</el-button>
      <el-button style="float:right" @click="productFormVisible=true">新增商品</el-button>
    </template>
    <el-dialog title="新增商品分类" :visible.sync="listFormVisible">
      <el-form :model="listForm">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="listForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="listFormVisible=false;listForm={}">取 消</el-button>
        <el-button type="primary" @click="addProductList">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增商品" :visible.sync="productFormVisible">
      <el-form :model="productForm">
        <el-form-item label="商品名称" label-width="120px">
          <el-input v-model="productForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px">
          <el-input v-model="productForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" label-width="120px">
          <el-select v-model="productForm.listId">
            <el-option v-for="item in productList" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productFormVisible=false;productForm={}">取 消</el-button>
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="商品名称" ></el-table-column>
      <el-table-column prop="price" label="商品价格" ></el-table-column>
      <el-table-column prop="listId" :formatter="listFormat" label="商品分类" ></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope" >
          <el-button size="mini" @click="updateProduct(scope.row)">更新</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import{getToken,getProductList,addProductList,updateProductList,getProduct,addProduct,updateProduct} from './api';
import{mapState,mapActions} from 'vuex' 
export default {
  name: "page2",
  data() {
    return {
      listFormVisible:false,
      productFormVisible:false,
      productForm:{},
      listForm:{},
      chargeForm:{},
      tableData: [],
      productList:[],
    };
  },
  computed:{
    ...mapState({
      wxToken:state=>state.d2admin.account.wxToken
    })
  },
  async created(){
    await this.loadData();
  },
  methods:{
    ...mapActions('d2admin/account',['getwxToken']),
    listFormat(row, column, cellValue, index){
      return this.productList.find(item=>item._id==cellValue).name
    },
    async loadData(){
      let token;
     if(!this.wxToken){
        token =await this.getwxToken()
        
      }else{
        token=this.wxToken
      };
      let data=await getProductList(token);
      this.productList=JSON.parse(data.resp_data).res.data;
      let tableData=await getProduct(token);
      this.tableData=JSON.parse(tableData.resp_data).res.data;
      console.log(tableData)
    },
    charge(id){
      this.chargeFormVisible=true;
      this.chargeForm=Object.assign({
        _id:id,token:this.wxToken
      })
    },
    async addProductList(){
      this.listFormVisible=false;
      
      let res;
      if(this.listForm._id){
        res=await updateProductList({...this.listForm,token:this.wxToken})
      }else{
        res=await addProductList({...this.listForm,token:this.wxToken});
      } 
      if(res.errcode==0){
        this.listForm={};
        await this.loadData();
      }
    },
    async addProduct(){
      this.productFormVisible=false;
      
      let res;
      if(this.productForm._id){
        res=await updateProduct({...this.productForm,token:this.wxToken})
      }else{
        res=await addProduct({...this.productForm,token:this.wxToken});
      } 
      if(res.errcode==0){
        this.productForm={};
        await this.loadData();
      }
    },
    updateProduct(row){
      this.productFormVisible=true;
      this.productForm=Object.assign({},this.productForm,{
        _id:row._id,
        name:row.name,
        price:row.price,
        listId:row.listId
      })
    },
    async chargeUser(){
      let res=await chargeUser(this.chargeForm);
      if(res.errcode==0){
        this.chargeFormVisible=false;
        this.chargeForm={};
        await this.loadData();
      }
    }
  }
};
</script>
