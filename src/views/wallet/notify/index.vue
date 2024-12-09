<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="Notification Target URL" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入Notification Target URL"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Error Count" prop="errorCount">
        <el-input
          v-model="queryParams.errorCount"
          placeholder="请输入Error Count"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Creation Time" prop="ctime">
        <el-date-picker clearable
          v-model="queryParams.ctime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择Creation Time">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Last Modification Time" prop="mtime">
        <el-date-picker clearable
          v-model="queryParams.mtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择Last Modification Time">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="主链类型" prop="chainType">
        <el-select v-model="queryParams.chainType" placeholder="请选择主链类型" clearable>
          <el-option
            v-for="dict in dict.type.chain"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wallet:notify:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wallet:notify:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wallet:notify:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:notify:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="notifyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="Application Type" align="center" prop="applicationType" />
      <el-table-column label="Parameters" align="center" prop="params" />
      <el-table-column label="Notification Target URL" align="center" prop="url" />
      <el-table-column label="Status: 0 - Notification, 1 - Success, 2 - Exception, 3 - Exception Terminated" align="center" prop="status" />
      <el-table-column label="Error Count" align="center" prop="errorCount" />
      <el-table-column label="Result or Error Message" align="center" prop="message" />
      <el-table-column label="Creation Time" align="center" prop="ctime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ctime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Modification Time" align="center" prop="mtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主链类型" align="center" prop="chainType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chain" :value="scope.row.chainType"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wallet:notify:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wallet:notify:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改通知对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Parameters" prop="params">
          <el-input v-model="form.params" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="Notification Target URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入Notification Target URL" />
        </el-form-item>
        <el-form-item label="Error Count" prop="errorCount">
          <el-input v-model="form.errorCount" placeholder="请输入Error Count" />
        </el-form-item>
        <el-form-item label="Result or Error Message" prop="message">
          <el-input v-model="form.message" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="Creation Time" prop="ctime">
          <el-date-picker clearable
            v-model="form.ctime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择Creation Time">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Last Modification Time" prop="mtime">
          <el-date-picker clearable
            v-model="form.mtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择Last Modification Time">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主链类型" prop="chainType">
          <el-select v-model="form.chainType" placeholder="请选择主链类型">
            <el-option
              v-for="dict in dict.type.chain"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotify, getNotify, delNotify, addNotify, updateNotify } from "@/api/wallet/notify";

export default {
  name: "Notify",
  dicts: ['chain'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 通知表格数据
      notifyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applicationType: null,
        params: null,
        url: null,
        status: null,
        errorCount: null,
        message: null,
        ctime: null,
        mtime: null,
        chainType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applicationType: [
          { required: true, message: "Application Type不能为空", trigger: "change" }
        ],
        url: [
          { required: true, message: "Notification Target URL不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "Status: 0 - Notification, 1 - Success, 2 - Exception, 3 - Exception Terminated不能为空", trigger: "change" }
        ],
        errorCount: [
          { required: true, message: "Error Count不能为空", trigger: "blur" }
        ],
        ctime: [
          { required: true, message: "Creation Time不能为空", trigger: "blur" }
        ],
        mtime: [
          { required: true, message: "Last Modification Time不能为空", trigger: "blur" }
        ],
        chainType: [
          { required: true, message: "主链类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询通知列表 */
    getList() {
      this.loading = true;
      listNotify(this.queryParams).then(response => {
        this.notifyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        applicationType: null,
        params: null,
        url: null,
        status: null,
        errorCount: null,
        message: null,
        ctime: null,
        mtime: null,
        chainType: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNotify(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改通知";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNotify(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotify(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除通知编号为"' + ids + '"的数据项？').then(function() {
        return delNotify(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wallet/notify/export', {
        ...this.queryParams
      }, `notify_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
