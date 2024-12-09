<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="账户ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入账户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参考ID，用于关联其他记录或外部数据" prop="refId">
        <el-input
          v-model="queryParams.refId"
          placeholder="请输入参考ID，用于关联其他记录或外部数据"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转出地址" prop="fromAddress">
        <el-input
          v-model="queryParams.fromAddress"
          placeholder="请输入转出地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收地址" prop="toAddress">
        <el-input
          v-model="queryParams.toAddress"
          placeholder="请输入接收地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入交易金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际到账金额" prop="realAmount">
        <el-input
          v-model="queryParams.realAmount"
          placeholder="请输入实际到账金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易手续费" prop="fee">
        <el-input
          v-model="queryParams.fee"
          placeholder="请输入交易手续费"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="币种ID" prop="coinId">
        <el-input
          v-model="queryParams.coinId"
          placeholder="请输入币种ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种名称" prop="coinName">
        <el-input
          v-model="queryParams.coinName"
          placeholder="请输入币种名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['wallet:transaction:add']"
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
          v-hasPermi="['wallet:transaction:edit']"
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
          v-hasPermi="['wallet:transaction:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:transaction:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="账户ID" align="center" prop="accountId" />
      <el-table-column label="参考ID，用于关联其他记录或外部数据" align="center" prop="refId" />
      <el-table-column label="交易类型" align="center" prop="type" />
      <el-table-column label="转出地址" align="center" prop="fromAddress" />
      <el-table-column label="接收地址" align="center" prop="toAddress" />
      <el-table-column label="交易金额" align="center" prop="amount" />
      <el-table-column label="实际到账金额" align="center" prop="realAmount" />
      <el-table-column label="交易手续费" align="center" prop="fee" />
      <el-table-column label="主链类型" align="center" prop="chainType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chain" :value="scope.row.chainType"/>
        </template>
      </el-table-column>
      <el-table-column label="币种ID" align="center" prop="coinId" />
      <el-table-column label="币种名称" align="center" prop="coinName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wallet:transaction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wallet:transaction:remove']"
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

    <!-- 添加或修改账户流水对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账户ID" prop="accountId">
          <el-input v-model="form.accountId" placeholder="请输入账户ID" />
        </el-form-item>
        <el-form-item label="参考ID，用于关联其他记录或外部数据" prop="refId">
          <el-input v-model="form.refId" placeholder="请输入参考ID，用于关联其他记录或外部数据" />
        </el-form-item>
        <el-form-item label="转出地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="请输入转出地址" />
        </el-form-item>
        <el-form-item label="接收地址" prop="toAddress">
          <el-input v-model="form.toAddress" placeholder="请输入接收地址" />
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="实际到账金额" prop="realAmount">
          <el-input v-model="form.realAmount" placeholder="请输入实际到账金额" />
        </el-form-item>
        <el-form-item label="交易手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入交易手续费" />
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
        <el-form-item label="币种ID" prop="coinId">
          <el-input v-model="form.coinId" placeholder="请输入币种ID" />
        </el-form-item>
        <el-form-item label="币种名称" prop="coinName">
          <el-input v-model="form.coinName" placeholder="请输入币种名称" />
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
import { listTransaction, getTransaction, delTransaction, addTransaction, updateTransaction } from "@/api/wallet/transaction";

export default {
  name: "Transaction",
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
      // 账户流水表格数据
      transactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountId: null,
        refId: null,
        type: null,
        fromAddress: null,
        toAddress: null,
        amount: null,
        realAmount: null,
        fee: null,
        chainType: null,
        coinId: null,
        coinName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        accountId: [
          { required: true, message: "账户ID不能为空", trigger: "blur" }
        ],
        refId: [
          { required: true, message: "参考ID，用于关联其他记录或外部数据不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "交易类型不能为空", trigger: "change" }
        ],
        fromAddress: [
          { required: true, message: "转出地址不能为空", trigger: "blur" }
        ],
        toAddress: [
          { required: true, message: "接收地址不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "交易金额不能为空", trigger: "blur" }
        ],
        realAmount: [
          { required: true, message: "实际到账金额不能为空", trigger: "blur" }
        ],
        fee: [
          { required: true, message: "交易手续费不能为空", trigger: "blur" }
        ],
        chainType: [
          { required: true, message: "主链类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询账户流水列表 */
    getList() {
      this.loading = true;
      listTransaction(this.queryParams).then(response => {
        this.transactionList = response.rows;
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
        accountId: null,
        refId: null,
        type: null,
        fromAddress: null,
        toAddress: null,
        amount: null,
        realAmount: null,
        fee: null,
        chainType: null,
        coinId: null,
        coinName: null
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
      this.title = "添加账户流水";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTransaction(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账户流水";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTransaction(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTransaction(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除账户流水编号为"' + ids + '"的数据项？').then(function() {
        return delTransaction(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wallet/transaction/export', {
        ...this.queryParams
      }, `transaction_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
