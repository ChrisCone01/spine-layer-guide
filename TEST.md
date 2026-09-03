# Spine 图层整理工具 - 自测流程

## 测试文件

**school-blazer.psd**（校服西装款）

## 预期输入（中文图层名）

```
头发-后发
头发-前发
鞋袜-左
鞋袜-右
下装-左长裤
下装-右长裤
上装-左上袖子
上装-右上袖子
上装-身体
上装-左下袖子
上装-右下袖子
眼睛-左眼白
眼睛-右眼白
眼睛-左眼珠
眼睛-右眼珠
眼睛-左睫毛
眼睛-右睫毛
头发-左眉毛
头发-右眉毛
嘴
```

## 预期输出结构

### 头发

```
[slot]slot-hair-back
  [skin]hair/hair-school-blazer
    hair-back-school-blazer

[slot]slot-hair-front
  [skin]hair/hair-school-blazer
    hair-front-school-blazer
```

### 鞋袜

```
[slot]slot-shoes-l
  [skin]foot/foot-school-blazer
    shoes-l-school-blazer

[slot]slot-shoes-r
  [skin]foot/foot-school-blazer
    shoes-r-school-blazer
```

### 下装（长裤）

```
[slot]slot-pant-l
  [skin]bottom/bottom-pant-long-school-blazer
    pant-long-l-school-blazer

[slot]slot-pant-r
  [skin]bottom/bottom-pant-long-school-blazer
    pant-long-r-school-blazer
```

### 上装（西装 - 5个部分）

```
[slot]slot-top-l-upper
  [skin]tops/top-sleeve-school-blazer
    sleeve-l-upper-school-blazer

[slot]slot-top-r-upper
  [skin]tops/top-sleeve-school-blazer
    sleeve-r-upper-school-blazer

[slot]slot-top-body
  [skin]tops/top-sleeve-school-blazer
    sleeve-body-school-blazer

[slot]slot-top-l-lower
  [skin]tops/top-sleeve-school-blazer
    sleeve-l-lower-school-blazer

[slot]slot-top-r-lower
  [skin]tops/top-sleeve-school-blazer
    sleeve-r-lower-school-blazer
```

### 眼睛

```
[slot]slot-eye-white-l
  [skin]eye/eye-school-blazer
    eye-white-l-school-blazer

[slot]slot-eye-white-r
  [skin]eye/eye-school-blazer
    eye-white-r-school-blazer

[slot]slot-irides-l
  [skin]eye/eye-school-blazer
    irides-l-school-blazer

[slot]slot-irides-r
  [skin]eye/eye-school-blazer
    irides-r-school-blazer

[slot]slot-eyelash-l
  [skin]eye/eye-school-blazer
    eyelash-l-school-blazer

[slot]slot-eyelash-r
  [skin]eye/eye-school-blazer
    eyelash-r-school-blazer
```

### 五官

```
[slot]slot-eyebrow-l
  [skin]facial/facial-school-blazer
    eyebrow-l-school-blazer

[slot]slot-eyebrow-r
  [skin]facial/facial-school-blazer
    eyebrow-r-school-blazer

[slot]slot-mouth
  [skin]facial/facial-school-blazer
    mouth-school-blazer
```

## 检查要点

### ✅ 结构正确性

1. **三层嵌套** — 每个附件都在 `[slot] → [skin] → attachment` 结构中
2. **slot 独立** — 每个附件有自己的 slot 组
3. **skin 共享** — 同类部位共享 skin 名
   - 头发前后 → 共享 `hair/hair-school-blazer`
   - 鞋袜左右 → 共享 `foot/foot-school-blazer`
   - 上装5部分 → 共享 `tops/top-sleeve-school-blazer`
   - 眼睛6部分 → 共享 `eye/eye-school-blazer`
   - 五官3部分 → 共享 `facial/facial-school-blazer`

### ✅ 命名正确性

1. **风格名一致** — 所有 skin 和 attachment 都带 `-school-blazer` 后缀
2. **左右标记** — `-l` / `-r` 正确区分
3. **长短标记** — 长裤用 `pant-long`，不是 `pant-mini`
4. **部位对应** — slot 名和 attachment 名逻辑一致

### ✅ 预处理正确性

1. **画布尺寸不变** — 文档宽高保持原样
2. **图层已栅格化** — 智能对象/文字图层转为普通图层
3. **隐藏图层跳过** — 隐藏的图层不被处理

### ✅ 皮肤映射验证

| 部位类型 | slot 数量 | skin 名称 | 共享情况 |
|---------|----------|----------|---------|
| 头发 | 2 | hair/hair | 前后共享同一skin |
| 鞋袜 | 2 | foot/foot | 左右共享同一skin |
| 长裤 | 2 | bottom/bottom-pant-long | 左右共享同一skin |
| 上装 | 5 | tops/top-sleeve | 5部分共享同一skin |
| 眼睛 | 6 | eye/eye | 6部分共享同一skin |
| 五官 | 3 | facial/facial | 3部分共享同一skin |

## 测试通过标准

1. ✅ 所有 20 个图层处理成功（成功 20/20）
2. ✅ 没有"未识别"的图层
3. ✅ 没有错误信息
4. ✅ 画布尺寸未改变
5. ✅ 所有图层正确嵌套在 `[slot] → [skin]` 结构中
6. ✅ 图层名全部转为英文标准格式
7. ✅ 风格名后缀正确（从文件名提取）

## 回归测试用例

### 用例 1：基础服装（deer.psd）
- 鞋袜、头发、裙子、上衣、尾巴、鹿角
- 预期：12个图层成功

### 用例 2：完整五官（pinkboy.psd）
- 包含眼睛、眉毛、嘴巴、上下袖子、长裤、帽子、腰带
- 预期：25+个图层成功

### 用例 3：带翅膀配饰（angel.psd）
- 翅膀、裙子、鞋子、头发、天使圈
- 预���：10+个图层成功

### 用例 4：隐藏图层测试
- 部分图层设为隐藏
- 预期：只处理可见图层，隐藏图层保持原样

## 常见问题排查

| 问题 | 原因 | 检查方法 |
|------|------|---------|
| 画布被裁剪 | trimLayer 执行了 | 确认 trimLayer 是空函数 |
| 图层在组外 | move 失败 | 检查是否用 PLACEATBEGINNING |
| 未识别图层 | 中文别名缺失 | 检查 SYNONYMS 表 |
| 语法错误 | 中文引号 | 确认所有引号是英文 ASCII |
| 移动报错 | PS 版本兼容 | 降级到最简单的 DOM move |

## 自动化测试脚本（未来扩展）

```javascript
// 验证结构的伪代码
function validateStructure(doc) {
  var errors = [];
  
  // 检查每个 slot 组
  for each slot in doc.layerSets {
    if (!slot.name.startsWith("[slot]")) {
      errors.push("Invalid slot: " + slot.name);
    }
    
    // 检查 skin 子组
    for each skin in slot.layerSets {
      if (!skin.name.startsWith("[skin]")) {
        errors.push("Invalid skin: " + skin.name);
      }
      
      // 检查附件图层
      if (skin.artLayers.length === 0) {
        errors.push("Empty skin: " + skin.name);
      }
    }
  }
  
  return errors;
}
```

## 更新日志

- ✅ 2026-01-XX: 修复画布裁剪问题，移除 trim 功能
- ✅ 2026-01-XX: 修复图层移动失败，改用 PLACEATBEGINNING
- ✅ 2026-01-XX: 修复中文���号编码问题
- ✅ 2026-01-XX: 添加隐藏图层跳过功能
- ✅ 2026-01-XX: 修正"前袋"错别字为"前发"
