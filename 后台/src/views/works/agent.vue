<style lang="scss">
.el-row {
  margin-bottom: 15px;
}
.type {
  width: 30%;
  display: flex;
  flex-direction: column;
  .t_i {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
  }
}
.introduce {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .i_item {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
<template>
  <div class="app-container">
    <el-row>
      <el-button
        type="primary"
        icon="el-icon-edit"
        style="margin-bottom: 20rpx"
        size="medium"
        @click="Add"
        >添加</el-button
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
    >
      <el-table-column align="center" label="封面" width="300">
        <template slot-scope="scope">
          <el-image
            @click="imgbig(scope.row.img.url)"
            style="width: 100px; height: 100px"
            :src="scope.row.img.url"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="姓名"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.uname }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="介紹"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.introduce }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="秘钥"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.secretKey }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="Id"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.Id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="提示词"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.prompt }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="第一句话"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.Cdefault }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="频道"
        width="120"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in classifyList" :key="index">
            <div v-if="item._id == scope.row.classifyID">{{ item.title }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="更新时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.updatetime }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="状态"
        width="80"
        fixed="right"
      >
        <template slot-scope="scope">
          {{ stateList[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="page_sizes"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :close-on-click-modal="false"
      :title="Btitle"
      :visible.sync="AEbl"
      @close="elDC"
      top="5vh"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="封面" prop="img">
          <el-upload
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handlechange"
            :file-list="form.img"
            list-type="picture"
            :auto-upload="false"
            :limit="2"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" style="width: 50%" prop="uname">
          <el-input v-model="form.uname"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <div class="introduce">
            <div
              class="i_item"
              v-for="(item, index) in form.introduce"
              :key="index"
            >
              <el-input v-model="form.introduce[index]"></el-input>
              <el-button
                @click="Idel(index)"
                type="danger"
                style="margin-left: 20px"
                icon="el-icon-delete"
                circle
              ></el-button>
            </div>
          </div>
          <el-button type="primary" size="small" plain @click="IAdd"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item label="秘钥" prop="secretKey">
          <el-input v-model="form.secretKey"></el-input>
        </el-form-item>
        <el-form-item label="Id" prop="Id">
          <el-input v-model="form.Id"></el-input>
        </el-form-item>
        <el-form-item label="提示词" prop="prompt">
          <el-input v-model="form.prompt"></el-input>
        </el-form-item>
        <el-form-item label="第一句话" prop="Cdefault">
          <el-input v-model="form.Cdefault"></el-input>
        </el-form-item>
        <el-form-item label="频道" prop="classifyID">
          <el-select v-model="form.classifyID" placeholder="请选择">
            <el-option
              v-for="(item, index) in classifyList"
              :key="index"
              :label="item.title"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option
              v-for="(item, index) in stateList"
              :key="item"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="create_Edit">确 定</el-button>
      </div>
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
import { List, edit, del, count, uploads, create } from "@/api/works";
import { Cquery } from "@/api/classify";

import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { ElImageViewer },
  data() {
    const validateImage = (rule, value, callback) => {
      // 验证器
      if (this.form.img.length == 0) {
        // 为true代表图片在  false报错
        callback(new Error("未添加封面"));
      } else {
        callback();
      }
    };
    const validateintroduce = (rule, value, callback) => {
      let f = this.form.introduce.filter((item) => item !== "");
      let G = this.form.introduce.filter((item) => item === "");
      if (G.length > f.length) {
        callback(new Error("未填写介绍"));
        return;
      }
      callback();
    };

    return {
      //  "审核中", "未通过"
      stateList: ["上架", "下架"],
      Btitle: "添加",
      showBig: false,
      listLoading: true,
      list: [],
      showBigImgList: [],
      page: 1,
      limit: 10,
      total: 0,
      page_sizes: [10, 20, 30, 40, 50, 100, 200, 300, 400],
      page_size: 10,
      data: { conditions: {}, projection: {}, options: {} },
      AEbl: false,
      AEindex: 0,
      form: {
        img: [],
        introduce: [],
        secretKey: "",
        Id: "",
        url: {},
        type: 0,
        agentType: 0,
        prompt: "",
        state: 0,
        Cdefault: "",
        classifyID: "",
        uname: "",
      },
      rules: {
        classifyID: [
          { required: true, message: "未选择频道", trigger: "blur" },
        ],
        img: [{ required: true, validator: validateImage, trigger: "blur" }],
        introduce: [
          { required: true, validator: validateintroduce, trigger: "blur" },
        ],
        Cdefault: [{ required: true, message: "未填写秘钥", trigger: "blur" }],
        secretKey: [{ required: true, message: "未填写秘钥", trigger: "blur" }],
        Id: [{ required: true, message: "未填写Id", trigger: "blur" }],
        title: [{ required: true, message: "未填群组标题", trigger: "blur" }],
        uname: [{ required: true, message: "未填写姓名", trigger: "blur" }],
      },
      _id: "",
      classifyList: [],
    };
  },
  async created(options) {
    await this.classify();
    await this.paging();
  },

  methods: {
    async classify() {
      let res = await Cquery({ conditions: {} });
      this.classifyList = res.data;
    },
    IAdd() {
      this.form.introduce.push("");
    },
    Idel(e) {
      if (this.form.introduce.length <= 1) {
        return;
      }
      this.form.introduce.splice(e, 1);
    },
    TDel(e) {
      this.form.typeList.splice(e, 1);
    },
    Tadd() {
      console.log(this.form.typeList);

      this.form.typeList = this.form.typeList.concat("");
    },
    async create_Edit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let {
            img,
            introduce,
            secretKey,
            type,
            agentType,
            prompt,
            state,
            url,
            Cdefault,
            Id,
            classifyID,
            uname,
          } = this.form;
          introduce = introduce.filter((item) => item !== "");
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          if (this.AEindex == 0) {
            let formData = new FormData();
            formData.append("image", img[0].raw);
            let u = await uploads(formData);
            if (u.code == 0) {
              let res = await create({
                data: {
                  img: u.data,
                  introduce,
                  secretKey,
                  type,
                  agentType,
                  prompt,
                  state,
                  url,
                  num: 0,
                  Playcount: 0,
                  phone: "",
                  date: this.date().format("YYYY-MM-DD HH:mm:ss"),
                  Cdefault,
                  Id,
                  classifyID,
                  uname,
                },
              });
              if (res.code == 0) {
                this.AEbl = false;
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.page = 1;
                this.paging();
                loading.close();
              } else {
                loading.close();
                this.$message.error("保存失败");
              }
            } else {
              loading.close();
              this.$message.error("保存失败");
            }
          }
          if (this.AEindex == 1) {
            let imgs = img[0];
            let u = {};
            if (imgs.raw) {
              let formData = new FormData();
              formData.append("image", imgs.raw);
              u = await uploads(formData);
              imgs = u.data;
            } else {
              u.code = 0;
            }
            if (u.code == 0) {
              let res = await edit({
                conditions: {
                  _id: this._id,
                },
                data: {
                  img: imgs,
                  introduce,
                  secretKey,
                  type,
                  agentType,
                  prompt,
                  state,
                  updatetime: this.date().format("YYYY-MM-DD HH:mm:ss"),
                  Cdefault,
                  Id,
                  classifyID,
                  uname,
                },
              });
              if (res.code == 0) {
                this.AEbl = false;
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.page = 1;
                this.paging();
                loading.close();
              } else {
                loading.close();
                this.$message.error("保存失败");
              }
            } else {
              loading.close();
              this.$message.error("保存失败");
            }
          }
        }
      });
    },
    async del(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
    async Bedit(e) {
      let {
        img,
        introduce,
        _id,
        secretKey,
        type,
        agentType,
        prompt,
        state,
        url,
        Cdefault,
        Id,
        classifyID,
        uname,
      } = e;

      this._id = _id;
      this.Btitle = "编辑";
      this.AEindex = 1;
      this.AEbl = true;
      this.form = {
        uname,
        img: [img],
        introduce,
        secretKey,
        type,
        agentType,
        prompt,
        state,
        url,
        Cdefault,
        Id,
        classifyID,
      };
    },
    Add() {
      this.AEbl = true;
      this.AEindex = 0;
      this.Btitle = "添加";
      this.form = {
        img: [],
        introduce: [""],
        secretKey: "",
        Id: "",
        url: {},
        type: 0,
        agentType: 0,
        prompt: "",
        state: 0,
        Cdefault: "",
        classifyID: "",
      };
    },
    imgbig(e) {
      this.showBig = true;
      this.showBigImgList = [e];
    },
    closeViewer() {
      this.showBig = false;
    },
    handlechange(file, img) {
      this.form.img = [file];
    },
    handleRemove(file) {
      this.form.img = [];
    },
    handlePreview(file, img) {
      this.showBig = true;
      this.showBigImgList = [file.url];
    },
    cancel() {
      this.AEbl = false;
      this.form = {
        img: [],
        introduce: [],
        secretKey: "",
        Id: "",
        url: {},
        type: 0,
        agentType: 0,
        prompt: "",
        state: 0,
        Cdefault: "",
        classifyID: "",
        uname: "",
      };
    },

    async paging() {
      let { page, limit, data } = this;
      page += 1 - 1;
      data.conditions.type = 0;
      let res = await List({ page, limit, data });
      this.list = res.data;
      let total = await count({ data });
      this.total = total.data;
      this.listLoading = false;
    },
    handleSizeChange(e) {
      this.limit = e;
      this.page = 1;
      this.paging();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.paging();
    },
    elDC() {
      this.AEbl = false;
      this.form = {
        img: [],
        introduce: [],
        secretKey: "",
        Id: "",
        url: {},
        type: 0,
        agentType: 0,
        prompt: "",
        state: 0,
        Cdefault: "",
        classifyID: "",
        uname: "",
      };
    },
  },
};
</script>
