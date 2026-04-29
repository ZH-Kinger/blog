#!/usr/bin/env node
/**
 * 将 yuque .lakebook 和散装 .md 文件转换并整理到 VuePress 博客目录
 * 用法: node scripts/convert-docs.js
 */
const fs = require('fs');
const path = require('path');

// ── 配置 ────────────────────────────────────────────────────────────────
const LAKE_DIR   = 'C:/Users/asus/AppData/Local/Temp'; // 解压后的 lakebook 目录
const STUDY_DIR  = 'E:/study_space'; // 原始 md 文件目录
const POSTS_DIR  = path.resolve(__dirname, '../src/posts');

// lakebook → { dir, category, icon }
const LAKEBOOKS = [
  { name: 'Docker',    dir: 'docker_lake',   category: '云原生',   icon: 'docker',   folder: 'Cloud_Native' },
  { name: 'LLM大模型', dir: 'LLM大模型_lake', category: 'AI大模型', icon: 'robot',    folder: 'AI_LLM' },
  { name: 'python开发',dir: 'python开发_lake',category: '开发',     icon: 'python',   folder: 'Development' },
  { name: 'web集群',   dir: 'web集群_lake',   category: '运维',     icon: 'server',   folder: 'DevOps' },
  { name: '数据库',    dir: '数据库_lake',    category: '数据库',   icon: 'database', folder: 'Database' },
  { name: '计算机网络',dir: '计算机网络_lake', category: '计算机网络',icon: 'network-wired', folder: 'Networking' },
];

// 散装 md 文件 → { src, destFolder, category, icon }
const STANDALONE_FILES = [
  { src: 'K-Means.md',          folder: 'AI_LLM',      category: 'AI大模型', icon: 'brain' },
  { src: '多智能体协同.md',       folder: 'AI_LLM',      category: 'AI大模型', icon: 'brain' },
  { src: 'Wiki文档.md',          folder: 'AI_LLM',      category: 'AI大模型', icon: 'book' },
  { src: 'Netfilter.md',        folder: 'DevOps',      category: '运维',     icon: 'shield' },
  { src: '防火墙.md',             folder: 'DevOps',      category: '运维',     icon: 'shield' },
  { src: '完整app代码后续将会封装.md', folder: 'Development', category: '开发',  icon: 'code' },
  // llm/ 子目录
  { src: 'llm/Agent开发/Agent简介.md',              folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/RAG小项目/动态入库去重项目.md',        folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/chain链/chain.md',                    folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/chain链/多模型链.md',                  folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/chain链/架构示例.md',                  folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/memory/memory（历史记录多轮对话）.md',  folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/memory/redis存储.md',                 folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/memory/runnable.md',                  folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/memory/长期存储中的问题.md',            folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/skill开发/标准skill.md',               folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/向量存储/RAG/RAG.md',                  folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/向量存储/RAG/基于向量检索的提示词生成.md',folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/向量存储/vector_store.md',             folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/向量存储/余弦相似度.md',               folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/向量存储/嵌入式模型.md',               folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/微调/fine-traing.md',                 folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/微调/预训练和后训练.md',               folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/微调/高效微调.md',                     folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/推理框架/KV Cache.md',                 folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/推理框架/vllm，ollama.md',             folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/提示词模板/提示词模板.md',              folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/数据转换/StrOutputParser.md',          folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  { src: 'llm/文档加载器/文档加载器.md',              folder: 'AI_LLM/LangChain', category: 'AI大模型', icon: 'robot' },
  // web集群目录 md 文件
  { src: 'web集群/ConfigMap.md',       folder: 'Cloud_Native', category: '云原生', icon: 'docker' },
  { src: 'web集群/Secret.md',          folder: 'Cloud_Native', category: '云原生', icon: 'docker' },
  { src: 'web集群/灰度发布.md',         folder: 'DevOps',       category: '运维',   icon: 'server' },
  { src: 'web集群/遇到的问题.md',       folder: 'DevOps',       category: '运维',   icon: 'server' },
  { src: 'web集群/CI，CD/CD，CD是什么.md', folder: 'DevOps',    category: '运维',   icon: 'server' },
];

// ── HTML → Markdown 转换 ────────────────────────────────────────────────
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // 1. 去除外层 HTML 包装
  md = md.replace(/^<!doctype html>\s*/i, '');
  md = md.replace(/<div\s+class="lake-content"[^>]*>/i, '');
  md = md.replace(/<\/div>\s*$/i, '');

  // 2. 代码块转换（最重要！）
  // <pre data-language="LANG" ... class="ne-codeblock language-LANG"><code>...</code></pre>
  md = md.replace(
    /<pre[^>]*(?:data-language|class)="[^"]*(?:language-)?([a-zA-Z0-9_+-]*)"[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_, lang, code) => {
      const cleanLang = (lang || 'plain').replace('language-', '').trim() || 'plain';
      const cleanCode = decodeHtmlEntities(code);
      return `\n\`\`\`${cleanLang === 'plain' ? '' : cleanLang}\n${cleanCode}\n\`\`\`\n`;
    }
  );
  // 备用：没有 language 属性的 pre
  md = md.replace(
    /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_, code) => `\n\`\`\`\n${decodeHtmlEntities(code)}\n\`\`\`\n`
  );

  // 3. 标题转换
  for (let i = 6; i >= 1; i--) {
    const hashes = '#'.repeat(i);
    md = md.replace(
      new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\\/h${i}>`, 'gi'),
      (_, content) => `\n${hashes} ${stripTags(content).trim()}\n`
    );
  }

  // 4. 图片（在段落转换之前处理）
  md = md.replace(/<img[^>]*\bsrc="([^"]+)"[^>]*>/gi, (_, src) => `\n![](${src})\n`);

  // 5. 加粗 / 斜体
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // 6. 链接
  md = md.replace(/<a[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => `[${stripTags(text)}](${href})`
  );

  // 7. 列表
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi,
    (_, content) => `\n- ${stripTags(content).trim()}`
  );
  md = md.replace(/<[uo]l[^>]*>/gi, '\n');
  md = md.replace(/<\/[uo]l>/gi, '\n');

  // 8. 段落 / 换行
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const text = stripInline(content).trim();
    return text ? `\n${text}\n` : '';
  });
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // 9. 去掉残余的 span/font/div 包装（只留内容）
  md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  md = md.replace(/<font[^>]*>([\s\S]*?)<\/font>/gi, '$1');
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1');

  // 10. 剩余 HTML 实体解码
  md = decodeHtmlEntities(md);

  // 11. 清理多余空行
  md = md.replace(/\n{4,}/g, '\n\n\n');
  md = md.trim();

  return md;
}

function stripTags(html) {
  return (html || '').replace(/<[^>]+>/g, '').trim();
}

function stripInline(html) {
  // 保留粗体/斜体，去掉其他标签
  let s = html;
  s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  s = s.replace(/<a[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => `[${stripTags(text)}](${href})`
  );
  s = s.replace(/<[^>]+>/g, '');
  return decodeHtmlEntities(s);
}

function decodeHtmlEntities(str) {
  return (str || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// ── 文件名安全化 ──────────────────────────────────────────────────────────
function safeFilename(title) {
  return title
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// ── 生成 frontmatter ──────────────────────────────────────────────────────
function makeFrontmatter(title, category, icon, date) {
  const d = date ? date.substring(0, 10) : new Date().toISOString().substring(0, 10);
  return `---
title: ${title}
icon: ${icon}
date: ${d}
category:
  - ${category}
---

`;
}

// ── 检查文章内容是否有意义（非空）──────────────────────────────────────────
function hasContent(body) {
  if (!body) return false;
  const text = stripTags(body).replace(/\s+/g, '').trim();
  return text.length > 30;
}

// ── 处理单个 lakebook ────────────────────────────────────────────────────
function processLakebook(book) {
  const lakeDir = path.join(LAKE_DIR, book.dir);
  // 找到解压后的子目录
  const entries = fs.readdirSync(lakeDir);
  const subDir = entries.find(e => !e.startsWith('$') && fs.statSync(path.join(lakeDir, e)).isDirectory());
  if (!subDir) {
    console.log(`  [跳过] ${book.name}: 未找到子目录`);
    return;
  }
  const articlesDir = path.join(lakeDir, subDir);

  // 读取 meta
  const metaRaw = JSON.parse(fs.readFileSync(path.join(articlesDir, '$meta.json'), 'utf-8'));
  const meta = JSON.parse(metaRaw.meta);
  const tocYml = meta.book.tocYml;

  // 解析 TOC（简单行解析，提取 title 和 url）
  const toc = [];
  const lines = tocYml.split('\n');
  let cur = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- type:')) {
      if (cur.type) toc.push(cur);
      cur = { type: trimmed.replace('- type:', '').trim() };
    } else if (trimmed.startsWith('title:')) {
      cur.title = trimmed.replace('title:', '').trim();
    } else if (trimmed.startsWith('url:')) {
      cur.url = trimmed.replace('url:', '').trim().replace(/'/g, '');
    } else if (trimmed.startsWith('level:')) {
      cur.level = parseInt(trimmed.replace('level:', '').trim());
    } else if (trimmed.startsWith('id:')) {
      cur.id = trimmed.replace('id:', '').trim().replace(/'/g, '');
    }
  }
  if (cur.type) toc.push(cur);

  // 目标文件夹
  const destFolder = path.join(POSTS_DIR, book.folder);
  fs.mkdirSync(destFolder, { recursive: true });

  let count = 0;
  for (const item of toc) {
    if (item.type !== 'DOC' || !item.url || item.url === "''") continue;
    const jsonPath = path.join(articlesDir, item.url + '.json');
    if (!fs.existsSync(jsonPath)) continue;

    let docData;
    try {
      docData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) { continue; }

    const doc = docData.doc || docData;
    const title = doc.title || item.title || '无标题';
    const body = doc.body || '';

    if (!hasContent(body)) {
      console.log(`  [跳过空文章] ${title}`);
      continue;
    }

    // 跳过无意义标题
    if (['无标题文档', 'Untitled', ''].includes(title.trim())) continue;

    const mdContent = htmlToMarkdown(body);
    const date = doc.created_at || doc.published_at || '';
    const frontmatter = makeFrontmatter(title, book.category, book.icon, date);
    const filename = safeFilename(title) + '.md';
    const destPath = path.join(destFolder, filename);

    fs.writeFileSync(destPath, frontmatter + mdContent, 'utf-8');
    count++;
    console.log(`  ✓ ${book.name}/${filename}`);
  }
  console.log(`  → ${book.name}: 共转换 ${count} 篇文章`);
}

// ── 处理散装 md 文件 ─────────────────────────────────────────────────────
function processStandaloneFile(entry) {
  const srcPath = path.join(STUDY_DIR, entry.src);
  if (!fs.existsSync(srcPath)) {
    console.log(`  [不存在] ${entry.src}`);
    return;
  }

  let content = fs.readFileSync(srcPath, 'utf-8');
  if (content.trim().length < 50) {
    console.log(`  [跳过空文件] ${entry.src}`);
    return;
  }

  // 如果已有 frontmatter，保持原样；否则加上
  if (!content.startsWith('---')) {
    const title = path.basename(entry.src, '.md');
    const frontmatter = makeFrontmatter(title, entry.category, entry.icon, null);
    content = frontmatter + content;
  } else {
    // 确保有 category
    if (!content.includes('category:')) {
      content = content.replace(/^---\n/, `---\ncategory:\n  - ${entry.category}\n`);
    }
  }

  const destFolder = path.join(POSTS_DIR, entry.folder);
  fs.mkdirSync(destFolder, { recursive: true });

  const filename = safeFilename(path.basename(entry.src, '.md')) + '.md';
  const destPath = path.join(destFolder, filename);
  fs.writeFileSync(destPath, content, 'utf-8');
  console.log(`  ✓ ${entry.folder}/${filename}`);
}

// ── 主流程 ───────────────────────────────────────────────────────────────
console.log('🚀 开始处理文档...\n');

console.log('=== 处理 lakebook 文件 ===');
for (const book of LAKEBOOKS) {
  console.log(`\n[${book.name}]`);
  try {
    processLakebook(book);
  } catch (e) {
    console.error(`  错误: ${e.message}`);
  }
}

console.log('\n=== 处理散装 md 文件 ===');
for (const entry of STANDALONE_FILES) {
  processStandaloneFile(entry);
}

console.log('\n✅ 完成！');
console.log(`文档已整理到: ${POSTS_DIR}`);
