# Spine 图层整理工具

自动将 Photoshop 图层整理为 Spine 需要的三层嵌套结构：`[slot] → [skin] → attachment`

## 🚀 快速开始

1. **在 Photoshop 中打开 PSD 文件**
2. **用中文命名图层**（见下方命名规则）
3. **运行脚本**：文件 → 脚本 → 浏览 → `spine_organizer.jsx`
4. **风格名自动填入**（从文件名提取）
5. **点"预览"**查看映射，**点"开始整理"**执行

## 📋 图层命名规则

### 基础部位

| 中文命名 | 生成结果 |
|---------|---------|
| `头发-前发` | `hair-front-{风格}` |
| `头发-后发` | `hair-back-{风格}` |
| `鞋袜-左` | `shoes-l-{风格}` |
| `鞋袜-右` | `shoes-r-{风格}` |
| `鞋袜-左鞋角度1` | `shoes-l-new-angle-{风格}` |
| `鞋袜-右鞋角度1` | `shoes-r-new-angle-{风格}` |
| `上装-左上袖子` | `sleeve-l-upper-{风格}` |
| `上装-右上袖子` | `sleeve-r-upper-{风格}` |
| `上装-左下袖子` | `sleeve-l-lower-{风格}` |
| `上装-右下袖子` | `sleeve-r-lower-{风格}` |
| `上装-身体` | `sleeve-body-{风格}` |
| `下装-左长裤` | `pant-long-l-{风格}` |
| `下装-右长裤` | `pant-long-r-{风格}` |
| `下装-左短裤` | `pant-mini-l-{风格}` |
| `下装-右短裤` | `pant-mini-r-{风格}` |
| `下装-短裙` | `skirt-mini-{风格}` |
| `下装-长裙` | `skirt-long-{风格}` |
| `眼睛-左眼白` | `eye-white-l-{风格}` |
| `眼睛-右眼白` | `eye-white-r-{风格}` |
| `眼睛-左眼珠` | `irides-l-{风格}` |
| `眼睛-右眼珠` | `irides-r-{风格}` |
| `眼睛-左睫毛` | `eyelash-l-{风格}` |
| `眼睛-右睫毛` | `eyelash-r-{风格}` |
| `头发-左眉毛` | `eyebrow-l-{风格}` |
| `头发-右眉毛` | `eyebrow-r-{风格}` |
| `嘴` | `mouth-{风格}` |

### 配饰（动态识别）

#### 1. 手持物品

**命名格式**：`配饰-左手拿{物品}` / `配饰-右手拿{物品}`

**生成格式**：`hold-{l/r}-{物品英文}-{风格}`

**示例**：
- `配饰-左手拿法杖` → `hold-l-wand-{风格}`
- `配饰-右手拿包` → `hold-r-bag-{风格}`

**支持物品**：
- 平底锅(pan)、荧光棒(lightstick)、法杖(wand)、包(bag)
- 伞(umbrella)、剑(sword)、书(book)、花(flower)
- 灯笼(lantern)、手机(phone)、相机(camera)、杯子(cup)
- 球(ball)、旗(flag)、扇子(fan)、喇叭(trumpet)
- 话筒/麦克风(microphone)

#### 2. 身体前配饰

**命名格式**：`配饰-身体前{物品}`

**生成格式**：`{物品英文}-front-{风格}`

**示例**：
- `配饰-身体前项链` → `necklace-front-{风格}`
- `配饰-身体前腰带` → `belt-front-{风格}`

**支持物品**：
- 项链(necklace)、腰带(belt)、衬衫(shirt)、领带(tie)
- 围巾(scarf)、胸针(brooch)、徽章(badge)

#### 3. 身体后配饰

**命名格式**：`配饰-身体后{物品}`

**生成格式**：`{物品英文}-back-{风格}`

**示例**：
- `配饰-身体后背包` → `backpack-back-{风格}`
- `配饰-身体后翅膀` → `wings-back-{风格}`

**支持物品**：
- 背包(backpack)、尾巴(tail)、翅膀(wings)
- 披风(cape)、斗篷(cloak)

#### 4. 头部配饰

**命名格式**：`配饰-头部{物品}`

**生成格式**：`{物品英文}-front-{风格}`

**示例**：
- `配饰-头部皇冠` → `crown-front-{风格}`
- `配饰-头部眼镜` → `glasses-front-{风格}`

**支持物品**：
- 皇冠(crown)、发箍(headband)、发带(headband)、鹿角(antler)
- 发夹(hairpin)、帽子(hat)、贝雷帽(beret)、眼镜(glasses)
- 兔耳(bunnyear)、猫耳(catear)、光环/天使圈(halo)

## ✅ 自动功能

### 预处理
- ✅ **跳过隐藏图层** — 只处理可见图层
- ✅ **栅格化** — 智能对象/文字图层转为普通图层
- ✅ **保持位置** — 图层在画布上的位置不变

### 智能检测
- ✅ **袖子检测** — 如果只有上袖子（无下袖子），自动简化命名
  - 有上下袖：`sleeve-l-upper` + `sleeve-l-lower`
  - 只有上袖：`sleeve-l`（自动去掉 `-upper`）
- ✅ **角度变体检测** — 图层名包含"角度"关键字时自动识别
  - 左鞋角度：使用 `slot-shoes-l` 结构，图层名 `shoes-l-new-angle-{风格}`
  - 右鞋角度：使用 `slot-shoes-r` 结构，图层名 `shoes-r-new-angle-{风格}`
  - 每个角度创建独立的同名 slot 组
  
### 完整验证
整理完成后自动检查：
- ✅ **同类部位共享 skin** — 头发前后、鞋袜左右、上装各部分等
- ✅ **左右配对** — 检查成对部位是否都存在
- ✅ **风格名后缀** — 所有 skin 和 attachment 都包含风格名
- ✅ **命名格式** — slot/skin/attachment 格式正确性
- ✅ **空组检查** — 没有空的 skin 组

## 📊 生成结构示例

### 头发（前后共享 skin）
```
[slot]slot-hair-front
  [skin]hair/hair-school-blazer
    hair-front-school-blazer

[slot]slot-hair-back
  [skin]hair/hair-school-blazer
    hair-back-school-blazer
```

### 手持物品（左右独立）
```
[slot]slot-acc-l-handheld
  [skin]acc/hold-l-wand-deer
    hold-l-wand-deer

[slot]slot-acc-r-handheld
  [skin]acc/hold-r-bag-deer
    hold-r-bag-deer
```

### 头部配饰
```
[slot]slot-acc-headwear
  [skin]acc/crown-front-princess
    crown-front-princess
```

### 角度变体（左右区分，独立分组）
```
[slot]slot-shoes-l
  [skin]foot/foot-demo
    shoes-l-new-angle-demo

[slot]slot-shoes-l
  [skin]foot/foot-demo
    shoes-l-new-angle-demo

[slot]slot-shoes-r
  [skin]foot/foot-demo
    shoes-r-new-angle-demo
```

**说明**：角度变体自动识别左右，每个角度创建独立的同名 slot 组。左鞋角度使用 `slot-shoes-l` 结构，右鞋角度使用 `slot-shoes-r` 结构。导出到 Spine 后同名 slot 会自动合并。

## ⚠️ 注意事项

1. **风格名从文件名提取** — 文件名 `school-blazer.psd` → 风格名 `school-blazer`
2. **隐藏图层不处理** — 隐藏参考图、草稿层等不会被整理
3. **画布尺寸不变** — 脚本不会修改画布大小
4. **配饰必须指定物品** — 如 `配饰-头部皇冠`，不能只写 `配饰-头部`

## 🔧 扩展新配饰

如果遇到词典中没有的新物品，在脚本开头的对应词典中添加：

```javascript
// 手持物品词典
var HANDHELD_ITEMS = {
  "新物品": "newitem",  // 只能用一个英文单词
  ...
};

// 身体前配饰词典
var FRONT_BODYWEAR = {
  "新物品": "newitem",
  ...
};

// 身体后配饰词典
var BACK_BODYWEAR = {
  "新物品": "newitem",
  ...
};

// 头部配饰词典
var HEADWEAR = {
  "新物品": "newitem",
  ...
};
```

## 📝 验证结果示例

### ✅ 全部正确
```
整理完成！成功 20 / 20

========== 验证命名正确性 ==========
✅ 所有检查通过！命名结构正确。
```

### ❌ 发现问题
```
整理完成！成功 20 / 20

========== 验证命名正确性 ==========

❌ 发现错误：
  - hair 类部位的 skin 名称不一致
  - skin 缺少风格后缀 '-school-blazer'

⚠️ 警告：
  - 只有左侧没有右侧: [slot]slot-shoes-l
```

## 🎯 完整功能清单

- ✅ 支持 40+ 种基础部位
- ✅ 支持 50+ 种动态配饰
- ✅ 智能袖子检测
- ✅ 完整命名验证
- ✅ 中英文命名支持
- ✅ 自动跳过隐藏图层
- ✅ 栅格化预处理

## 📦 文件说明

- `spine_organizer.jsx` — 主脚本
- `README.md` — 本文档
- `TEST.md` — 测试用例文档

## 🔗 相关链接

- Spine 官网：https://zh.esotericsoftware.com/
- Photoshop 脚本文档：https://www.adobe.com/devnet/photoshop/scripting.html
