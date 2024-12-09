<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="bizId" prop="bizId">
        <el-input
          v-model="queryParams.bizId"
          placeholder="请输入bizId"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入提现地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入提现金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合约地址" prop="contract">
        <el-input
          v-model="queryParams.contract"
          placeholder="请输入合约地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易哈希" prop="hash">
        <el-input
          v-model="queryParams.hash"
          placeholder="请输入交易哈希"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="ctime">
        <el-date-picker clearable
          v-model="queryParams.ctime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="mtime">
        <el-date-picker clearable
          v-model="queryParams.mtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
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
          v-hasPermi="['wallet:withdraw:add']"
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
          v-hasPermi="['wallet:withdraw:edit']"
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
          v-hasPermi="['wallet:withdraw:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:withdraw:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="交易类型：0-主链币交易，1-代币交易" align="center" prop="transactionType" />
      <el-table-column label="bizId" align="center" prop="bizId" />
      <el-table-column label="提现地址" align="center" prop="address" />
      <el-table-column label="提现金额" align="center" prop="amount" />
      <el-table-column label="合约地址" align="center" prop="contract" />
      <el-table-column label="交易哈希" align="center" prop="hash" />
      <el-table-column label="状态：0-刚入库，1-上链" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="ctime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ctime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="mtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主链类型" align="center" prop="chainType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chain" :value="scope.row.chainType"/>
        </template>
      </el-table-column>
      <el-table-column label="币种名称" align="center" prop="coinName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wallet:withdraw:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wallet:withdraw:remove']"
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

    <!-- 添加或修改提现对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="bizId" prop="bizId">
          <el-input v-model="form.bizId" placeholder="请输入bizId" />
        </el-form-item>
        <el-form-item label="提现地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入提现地址" />
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入提现金额" />
        </el-form-item>
        <el-form-item label="合约地址" prop="contract">
          <el-input v-model="form.contract" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="交易哈希" prop="hash">
          <el-input v-model="form.hash" placeholder="请输入交易哈希" />
        </el-form-item>
        <el-form-item label="创建时间" prop="ctime">
          <el-date-picker clearable
            v-model="form.ctime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="mtime">
          <el-date-picker clearable
            v-model="form.mtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间">
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
import { listWithdraw, getWithdraw, delWithdraw, addWithdraw, updateWithdraw } from "@/api/wallet/withdraw";

export default {
  name: "Withdraw",
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
      // 提现表格数据
      withdrawList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transactionType: null,
        bizId: null,
        address: null,
        amount: null,
        contract: null,
        hash: null,
        status: null,
        ctime: null,
        mtime: null,
        chainType: null,
        coinName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        transactionType: [
          { required: true, message: "交易类型：0-主链币交易，1-代币交易不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "提现地址不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "提现金额不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态：0-刚入库，1-上链不能为空", trigger: "change" }
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
    /** 查询提现列表 */
    getList() {
      this.loading = true;
      listWithdraw(this.queryParams).then(response => {
        this.withdrawList = response.rows;
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
        transactionType: null,
        bizId: null,
        address: null,
        amount: null,
        contract: null,
        hash: null,
        status: null,
        ctime: null,
        mtime: null,
        chainType: null,
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
      this.title = "添加提现";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWithdraw(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWithdraw(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWithdraw(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除提现编号为"' + ids + '"的数据项？').then(function() {
        return delWithdraw(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wallet/withdraw/export', {
        ...this.queryParams
      }, `withdraw_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
