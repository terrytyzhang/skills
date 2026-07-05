# 关键词分析方法论

## 一、KRG 公式说明

```
KRG = Volume × CPC / KD
```

| 变量 | 含义 | 说明 |
|------|------|------|
| Volume | 月搜索量 | 需求规模指标 |
| CPC | 单次点击成本 | 商业价值指标（广告主愿意支付的金额） |
| KD | 关键词难度 | 竞争激烈程度（0-100） |

**KRG 解读:**
- **KRG > 1000** — 高价值词，商业回报大，但通常竞争也激烈
- **KRG 100-1000** — 中等价值，值得做但需要策略
- **KRG < 100** — 低价值/长尾词，容易排名但回报有限

**为什么不用单纯的 Volume 或 CPC？**
- Volume 高但 CPC 低 → 流量大但用户付费意愿低（如 "what is ai"）
- CPC 高但 Volume 低 → 精准但市场规模小
- KD 高 → 竞争激烈，投入产出比低
- KRG 综合三者平衡了市场规模、商业价值和竞争难度

## 二、Web Tool 相关性判断逻辑

### 过滤原则

```
关键词判断流程:
1. 是否包含 WebTool 正面特征词? → 通过
2. 是否包含物理设备语境词? → 排除
3. 是否包含非Web噪声词? → 排除
4. 默认通过
```

### 噪声词分类

| 类别 | 示例 | 排除原因 |
|------|------|----------|
| 物理设备 | generator, motor, pump | 发电机、马达等硬件，非软件工具 |
| 医疗设备 | surgery, pharmaceutical | 医疗行业，非 Web 工具 |
| 食品农业 | recipe, farming | 食谱、农业，非工具型产品 |
| 金融保险 | mortgage, insurance | 金融服务，非工具型 Web 产品 |
| 成人内容 | dating, gambling | 非目标市场 |

### 特征词分类

| 类别 | 示例 | 保留原因 |
|------|------|----------|
| Web 标记 | online, website, web | 明确标注在线/Web属性 |
| 工具后缀 | generator, converter, checker | Web 语境下的工具词 |
| 技术术语 | api, saas, software | 软件/SaaS属性 |
| AI 术语 | ai, chatbot, nlp | AI工具属性 |
| 功能描述 | automation, workflow, integration | 工具型功能 |

### 边界情况处理

**"generator" 的歧义消解:**
- `"ai image generator"` → 包含 "ai"/"image" → WebTool ✅
- `"diesel generator"` → 包含 "diesel" (物理语境) → 非WebTool ❌
- `"pdf generator"` → 包含 "pdf" → WebTool ✅
- `"standby generator"` → 包含 "standby" (物理语境) → 非WebTool ❌

## 三、AI 分类标准

### AI工具
关键词直接提及 AI/ML 相关技术：
- 明确提到 "ai", "artificial intelligence", "machine learning"
- 提到具体 AI 模型/产品: "chatgpt", "copilot", "midjourney"
- AI 专有概念: "nlp", "computer vision", "prompt"

### AI+传统（可结合创新）
传统工具但有 AI 增强潜力：
- 内容生成类: "generator", "creator", "builder", "maker"
- 分析处理类: "analyzer", "detection", "recognition"
- 编辑优化类: "editor", "enhance", "upscale", "optimizer"

### 传统工具
纯功能型工具，暂无明确 AI 结合点：
- 格式转换: "pdf converter", "json to csv"
- 基础工具: "qrcode generator", "password checker"
- 编码类: "hash generator", "base64 encoder"

## 四、竞品分析框架

### Top 3 竞品分析维度

#### 优势识别
1. **域名权威性** — wikipedia, github, medium 等高权重域名
2. **Title 优化** — 是否精准匹配关键词
3. **内容深度** — 是否为教程型、指南型内容
4. **获客策略** — 是否提供免费/开源版本

#### 劣势识别
1. **聚合类网站** — producthunt, alternativeto 等非直接竞争
2. **URL 层级** — 深度 > 5 层说明非核心页面
3. **关键词缺失** — Title 未命中关键词
4. **内容时效** — 明显过时的内容
5. **描述偏短** — snippet < 80 字符，可能内容单薄

#### 切入机会
1. 竞品是聚合站 → 可做专业垂直工具页面
2. 竞品未提免费 → 提供免费版吸引用户
3. 竞品未提 AI → 打造 AI 增强版差异化
4. 竞品非工具页 → 创建工具页面提升转化
5. 竞品弱点 ≥ 3 处 → 做好基础即可超越

### 使用限制
- 启发式分析，基于搜索结果页面信息，不如深度 SEO 审计准确
- 受限于搜索 API 返回的 snippet 长度（通常 150-160 字符）
- 建议人工复核 Top 10 结果以确认分析结论