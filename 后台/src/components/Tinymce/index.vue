<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <el-upload
        :multiple="true"
        :file-list="TfileList"
        :show-file-list="false"
        :on-success="Thandlesuccess"
        action="https://xcx.snowater.cn/UDD/upload"
        list-type="picture"
      >
        <el-button size="small" type="primary">上传图片 </el-button>
      </el-upload>
    </div>
  </div>
</template>
<script>
import editorImage from "./components/EditorImage";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";

const tinymceCDN = "https://cdn.staticfile.org/tinymce/4.9.3/tinymce.min.js";

export default {
  name: "Tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "tinymce" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    flags: {
      type: Boolean,
      default: "",
    },

    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
      TfileList: [],
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        return `${width}px`;
      }
      return width;
    },
  },
  watch: {
    flags(e) {
      console.log(e);

      if (e) {
        this.setContent(this.value);
      }
    },
    value(val) {
      if (val == "") {
        window.tinymce.get(this.tinymceId).setContent(val || "");
      }
    },
  },
  async mounted() {
    await this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    async Thandlesuccess(file, fileList) {
      this.dialogVisible = false;
      let path = file.data.url;
      this.imageSuccessCBK(path);
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file);
        //开始转
        reader.onload = function () {
          fileResult = reader.result;
        };
        //转 失败
        reader.onerror = function (error) {
          reject(error);
        };
        //转 结束  咱就 resolve 出去
        reader.onloadend = function () {
          resolve(fileResult);
        };
      });
    },

    init() {
      load(tinymceCDN, (err) => {
        this.initTinymce();
      });
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList["zh"],
        language_url: require("./zh_CN"),
        height: this.height,
        body_class: "panel-body",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: false,
        plugins: plugins,
        end_container_on_empty_block: true,
        paste_data_images: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        default_link_target: "_blank",
        link_title: false,
        placeholder: "开始编写吧", // 占位符
        branding: false, // 关闭底部官网提示 默认true
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_size: 16,
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        nonbreaking_force_tab: true,
        content_style: `
        body {font-size: 16px;}
        p { margin: 0; padding: 0;  font-family: 'Microsoft YaHei', sans-serif; }
      `, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("Change", (e) => {
            _this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("init", (e) => {
            _this.fullscreen = e.state;
          });
        },
        convert_urls: false,
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }
      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
      window.tinymce.activeEditor.selection.select(
        window.tinymce.activeEditor.getBody(),
        true
      );
      window.tinymce.activeEditor.selection.collapse(false);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(v) {
      window.tinymce
        .get(this.tinymceId)
        .insertContent(`<img style="width:100%" src="${v}" >`);
    },
  },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
  z-index: 9999;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
