<template>
  <d2-container>
    <template slot="header">商品列表
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
        <el-form-item label="预约价格" label-width="120px">
          <el-input v-model="productForm.book" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" label-width="120px">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="uploadUrl"
            list-type="picture"
            :limit="1"
            :on-exceed="handleExcel"	
            :file-list="fileList"
            :http-request="uploadFile"
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传图片文件,如需更换图片请先点击图片删除按钮之后再上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" label-width="120px">
          <el-input v-model="productForm.describe" type="textarea" autosize auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="商品分类" label-width="120px">
          <el-select v-model="productForm.listId">
            <el-option
              v-for="item in productList"
              :key="item._id"
              :value="item._id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productFormVisible=false;productForm={};$refs['upload'].clearFiles();fileList=[]">取 消</el-button>
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" border="" style="width: 100%">
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="book" label="预约价格"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <el-image  style="width: 100px; height: 100px" :src="scope.row.imgUrl" fit="cover">更新</el-image>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="商品描述"></el-table-column>
      <el-table-column prop="listId" :formatter="listFormat" label="商品分类"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="updateProduct(scope.row)">更新</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {
  getToken,
  getProductList,
  addProductList,
  updateProductList,
  getProduct,
  addProduct,
  updateProduct,
  getUploadPath,
  getImgUrl
} from "./api";
import request from '@/plugin/axios';
import { mapState, mapActions } from "vuex";
let uploadUrl=process.env.NODE_ENV=="development"?'/wxcloud':"https://cos.ap-shanghai.myqcloud.com";
export default {
  name: "page9",
  data() {
    return {
      listFormVisible: false,
      productFormVisible: false,
      productForm: {},
      listForm: {},
      chargeForm: {},
      tableData: [],
      productList: [],
      uploadUrl:"https://api.weixin.qq.com/tcb/uploadfile",
      fileList:[]
    };
  },
  computed: {
    ...mapState({
      wxToken: state => state.d2admin.account.wxToken
    })
  },
  async created() {
    await this.loadData();
  },
  methods: {
    ...mapActions("d2admin/account", ["getwxToken"]),
    listFormat(row, column, cellValue, index) {
      return this.productList.find(item => item._id == cellValue).name;
    },
    async loadData() {
      let token = this.wxToken;
      let data = await getProductList(token);
      this.productList = JSON.parse(data.resp_data).res.data;
      let tableData = await getProduct(token);
      // this.tableData = JSON.parse(tableData.resp_data).res.data;
      let fileList=JSON.parse(tableData.resp_data).res.data.map(val=>{
        return val.fileId||"cloud://fayuandi-v1.6661-fayuandi-v1-1259707861/preview@2x1566761051310.png"
      });
      let urlDataListJson=await getImgUrl({
        token:token,
        fileList
      });
      let urlDataList=JSON.parse(urlDataListJson.resp_data);
      this.tableData=JSON.parse(tableData.resp_data).res.data.map((val,index)=>{
        return Object.assign(val,{
          imgUrl:urlDataList[index].tempFileURL
        })
      })
      console.log(this.tableData);
    },
    charge(id) {
      this.chargeFormVisible = true;
      this.chargeForm = Object.assign({
        _id: id,
        token: this.wxToken
      });
    },
    handleExcel(file,fileList){
      
    },
    async uploadFile(content){
      let path=content.file.name.split('.').slice(0,-1).join("")+content.file.uid+"."+content.file.name.split('.').slice(-1)[0];
      let res=await getUploadPath({
        token:this.wxToken,
        path
      });
      console.log(res);
      let formData=new FormData();
      formData.append('key',`${path}`);
      formData.append("Signature",res.authorization);
      formData.append('x-cos-security-token',res.token);
      formData.append('x-cos-meta-fileid',res.cos_file_id);
      formData.append('file',content.file);
      let data=await request({
        url:uploadUrl+res.url.slice(36),
        headers: {
                'Content-Type': 'multipart/form-data'
              },
        data:formData,
        method:'POST'
      });
      // let url=await getImgUrl({
      //   token:this.wxToken,
      //   fileList:[res.file_id]
      // });
      // let urlObject=JSON.parse(url.resp_data)[0];
      // console.log(urlObject.tempFileURL);
      Object.assign(this.productForm,{
        fileId:res.file_id
      })
    },
    async addProductList() {
      this.listFormVisible = false;

      let res;
      if (this.listForm._id) {
        res = await updateProductList({
          ...this.listForm,
          token: this.wxToken
        });
      } else {
        res = await addProductList({ ...this.listForm, token: this.wxToken });
      }
      if (res.errcode == 0) {
        this.listForm = {};
        await this.loadData();
      }
    },
    async addProduct() {
      this.productFormVisible = false;

      let res;
      if (this.productForm._id) {
        res = await updateProduct({ ...this.productForm, token: this.wxToken });
      } else {
        res = await addProduct({ ...this.productForm, token: this.wxToken });
      }
      if (res.errcode == 0) {
        this.productForm = {};
        await this.loadData();
      }
    },
    updateProduct(row) {
      this.productFormVisible = true;
      this.fileList=[{name:'原图片',url:row.imgUrl}],
      this.productForm = Object.assign({}, this.productForm, {
        _id: row._id,
        name: row.name,
        price: row.price,
        listId: row.listId,
        imgUrl:row.imgUrl,
        book:row.book,
        describe:row.describe
      });
    },
    async chargeUser() {
      let res = await chargeUser(this.chargeForm);
      if (res.errcode == 0) {
        this.chargeFormVisible = false;
        this.chargeForm = {};
        await this.loadData();
      }
    }
  }
};
</script>
