<style lang="scss">
.el-row {
  margin-bottom: 15px;
}
.TimePeriod {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 20px;
}
.s_ipt {
  width: 26%;
}
.btnS {
  margin-bottom: 10px;
}
.el-input.is-disabled .el-input__inner {
  color: #000;
  background: #fff;
}
.dialog-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
<style>
.Form .el-switch__label.is-active {
  color: #000;
}
</style>
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="头像">
        <el-upload
          class="upload-demo"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handlechange"
          :file-list="form.fileList"
          list-type="picture"
          :auto-upload="false"
          :limit="2"
          action=""
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        style="margin-left: 0px; width: 100px"
        type="primary"
        @click="Edit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { getInfo, edit, uploads } from "@/api/admin";
const Citys = require("../../utils/Citys");
import Tinymce from "../../components/Tinymce";
export default {
  components: { Tinymce },
  data() {
    const validateImage = (rule, value, callback) => {
      // 验证器
      if (this.form.fileList.length == 0) {
        // 为true代表图片在  false报错
        callback(new Error("未添加头像"));
      } else {
        callback();
      }
    };
    return {
      content: "",
      classifyList: ["桌球", "棋牌"],
      Citys: Citys,
      timeValue: "",
      CityList: [],
      sindex: -1,
      checkbl: false,
      Btitle: "添加",
      MTbl: false,
      AEindex: 0,
      _id: "",
      listLoading: true,
      list: [],
      page: 1,
      limit: 10,
      total: 0,
      page_sizes: [10, 20, 30, 40, 50, 100, 200, 300, 400],
      page_size: 10,
      data: { conditions: {}, projection: {}, options: { sort: { date: -1 } } },
      form: {
        pwd: "",
        fileList: [],
        account: "",
        deposit: 0,
        Information: "",
        content: "",
        Notice: "",
      },
      rules: {
        fileList: [
          { required: true, validator: validateImage, trigger: "change" },
        ],
        account: [{ required: true, message: "未填写账号", trigger: "blur" }],
        pwd: [{ required: true, message: "未填写密码", trigger: "blur" }],
      },
      src: "",
    };
  },
  created(options) {
    this.paging();
  },
  // 在父组件中

  methods: {
    provinceC(e) {
      this.CityList = this.Citys[e.index].citys;
      this.form.City = "";
    },

    async Edit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let { pwd, account, deposit, fileList, Notice } = this.form;
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        let img = {};
        if (fileList.length > 0) {
          if (fileList[0].raw) {
            let formData = new FormData();
            formData.append("file", fileList[0].raw);
            let u = await uploads(formData);
            img = u.data;
          } else {
            img = fileList[0];
          }
        }

        let res = await edit({
          conditions: {
            _id: this._id,
          },
          data: {
            pwd,
            account,
            avatar: img,
          },
        });
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.AEbl = false;
          this.paging();
          loading.close();
        } else {
          loading.close();
        }
      });
    },

    check(e) {
      this.checkbl = true;
    },

    async paging() {
      let { data } = this;
      data.conditions._id = this.Cookies.get("yfai");
      let res = await getInfo({ data });
      let { _id, pwd, avatar, account, deposit, Information, Notice } =
        res.data[0];
      this._id = _id;
      this.form = {
        pwd,
        fileList: [],
        account,
      };

      if (avatar) {
        this.form.fileList = [avatar];
      }
    },
    imgbig(e) {
      this.showBig = true;
      this.showBigImgList = [e];
    },
    closeViewer() {
      this.showBig = false;
    },
    handlechange(file, fileList) {
      this.form.fileList = [file];
    },
    handleRemove(file) {
      this.form.fileList = [];
    },
    handlePreview(file, fileList) {
      this.showBig = true;
      this.showBigImgList = [file.url];
    },
  },
};
</script>
