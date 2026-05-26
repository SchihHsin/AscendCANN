# Dump ErrorMessage 评估报告

**评估日期**: 2026-05-05
**评估范围**: output/dump_error_messages.json (32条)
**参考基准**: reference/cann_error_message.md + reference/dump/Dump_ErrorMsg设计方案_20260304.xlsx
**评估原则**:
- Principle 1: Reason作为独立字段解析，与ErrMessage(Symptom)分离
- Principle 2: 第三方库异常名（json.exception.*）视为用户语言
- Principle 3: 每个ErrCode的NA算作一个独立合法Reason
- Principle 4: Reason自解释且可操作时，Solution=NA可接受
- Principle 5: 跨组件ErrCode不计入本组件评分分母

## 评估结论总览

> **⚠️ 必须规则检查失败 — 评审不通过**

| 必须规则 | 要求 | 实际值 | 结果 |
|---------|------|--------|------|
| 测试用例ErrCode覆盖率 | 100% | 75.0% (3/4) | **❌ FAIL** |
| 每个ErrCode Reason可操作修复测试覆盖 | ≥5% | EP0003 = 0% | **❌ FAIL** |
| 测试覆盖用户场景（非仅开发整改） | 是 | 是（配置校验场景） | ✅ PASS |

**根据评分规则: ErrCode覆盖率未达100% → 评审不通过 → 综合评分 < 6.0（等级D）**

| 维度 | 原始得分 | 权重 | 原始加权 | 关键发现 |
|------|---------|------|---------|----------|
| 一、设计评分 | 10.0/10 | 20% | 2.00 | 3/3个Dump ErrCode在设计文档中均有定义 |
| 二、测试评分 | 7.0/10 | 40% | 2.80 | ErrCode覆盖75%，Reason覆盖50% |
| 三、交付质量 | 9.1/10 | 40% | 3.64 | 24/24条Dump条目全部合规 |
| **原始总分** | — | 100% | **8.44** | **等级B（原始）** |
| **强制执行后** | — | — | **5.0** | **等级D（必须规则FAIL）** |

**关键数据一览**:
- 总条目数: 32 (EP系列24 + 跨组件8)
- Dump组件条目(EP系列): 24 (EP0001×11 + EP0002×6 + EP0004×7)
- 跨组件条目: 8 (EE1001×7 + EH0004×1)
- ErrCode覆盖率: 75.0% (3/4 设计ErrCode有测试覆盖，EP0003缺失)
- Reason覆盖率: 50.0% (4/8 设计Reason被覆盖)
- 规范符合率(Dump条目): 100.0% (24/24条EP系列条目全部合规)
- 用户指导能力(Dump条目): 8.375/10 (EP系列entry加权平均)
- 跨组件问题: 8条(EE1001×7 + EH0004×1)，非Dump评分范围

**核心问题 (必须/P0-P2)**:
1. **[必须-FAIL]** ErrCode覆盖率75% < 100%，EP0003完全无测试覆盖 → 评审不通过，评分强制<6.0
2. **[必须-FAIL]** EP0003的Reason可操作修复覆盖0% < 5%最低要求
3. **[P0-跨组件]** EE1001 (7条) Reason暴露CANN内部函数名`rtGetDevMsg`和内部状态`context is a null pointer`，属Runtime组件问题
4. **[P1-跨组件]** EH0004 (1条) 为ACL组件错误码穿透至Dump日志，归属不明确
5. **[P2-本组件]** EP0003完全无测试覆盖，4个Reason场景(路径长度/有效性/字符/权限)全部缺失
6. **[P2-本组件]** EP0004 Locatability偏低(5分)，不指明具体出错的JSON字段

---

## 一、日志提取分析

### 1.1 日志文件概览

| 日志文件 | 条目数 | 格式 |
|---------|--------|------|
| tc_adump_data_func_acljson_*_polymorph_1971_evb_physical_EP.log (32个文件) | 32 | ATC-raw |

### 1.2 提取条目分类

| 分类 | ErrCode系列 | 条目数 | 占比 | 备注 |
|------|-----------|--------|------|------|
| Dump组件 | EP0001 | 11 | 34.4% | Config_Error |
| Dump组件 | EP0002 | 6 | 18.8% | Config_Error (Expected value) |
| Dump组件 | EP0004 | 7 | 21.9% | File_Operation_Error_Parse |
| **Dump小计** | **EP系列** | **24** | **75.0%** | **纳入评分** |
| 跨组件(Runtime) | EE1001 | 7 | 21.9% | Invalid_Argument |
| 跨组件(ACL) | EH0004 | 1 | 3.1% | File_Operation_Error |
| **跨组件小计** | **EE/EH系列** | **8** | **25.0%** | **不纳入评分** |
| **总计** | — | **32** | **100%** | |

---

## 二、设计文档分析

### 2.1 设计文档状态

| 文档 | 路径 | 状态 |
|------|------|------|
| Dump专用设计文档 | reference/dump/Dump_ErrorMsg设计方案_20260304.xlsx | ✅ 存在 |
| ErrorMessage规范 | reference/cann_error_message.md | ✅ 存在 |

### 2.2 与提取ErrCode的设计文档对照

| 设计ErrCode | errTitle | 设计Reason数 | 输出中有测试 | 输出条目数 | 备注 |
|------------|----------|-------------|-------------|-----------|------|
| EP0001 | Config_Error | 2 | ✅ 已覆盖 | 11 | 2/2 Reason覆盖 |
| EP0002 | Config_Error | 1(NA) | ✅ 已覆盖 | 6 | NA匹配(Expected value) |
| EP0003 | Config_Error | 4 | ❌ 未覆盖 | 0 | **完全无测试数据** |
| EP0004 | File_Operation_Error_Parse | 1(模板) | ✅ 已覆盖 | 7 | json.exception.*匹配 |

**设计文档ErrCode总数**: 4 (EP0001, EP0002, EP0003, EP0004)
**输出中Dump ErrCode去重数**: 3 (EP0001, EP0002, EP0004; EP0003不在输出中)
**跨组件ErrCode**: 2 (EE1001=E=Runtime, EH0004=H=ACL)，按Principle 5不计入Dump评分分母

### 2.3 设计文档完整性评分因素

- 输出中Dump ErrCode(EP系列)3个，全部在设计文档找到定义 → 完整性100%
- EP0003在设计文档有定义但无测试覆盖 → 影响测试评分(维度二)，不影响设计完整性(维度一)
- 跨组件ErrCode(EE1001, EH0004)不计入本组件分母

---

## 三、Reason覆盖率

### 3.1 设计文档Reason

| ErrCode | errTitle | Reason | 场景说明 |
|---------|----------|--------|----------|
| EP0001 | Config_Error | The configuration item is not found | dump_path字段不存在 |
| EP0001 | Config_Error | The configuration item value is empty | dump_path等字段值为空 |
| EP0002 | Config_Error | NA (Expected value自解释) | dump_mode等字段选项非法 |
| EP0003 | Config_Error | The value length %d exceeds the upper limit %d | dump_path字段过长 |
| EP0003 | Config_Error | The value is an invalid path | mmRealPath失败 |
| EP0003 | Config_Error | The value contains invalid characters | dump_path字段含非法字符 |
| EP0003 | Config_Error | The value is a path without read and write permissions | dump_path字段mmAccess2失败 |
| EP0004 | File_Operation_Error_Parse | %s (json库抛出的异常) | nlohmann::json库兜底报错 |

**设计Reason总数**: 8 (含1个NA按Principle 3计数)

### 3.2 提取日志Reason（独立Reason字段）

**Dump组件(EP系列, 纳入分析)**:

| ErrCode | 去重Reason | 出现次数 |
|---------|-----------|----------|
| EP0001 | The configuration item value is empty | 7 |
| EP0001 | The configuration item is not found | 4 |
| EP0002 | NA | 6 |
| EP0004 | [json.exception.type_error.302] type must be string, but is number | 6 |
| EP0004 | [json.exception.type_error.302] type must be array, but is string | 1 |

**跨组件(不计入评分)**:

| ErrCode | 去重Reason | 出现次数 | 备注 |
|---------|-----------|----------|------|
| EE1001 | rtGetDevMsg execution failed, the context is a null pointer | 7 | CANN内部暴露(R3/R4违规) |
| EH0004 | Parse exception: [json.exception.parse_error.101] ... | 1 | ACL层错误穿透 |

### 3.3 覆盖矩阵

| 设计Reason | 日志匹配 | 匹配方式 |
|-----------|---------|----------|
| EP0001: The configuration item is not found | **✅ 已覆盖** | 精确匹配 (4条日志) |
| EP0001: The configuration item value is empty | **✅ 已覆盖** | 精确匹配 (7条日志) |
| EP0002: NA | **✅ 已覆盖** | NA匹配 (ErrMessage含Expected value自解释, 6条) |
| EP0004: %s (json库异常) | **✅ 已覆盖** | json.exception.*匹配模板 (7条日志) |
| EP0003: value length exceeds upper limit | **❌ 未覆盖** | EP0003无测试数据 |
| EP0003: invalid path | **❌ 未覆盖** | EP0003无测试数据 |
| EP0003: invalid characters | **❌ 未覆盖** | EP0003无测试数据 |
| EP0003: path without read/write permissions | **❌ 未覆盖** | EP0003无测试数据 |

**覆盖率**: 4/8 = **50.0%** (严格匹配)
**未覆盖设计Reason**: 4个，全部属于EP0003 (路径值校验类错误)

**设计外日志Reason**:
- EE1001: `rtGetDevMsg execution failed, the context is a null pointer` (CANN内部暴露，非Dump定义)
- EH0004: `json.exception.parse_error.101` (ACL层错误穿透)

---

## 四、ErrCode覆盖率

### 4.1 测试用例 → ErrCode映射

| 设计ErrCode | 是否有测试覆盖 | 覆盖的Reason数/总Reason数 | 缺失的Reason |
|------------|--------------|-------------------------|-------------|
| EP0001 | ✅ 已覆盖 | 2/2 | 无 |
| EP0002 | ✅ 已覆盖 | 1/1 (NA) | 无 |
| **EP0003** | **❌ 未覆盖** | **0/4** | **全部4个Reason** |
| EP0004 | ✅ 已覆盖 | 1/1 (模板) | 无 |

### 4.2 覆盖统计

| 指标 | 值 | 是否达标 |
|------|-----|---------|
| 设计ErrCode总数 | 4 | — |
| 已覆盖ErrCode数 | 3 (EP0001, EP0002, EP0004) | — |
| 未覆盖ErrCode数 | 1 (EP0003) | — |
| **ErrCode覆盖率** | **75.0%** | **❌ <100% 必须规则FAIL** |
| 已覆盖Reason数 | 4 | — |
| 设计Reason总数 | 8 | — |
| **Reason覆盖率** | **50.0%** | 偏低 |

> **⚠️ 必须规则违反: ErrCode覆盖率75%未达100%要求。EP0003整个ErrCode无任何测试用例覆盖。**

---

## 五、交付质量 — 规范符合性

### 5.1 有效条目逐条合规审查

**Dump组件条目(EP系列，纳入评分，24条)**:

| ErrCode | 条目数 | R1 errTitle | R2 ErrCode | R3 ErrMessage | R3/R4 Reason | R5 Solution | R6 用户错误 | 判定 |
|---------|--------|-------------|------------|---------------|-------------|-------------|------------|------|
| EP0001 | 11 | ✅ 已注册 | ✅ 格式有效 | ✅ 用户语言 | ✅ 自解释 | ✅ P4适用 | ✅ P4适用 | **合规** |
| EP0002 | 6 | ✅ 已注册 | ✅ 格式有效 | ✅ 含Expected value | ✅ P4适用 | ✅ P4适用 | ✅ P4适用 | **合规** |
| EP0004 | 7 | ✅ 已注册 | ✅ 格式有效 | ✅ 用户语言 | ✅ P2第三方库 | ✅ P4适用 | ✅ P4适用 | **合规** |

**合规审查详评**:

#### EP0001 (Config_Error, 11条)
- **R1**: `Config_Error` 在规范errTitle表中已注册(line 226) ✅
- **R2**: `EP0001` 格式 `[EWI][0-9A-Z]\d{4}` — E=Error, P=Dump模块, 0001=用户错误编号 ✅
- **R3**: ErrMessage "The content of configuration item %s in configuration file %s is invalid" — 用户语言，明确指出哪个配置项(dump_op_switch/dump_mode/dump_stats/dump_path/dump_level/dump_debug/dump_data/dump_scene)在哪个文件(acl.json) ✅
- **R3/R4**: Reason "value is empty" / "not found" — 用户语言，自解释 ✅
- **R5**: Solution=NA → Principle 4适用: "value is empty"→用户填入值, "not found"→用户添加配置项 ✅
- **R6**: 用户错误(0001)，Solution=NA可接受因Reason自解释可操作 ✅
- **Verdict**: COMPLIANT

#### EP0002 (Config_Error, 6条)
- **R1**: `Config_Error` 已注册 ✅
- **R2**: `EP0002` 格式有效 ✅
- **R3**: ErrMessage含 "Expected value: stats/tensor", "all/input/output", "off/on", "all/kernel/op", "aic_err_brief_dump/aic_err_detail_dump/..." — 最佳实践，直接展示正确值范围 ✅
- **R5/R6**: Solution=NA → ErrMessage展示正确值(Principle 4自解释) ✅
- **Verdict**: COMPLIANT

#### EP0004 (File_Operation_Error_Parse, 7条)
- **R1**: `File_Operation_Error_Parse` 在规范errTitle表中已注册(line 235) ✅
- **R2**: `EP0004` 格式有效 ✅
- **R3**: ErrMessage "Failed to parse file acl.json" — 用户语言 ✅
- **R3**: Reason = `json.exception.type_error.302` → Principle 2适用(nlohmann/json第三方库异常可接受) ✅
- **R5**: Solution=NA → Principle 4适用: "type must be string, but is number"→用户修改JSON类型; "type must be array, but is string"→用户修改为array ✅
- **Verdict**: COMPLIANT

**跨组件条目(非EP系列，不纳入评分，8条)**:

| ErrCode | 条目数 | 主要违规 | 判定 |
|---------|--------|---------|------|
| EE1001 | 7 | R3/R4 暴露CANN内部(rtGetDevMsg, "context is a null pointer") | **不合规-P0跨组件** |
| EH0004 | 1 | 不在Dump设计文档(属ACL/H模块) | **跨组件-P1** |

**EE1001不合规详析(7条)**:
- errTitle=`Invalid_Argument`(在spec注册表中存在)，ErrCode格式合规
- **R3 FAIL**: Reason `rtGetDevMsg execution failed, the context is a null pointer` — 暴露Runtime内部函数名`rtGetDevMsg`和内部状态`context is a null pointer`
- **R4 FAIL**: Possible Cause含内部API调用失败信息
- **NOT P2**: `rtGetDevMsg`是CANN内部函数，非第三方库，Principle 2不适用
- TraceBack进一步暴露: `[FUNC:ReportInnerError] [FILE:log_inner.cpp] [LINE:132]`, `[FUNC:GetDevErrMsg] [FILE:api_impl.cc] [LINE:6145]`

### 5.2 合规率汇总

| 范围 | 合规 | 不合规 | 合规率 |
|------|------|--------|--------|
| **Dump组件(EP系列, 24条)** | **24** | **0** | **100.0%** |
| 跨组件(EE/EH系列, 8条) | 0 | 8 | 0.0% |
| 全部(32条) | 24 | 8 | 75.0% |

---

## 六、用户指导能力评分

### 6.1 逐ErrCode指导评分

**Dump组件ErrCode(纳入评分)**:

| ErrCode | Understandability (25%) | Locatability (25%) | Actionability (30%) | Self-closure (20%) | 加权平均 | 评分说明 |
|---------|------------------------|--------------------|--------------------|--------------------|---------|---------|
| EP0001 | 9 | 8 | 9 | 9 | **8.75** | 精确到配置项名+文件名 |
| EP0002 | 9 | 9 | 9 | 9 | **9.0** | Expected value最佳实践 |
| EP0004 | 6 | 5 | 9 | 9 | **7.25** | json.exception技术性,Locatability偏低 |
| **Dump加权平均(24条)** | — | — | — | — | **8.375** | (11×8.75+6×9+7×7.25)/24 |

**评分说明**:

- **EP0001 (11条)**:
  - Understandability=9: 明确指出哪个配置项、哪个文件、什么问题
  - Locatability=8: 精确到配置项名称+文件名(略扣因未说明正确格式)
  - Actionability=9: "value is empty"→填入值, "not found"→添加配置项
  - Self-closure=9: 立即可修复

- **EP0002 (6条) — 最佳实践**:
  - Understandability=9: 清晰的Expected value模式
  - Locatability=9: 精确到配置项+正确值范围
  - Actionability=9: 正确值已列出(stats/tensor, all/input/output等)
  - Self-closure=9: 立即修复，无需查文档

- **EP0004 (7条)**:
  - Understandability=6: json.exception技术性强但P2适用(第三方库)
  - Locatability=5: 仅给出文件名(acl.json)，**不指明哪个具体字段类型错误** — 主要扣分项
  - Actionability=9: P4 "type must be string, but is number" → 用户知道修改JSON类型
  - Self-closure=9: 知道类型不匹配即可立即修复

**跨组件ErrCode(不纳入评分，仅供跟踪)**:

| ErrCode | Understandability (25%) | Locatability (25%) | Actionability (30%) | Self-closure (20%) | 加权平均 |
|---------|------------------------|--------------------|--------------------|--------------------|---------|
| EE1001 | 2 | 1 | 7 | 6 | **4.1** |
| EH0004 | 6 | 5 | 9 | 9 | **7.2** |

### 6.2 问题总结

1. **EP0002为最佳实践**: "Expected value"设计使用户可直接看到正确选项，建议所有配置校验类错误采用此模式
2. **EP0004 Locatability不足(5分)**: "Failed to parse file acl.json"不指明具体字段，建议补充出错JSON字段名/行号，如 "Failed to parse field 'dump_mode' in file acl.json"
3. **EE1001(4.1/10)为跨组件最差**: Reason暴露内部函数名，用户完全无法理解或修复

---

## 七、errTitle细分分析

### 7.1 设计文档vs提取errTitle对比

| errTitle | 规范注册 | 设计文档定义 | 输出使用 | 对应ErrCode | R1判定 |
|----------|---------|------------|---------|-------------|--------|
| Config_Error | ✅ (line 226) | ✅ | ✅ (17条) | EP0001, EP0002 | **合规** |
| File_Operation_Error_Parse | ✅ (line 235) | ✅ | ✅ (7条) | EP0004 | **合规** |
| Invalid_Argument | ✅ (line 194) | ❌ (非Dump定义) | ✅ (7条) | EE1001(跨组件) | 跨组件 |
| File_Operation_Error | ✅ (line 230) | ❌ (非Dump定义) | ✅ (1条) | EH0004(跨组件) | 跨组件 |

**结论**: Dump组件EP系列使用的errTitle(Config_Error, File_Operation_Error_Parse)均在规范errTitle注册表中定义，R1全部通过。

---

## 八、TraceBack规范审查

### 8.1 TraceBack合规判断

| ErrCode | 条目数 | TraceBack典型内容 | 合规判断 |
|---------|--------|------------------|---------|
| EP0001 | 11 | `[FUNC:ReportInnerError] [FILE:log_inner.cpp] [LINE:132]` + `[FUNC:GetDevErrMsg] [FILE:api_impl.cc]` | TraceBack含内部信息 — **ErrMessage/Reason层合规**(TraceBack为调试层) |
| EP0002 | 6 | 同上 | 同上 |
| EP0004 | 7 | 同上 | 同上 |
| EE1001 | 7 | 暴露`[FUNC:ReportInnerError]` + `HandleDumpConfig` + `GetDevErrMsg`等 | **跨组件内部暴露** |
| EH0004 | 1 | 暴露`[FUNC:ReportInnerError]` + json解析异常链 | **跨组件内部暴露** |

**说明**: TraceBack作为调试日志信息，包含内部函数名和行号属正常设计。评估重点在ErrMessage/Reason层面的用户语言规范性。Dump组件EP系列的ErrMessage和Reason均不含CANN内部信息，TraceBack层内容不影响交付质量评分。

---

## 九、测试结果分析

### 9.1 测试Pass/Fail统计

| 测试场景类别 | 设计ErrCode | 测试条目数 | Pass | Fail(场景缺失) | 通过率 |
|------------|------------|-----------|------|--------------|--------|
| 配置项值校验 | EP0001 | 11 | 11 | 0 | 100% |
| 配置项选项校验 | EP0002 | 6 | 6 | 0 | 100% |
| 文件JSON解析 | EP0004 | 7 | 7 | 0 | 100% |
| 路径值校验 | EP0003 | **0** | **0** | **4** | **0%** |
| **总计** | **4** | **24** | **24** | **4** | **75.0%** |

### 9.2 Failed用例根因分析

| 未覆盖ErrCode | 缺失场景 | 根因分析 |
|--------------|---------|---------|
| EP0003 | 路径长度超限 (value length exceeds upper limit) | 无测试用例覆盖dump_path长度校验场景 |
| EP0003 | 无效路径 (invalid path, mmRealPath失败) | 无测试用例覆盖dump_path有效性校验场景 |
| EP0003 | 非法字符 (contains invalid characters) | 无测试用例覆盖dump_path字符合法性校验场景 |
| EP0003 | 权限不足 (path without read/write permissions) | 无测试用例覆盖dump_path读写权限校验场景 |

**根因**: EP0003的4个Reason场景均无对应测试用例，整个ErrCode未进入测试视野。需补充dump_path路径校验的4个测试场景。

---

## 十、核心问题汇总

| 优先级 | 标签 | 问题 | 影响 | 涉及条目 |
|--------|------|------|------|---------|
| **必须** | **规则FAIL** | **ErrCode覆盖率75% < 100%，评审不通过** | **评分强制<6.0(等级D)** | EP0003(0→4缺失) |
| **必须** | **规则FAIL** | EP0003的Reason可操作修复覆盖0% < 5%最低要求 | 额外必须规则违反 | EP0003 |
| **P0** | 紧急-跨组件 | EE1001 Reason暴露`rtGetDevMsg`(CANN内部) + `context is a null pointer`(内部状态) | 用户无法理解/修复 | 7条EE1001 |
| **P1** | 高优-跨组件 | EH0004为ACL错误码穿透至Dump日志，归属不明确 | 错误码归属模糊 | 1条EH0004 |
| **P2** | 中优-本组件 | EP0003完全无测试覆盖，4个Reason场景缺失 | ErrCode覆盖和Reason覆盖的主要缺口 | 0→4条新测试 |
| **P2** | 中优-本组件 | EP0004 Locatability=5(低)，不指明具体出错JSON字段 | 用户定位困难 | 7条EP0004 |
| **P3** | 低优 | 设计文档Solution均为NA(Reason自解释可接受但缺复杂场景修复指导) | 可选改进 | EP系列24条 |

---

## 十一、修复路线图

| 阶段 | 优先级 | 时间 | 修复内容 | 预期评分变化 |
|------|--------|------|---------|-------------|
| **Phase 1** | **必须** | **1-2周** | **补充EP0003全部4个Reason的测试用例**(路径长度/有效性/字符/权限校验) | **ErrCode覆盖75%→100%, 消除必须规则FAIL, 评分5.0→9.4(A)** |
| Phase 2 | P2-本组件 | 2-3周 | 优化EP0004 Locatability: 补充出错JSON字段名/行号信息 | 用户指导8.375→8.8, 总分微升 |
| Phase 3 | P0-跨组件 | 3-4周 | 推动Runtime修复EE1001内部信息暴露: 将`rtGetDevMsg`替换为用户语言 | 消除7条跨组件违规 |
| Phase 4 | P1-跨组件 | 4-6周 | 建立跨组件错误码协调机制，明确EE1001/EH0004归属 | 架构级优化, 防止错误穿透 |

**Phase 1修复后预期评分**: 9.4/10 (等级A)
- 设计评分(20%): 10/10 → 2.00 (不变)
- 测试评分(40%): (10×0.8 + 10×0.2) = 10/10 → **4.00** (从7.0→10.0)
- 交付质量(40%): 9.1/10 → 3.64 (不变)
- 总分: 2.00 + 4.00 + 3.64 = **9.64** → 等级A

**跨组件修复后额外收益**: 消除8条跨组件错误穿透条目，Dump日志整体规范符合率达100%

---

## 十二、评分汇总

### 评分计算明细

| 维度 | 子项 | 子项得分 | 子项权重 | 维度权重 | 加权得分 |
|------|------|---------|---------|---------|---------|
| **一、设计评分** | 设计文档完整性 | 10.0/10 (3/3) | 100% | 20% | 2.00 |
| | | | | | |
| **二、测试评分** | ErrCode覆盖度 | 7.5/10 (3/4) | 80% | 40% | 2.40 |
| | Reason覆盖率 | 5.0/10 (4/8) | 20% | 40% | 0.40 |
| | *维度小计* | *7.0/10* | — | 40% | **2.80** |
| **三、交付质量** | 规范符合性 | 10.0/10 (24/24) | 40% | 40% | 1.60 |
| | ErrMessage质量 | 8.5/10 | 30% | 40% | 1.02 |
| | 用户指导能力 | 8.375/10 | 30% | 40% | 1.005 |
| | *维度小计* | *9.1/10* | — | 40% | **3.625** |
| **原始总分** | | | **100%** | | **8.425** |
| | | | | | |
| **必须规则检查** | ErrCode覆盖率 | 75% < 100% | — | — | **❌ FAIL** |
| | EP0003 Reason覆盖 | 0% < 5% | — | — | **❌ FAIL** |
| | 用户场景覆盖 | ✅ | — | — | **✅ PASS** |
| **强制执行** | 2项必须规则FAIL → 评审不通过 | | | | **评分<6.0** |
| **最终评分** | | | | | **5.0/10 (D)** |

### ErrMessage质量评分明细

| ErrCode组 | Symptom清晰度 | Reason精确度 | 内部信息暴露 | 组平均 | 条目权重 |
|-----------|-------------|-------------|------------|--------|---------|
| EP0001 (11条) | 9 | 9 | 10 | 9.3 | 11/24 |
| EP0002 (6条) | 10 | 9 | 10 | 9.7 | 6/24 |
| EP0004 (7条) | 6 | 8 | 9 | 7.7 | 7/24 |
| **加权平均** | — | — | — | **8.83** | 24/24 |

### 等级判定

| 等级 | 分数范围 | 判定 |
|------|---------|------|
| A | 9.0-10.0 | Phase 1修复后预期等级 |
| B | 7.0-8.9 | 原始等级(8.425，被必须规则覆盖) |
| C | 6.0-6.9 | — |
| **D** | **4.0-5.9** | **✅ 当前等级(5.0/10，必须规则FAIL)** |
| E | <4.0 | — |

### 必须规则影响说明

> **关键判定**: 根据skills/eval_err_msg.md规定的必须规则:
> 1. **"测试用例错误码覆盖率必须为100%，否则评审不通过，评分小于60"** — Dump组件ErrCode覆盖率75%(3/4)未达标
> 2. **"每个Error Code至少有5%的Error Reason测试覆盖是否可以操作修复问题"** — EP0003覆盖0%
>
> 两条必须规则FAIL，因此原始8.425分被强制执行为5.0分(等级D)。
>
> **修复路径**: 仅需补充EP0003的4个测试场景即可将ErrCode覆盖率提升至100%，同时满足两条必须规则，预期评分恢复至9.4+/10(等级A)。

---

## 附录

### A. 有效条目清单

**Dump组件(EP系列, 24条)**:

| # | ErrCode | 配置项 | Reason | source_file |
|---|---------|--------|--------|-------------|
| 1 | EP0001 | dump_op_switch | value is empty | ...021.log |
| 2 | EP0001 | dump_mode | value is empty | ...018.log |
| 3 | EP0001 | dump_stats | value is empty | ...015.log |
| 4 | EP0001 | dump_path | not found | ...045.log |
| 5 | EP0001 | dump_path | not found | ...027.log |
| 6 | EP0001 | dump_path | not found | ...028.log |
| 7 | EP0001 | dump_path | not found | ...040.log |
| 8 | EP0001 | dump_scene | value is empty | ...037.log |
| 9 | EP0001 | dump_level | value is empty | ...019.log |
| 10 | EP0001 | dump_debug | value is empty | ...042.log |
| 11 | EP0001 | dump_data | value is empty | ...021.log |
| 12 | EP0002 | dump_data | NA (Expected: stats/tensor) | ...014.log |
| 13 | EP0002 | dump_mode | NA (Expected: all/input/output) | ...010.log |
| 14 | EP0002 | dump_debug | NA (Expected: off/on) | ...041.log |
| 15 | EP0002 | dump_op_switch | NA (Expected: off/on) | ...013.log |
| 16 | EP0002 | dump_level | NA (Expected: all/kernel/op) | ...012.log |
| 17 | EP0002 | dump_scene | NA (Expected: aic_err_...) | ...036.log |
| 18 | EP0004 | acl.json | type must be string, but is number | ...024.log |
| 19 | EP0004 | acl.json | type must be string, but is number | ...023.log |
| 20 | EP0004 | acl.json | type must be string, but is number | ...043.log |
| 21 | EP0004 | acl.json | type must be array, but is string | ...022.log |
| 22 | EP0004 | acl.json | type must be string, but is number | ...038.log |
| 23 | EP0004 | acl.json | type must be string, but is number | ...026.log |
| 24 | EP0004 | acl.json | type must be string, but is number | ...025.log |

**跨组件(8条, 不纳入Dump评分)**:

| # | ErrCode | errTitle | Reason | 所属模块 |
|---|---------|----------|--------|---------|
| 1-7 | EE1001 | Invalid_Argument | rtGetDevMsg execution failed, the context is a null pointer | Runtime (E) |
| 8 | EH0004 | File_Operation_Error | Parse exception: [json.exception.parse_error.101] ... | ACL (H) |

### B. 错误输出机制

Dump组件错误通过aclGetRecentErrMsg()接口获取。Dump配置校验链路: 用户配置acl.json → Dump组件解析 → 配置项逐项校验 → 错误上报。错误信息包含errTitle、ErrCode、ErrMessage(Symptom)、Reason、Possible Cause、Solution等字段。

### C. 组件ErrCode归属对照

| 模块标识(ErrCode第2位) | 组件 | ErrCode范围 | Dump日志中出现 | 条目数 |
|----------------------|------|------------|--------------|--------|
| P | Dump | EPxxxx | ✅ 本组件 | 24条 |
| E | Runtime | EExxxx | ❌ 跨组件 | 7条 |
| H | ACL | EHxxxx | ❌ 跨组件 | 1条 |