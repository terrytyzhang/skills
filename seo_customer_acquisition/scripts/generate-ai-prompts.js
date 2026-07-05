#!/usr/bin/env node

/**
 * AI提示生成工具
 * 根据用户输入生成定制化的AI提示
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// AI提示模板库
const promptTemplates = {
  positioning: {
    name: '业务定位AI提示',
    template: `请帮我分析以下竞品：[列出2-3个主要竞品]
我的情况是：[个人开发者/小团队/创业公司，有无资金/团队限制]
如何差异化竞争？
请生成一个清晰的定位语句。`,
    variables: ['竞品列表', '自身情况', '差异化需求']
  },
  businessModel: {
    name: '商业模式AI提示',
    template: `请帮我生成商业模式九宫格：
目标客群：[描述目标客户]
产品服务：[描述产品服务]
差异化价值：[描述差异化价值]
预算限制：[描述预算限制]`,
    variables: ['目标客群', '产品服务', '差异化价值', '预算限制']
  },
  customerJourney: {
    name: '客户旅程AI提示',
    template: `请帮我分析[目标客户]的完整客户旅程：
客户画像：[描述客户特征]
使用场景：[描述主要使用场景]
决策因素：[描述购买决策因素]`,
    variables: ['目标客户', '客户特征', '使用场景', '决策因素']
  },
  marketingBudget: {
    name: '营销预算AI提示',
    template: `请帮我制定营销预算：
项目类型：[AI工具/SaaS产品/电商]
目标客户：[描述目标客户]
预算限制：[描述预算限制]
时间范围：[描述时间范围]`,
    variables: ['项目类型', '目标客户', '预算限制', '时间范围']
  },
  reviewAdjustment: {
    name: '复盘调整AI提示',
    template: `请帮我分析当前营销策略：
当前渠道：[列出主要渠道]
当前效果：[描述效果数据]
当前问题：[描述遇到的问题]
请给出调整建议。`,
    variables: ['当前渠道', '当前效果', '当前问题']
  },
  contentStrategy: {
    name: '内容策略AI提示',
    template: `请帮我制定内容营销策略：
目标客户：[描述目标客户]
产品类型：[描述产品类型]
核心优势：[描述核心优势]
内容形式：[博客/视频/播客/社交媒体]
请生成3个月的内容日历。`,
    variables: ['目标客户', '产品类型', '核心优势', '内容形式']
  },
  seoStrategy: {
    name: 'SEO策略AI提示',
    template: `请帮我制定SEO策略：
产品类型：[描述产品类型]
目标关键词：[列出目标关键词]
竞品分析：[列出主要竞品]
请生成关键词策略、内容策略和技术SEO建议。`,
    variables: ['产品类型', '目标关键词', '竞品分析']
  }
};

// 提问函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 生成AI提示
async function generatePrompt(promptType, variables) {
  const template = promptTemplates[promptType];
  if (!template) {
    console.log('❌ 无效的提示类型');
    return;
  }

  let prompt = template.template;
  
  // 替换变量
  template.variables.forEach((variable, index) => {
    const value = variables[index] || `[${variable}]`;
    prompt = prompt.replace(`[${variable}]`, value);
  });

  return prompt;
}

// 显示提示类型菜单
function showPromptTypes() {
  console.log('\n请选择AI提示类型：');
  Object.keys(promptTemplates).forEach((key, index) => {
    console.log(`${index + 1}. ${promptTemplates[key].name}`);
  });
  console.log('0. 退出');
}

// 主函数
async function main() {
  console.log(`
=============================================
      AI提示生成工具
=============================================

本工具帮助生成定制化的AI提示，用于：
• 业务定位分析
• 商业模式规划
• 客户旅程设计
• 营销预算制定
• 策略复盘调整

=============================================
`);

  while (true) {
    showPromptTypes();
    const choice = await askQuestion('\n请输入选择（数字）：');
    
    if (choice === '0') {
      break;
    }

    const promptKeys = Object.keys(promptTemplates);
    const selectedKey = promptKeys[parseInt(choice) - 1];
    
    if (!selectedKey) {
      console.log('❌ 无效选择');
      continue;
    }

    const template = promptTemplates[selectedKey];
    console.log(`\n${template.name}`);
    console.log('='.repeat(50));
    
    // 收集变量值
    const variables = [];
    for (const variable of template.variables) {
      const value = await askQuestion(`请输入"${variable}"：`);
      variables.push(value);
    }

    // 生成提示
    const prompt = await generatePrompt(selectedKey, variables);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 生成的AI提示：\n');
    console.log(prompt);
    console.log('\n' + '='.repeat(50));

    // 保存到文件
    const saveChoice = await askQuestion('\n是否保存到文件？(y/n): ');
    if (saveChoice.toLowerCase() === 'y') {
      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ai-prompt-${selectedKey}-${timestamp}.txt`;
      const filepath = path.join(outputDir, filename);
      
      const content = `# ${template.name}\n生成时间：${new Date().toLocaleString()}\n\n## 输入变量\n${template.variables.map((v, i) => `- ${v}: ${variables[i]}`).join('\n')}\n\n## AI提示\n\n${prompt}`;
      
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ 提示已保存至：${filepath}`);
    }

    // 使用建议
    console.log('\n💡 使用建议：');
    console.log('1. 将提示复制到AI工具（如ChatGPT、Claude等）');
    console.log('2. 根据AI生成的结果进行优化和调整');
    console.log('3. 将结果应用到实际业务中');
    console.log('4. 定期更新和优化提示');

    const continueChoice = await askQuestion('\n继续生成其他提示？(y/n): ');
    if (continueChoice.toLowerCase() !== 'y') {
      break;
    }
  }

  console.log('\n感谢使用AI提示生成工具！');
  console.log('记住：好的提示是成功的一半！');
  rl.close();
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
  promptTemplates,
  generatePrompt
};