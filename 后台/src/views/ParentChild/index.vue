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
      <el-table-column align="center" label="logo" width="150">
        <template slot-scope="scope">
          <el-image
            @click="imgbig(scope.row.imgs[0])"
            style="width: 100px; height: 100px"
            :src="scope.row.imgs[0]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="封面" width="150">
        <template slot-scope="scope">
          <el-image
            @click="imgbig(scope.row.imgs[1])"
            style="width: 100px; height: 100px"
            :src="scope.row.imgs[1]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="昵称"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.uname }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="智能体昵称"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.Agent.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="人设"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.ask }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        show-overflow-tooltip
        label="秘钥"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.Agent.secret }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="Id"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.Agent.api_id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="对话记录"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.record }}
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
        label="状态"
        width="80"
        fixed="right"
      >
        <template slot-scope="scope">
          {{ stateList[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <div style="flex: 1; display: flex; flex-direction: column">
            <el-button
              v-if="scope.row.state == 0"
              size="small"
              @click="states(scope.row._id, 1, scope.row)"
              type="primary"
              >审核通过</el-button
            >

            <el-button
              v-if="scope.row.state == 1 || scope.row.state == 3"
              style="margin-left: 0; margin-top: 5px"
              size="small"
              @click="states(scope.row._id, 2)"
              type="primary"
              >上线</el-button
            >
            <el-button
              v-if="scope.row.state == 2"
              style="margin-left: 0; margin-top: 5px"
              size="small"
              @click="states(scope.row._id, 3)"
              type="danger"
              >下线</el-button
            >
            <el-button
              v-if="scope.row.state == 0"
              style="margin-left: 0; margin-top: 5px"
              size="small"
              @click="states(scope.row._id, 4)"
              type="danger"
              >未通过</el-button
            >
            <el-button
              style="margin-left: 0; margin-top: 5px"
              size="small"
              @click="states(scope.row._id, 5)"
              type="danger"
              >删除</el-button
            >
          </div>
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
  recordCreate,
} from "@/api/ParentChild";
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
      stateList: ["审核中", "审核通过", "已上线", "已下线", "未通过"],
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
    await this.paging();
  },

  methods: {
    async states(id, index, item) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      if (index == 1) {
        if (item) {
          let obj = {
            openid: item.openid,
            content: `${item.ask[3].content[0]}，最近怎么样呀`,
            chatID: item._id,
            type: 0,
            chatType: 1,
            duration: 0,
            date: this.date().format("YYYY-MM-DD HH:mm:ss"),
          };
          await recordCreate({ data: obj });
        }
        index = 2;
      }
      let res = await edit({
        conditions: {
          _id: id,
        },
        data: {
          state: index,
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
      data = {
        conditions: { state: { $nin: [5] } },
        date: -1,
      };
      let res = await List({ page, limit, data });
      for (let i = 0; i < res.data.length; i++) {
        if (!res.data[i].Agent) {
          res.data[i].Agent = {};
        }
      }
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
