#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function shortHash(s){
  return crypto.createHash('md5').update(s).digest('hex').slice(0,8);
}

function wrapColorLiteral(original){
  // conservative wrapper: var(--app-legacy-<h>, <original>)
  const h = shortHash(original.replace(/\s+/g,' '));
  return `var(--app-legacy-${h}, ${original})`;
}

const colorRegex = /#([0-9a-fA-F]{3,8})\b|rgba?\([^\)]*\)/g;

function transformCode(code){
  const ast = parser.parse(code, {sourceType: 'module', plugins:['typescript','jsx']});
  let changed=false;
  traverse(ast, {
    StringLiteral(path){
      const val = path.node.value;
      if(colorRegex.test(val)){
        path.node.value = val.replace(colorRegex, (m)=>wrapColorLiteral(m));
        changed=true;
      }
    },
    TemplateLiteral(path){
      path.node.quasis.forEach((q)=>{
        if(colorRegex.test(q.value.raw)){
          q.value.raw = q.value.raw.replace(colorRegex, (m)=>wrapColorLiteral(m));
          q.value.cooked = q.value.raw;
          changed=true;
        }
      });
    }
  });
  if(!changed) return null;
  const out = generate(ast, {retainLines:true}, code).code;
  return out;
}

function processFile(filePath){
  const stat = fs.statSync(filePath);
  if(!stat.isFile()) return;
  if(/\.d\.ts$/.test(filePath)) return;
  const content = fs.readFileSync(filePath,'utf8');
  const transformed = transformCode(content);
  if(transformed){
    const bak = filePath + '.preappfix.bak';
    fs.writeFileSync(bak, content, 'utf8');
    fs.writeFileSync(filePath, transformed, 'utf8');
    console.log('UPDATED:', filePath);
  }
}

function walkDir(dir){
  const entries = fs.readdirSync(dir);
  entries.forEach((e)=>{
    const full = path.join(dir,e);
    const st = fs.statSync(full);
    if(st.isDirectory()){
      // skip test folders and snapshots and pdf fixtures
      if(/node_modules|__snapshots__|__tests__|\.git/.test(e)) return;
      walkDir(full);
    } else {
      if(/\.tsx?$/.test(full) && !/\.test\.(ts|tsx)$/.test(full) && !/\.stories\./.test(full)){
        processFile(full);
      }
    }
  });
}

// CLI
const target = process.argv[2] || 'src/components';
if(!fs.existsSync(target)){
  console.error('Target not found:', target);
  process.exit(2);
}
console.log('Transforming files under', target);
walkDir(target);
console.log('Done.');
