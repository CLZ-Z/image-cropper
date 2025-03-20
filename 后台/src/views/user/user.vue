<style lang="scss">
.el-row {
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.TimePeriod {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 700;
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
</style>
<template>
  <div class="app-container">
    <el-row>
      <el-input
        style="width: 200px; margin-right: 20px"
        v-model="ipt"
        placeholder="请输入用户id搜索"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-bottom: 20rpx"
        size="medium"
        @click="search"
        >搜索</el-button
      >
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="650"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="用户id" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.openid }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            @click="imgbig(scope.row.AvatarUrl)"
            style="width: 100px; height: 100px"
            :src="scope.row.AvatarUrl"
          >
            <div
              slot="error"
              class="image-slot"
              style="width: 100px; height: 100px"
            >
              <img
                src="../../../public/imgs/0.png"
                alt=""
                srcset=""
                style="width: 100px; height: 100px"
              />
            </div> </el-image
        ></template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.uname }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column label="地址" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="职业" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.career }}
        </template>
      </el-table-column>
      <el-table-column label="学历" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.qualification }}
        </template>
      </el-table-column>

      <el-table-column label="个性签名" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.signature }}
        </template>
      </el-table-column>
      <el-table-column label="兴趣" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.interest }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="Bedit(scope.row)" type="primary"
            >编辑</el-button
          >
          <el-button size="small" @click="del(scope.row._id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeblur"
      @current-change="handleCurrentblur"
      :current-page="page"
      :page-sizes="page_sizes"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      title="编辑"
      :visible.sync="AEbl"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="2vh"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
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
        <el-form-item label="昵称" prop="uname">
          <el-input v-model="form.uname" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="Citys">
          <el-select
            v-model="form.province"
            @change="provinceC"
            placeholder="请选择省"
          >
            <el-option
              v-for="(item, index) in Citys"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>

          <el-select
            @change="CityT"
            v-model="form.citys"
            placeholder="请选择市"
            style="margin-left: 20px"
          >
            <el-option
              v-for="(item, index) in CityList"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="form.areas"
            placeholder="请选择区"
            style="margin-left: 20px"
          >
            <el-option
              v-for="(item, index) in areasList"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业" prop="career">
          <el-input v-model="form.career" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="qualification">
          <el-input
            v-model="form.qualification"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item label="兴趣" prop="interest">
          <el-input v-model="form.interest"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="create_Edit">确 定</el-button>
      </span>
    </el-dialog>
    <el-image-viewer
      style="z-index: 99999"
      v-if="showBig"
      :on-close="closeViewer"
      :url-list="showBigImgList"
    />
  </div>
</template>

<script>
import { List, edit, del, count, uploads, create } from "@/api/users";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
const Citys = require("../../utils/Citys");

export default {
  components: { ElImageViewer },

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
      Citys: Citys,
      CityList: [],
      areasList: [],
      AEblB: false,
      showBig: false,
      showBigImgList: [],
      StorePage: 1,
      StoreData: {
        conditions: {},
        projection: {},
        options: { sort: {} },
      },
      Storelimit: 10,
      authority: ["admin", "store"],
      Btitle: "添加",
      AEbl: false,
      AEindex: 0,
      _id: "",
      listLoading: true,
      list: [],
      page: 1,
      limit: 10,
      total: 0,
      page_sizes: [10, 20, 30, 40, 50, 100, 200, 300, 400],
      page_size: 10,
      data: {},
      form: {
        fileList: [],
        phone: "",
        uname: "",
        AvatarUrl: "",
        gender: "",
        birthday: "",
        address: [],
        career: "",
        qualification: "",
        signature: "",
        interest: "",
        province: 0,
        citys: 0,
        areas: 0,
      },
      rules: {
        img: [{ required: true, validator: validateImage, trigger: "blur" }],
        uname: [{ required: true, message: "", trigger: "blur" }],
        operation: [
          {
            required: true,
            // validator: validateoperation,
            trigger: "change",
          },
        ],
        ServiceCharge: [
          {
            required: true,
            // validator: validateServiceCharge,
            trigger: "change",
          },
        ],
        CommissionDraw: [
          {
            required: true,
            // validator: validateCommissionDraw,
            trigger: "change",
          },
        ],
      },
      matchingList: [],
      ipt: "",
      sort: { date: -1 },
      selectList: [],
    };
  },
  created(options) {
    this.paging();
  },
  directives: {
    loadmore: {
      inserted(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  methods: {
    CityT(e) {
      this.areasList = this.CityList[e].areas;
      this.form.areas = null;
    },
    provinceC(e) {
      this.CityList = this.Citys[e].cities;
      // this.form.province = e.;
      this.form.citys = null;
      this.form.areas = null;
    },

    batch() {
      if (this.selectList.length == 0) {
        this.$message({
          message: "未选择",
          type: "error",
        });
        return;
      }
      this.AEblB = true;
      // console.log(this.selectList);
      this.form = { ServiceCharge: "", CommissionDraw: "", operation: "" };
    },

    handleSelectionChange(e) {
      if (e.length == 0) {
        this.selectList = [];
        return;
      }
      let id = [];
      for (let i = 0; i < e.length; i++) {
        id.push(e[i]._id);
      }
      this.selectList = id;
    },
    loadMore() {
      this.StorePaging();
    },
    async create_Edit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let {
          uname,
          AvatarUrl,
          gender,
          birthday,
          address,
          career,
          qualification,
          signature,
          interest,
        } = this.form;
        let obj = {
          uname,
          AvatarUrl,
          gender,
          birthday,
          address,
          career,
          qualification,
          signature,
          interest,
        };
        obj.birthday = this.date(birthday).format("YYYY年MM月DD");
        if (address.length > 0) {
          obj.address = [
            this.Citys[this.form.province].name,
            this.Citys[this.form.province].cities[this.form.citys].name,
            this.Citys[this.form.province].cities[this.form.citys].areas[
              this.form.areas
            ],
          ];
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        let res = await edit({
          conditions: { _id: this._id },
          data: { ...obj },
        });
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
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
    async del(e) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await del({
            conditions: {
              _id: e,
            },
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.paging();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    check(e) {
      this.checkbl = true;
      this.TimePeriod = e;
    },

    formatDate(dateStr) {
      console.log(dateStr);
      return dateStr.replace("年", "-").replace("月", "-").replace("日", "-");
    },

    async Bedit(e) {
      let {
        _id,
        phone,
        uname,
        AvatarUrl,
        gender,
        birthday,
        address,
        career,
        qualification,
        signature,
        interest,
      } = e;
      this._id = _id;
      this.Btitle = "编辑";
      this.AEindex = 1;
      this.AEbl = true;
      this.form = {
        fileList: [{ url: AvatarUrl, name: "1.png" }],
        phone,
        uname,
        AvatarUrl,
        gender,
        birthday: this.formatDate(birthday),
        address,
        career,
        qualification,
        signature,
        interest,
        province: null,
        citys: null,
        areas: null,
      };
      if (address.length > 0) {
        let p = this.Citys.findIndex((item) => item.name == address[0]);
        let c = this.Citys[p].cities.findIndex(
          (item) => item.name == address[1]
        );

        let a = this.Citys[p].cities[c].areas.findIndex(
          (item) => item == address[2]
        );

        this.form.province = p;
        this.form.citys = c;
        this.form.areas = a;
        this.CityList = this.Citys[p].cities;
        this.areasList = this.Citys[p].cities[c].areas;
      }

      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    Add() {
      this.AEbl = true;
      this.AEindex = 0;
      this.Btitle = "添加";
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.form = {
        phone: "",
        uname: "",
        AvatarUrl: "",
        gender: "",
        birthday: "",
        address: [],
        career: "",
        qualification: "",
        signature: "",
        interest: "",
      };
    },

    cancel() {
      this.AEbl = false;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.form = {};
    },

    async search() {
      if (this.ipt == "") {
        delete this.data.openid;
        this.list = [];
        this.page = 1;
        await this.paging();
        return;
      }
      this.page = 1;
      this.list = [];
      this.data.openid = this.ipt;
      await this.paging();
    },
    async paging() {
      let { page, limit, data } = this;
      page += 1 - 1;
      let res = await List({ page, limit, data });
      this.list = res.data;
      let total = await count({ data });
      this.total = total.data;
      this.listLoading = false;
    },
    handleSizeblur(e) {
      this.limit = e;
      this.page = 1;
      this.paging();
    },
    handleCurrentblur(e) {
      this.page = e;
      this.paging();
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
