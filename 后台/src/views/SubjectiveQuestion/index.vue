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
.subject {
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
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="标题"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="题目"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.subject }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        show-overflow-tooltip
        label="跳转次数"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.frequency }}
        </template>
      </el-table-column> -->
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
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          {{ stateList[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
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
        <el-form-item label="标题" style="width: 50%" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="题目" prop="subject">
          <div class="subject">
            <div
              class="i_item"
              v-for="(item, index) in form.subject"
              :key="index"
            >
              <el-input v-model="form.subject[index]"></el-input>
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
        <el-form-item label="次数" style="width: 50%">
          <el-input v-model="form.frequency"></el-input>
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
import {
  List,
  edit,
  del,
  count,
  uploads,
  create,
} from "@/api/SubjectiveQuestion";
import { Cquery } from "@/api/classify";

import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { ElImageViewer },
  data() {
    const validatesubject = (rule, value, callback) => {
      let f = this.form.subject.filter((item) => item !== "");
      let G = this.form.subject.filter((item) => item === "");
      if (G.length > f.length) {
        callback(new Error("未填写题目"));
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
        title: "",
        subject: [],
        num: 0,
        state: 0,
        frequency: 1,
      },
      rules: {
        subject: [
          { required: true, validator: validatesubject, trigger: "blur" },
        ],
        title: [{ required: true, message: "未填标题", trigger: "blur" }],
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
      this.form.subject.push("");
    },
    Idel(e) {
      if (this.form.subject.length <= 1) {
        return;
      }
      this.form.subject.splice(e, 1);
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
          let { title, subject, num, state, frequency } = this.form;
          subject = subject.filter((item) => item !== "");
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          if (this.AEindex == 0) {
            let res = await create({
              data: {
                title,
                subject,
                num,
                state,
                frequency,
                date: this.date().format("YYYY-MM-DD HH:mm:ss"),
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
          }
          if (this.AEindex == 1) {
            let res = await edit({
              conditions: {
                _id: this._id,
              },
              data: {
                title,
                subject,
                num,
                state,
                frequency,
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
      let { _id, title, subject, num, state, frequency } = e;

      this._id = _id;
      this.Btitle = "编辑";
      this.AEindex = 1;
      this.AEbl = true;
      this.form = {
        title,
        subject,
        num,
        state,
        frequency,
      };
    },
    Add() {
      this.AEbl = true;
      this.AEindex = 0;
      this.Btitle = "添加";
      this.form = {
        title: "",
        subject: [""],
        num: 0,
        state: 0,
        frequency: 1,
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
        title: "",
        subject: [],
        num: 0,
        state: 0,
        frequency: 1,
      };
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
        title: "",
        subject: [],
        num: 0,
        state: 0,
        frequency: 1,
      };
    },
  },
};
</script>
