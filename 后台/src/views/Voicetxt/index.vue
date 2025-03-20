<style lang="scss">
.el-row {
  margin-bottom: 15px;
}
.classify {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
<style>
.addc {
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #b1afaf5d;
  color: #afaeae;
}

.c_item {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.c_ipt {
  height: 40px;
  margin-right: 10px;
}
.c_ipt .el-input__inner {
  height: 40px;
}
.tabs .cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.classifyTA {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  overflow: auto;
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
      height="800"
      class="tabs"
    >
      <el-table-column align="center" label="文本" width="300">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="排序" width="100">
        <template slot-scope="scope">
          {{ scope.row.num }}
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
      :content="Bcontent"
      :visible.sync="AEbl"
      @close="elDC"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item style="width: 50%" label="声音文本" prop="content">
          <el-input
            v-model="form.content"
            placeholder="输入声音文本"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item style="width: 50%" label="排序">
          <el-input v-model="form.num" placeholder="输入数字 "></el-input>
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
import { List, edit, del, count, uploads, create } from "@/api/Voicetxt";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { ElImageViewer },
  data() {
    const validateImage = (rule, value, callback) => {
      // 验证器
      if (this.form.fileList.length == 0) {
        // 为true代表图片在  false报错
        callback(new Error("未添加图片"));
      } else {
        callback();
      }
    };

    return {
      Bcontent: "添加",
      showBig: false,
      listLoading: true,
      list: [],
      showBigImgList: [],
      page: 1,
      limit: 10,
      total: 0,
      page_sizes: [10, 20, 30, 40],
      page_size: 10,
      data: {
        conditions: {},
        projection: {},
        options: {
          sort: {
            num: 1,
          },
        },
      },
      AEbl: false,
      AEindex: 0,
      form: {
        content: "",
        num: 0,
      },
      rules: {
        content: [
          { required: true, message: "未输入声音文本", trigger: "change" },
        ],
      },
      _id: "",
    };
  },
  created(options) {
    this.paging();
  },

  methods: {
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

    async create_Edit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let { content, num } = this.form;
          if (isNaN(Number(num))) {
            num = 0;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          if (this.AEindex == 0) {
            let res = await create({
              data: {
                content,
                num,
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
                content,
                num,
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
      let { _id, content, num } = e;
      this._id = _id;
      this.Bcontent = "编辑";
      this.AEindex = 1;
      this.AEbl = true;
      this.form = {
        content,
        num,
      };
    },
    Add() {
      this.AEbl = true;
      this.AEindex = 0;
      this.Bcontent = "添加";
      this.form = {
        content: "",
        num: 0,
      };
    },
    cancel() {
      this.AEbl = false;
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
        content: "",
        num: 0,
      };
    },
  },
};
</script>
