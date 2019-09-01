<template>
  <d2-container>
    <template slot="header">首页设置</template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="首页轮播图" name="first">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          :action="uploadUrl"
          list-type="picture-card"
          :limit="5"
          :file-list="fileList"
          :http-request="uploadFile"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传图片文件,最多5张,如需更换图片请先点击图片删除按钮之后再上传</div>
        </el-upload>
        <el-divider></el-divider>
        <el-button type="success" size="medium " @click="uploadIndexImage">确定</el-button>
      </el-tab-pane>
      <el-tab-pane label="店铺描述" name="second">
        <editor :catchData="catchDescribe" :content="indexDescribe"/>
        <el-divider></el-divider>
        <el-button type="success" size="medium " @click="uploadIndexDescribe">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import { getUploadPath, getImgUrl, uploadImage, getImage, getDescribe, updateIndexDescribe} from "./api";
import request from "@/plugin/axios";
import { mapState, mapActions } from "vuex";
import editor from '@/components/EditorBar'
let uploadUrl=process.env.NODE_ENV=="development"?'/wxcloud':"https://cos.ap-shanghai.myqcloud.com";
export default {
  name: "page5",
  data() {
    return {
      listFormVisible: false,
      productFormVisible: false,
      productForm: {},
      listForm: {},
      chargeForm: {},
      tableData: [],
      productList: [],
      uploadUrl: "https://api.weixin.qq.com/tcb/uploadfile",
      fileList: [],
      fileListWithId: [],
      activeName: "first",
      indexDescribe: ""
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    listFormat(row, column, cellValue, index) {
      return this.productList.find(item => item._id == cellValue).name;
    },
    catchDescribe(content){
      this.indexDescribe=content;
    },
    async loadData() {
      let token = this.wxToken;
      let data = await getImage({ token });
      let imageIdList = JSON.parse(data.resp_data).res.data.image;
      this.fileListWithId = imageIdList;
      this.indexDescribe=JSON.parse(data.resp_data).res.data.describe;
      console.log(imageIdList);
      let url = await getImgUrl({
        token: this.wxToken,
        fileList: imageIdList
      });
      let urlObject = JSON.parse(url.resp_data);
      console.log(urlObject);
      this.fileList = urlObject.map(val => {
        return { fileID: val.fileID, url: val.tempFileURL };
      });
      // this.productList = JSON.parse(data.resp_data).res.data;
      // let tableData = await getProduct(token);
      // // this.tableData = JSON.parse(tableData.resp_data).res.data;
      // let fileList = JSON.parse(tableData.resp_data).res.data.map(val => {
      //   return (
      //     val.fileId ||
      //     "cloud://fayuandi-v1.6661-fayuandi-v1-1259707861/preview@2x1566761051310.png"
      //   );
      // });
      // let urlDataListJson = await getImgUrl({
      //   token: token,
      //   fileList
      // });
      // let urlDataList = JSON.parse(urlDataListJson.resp_data);
      // this.tableData = JSON.parse(tableData.resp_data).res.data.map(
      //   (val, index) => {
      //     return Object.assign(val, {
      //       imgUrl: urlDataList[index].tempFileURL
      //     });
      //   }
      // );
      // console.log(this.tableData);
    },
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
      this.fileListWithId.push(res.file_id);
      console.log(this.fileListWithId);
      return {fileID:res.file_id}
      // let url=await getImgUrl({
      //   token:this.wxToken,
      //   fileList:[res.file_id]
      // });
      // let urlObject=JSON.parse(url.resp_data)[0];
      // console.log(urlObject.tempFileURL);
    },
    handleRemove(file,fileList) {
      console.log(file,fileList);
      let index=this.fileListWithId.findIndex(val=>val==file.fileID);
      this.fileListWithId.splice(index,1);
      console.log(this.fileListWithId);
    },
    uploadIndexImage() {
      uploadImage({
        token: this.wxToken,
        image: this.fileListWithId
      }).then(res => {
        if(res.errcode==0){
          this.$message({
            message:'更改成功',
            type:'success'
          });
          this.loadData()
        }else{
          this.$message({
            message:'更改失败',
            type:'error'
          })
        }
      });
    },
    uploadIndexDescribe(){
      updateIndexDescribe({
        token:this.wxToken,
        describe:this.indexDescribe
      }).then(res=>{
        if(res.errcode==0){
          this.$message({
            message:'更改成功',
            type:'success'
          });
          this.loadData();
        }else{
          this.$message({
            message:'更改失败',
            type:'error'
          })
        };
        
      })
    }
  }
};
</script>
