<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流水ID" prop="transactionId">
        <el-input
          v-model="queryParams.transactionId"
          placeholder="请输入流水ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合约地址" prop="contractAddress">
        <el-input
          v-model="queryParams.contractAddress"
          placeholder="请输入合约地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归集来源地址" prop="collectFromAddress">
        <el-input
          v-model="queryParams.collectFromAddress"
          placeholder="请输入归集来源地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归集目的地址" prop="collectToAddress">
        <el-input
          v-model="queryParams.collectToAddress"
          placeholder="请输入归集目的地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归集金额" prop="collectAmount">
        <el-input
          v-model="queryParams.collectAmount"
          placeholder="请输入归集金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归集交易哈希" prop="collectHash">
        <el-input
          v-model="queryParams.collectHash"
          placeholder="请输入归集交易哈希"
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
          v-hasPermi="['wallet:collect:add']"
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
          v-hasPermi="['wallet:collect:edit']"
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
          v-hasPermi="['wallet:collect:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:collect:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="流水ID" align="center" prop="transactionId" />
      <el-table-column label="归集类型" align="center" prop="type" />
      <el-table-column label="合约地址" align="center" prop="contractAddress" />
      <el-table-column label="归集来源地址" align="center" prop="collectFromAddress" />
      <el-table-column label="归集目的地址" align="center" prop="collectToAddress" />
      <el-table-column label="归集金额" align="center" prop="collectAmount" />
      <el-table-column label="归集交易哈希" align="center" prop="collectHash" />
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
      <el-table-column label="币种ID" align="center" prop="coinId" />
      <el-table-column label="币种名称" align="center" prop="coinName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wallet:collect:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wallet:collect:remove']"
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

    <!-- 添加或修改归集对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="流水ID" prop="transactionId">
          <el-input v-model="form.transactionId" placeholder="请输入流水ID" />
        </el-form-item>
        <el-form-item label="合约地址" prop="contractAddress">
          <el-input v-model="form.contractAddress" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="归集来源地址" prop="collectFromAddress">
          <el-input v-model="form.collectFromAddress" placeholder="请输入归集来源地址" />
        </el-form-item>
        <el-form-item label="归集目的地址" prop="collectToAddress">
          <el-input v-model="form.collectToAddress" placeholder="请输入归集目的地址" />
        </el-form-item>
        <el-form-item label="归集金额" prop="collectAmount">
          <el-input v-model="form.collectAmount" placeholder="请输入归集金额" />
        </el-form-item>
        <el-form-item label="归集交易哈希" prop="collectHash">
          <el-input v-model="form.collectHash" placeholder="请输入归集交易哈希" />
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
import { listCollect, getCollect, delCollect, addCollect, updateCollect } from "@/api/wallet/collect";

export default {
  name: "Collect",
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
      // 归集表格数据
      collectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transactionId: null,
        type: null,
        contractAddress: null,
        collectFromAddress: null,
        collectToAddress: null,
        collectAmount: null,
        collectHash: null,
        ctime: null,
        mtime: null,
        chainType: null,
        coinId: null,
        coinName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        transactionId: [
          { required: true, message: "流水ID不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "归集类型不能为空", trigger: "change" }
        ],
        contractAddress: [
          { required: true, message: "合约地址不能为空", trigger: "blur" }
        ],
        collectFromAddress: [
          { required: true, message: "归集来源地址不能为空", trigger: "blur" }
        ],
        collectToAddress: [
          { required: true, message: "归集目的地址不能为空", trigger: "blur" }
        ],
        collectAmount: [
          { required: true, message: "归集金额不能为空", trigger: "blur" }
        ],
        collectHash: [
          { required: true, message: "归集交易哈希不能为空", trigger: "blur" }
        ],
        ctime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        mtime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
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
    /** 查询归集列表 */
    getList() {
      this.loading = true;
      listCollect(this.queryParams).then(response => {
        this.collectList = response.rows;
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
        transactionId: null,
        type: null,
        contractAddress: null,
        collectFromAddress: null,
        collectToAddress: null,
        collectAmount: null,
        collectHash: null,
        ctime: null,
        mtime: null,
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
      this.title = "添加归集";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCollect(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改归集";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCollect(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCollect(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除归集编号为"' + ids + '"的数据项？').then(function() {
        return delCollect(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wallet/collect/export', {
        ...this.queryParams
      }, `collect_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
