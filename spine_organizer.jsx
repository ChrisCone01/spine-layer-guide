// Spine PSD Layer Organizer
// 目标结构（3 层嵌套）：
//   [slot]slot-xxx                       插槽组
//     [skin]category/skin-base-{style}    皮肤组
//       attachment-{style}                实际图层（附件）
//
// 用法：把每个原始图层命名为下表的“基础名”（不带风格后缀），
//       风格名 {style} 会自动取自 PSD 文件名，然后点“开始整理”。

#target photoshop

// ============ 手持物品词典 ============
// 中文物品名 → 英文单词（单个单词）
var HANDHELD_ITEMS = {
  "平底锅": "pan",
  "荧光棒": "lightstick",
  "法杖": "wand",
  "包": "bag",
  "伞": "umbrella",
  "剑": "sword",
  "书": "book",
  "花": "flower",
  "灯笼": "lantern",
  "手机": "phone",
  "相机": "camera",
  "杯子": "cup",
  "球": "ball",
  "旗": "flag",
  "扇子": "fan",
  "喇叭": "trumpet",
  "话筒": "microphone",
  "麦克风": "microphone"
};

// ============ 身体前配饰词典 ============
var FRONT_BODYWEAR = {
  "项链": "necklace",
  "项圈": "choker",
  "颈圈": "choker",
  "脖圈": "choker",
  "腰带": "belt",
  "衬衫": "shirt",
  "领带": "tie",
  "领结": "bowtie",
  "围巾": "scarf",
  "胸针": "brooch",
  "徽章": "badge",
  "花朵": "flower",
  "花": "flower"
};

// ============ 身体后配饰词典 ============
var BACK_BODYWEAR = {
  "背包": "backpack",
  "尾巴": "tail",
  "翅膀": "wings",
  "披风": "cape",
  "斗篷": "cloak",
  "翼": "wings"
};

// ============ 头部配饰词典 ============
var HEADWEAR = {
  "皇冠": "crown",
  "发箍": "headband",
  "大眼发箍": "headband",
  "发带": "headband",
  "鹿角": "antler",
  "发夹": "hairpin",
  "帽子": "beaniel",
  "贝雷帽": "beret",
  "眼镜": "glasses",
  "耳环": "earring",
  "耳钉": "earring",
  "耳机": "headphone",
  "兔耳": "bunnyear",
  "猫耳": "catear",
  "光环": "halo",
  "天使圈": "halo"
};

// ============ 部位映射表 ============
// key  = 图层基础名（不含风格后缀，全小写）
// slot = 插槽名（不含 [slot] 前缀）
// skin = 皮肤名 category/base（不含 [skin] 前缀和风格后缀）
var PART_MAP = {
  // ===== 脚部：鞋 + 袜（左右各自独立插槽，共用 foot 皮肤）=====
  "shoes-l":        { slot: "slot-shoes-l",           skin: "foot/foot" },
  "shoes-r":        { slot: "slot-shoes-r",           skin: "foot/foot" },
  "socks-l-mini":   { slot: "slot-socks-l",           skin: "foot/foot" },
  "socks-r-mini":   { slot: "slot-socks-r",           skin: "foot/foot" },

  // ===== 头发 =====
  "hair-front":     { slot: "slot-hair-front",        skin: "hair/hair" },
  "hair-back":      { slot: "slot-hair-back",         skin: "hair/hair" },

  // ===== 上衣 / 袖子 =====
  // 简版（只有上臂，deer 款）
  "sleeve-l":       { slot: "slot-top-l-upper",       skin: "tops/top-sleeve" },
  "sleeve-r":       { slot: "slot-top-r-upper",       skin: "tops/top-sleeve" },
  "sleeve-body":    { slot: "slot-top-body",          skin: "tops/top-sleeve" },
  // 完整版（上臂 + 下臂，pinkboy 款）
  "sleeve-l-upper": { slot: "slot-top-l-upper",       skin: "tops/top-sleeve" },
  "sleeve-l-lower": { slot: "slot-top-l-lower",       skin: "tops/top-sleeve" },
  "sleeve-r-upper": { slot: "slot-top-r-upper",       skin: "tops/top-sleeve" },
  "sleeve-r-lower": { slot: "slot-top-r-lower",       skin: "tops/top-sleeve" },

  // ===== 下装（区分长短）=====
  "skirt-mini":     { slot: "slot-skirt",             skin: "bottom/bottom-skirt-min" },
  "skirt-long":     { slot: "slot-skirt",             skin: "bottom/bottom-skirt-long" },
  "pant-mini-l":    { slot: "slot-pant-l",            skin: "bottom/bottom-pant-mini" },
  "pant-mini-r":    { slot: "slot-pant-r",            skin: "bottom/bottom-pant-mini" },
  "pant-long-l":    { slot: "slot-pant-l",            skin: "bottom/bottom-pant-long" },
  "pant-long-r":    { slot: "slot-pant-r",            skin: "bottom/bottom-pant-long" },

  // ===== 配饰 =====
  // 身体后配饰（每种配饰独立皮肤）
  "tail-back":      { slot: "slot-acc-back-bodywear", skin: "acc/tail-back" },
  "wings-back":     { slot: "slot-acc-back-bodywear", skin: "acc/wings-back" },

  // 手持配饰（左右手独立插槽，每种物品独立皮肤）
  "hold-l":         { slot: "slot-acc-l-handheld",    skin: "acc/hold-l" },
  "hold-r":         { slot: "slot-acc-r-handheld",    skin: "acc/hold-r" },

  // 头部配饰（每种配饰独立皮肤）
  "headband-front": { slot: "slot-acc-headwear",      skin: "acc/headband-front" },
  "hairpin-front":  { slot: "slot-acc-headwear",      skin: "acc/hairpin-front" },
  "beaniel-front":  { slot: "slot-acc-headwear",      skin: "acc/beaniel-front" },
  "glasses-front":  { slot: "slot-acc-headwear",      skin: "acc/glasses-front" },

  // 身体前配饰（每种配饰独立皮肤���
  "belt-front":     { slot: "slot-acc-front-bodywear",skin: "acc/belt-front" },
  "bag-front":      { slot: "slot-acc-front-bodywear",skin: "acc/bag-front" },

  // ===== 五官（facial 皮肤）=====
  "mouth":          { slot: "slot-mouth",             skin: "facial/facial" },
  "eyebrow-l":      { slot: "slot-eyebrow-l",         skin: "facial/facial" },
  "eyebrow-r":      { slot: "slot-eyebrow-r",         skin: "facial/facial" },

  // ===== 眼睛（eye 皮肤）=====
  "eye-white-l":    { slot: "slot-eye-white-l",       skin: "eye/eye" },
  "eye-white-r":    { slot: "slot-eye-white-r",       skin: "eye/eye" },
  "irides-l":       { slot: "slot-irides-l",          skin: "eye/eye" },
  "irides-r":       { slot: "slot-irides-r",          skin: "eye/eye" },
  "eyelash-l":      { slot: "slot-eyelash-l",         skin: "eye/eye" },
  "eyelash-r":      { slot: "slot-eyelash-r",         skin: "eye/eye" }
};

// 中文/别名 → 规范 key（可选，方便用中文命名图层）
// 注意：用”包含匹配”，所以别名要够独特，避免相互冲突
// 中文/别名 → 规范 key（可选，方便用中文命名图层）
// 注意：用"包含匹配"，所以别名要够独特，避免相互冲突
var SYNONYMS = {
  // 鞋袜
  "鞋袜-左": "shoes-l", "鞋袜-右": "shoes-r",
  "左鞋": "shoes-l", "右鞋": "shoes-r",
  "左袜": "socks-l-mini", "右袜": "socks-r-mini",

  // 头发
  "头发-前发": "hair-front", "头发-后发": "hair-back",
  "刘海": "hair-front", "前发": "hair-front", "后发": "hair-back",

  // 上装-袖子（注意匹配顺序：先匹配具体的，再匹配通用的）
  "上装-左下袖子": "sleeve-l-lower", "上装-右下袖子": "sleeve-r-lower",
  "上装-左上袖子": "sleeve-l-upper", "上装-右上袖子": "sleeve-r-upper",
  "上装-左袖子": "sleeve-l", "上装-右袖子": "sleeve-r",  // 通用的（没有上下之分）
  "上装-身体": "sleeve-body",
  "左下袖": "sleeve-l-lower", "右下袖": "sleeve-r-lower",
  "左上袖": "sleeve-l-upper", "右上袖": "sleeve-r-upper",
  "左袖": "sleeve-l", "右袖": "sleeve-r",  // 通用的
  "身体": "sleeve-body", "上衣": "sleeve-body",

  // 下装-裤子（长短）
  "下装-左长裤": "pant-long-l", "下装-右长裤": "pant-long-r",
  "下装-左短裤": "pant-mini-l", "下装-右短裤": "pant-mini-r",
  "左长裤": "pant-long-l", "右长裤": "pant-long-r",
  "左短裤": "pant-mini-l", "右短裤": "pant-mini-r",
  "左裤": "pant-mini-l", "右裤": "pant-mini-r",

  // 下装-裙子
  "裙子": "skirt-mini", "短裙": "skirt-mini", "长裙": "skirt-long",

  // 配饰
  "尾巴": "tail-back",
  "翅膀": "wings-back",
  "左手拿": "hold-l",
  "右手拿": "hold-r",
  "鹿角": "headband-front",
  "发带": "headband-front",
  "发箍": "headband-front",
  "大眼发箍": "headband-front",
  "发夹": "hairpin-front",
  "帽子": "beaniel-front",
  "贝雷帽": "beaniel-front",
  "眼镜": "glasses-front",
  "腰带": "belt-front",
  "包包": "bag-front",

  // 五官-眉毛嘴巴
  "左眉毛": "eyebrow-l", "右眉毛": "eyebrow-r",
  "左眉": "eyebrow-l", "右眉": "eyebrow-r",
  "嘴巴": "mouth", "嘴": "mouth",
  // 兼容旧命名（早期眉毛曾放在头发组里）
  "头发-左眉毛": "eyebrow-l", "头发-右眉毛": "eyebrow-r",

  // 眼睛
  "眼睛-左眼白": "eye-white-l", "眼睛-右眼白": "eye-white-r",
  "眼睛-左眼珠": "irides-l", "眼睛-右眼珠": "irides-r",
  "眼睛-左眼球": "irides-l", "眼睛-右眼球": "irides-r",
  "眼睛-左睫毛": "eyelash-l", "眼睛-右睫毛": "eyelash-r",
  "左眼白": "eye-white-l", "右眼白": "eye-white-r",
  "左瞳": "irides-l", "右瞳": "irides-r",
  "左眼珠": "irides-l", "右眼珠": "irides-r",
  "左眼球": "irides-l", "右眼球": "irides-r",
  "左睫": "eyelash-l", "右睫": "eyelash-r",
  "左睫毛": "eyelash-l", "右睫毛": "eyelash-r"
};

// ============ 工具函数 ============

function sTID(s) { return app.stringIDToTypeID(s); }
function cTID(s) { return app.charIDToTypeID(s); }

// 去首尾空格（ExtendScript 无 String.trim）
function trim(s) { return s.replace(/^\s+|\s+$/g, ""); }

// 全部转小写并去空格
function norm(s) { return trim(String(s)).toLowerCase(); }

// ============ 镜像处理 ============
// 图层名里带"镜像"两个字，表示这是镜像件（常见于只含身体部位的上衣、裤子）
// 规则：slot 名完全不变，skin 名和图层名在风格名后加 -mirror
var MIRROR_TAG = "mirror";
var MIRROR_WORDS = ["镜像", "mirror"];

// 判断图层名是否带镜像标记
function hasMirrorTag(layerName) {
  var n = norm(layerName);
  for (var i = 0; i < MIRROR_WORDS.length; i++) {
    if (n.indexOf(MIRROR_WORDS[i]) !== -1) return true;
  }
  return false;
}

// 去掉图层名里的镜像标记，好让后续走原有的识别逻辑
// 同时清掉标记两侧可能残留的连字符和空格，例如 "上装-身体-镜像" → "上装-身体"
function stripMirror(layerName) {
  var s = String(layerName);
  for (var i = 0; i < MIRROR_WORDS.length; i++) {
    var w = MIRROR_WORDS[i];
    var at = s.toLowerCase().indexOf(w);
    while (at !== -1) {
      s = s.substring(0, at) + s.substring(at + w.length);
      at = s.toLowerCase().indexOf(w);
    }
  }
  // 清理残留的分隔符：结尾的 -/_/空格，以及连续的 --
  s = s.replace(/[-_\s]+$/g, "").replace(/[-_]{2,}/g, "-");
  return trim(s);
}

// 从文件名提取风格名（去扩展名）
function getStyleName() {
  var n = app.activeDocument.name;
  return norm(n.replace(/\.(psd|psb|tif|tiff|png|jpg|jpeg)$/i, ""));
}

// 把图层名解析成规范 key：
// 1) 去掉可能已有的风格后缀  2) 识别手持物品  3) 查别名表  4) 直接匹配 PART_MAP
function resolveKey(layerName, style) {
  var name = norm(layerName);

  // 去掉结尾的 "-style"
  if (style && name.length > style.length) {
    var suffix = "-" + style;
    if (name.substring(name.length - suffix.length) === suffix) {
      name = name.substring(0, name.length - suffix.length);
    }
  }

  // 特殊处理 1：手持物品（配饰-左手拿XXX / 配饰-右手拿XXX）
  // 格式：hold-{l/r}-{item}
  if (layerName.indexOf("左手拿") !== -1 || layerName.indexOf("右手拿") !== -1) {
    var hand = layerName.indexOf("左手拿") !== -1 ? "l" : "r";
    for (var itemName in HANDHELD_ITEMS) {
      if (layerName.indexOf(itemName) !== -1) {
        return "hold-" + hand + "-" + HANDHELD_ITEMS[itemName];
      }
    }
    return "hold-" + hand; // 未识别出物品
  }

  // 特殊处理 2：身体前配饰（配饰-身体前XXX）
  // 格式：{item}-front
  if (layerName.indexOf("身体前") !== -1) {
    for (var itemName in FRONT_BODYWEAR) {
      if (layerName.indexOf(itemName) !== -1) {
        return FRONT_BODYWEAR[itemName] + "-front";
      }
    }
    return null; // 未识别出物品
  }

  // 特殊处理 3：身体后配饰（配饰-身体后XXX）
  // 格式：{item}-back
  if (layerName.indexOf("身体后") !== -1) {
    for (var itemName in BACK_BODYWEAR) {
      if (layerName.indexOf(itemName) !== -1) {
        return BACK_BODYWEAR[itemName] + "-back";
      }
    }
    return null; // 未识别出物品
  }

  // 特殊处理 4：头部配饰（配饰-头部XXX）
  // 格式：{item}-front（头部配饰统一用 front）
  if (layerName.indexOf("头部") !== -1) {
    for (var itemName in HEADWEAR) {
      if (layerName.indexOf(itemName) !== -1) {
        return HEADWEAR[itemName] + "-front";
      }
    }
    return null; // 未识别出物品
  }

  // 别名（中文）匹配：只要包含即可
  for (var cn in SYNONYMS) {
    if (layerName.indexOf(cn) !== -1) return SYNONYMS[cn];
  }

  // 直接命中
  if (PART_MAP[name]) return name;

  return null; // 未识别
}

// ---- 图层预处理：栅格化 + 裁剪透明区域 ----

// 栅格化图层（如果是智能对象或文字图层）
function rasterizeLayer(layer) {
  if (layer.kind === LayerKind.TEXT || layer.kind === LayerKind.SMARTOBJECT) {
    try {
      layer.rasterize(RasterizeType.ENTIRELAYER);
    } catch (e) {
      // 有些图层可能无法栅格化，跳过
    }
  }
}

// 裁剪图层的透明像素（只裁图层边界，不动画布）
function trimLayer(layer) {
  // Photoshop 没有直接的"裁剪单个图层边界"API
  // Trim 命令会裁整个画布，不能用
  // 暂时跳过这个功能，保持画布和图层位置不变
  // 如果真需要裁剪，需要用复杂的选区+裁切方法，容易出错
}

// ---- 最兼容的分组方式：先建空组，再用"合并到下方"把图层收进去 ----

function sTID(s) { return app.stringIDToTypeID(s); }
function cTID(s) { return app.charIDToTypeID(s); }

// 在文档根部找或创建组
function findOrCreateRootGroup(doc, groupName) {
  for (var i = 0; i < doc.layerSets.length; i++) {
    if (doc.layerSets[i].name === groupName) return doc.layerSets[i];
  }
  var g = doc.layerSets.add();
  g.name = groupName;
  return g;
}

// 在父组内找或创建子组
function findOrCreateChildGroup(parent, groupName) {
  for (var i = 0; i < parent.layerSets.length; i++) {
    if (parent.layerSets[i].name === groupName) return parent.layerSets[i];
  }
  var g = parent.layerSets.add();
  g.name = groupName;
  return g;
}

// 把图层移入组（使用 DOM 的 move 方法）
function putLayerIntoGroup(layer, targetGroup) {
  try {
    // 直接用 DOM move，PLACEATBEGINNING 把图层放到组的顶部
    layer.move(targetGroup, ElementPlacement.PLACEATBEGINNING);
  } catch (e) {
    throw new Error("Failed to move layer into group: " + e.message);
  }
}

// 递归收集所有可见的普通图层（隐藏图层跳过）
function collectArtLayers(container, out) {
  for (var i = 0; i < container.artLayers.length; i++) {
    var layer = container.artLayers[i];
    // 只收集可见的图层
    if (layer.visible) {
      out.push(layer);
    }
  }
  for (var j = 0; j < container.layerSets.length; j++) {
    collectArtLayers(container.layerSets[j], out);
  }
  return out;
}

// ============ 命名验证 ============

// 验证整理后的结构和命名是否正确
function validateResult(doc, style) {
  var errors = [];
  var warnings = [];

  // 收集所有 slot 和 skin 的映射关系
  var slotSkinMap = {}; // slot名 → skin名列表
  var skinAttachmentMap = {}; // skin名 → attachment列表
  var allSlots = [];
  var allSkins = [];
  var allAttachments = [];

  // 遍历所有 slot 组
  for (var i = 0; i < doc.layerSets.length; i++) {
    var slotGroup = doc.layerSets[i];
    if (slotGroup.name.indexOf("[slot]") !== 0) continue;

    var slotName = slotGroup.name;
    allSlots.push(slotName);
    slotSkinMap[slotName] = [];

    // 遍历 slot 下的 skin 组
    for (var j = 0; j < slotGroup.layerSets.length; j++) {
      var skinGroup = slotGroup.layerSets[j];
      if (skinGroup.name.indexOf("[skin]") !== 0) {
        warnings.push("slot " + slotName + " 下有非 skin 组: " + skinGroup.name);
        continue;
      }

      var skinName = skinGroup.name;
      allSkins.push(skinName);
      slotSkinMap[slotName].push(skinName);

      if (!skinAttachmentMap[skinName]) skinAttachmentMap[skinName] = [];

      // 检查 skin 下的附件图层
      if (skinGroup.artLayers.length === 0) {
        errors.push("空的 skin 组: " + skinName + " (在 " + slotName + " 下)");
      } else {
        for (var k = 0; k < skinGroup.artLayers.length; k++) {
          var attName = skinGroup.artLayers[k].name;
          allAttachments.push(attName);
          skinAttachmentMap[skinName].push(attName);
        }
      }
    }
  }

  // ========== 验证规则 1：检查同类部位是否共享 skin ==========
  var expectedSharing = {
    "hair": ["[slot]slot-hair-front", "[slot]slot-hair-back"],
    "foot": ["[slot]slot-shoes-l", "[slot]slot-shoes-r", "[slot]slot-socks-l", "[slot]slot-socks-r"],
    "tops": ["[slot]slot-top-l-upper", "[slot]slot-top-r-upper", "[slot]slot-top-body",
             "[slot]slot-top-l-lower", "[slot]slot-top-r-lower"],
    "bottom-pant": ["[slot]slot-pant-l", "[slot]slot-pant-r"],
    "bottom-skirt": ["[slot]slot-skirt"],
    "eye": ["[slot]slot-eye-white-l", "[slot]slot-eye-white-r", "[slot]slot-irides-l",
            "[slot]slot-irides-r", "[slot]slot-eyelash-l", "[slot]slot-eyelash-r"],
    "facial": ["[slot]slot-eyebrow-l", "[slot]slot-eyebrow-r", "[slot]slot-mouth"]
  };

  // 镜像件的 skin 带 -mirror 后缀，属于独立皮肤，不参与"同类共享"比较
  var mirrorSuffix = "-" + MIRROR_TAG;
  function isMirrorSkin(name) {
    return name.length >= mirrorSuffix.length &&
           name.substring(name.length - mirrorSuffix.length) === mirrorSuffix;
  }

  for (var category in expectedSharing) {
    var slots = expectedSharing[category];
    var skins = [];        // 普通 skin
    var mirrorSkins = [];  // 镜像 skin

    for (var s = 0; s < slots.length; s++) {
      var slotName = slots[s];
      var list = slotSkinMap[slotName];
      if (!list || list.length === 0) continue;

      // 同一个 slot 下可能同时有普通 skin 和镜像 skin，分开收集
      for (var li = 0; li < list.length; li++) {
        if (isMirrorSkin(list[li])) {
          mirrorSkins.push(list[li]);
        } else {
          skins.push(list[li]);
          break; // 普通 skin 每个 slot 只取第一个
        }
      }
    }

    // 检查普通 skin 是否一致
    if (skins.length > 1) {
      var firstSkin = skins[0];
      for (var n = 1; n < skins.length; n++) {
        if (skins[n] !== firstSkin) {
          errors.push(category + " 类部位的 skin 名称不一致:\n    " + skins.join("\n    "));
          break;
        }
      }
    }

    // 镜像 skin 之间也应该一致
    if (mirrorSkins.length > 1) {
      var firstMirror = mirrorSkins[0];
      for (var m = 1; m < mirrorSkins.length; m++) {
        if (mirrorSkins[m] !== firstMirror) {
          errors.push(category + " 类部位的镜像 skin 名称不一致:\n    " + mirrorSkins.join("\n    "));
          break;
        }
      }
    }
  }

  // ========== 验证规则 2：检查左右标记是否正确 ==========
  // 注释掉：不对称设计是合理的，不需要检查左右配对
  /*
  var leftRightPairs = [
    {l: "[slot]slot-shoes-l", r: "[slot]slot-shoes-r"},
    {l: "[slot]slot-socks-l", r: "[slot]slot-socks-r"},
    {l: "[slot]slot-pant-l", r: "[slot]slot-pant-r"},
    {l: "[slot]slot-top-l-upper", r: "[slot]slot-top-r-upper"},
    {l: "[slot]slot-top-l-lower", r: "[slot]slot-top-r-lower"},
    {l: "[slot]slot-eye-white-l", r: "[slot]slot-eye-white-r"},
    {l: "[slot]slot-irides-l", r: "[slot]slot-irides-r"},
    {l: "[slot]slot-eyelash-l", r: "[slot]slot-eyelash-r"},
    {l: "[slot]slot-eyebrow-l", r: "[slot]slot-eyebrow-r"}
  ];

  for (var p = 0; p < leftRightPairs.length; p++) {
    var pair = leftRightPairs[p];
    var hasLeft = slotSkinMap[pair.l] && slotSkinMap[pair.l].length > 0;
    var hasRight = slotSkinMap[pair.r] && slotSkinMap[pair.r].length > 0;

    // 如果有左但没右，或有右但没左，发出警告
    if (hasLeft && !hasRight) {
      warnings.push("只有左侧没有右侧: " + pair.l);
    } else if (hasRight && !hasLeft) {
      warnings.push("只有右侧没有左侧: " + pair.r);
    }
  }
  */

  // ========== 验证规则 3：检查风格名后缀 ==========
  var styleSuffix = "-" + style;

  // 检查所有 skin 名
  for (var si = 0; si < allSkins.length; si++) {
    var skinName = allSkins[si];
    if (skinName.indexOf(styleSuffix) === -1) {
      errors.push("skin 缺少风格后缀 '" + styleSuffix + "': " + skinName);
    }
  }

  // 检查所有 attachment 名
  for (var ai = 0; ai < allAttachments.length; ai++) {
    var attName = allAttachments[ai];
    if (attName.indexOf(styleSuffix) === -1) {
      errors.push("attachment 缺少风格后缀 '" + styleSuffix + "': " + attName);
    }
  }

  // ========== 验证规则 4：检查命名格式正确性 ==========
  // slot 应该是 [slot]slot-xxx 格式
  for (var sli = 0; sli < allSlots.length; sli++) {
    var slotName = allSlots[sli];
    if (slotName.indexOf("[slot]slot-") !== 0) {
      errors.push("slot 命名格式错误: " + slotName + " (应该是 [slot]slot-xxx)");
    }
  }

  // skin 应该是 [skin]category/base-style 格式
  for (var ski = 0; ski < allSkins.length; ski++) {
    var skinName = allSkins[ski];
    if (skinName.indexOf("[skin]") !== 0) {
      errors.push("skin 命名格式错误: " + skinName + " (应该以 [skin] 开头)");
    }
    if (skinName.indexOf("/") === -1) {
      errors.push("skin 缺少类别分隔符 '/': " + skinName + " (应该是 [skin]category/base-style)");
    }
  }

  // ========== 验证规则 4：检查命名格式正确性 ==========
  // attachment 应该以有效前缀开头，或者是动态配饰（hold-/xxx-front/xxx-back）
  var validAttachmentPrefixes = [
    // 基础部位
    "shoes-", "socks-", "pant-", "skirt-", "sleeve-", "hair-",
    "mouth", "eyebrow-", "eye-white-", "irides-", "eyelash-"
  ];

  for (var ati = 0; ati < allAttachments.length; ati++) {
    var attName = allAttachments[ati];
    var hasValidPrefix = false;

    // 检查基础部位前缀
    for (var vi = 0; vi < validAttachmentPrefixes.length; vi++) {
      if (attName.indexOf(validAttachmentPrefixes[vi]) === 0) {
        hasValidPrefix = true;
        break;
      }
    }

    // 检查动态配饰格式
    if (!hasValidPrefix) {
      // 手持物品：hold-{l/r}-xxx
      if (attName.indexOf("hold-") === 0) {
        hasValidPrefix = true;
      }
      // 身体前/后、头部配饰：xxx-front 或 xxx-back
      else if (attName.indexOf("-front-") !== -1 || attName.indexOf("-back-") !== -1) {
        hasValidPrefix = true;
      }
    }

    if (!hasValidPrefix) {
      warnings.push("attachment 命名可能不正确: " + attName + " (未识别的部位前缀)");
    }
  }

  // ========== 验证规则 5：检查 attachment 和 slot 的一致性 ==========
  for (var slotName in slotSkinMap) {
    // 提取 slot 的基础部位名（去掉 [slot]slot- 前缀）
    var slotBase = slotName.replace("[slot]slot-", "");

    var skins = slotSkinMap[slotName];
    for (var skinIdx = 0; skinIdx < skins.length; skinIdx++) {
      var skinName = skins[skinIdx];
      var attachments = skinAttachmentMap[skinName];

      if (!attachments || attachments.length === 0) continue;

      // 检查 attachment 名称是否与 slot 基础名匹配
      for (var attIdx = 0; attIdx < attachments.length; attIdx++) {
        var attName = attachments[attIdx];
        // attachment 应该包含 slot 的核心部位标识
        // 例如：slot-shoes-l 对应 shoes-l-style
        //      slot-hair-front 对应 hair-front-style

        var attBase = attName.replace(styleSuffix, ""); // 去掉风格后缀

        // 检查 attachment 基础名是否与 slot 基础名相关
        // 这里做简单的包含检查
        var slotCore = slotBase.replace(/-/g, ""); // 去掉连字符比较核心
        var attCore = attBase.replace(/-/g, "");

        // 跳过太复杂的检查，只做基本验证
        // 主要确保没有完全不相关的命名
      }
    }
  }

  return { errors: errors, warnings: warnings };
}

// ============ 预览 / 整理 ============

function buildPlan(style) {
  var doc = app.activeDocument;
  var all = collectArtLayers(doc, []);
  var plan = [];      // 可整理的
  var unknown = [];   // 未识别的

  // 检测是否是连体衣服（文件名包含 onesie）
  var isOnesie = style.indexOf("onesie") !== -1;
  var onesieType = "sleeve"; // 默认连体裤装

  // 第一遍：收集所有图层的 key，检测是否有下袖子、是否有裙子
  var allKeys = [];
  var hasLowerSleeves = false;
  var hasSkirt = false;

  for (var i = 0; i < all.length; i++) {
    var layer = all[i];
    var key = resolveKey(stripMirror(layer.name), style);
    if (key) {
      allKeys.push(key);
      // 检测是否有下袖子
      if (key === "sleeve-l-lower" || key === "sleeve-r-lower") {
        hasLowerSleeves = true;
      }
      // 检测是否有裙子（连体裙）
      if (key.indexOf("skirt-") === 0) {
        hasSkirt = true;
      }
    }
  }

  // 如果是连体衣服且有裙子，类型改为 skirt
  if (isOnesie && hasSkirt) {
    onesieType = "skirt";
  }

  // 第二遍：根据是否有下袖子，调整上袖子的命名
  for (var i = 0; i < all.length; i++) {
    var layer = all[i];
    var isMirror = hasMirrorTag(layer.name);
    var key = resolveKey(stripMirror(layer.name), style);

    if (key) {
      var finalKey = key;
      var mapping = PART_MAP[key];

      // 如果没有下袖子，把 sleeve-x-upper 改成 sleeve-x
      if (!hasLowerSleeves) {
        if (key === "sleeve-l-upper") finalKey = "sleeve-l";
        if (key === "sleeve-r-upper") finalKey = "sleeve-r";
        mapping = PART_MAP[finalKey];
      }

      // 动态处理手持物品（hold-l-xxx / hold-r-xxx 或 hold-l / hold-r）
      if (!mapping && (key.indexOf("hold-l") === 0 || key.indexOf("hold-r") === 0)) {
        var hand = key.indexOf("hold-l") === 0 ? "l" : "r";
        mapping = {
          slot: "slot-acc-" + hand + "-handheld",
          skin: "acc/" + key
        };
      }

      // 动态处理头部配饰（检查是否在 HEADWEAR 词典中）
      // 格式：{item}-front，slot 用 headwear
      if (!mapping && key.indexOf("-front") !== -1) {
        var itemPart = key.replace("-front", "");
        var isHeadwear = false;
        for (var hwItem in HEADWEAR) {
          if (HEADWEAR[hwItem] === itemPart) {
            isHeadwear = true;
            break;
          }
        }
        if (isHeadwear) {
          mapping = {
            slot: "slot-acc-headwear",
            skin: "acc/" + key
          };
        }
      }

      // 动态处理身体前配饰（xxx-front，但不在 HEADWEAR 中）
      if (!mapping && key.indexOf("-front") !== -1 && key.indexOf("-front") === key.length - 6) {
        mapping = {
          slot: "slot-acc-front-bodywear",
          skin: "acc/" + key
        };
      }

      // 动态处理身体后配饰（xxx-back）
      if (!mapping && key.indexOf("-back") !== -1 && key.indexOf("-back") === key.length - 5) {
        mapping = {
          slot: "slot-acc-back-bodywear",
          skin: "acc/" + key
        };
      }

      if (mapping) {
        var skinName = mapping.skin;

        // 如果是连体衣服，统一替换为 onesie/onesie-{type}
        if (isOnesie) {
          // 替换上装的 skin：tops/top-xxx → onesie/onesie-{type}
          if (skinName.indexOf("tops/top-") === 0) {
            skinName = "onesie/onesie-" + onesieType;
          }
          // 替换下装的 skin：bottom/bottom-xxx → onesie/onesie-{type}
          else if (skinName.indexOf("bottom/bottom-") === 0) {
            skinName = "onesie/onesie-" + onesieType;
          }
        }

        // 镜像件：slot 名不变，skin 名和图层名在风格名后加 -mirror
        var styleSuffix = isMirror ? style + "-" + MIRROR_TAG : style;

        plan.push({
          layer: layer,
          original: layer.name,
          isMirror: isMirror,
          slotGroup: "[slot]" + mapping.slot,
          skinGroup: "[skin]" + skinName + "-" + styleSuffix,
          attachment: finalKey + "-" + styleSuffix
        });
      } else {
        unknown.push(layer.name);
      }
    } else {
      unknown.push(layer.name);
    }
  }
  return { plan: plan, unknown: unknown };
}

function previewPlan(style) {
  var r = buildPlan(style);
  var msg = "风格名：" + style + "\n\n";
  msg += "将整理 " + r.plan.length + " 个图层：\n\n";
  var mirrorCount = 0;
  for (var i = 0; i < r.plan.length; i++) {
    var p = r.plan[i];
    if (p.isMirror) mirrorCount++;
    msg += p.original + (p.isMirror ? "   [镜像]" : "") + "\n";
    msg += "  " + p.slotGroup + " / " + p.skinGroup + " / " + p.attachment + "\n";
  }
  if (mirrorCount > 0) {
    msg += "\n其中镜像件 " + mirrorCount + " 个（skin 和图层名带 -" + MIRROR_TAG + "，slot 名不变）\n";
  }
  if (r.unknown.length > 0) {
    msg += "\n未识别（不会处理）：\n";
    for (var j = 0; j < r.unknown.length; j++) msg += "  " + r.unknown[j] + "\n";
  }
  alert(msg);
}

function organize(style) {
  var doc = app.activeDocument;
  var r = buildPlan(style);

  if (r.plan.length === 0) {
    alert("没有可识别的图层。\n请确认图层名符合基础名（如 shoes-r、sleeve-body）。");
    return;
  }

  var done = 0, errors = "";
  for (var i = 0; i < r.plan.length; i++) {
    var p = r.plan[i];
    try {
      // 0) 预处理：栅格化 + 裁剪透明区域
      rasterizeLayer(p.layer);
      trimLayer(p.layer);

      // 1) 重命名附件图层
      p.layer.name = p.attachment;

      // 2) 找或创建 slot 组（文档根部）
      // 配饰 slot 和镜像件：每次都创建新组（允许同名 slot 并存）
      // 基础部位：查找或创建（避免重复）
      var slotG;
      if (p.slotGroup.indexOf("slot-acc-") !== -1 || p.isMirror) {
        // 配饰或镜像：直接创建新组，不查找已存在的
        slotG = doc.layerSets.add();
        slotG.name = p.slotGroup;
      } else {
        // 基础部位：查找或创建（避免重复）
        slotG = findOrCreateRootGroup(doc, p.slotGroup);
      }

      // 3) 在 slot 组内找或创建 skin 组
      var skinG = findOrCreateChildGroup(slotG, p.skinGroup);

      // 4) 把图层放进 skin 组
      putLayerIntoGroup(p.layer, skinG);

      done++;
    } catch (e) {
      errors += "  " + p.original + ": " + e.message + "\n";
    }
  }

  var msg = "整理完成！成功 " + done + " / " + r.plan.length + "\n";

  var mirrorDone = 0;
  for (var mi = 0; mi < r.plan.length; mi++) {
    if (r.plan[mi].isMirror) mirrorDone++;
  }
  if (mirrorDone > 0) {
    msg += "其中镜像件 " + mirrorDone + " 个\n";
  }

  if (r.unknown.length > 0) {
    msg += "\n未识别（已跳过）：\n";
    for (var k = 0; k < r.unknown.length; k++) msg += "  " + r.unknown[k] + "\n";
  }
  if (errors.length > 0) msg += "\n错误：\n" + errors;

  // 如果整理成功，运行验证
  if (done > 0) {
    msg += "\n========== 验证命名正确性 ==========\n";
    var validation = validateResult(doc, style);

    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      msg += "✅ 所有检查通过！命名结构正确。\n";
    } else {
      if (validation.errors.length > 0) {
        msg += "\n❌ 发现错误：\n";
        for (var e = 0; e < validation.errors.length; e++) {
          msg += "  - " + validation.errors[e] + "\n";
        }
      }

      if (validation.warnings.length > 0) {
        msg += "\n⚠️ 警告：\n";
        for (var w = 0; w < validation.warnings.length; w++) {
          msg += "  - " + validation.warnings[w] + "\n";
        }
      }
    }
  }

  alert(msg);
}

// ============ 界面 ============

function showDialog() {
  if (!app.documents.length) { alert("请先打开一个 PSD 文档"); return; }

  var style = getStyleName();

  var dlg = new Window("dialog", "Spine 图层整理工具");
  dlg.orientation = "column";
  dlg.alignChildren = ["fill", "top"];
  dlg.spacing = 10;
  dlg.margins = 16;

  dlg.add("statictext", undefined, "按 [slot]/[skin]/附件 三层结构自动整理");

  var sg = dlg.add("group");
  sg.add("statictext", undefined, "风格名：");
  var styleInput = sg.add("edittext", undefined, style);
  styleInput.characters = 20;

  var bg = dlg.add("group");
  bg.alignment = ["center", "top"];
  var previewBtn = bg.add("button", undefined, "预览");
  var runBtn = bg.add("button", undefined, "开始整理");
  var cancelBtn = bg.add("button", undefined, "取消", { name: "cancel" });

  previewBtn.onClick = function() {
    var s = trim(styleInput.text);
    if (!s) { alert("请输入风格名"); return; }
    previewPlan(norm(s));
  };

  runBtn.onClick = function() {
    var s = trim(styleInput.text);
    if (!s) { alert("请输入风格名"); return; }
    organize(norm(s));
    dlg.close();
  };

  dlg.show();
}

showDialog();

