<template>
  <div class="upload-container">
    <el-button :style="{ background: color, borderColor: color }" icon="el-icon-upload" size="mini" type="primary"
      @click="dialogVisible = true">
      upload
    </el-button>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff",
    },
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        (item) => this.listObj[item].hasSuccess
      );
    },
    handlechange(file, fileList) {
      this.dialogVisible = false;
      console.log(file);
      this.$emit("successCBK", file.url);
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;

  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
