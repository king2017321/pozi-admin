<template>
  <d2-container>
    <template slot="header">发型师列表
      <el-button style="float:right" @click="productFormVisible=true">新增发型师</el-button>
    </template>
    <el-dialog title="新增发型师" :visible.sync="productFormVisible">
      <el-form :model="productForm">
        <el-form-item label="发型师名称" label-width="120px">
          <el-input v-model="productForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="造型价格" label-width="120px">
          <el-input v-model="productForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="预约价格" label-width="120px">
          <el-input v-model="productForm.book" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发型师图片" label-width="120px">
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
        <el-form-item label="发型师描述" label-width="120px">
           <editor :catchData="editorData" :content="productForm.describe"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="productFormVisible=false;productForm={};$refs['upload'].clearFiles();fileList=[]"
        >取 消</el-button>
        <el-button type="primary" @click="addStylist">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" border="" style="width: 100%">
      <el-table-column prop="name" label="发型师"></el-table-column>
      <el-table-column prop="isActive" label="是否离职" :formatter="activeFormat"></el-table-column>
      <el-table-column prop="price" label="造型价格"></el-table-column>
      <el-table-column prop="book" label="预约价格"></el-table-column>
      <el-table-column label="发型师图片">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.imgUrl" fit="cover">更新</el-image>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="发型师描述"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="updateStylist(scope.row)">更新</el-button>
           <el-button size="mini" @click="deleteStylist(scope.row)">设为离职</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {
  getUploadPath,
  getImgUrl,
  getStylist,
  addStylist,
  updateStylist,
  deleteStylist
} from "./api";
import request from "@/plugin/axios";
import { mapState, mapActions } from "vuex";
import editor from '@/components/EditorBar';
let uploadUrl=process.env.NODE_ENV=="development"?'/wxcloud':"https://cos.ap-shanghai.myqcloud.com";
export default {
  name: "page8",
  data() {
    return {
      productFormVisible: false,
      productForm: {},
      tableData: [],
      uploadUrl: "https://api.weixin.qq.com/tcb/uploadfile",
      fileList: []
    };
  },
  components:{
    editor
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
    timeFormat(row, column, cellValue, index) {
      return new Date(cellValue).toLocaleString();
    },
    activeFormat(row, column, cellValue, index){
      return cellValue?'在职':'离职'
    },
    async loadData() {
      let token = this.wxToken;
      let tableData = await getStylist(token);
      // this.tableData = JSON.parse(tableData.resp_data).res.data;
      let fileList = JSON.parse(tableData.resp_data).res.data.map(val => {
        return (
          val.fileId ||
          "cloud://fayuandi-v1.6661-fayuandi-v1-1259707861/preview@2x1566761051310.png"
        );
      });
      let urlDataListJson = await getImgUrl({
        token: token,
        fileList
      });
      let urlDataList = JSON.parse(urlDataListJson.resp_data);
      this.tableData = JSON.parse(tableData.resp_data).res.data.map(
        (val, index) => {
          return Object.assign(val, {
            imgUrl: urlDataList[index].tempFileURL
          });
        }
      );
    },
    handleExcel(file, fileList) {},
    async uploadFile(content) {
      let path =
        content.file.name
          .split(".")
          .slice(0, -1)
          .join("") +
        content.file.uid +
        "." +
        content.file.name.split(".").slice(-1)[0];
      let res = await getUploadPath({
        token: this.wxToken,
        path
      });
      console.log(res);
      let formData = new FormData();
      formData.append("key", `${path}`);
      formData.append("Signature", res.authorization);
      formData.append("x-cos-security-token", res.token);
      formData.append("x-cos-meta-fileid", res.cos_file_id);
      formData.append("file", content.file);
      let data = await request({
        url: uploadUrl + res.url.slice(36),
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: formData,
        method: "POST"
      });
      // let url=await getImgUrl({
      //   token:this.wxToken,
      //   fileList:[res.file_id]
      // });
      // let urlObject=JSON.parse(url.resp_data)[0];
      // console.log(urlObject.tempFileURL);
      Object.assign(this.productForm, {
        fileId: res.file_id
      });
    },
    async addStylist() {
      this.productFormVisible = false;

      let res;
      let data={...this.productForm};
      data.isActive=true;
      if (data._id) {
        res = await updateStylist({ ...data, token: this.wxToken });
      } else {
        res = await addStylist({ ...data, token: this.wxToken });
      }
      if (res.errcode == 0) {
        this.productForm = {};
        await this.loadData();
      }
    },
    updateStylist(row) {
      this.productFormVisible = true;
      (this.fileList = [{ name: "原图片", url: row.imgUrl }]),
        (this.productForm = Object.assign({}, this.productForm, {
          _id: row._id,
          name: row.name,
          imgUrl: row.imgUrl,
          book: row.book,
          describe: row.describe,
          price:row.price
        }));
    },
    async deleteStylist(row){
      let res=await deleteStylist({
        token:this.wxToken,
        id:row._id
      });
      if(res.errcode==0){
        await this.loadData();
      }
    },
    editorData(data){
      Object.assign(this.productForm,{describe:data})
    }
  }
};
</script>
