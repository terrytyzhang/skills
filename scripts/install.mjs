#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// 支持的 agent 及其 skills 安装目录
const AGENTS = {
  codebuddy: join(homedir(), '.codebuddy/skills'),
  workbuddy: join(homedir(), '.workbuddy/skills'),
  codex: join(homedir(), '.codex/skills'),
};

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

// skill = 包含 SKILL.md 或 skill.md 的顶层目录（自动发现）
function getSkills() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        !d.name.startsWith('.') &&
        d.name !== 'node_modules' &&
        (existsSync(join(ROOT, d.name, 'SKILL.md')) ||
          existsSync(join(ROOT, d.name, 'skill.md')))
    )
    .map((d) => d.name)
    .sort();
}

function resolveTargets(agentArgs) {
  if (agentArgs.length === 0 || agentArgs.includes('all')) return Object.keys(AGENTS);
  const unknown = agentArgs.filter((a) => !AGENTS[a]);
  if (unknown.length > 0) {
    console.error(`${YELLOW}Unknown agent(s): ${unknown.join(', ')}${NC}`);
    console.error(`Available agents: ${Object.keys(AGENTS).join(', ')}, all`);
    process.exit(1);
  }
  return agentArgs;
}

function install(agents) {
  const skills = getSkills();
  if (skills.length === 0) {
    console.log(`${YELLOW}No skills found.${NC}`);
    return;
  }
  for (const agent of agents) {
    const dst = AGENTS[agent];
    mkdirSync(dst, { recursive: true });
    console.log(`${YELLOW}Installing to ${agent} (${dst}):${NC}`);
    for (const skill of skills) {
      rmSync(join(dst, skill), { recursive: true, force: true });
      cpSync(join(ROOT, skill), join(dst, skill), { recursive: true });
      console.log(`  ${GREEN}✓${NC} ${skill} → ${dst}/${skill}`);
    }
  }
  console.log(`${GREEN}✅ All skills installed!${NC}`);
}

async function clean() {
  const skills = getSkills();
  console.log(`${YELLOW}This will remove ONLY the following skills installed by this repo:${NC}`);
  for (const s of skills) console.log(`  - ${s}`);
  console.log(`${YELLOW}Skills from other projects are NOT affected.\n${NC}`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) =>
    rl.question(`${YELLOW}Type 'yes' to confirm: ${NC}`, resolve)
  );
  rl.close();
  if (answer !== 'yes') {
    console.log(`${YELLOW}Aborted.${NC}`);
    return;
  }
  for (const dst of Object.values(AGENTS)) {
    for (const s of skills) {
      rmSync(join(dst, s), { recursive: true, force: true });
      console.log(`  removed ${s} from ${dst}`);
    }
  }
  console.log(`${GREEN}✅ Clean complete${NC}`);
}

function list() {
  console.log(`${YELLOW}Available skills:${NC}`);
  for (const s of getSkills()) console.log(`  ${GREEN}✓${NC} ${s}`);
  console.log(`\n${YELLOW}Supported agents:${NC}`);
  for (const [name, dir] of Object.entries(AGENTS)) console.log(`  ${GREEN}✓${NC} ${name} → ${dir}`);
}

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case 'install':
    install(resolveTargets(args));
    break;
  case 'clean':
    await clean();
    break;
  case 'list':
    list();
    break;
  default:
    console.log(`${YELLOW}Usage: node scripts/install.mjs <command> [agents...]${NC}`);
    console.log(`  ${GREEN}install [codebuddy|workbuddy|codex|all]${NC}  Install skills (default: all)`);
    console.log(`  ${GREEN}clean${NC}                                   Remove installed skills`);
    console.log(`  ${GREEN}list${NC}                                    List skills and agents`);
    process.exit(command ? 1 : 0);
}
