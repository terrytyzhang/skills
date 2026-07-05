#!/usr/bin/env node

/**
 * SEO Customer Acquisition Strategy Tool
 * 基于AI SaaS工具出海课程的SEO获客九步策略
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 九步策略指南
const strategies = {
  step1: {
    title: '第一步：明确业务定位',
    description: '用一句话回答：我提供什么产品服务，为谁，带来什么差异化价值？',
    questions: [
      '1. 你的产品/服务是什么？',
      '2. 你的目标客户是谁？',
      '3. 你的差异化价值是什么？',
      '4. 你的竞品有哪些？',
      '5. 你的核心优势是什么？'
    ],
    template: 'business-positioning.md'
  },
  step2: {
    title: '第二步：梳理商业模式',
    description: '用经典九宫格标准化梳理商业模式',
    questions: [
      '1. 客户细分（目标客户是谁？）',
      '2. 价值主张（为客户提供什么价值？）',
      '3. 渠道通路（如何触达客户？）',
      '4. 客户关系（如何维护客户关系？）',
      '5. 收入来源（如何赚钱？）',
      '6. 核心资源（需要哪些核心资源？）',
      '7. 关键业务（关键业务活动是什么？）',
      '8. 重要合作（需要哪些合作伙伴？）',
      '9. 成本结构（主要成本是什么？）'
    ],
    template: 'business-model.md'
  },
  step3: {
    title: '第三步：验证产品市场匹配',
    description: '找出理想客户画像和负面客户画像',
    questions: [
      '1. 理想客户的人口统计特征？',
      '2. 理想客户的行为特征？',
      '3. 理想客户的心理特征？',
      '4. 理想客户的使用场景？',
      '5. 负面客户特征（需要远离的客户）？',
      '6. 验证方法（广告/红人/其他）？'
    ],
    template: 'customer-journey.md'
  },
  step4: {
    title: '第四步：深挖用户使用场景',
    description: '梳理完整的客户决策旅程',
    questions: [
      '1. 认知阶段：用户如何发现你的产品？',
      '2. 考虑阶段：用户如何评估你的产品？',
      '3. 决策阶段：用户如何决定购买？',
      '4. 使用阶段：用户如何使用产品？',
      '5. 忠诚阶段：用户如何成为忠实客户？',
      '6. 推荐阶段：用户如何推荐给他人？'
    ],
    template: 'customer-journey.md'
  },
  step5: {
    title: '第五步：明确各个渠道在漏斗中的作用',
    description: '全渠道布局，线上线下结合',
    questions: [
      '1. 线上渠道有哪些？',
      '2. 线下渠道有哪些？',
      '3. 各渠道的获客成本？',
      '4. 各渠道的转化率？',
      '5. 各渠道的用户质量？',
      '6. 各渠道的反馈质量？'
    ]
  },
  step6: {
    title: '第六步：制定总体获客策略',
    description: '根据资源确定执行优先级',
    questions: [
      '1. 总体目标（月/季度/年）？',
      '2. 核心渠道（1-3个）？',
      '3. 辅助渠道（2-4个）？',
      '4. 预算分配比例？',
      '5. 关键时间节点？'
    ]
  },
  step7: {
    title: '第七步：确定营销预算',
    description: '根据资源分配预算',
    questions: [
      '1. 资金预算总额？',
      '2. 时间预算（小时/周）？',
      '3. 团队规模？',
      '4. 技术能力评估？',
      '5. 各渠道预算分配？'
    ],
    template: 'marketing-budget.md'
  },
  step8: {
    title: '第八步：制定细分渠道策略',
    description: 'SEO、社媒、广告、红人、合作策略',
    questions: [
      '1. SEO策略重点？',
      '2. 内容策略重点？',
      '3. 社交媒体策略？',
      '4. 广告投放策略？',
      '5. 红人合作策略？'
    ]
  },
  step9: {
    title: '第九步：定期复盘调整策略',
    description: '3个月小复盘，6-9个月大复盘',
    questions: [
      '1. 各渠道ROI分析？',
      '2. 客户满意度调查结果？',
      '3. 竞争对手动态？',
      '4. 行业趋势变化？',
      '5. 团队能力变化？'
    ],
    template: 'review-adjustment.md'
  }
};

// AI提示模板
const aiPrompts = {
  positioning: `请帮我分析以下竞品：[列出2-3个主要竞品]
我的情况是：[个人开发者/小团队/创业公司，有无资金/团队限制]
如何差异化竞争？
请生成一个清晰的定位语句。`,

  businessModel: `请帮我生成商业模式九宫格：
目标客群：[描述目标客户]
产品服务：[描述产品服务]
差异化价值：[描述差异化价值]
预算限制：[描述预算限制]`,

  customerJourney: `请帮我分析[目标客户]的完整客户旅程：
客户画像：[描述客户特征]
使用场景：[描述主要使用场景]
决策因素：[描述购买决策因素]`,

  marketingBudget: `请帮我制定营销预算：
项目类型：[AI工具/SaaS产品/电商]
目标客户：[描述目标客户]
预算限制：[描述预算限制]
时间范围：[描述时间范围]`,

  reviewAdjustment: `请帮我分析当前营销策略：
当前渠道：[列出主要渠道]
当前效果：[描述效果数据]
当前问题：[描述遇到的问题]
请给出调整建议。`
};

// 打印欢迎信息
function printWelcome() {
  console.log(`
=============================================
      SEO获客九步策略工具 v1.0
=============================================

基于AI SaaS工具出海课程的完整获客框架

核心思维转变：
• 从「关键词本位思维」→「全网优化客户旅程思维」
• 传统SEO模式在AI时代面临巨大挑战
• 80% B2B决策流程在水下，传统工具追踪不到
• AI会综合第三方信息，用户先通过AI了解品牌

九步策略框架：
1. 明确业务定位
2. 梳理商业模式
3. 验证产品市场匹配
4. 深挖用户使用场景
5. 明确各个渠道作用
6. 制定总体获客策略
7. 确定营销预算
8. 制定细分渠道策略
9. 定期复盘调整

=============================================
`);
}

// 显示步骤菜单
function showMenu() {
  console.log('\n请选择要执行的步骤（输入数字1-9，或输入"all"执行全部步骤）：');
  Object.keys(strategies).forEach((key, index) => {
    console.log(`${index + 1}. ${strategies[key].title}`);
  });
  console.log('10. 查看Water AI案例实战');
  console.log('11. 查看AI提示模板');
  console.log('0. 退出');
}

// 执行单个步骤
async function executeStep(stepKey) {
  const step = strategies[stepKey];
  if (!step) return;

  console.log(`\n${step.title}`);
  console.log('='.repeat(50));
  console.log(step.description);
  console.log('');

  // 如果有模板文件，显示模板路径
  if (step.template) {
    const templatePath = path.join(__dirname, 'templates', step.template);
    console.log(`📁 模板文件：${templatePath}`);
    console.log('💡 提示：请参考模板文件填写详细信息');
  }

  // 显示问题列表
  console.log('\n需要回答的问题：');
  step.questions.forEach((question, index) => {
    console.log(`${question}`);
  });

  console.log('\n请回答上述问题（输入"skip"跳过）：');
  
  const answers = [];
  for (const question of step.questions) {
    const answer = await askQuestion(question + ' ');
    if (answer.toLowerCase() === 'skip') {
      answers.push('【跳过】');
      continue;
    }
    answers.push(answer);
  }

  // 保存答案
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, `${stepKey}-answers.txt`);
  const content = `# ${step.title}\n\n${step.description}\n\n## 问题与回答\n\n${step.questions.map((q, i) => `### ${q}\n${answers[i]}\n`).join('\n')}`;
  
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`\n✅ 答案已保存至：${outputFile}`);
}

// 提问函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 显示Water AI案例
function showWaterAICase() {
  console.log(`
=============================================
      Water AI案例实战
=============================================

案例背景：
• 竞品：Water AI等AI文本人性化工具
• 问题：只做简单换词，没有保留个人风格
• 机会：为个人IP创作者提供保留个人音色的工具

九步策略应用：

1. 差异化定位
   • 定位：为高频输出的个人IP创作者提供保留个人音色的AI人性化工具
   • 核心价值：保留100%个人品牌声音，省去人工润色时间
   • 差异化：对手让机器像人，我们让机器像用户自己

2. 商业模式
   • 目标客群：高频输出的个人IP、独立博主、垂类专家
   • 负面客户：找免费工具的学生、黑帽站长、一次性白嫖用户
   • 变现模式：免费体验1000字，专业版15-29美元/月，按「音色胶囊」付费

3. 全渠道布局
   • 认知阶段：LinkedIn发帖 + 冷私信
   • 评估阶段：竞品对比落地页（教育AI）
   • 决策阶段：邮件营销跟进

4. SEO策略
   • 优先做：漏斗底部竞品拦截长尾词
   • 布局：场景化长尾词
   • 技术：寄生虫SEO，借第三方高权重平台

5. 预算与目标
   • 6个月预算：600美元
   • 目标营收：10,000美元
   • 项目估值：300,000-400,000美元（年营收×30-40倍）

关键洞察：
• SEO是放大器不是启动器，先验证商业模式
• AI优先推荐，对比页教育AI
• 及时变现，不要死扛
`);
}

// 显示AI提示模板
function showAIPrompts() {
  console.log(`
=============================================
      AI提示模板
=============================================

1. 业务定位AI提示：
${aiPrompts.positioning}

2. 商业模式AI提示：
${aiPrompts.businessModel}

3. 客户旅程AI提示：
${aiPrompts.customerJourney}

4. 营销预算AI提示：
${aiPrompts.marketingBudget}

5. 复盘调整AI提示：
${aiPrompts.reviewAdjustment}

使用建议：
1. 将[]中的内容替换为你的实际情况
2. 将提示复制到AI工具（如ChatGPT、Claude等）
3. 根据AI生成的结果进行优化和调整
`);
}

// 执行全部步骤
async function executeAllSteps() {
  console.log('\n开始执行九步策略...\n');
  
  for (const stepKey in strategies) {
    await executeStep(stepKey);
    console.log('\n' + '='.repeat(50) + '\n');
  }
  
  console.log('🎉 恭喜！九步策略全部完成！');
  console.log('所有答案已保存在 output/ 目录中');
  console.log('建议：');
  console.log('1. 定期回顾和更新你的策略');
  console.log('2. 3个月做一次小复盘');
  console.log('3. 6-9个月做一次大复盘');
  console.log('4. 根据市场变化及时调整策略');
}

// 主函数
async function main() {
  printWelcome();
  
  while (true) {
    showMenu();
    const choice = await askQuestion('\n请输入选择：');
    
    switch (choice) {
      case '1':
        await executeStep('step1');
        break;
      case '2':
        await executeStep('step2');
        break;
      case '3':
        await executeStep('step3');
        break;
      case '4':
        await executeStep('step4');
        break;
      case '5':
        await executeStep('step5');
        break;
      case '6':
        await executeStep('step6');
        break;
      case '7':
        await executeStep('step7');
        break;
      case '8':
        await executeStep('step8');
        break;
      case '9':
        await executeStep('step9');
        break;
      case '10':
        showWaterAICase();
        break;
      case '11':
        showAIPrompts();
        break;
      case 'all':
        await executeAllSteps();
        break;
      case '0':
        console.log('\n感谢使用SEO获客九步策略工具！');
        console.log('记住：结果 = 策略方向正确 × 执行到位 + 运气');
        rl.close();
        return;
      default:
        console.log('无效选择，请重新输入。');
    }
    
    await askQuestion('\n按回车键继续...');
  }
}

// 错误处理
process.on('uncaughtException', (err) => {
  console.error('程序出错:', err);
  rl.close();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n程序已中断');
  rl.close();
  process.exit(0);
});

// 启动程序
if (require.main === module) {
  main().catch(err => {
    console.error('程序执行出错:', err);
    rl.close();
    process.exit(1);
  });
}

module.exports = {
  strategies,
  aiPrompts,
  executeStep,
  showWaterAICase,
  showAIPrompts
};