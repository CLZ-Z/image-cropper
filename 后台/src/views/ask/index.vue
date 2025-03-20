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
.answer {
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
        label="顺序"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.num }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="问题"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
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
        label="类型"
        width="200"
      >
        <template slot-scope="scope">
          {{ TypeList[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="答案"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.answer }}
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

      <!-- <el-table-column
        align="center"
        show-overflow-tooltip
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          {{ stateList[scope.row.state] }}
        </template>
      </el-table-column> -->
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
        <el-form-item label="问题" style="width: 50%" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="提示词" style="width: 50%" prop="prompt">
          <el-input v-model="form.prompt"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="(item, index) in TypeList"
              :key="item"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="答案"
          prop="answer"
          v-if="
            form.type == 1 || form.type == 2 || form.type == 4 || form.type == 5
          "
        >
          <div class="answer">
            <div
              class="i_item"
              v-for="(item, index) in form.answer"
              :key="index"
            >
              <el-input v-model="form.answer[index]"></el-input>
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
        <el-form-item label="顺序" style="width: 50%" prop="">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option
              v-for="(item, index) in stateList"
              :key="item"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
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
import { List, edit, del, count, uploads, create } from "@/api/ask";
// import { Cquery } from "@/api/ask";

import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { ElImageViewer },
  data() {
    const validateanswer = (rule, value, callback) => {
      let f = this.form.answer.filter((item) => item !== "");
      let G = this.form.answer.filter((item) => item === "");
      if (G.length > f.length) {
        callback(new Error("未填写问券答案"));
        return;
      }
      callback();
    };

    return {
      //  "审核中", "未通过"
      TypeList: ["填空", "单选", "多选", "日期", "滑动选择", "多选小栏目"],
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
        answer: [],
        num: 0,
        state: 0,
        type: 0,
        prompt: "",
      },
      rules: {
        answer: [
          { required: true, validator: validateanswer, trigger: "blur" },
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
      //   let res = await Cquery({ conditions: {} });
      //   this.classifyList = res.data;
    },
    IAdd() {
      this.form.answer.push("");
    },
    Idel(e) {
      if (this.form.answer.length <= 1) {
        return;
      }
      this.form.answer.splice(e, 1);
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
          let { title, answer, type, num, state, prompt } = this.form;
          answer = answer.filter((item) => item !== "");
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
                answer,
                num,
                state,
                type,
                prompt,
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
                answer,
                num,
                state,
                type,
                prompt,
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
      let { _id, title, answer, type, num, state, prompt } = e;

      this._id = _id;
      this.Btitle = "编辑";
      this.AEindex = 1;
      this.AEbl = true;
      this.form = {
        title,
        answer,
        num,
        state,
        type,
        prompt,
      };
    },
    Add() {
      this.AEbl = true;
      this.AEindex = 0;
      this.Btitle = "添加";
      this.form = {
        title: "",
        answer: [""],
        num: 0,
        state: 0,
        type: 0,
        prompt: "",
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
        answer: [],
        num: 0,
        state: 0,
        type: 0,
        prompt: "",
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
        answer: [],
        num: 0,
        state: 0,
        type: 0,
        prompt: "",
      };
    },
  },
};
</script>
