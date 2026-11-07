#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const tasksDir = path.join(rootDir, 'workflow', 'tasks');
const boardFile = path.join(rootDir, 'workflow', 'board.md');

console.log('🔄 Đang đồng bộ hóa workflow/board.md từ các việc trong workflow/tasks...');

const taskFolders = fs.readdirSync(tasksDir).filter(f => f.startsWith('T-') && fs.statSync(path.join(tasksDir, f)).isDirectory()).sort();

const rows = [
  '# Bảng việc hoàn thiện DrMayDay (Production Roadmap)',
  '',
  '| Mã | Tên công việc | Phân hệ | Phụ thuộc | Trạng thái | Số vòng |',
  '|---|---|---|---|---|---|'
];

taskFolders.forEach(folder => {
  const folderPath = path.join(tasksDir, folder);
  const statusFile = path.join(folderPath, 'status.md');
  const briefFile = path.join(folderPath, 'brief.md');

  const match = folder.match(/^(T-\d{3})/);
  const taskCode = match ? match[1] : folder;

  let status = 'TODO';
  if (fs.existsSync(statusFile)) {
    status = fs.readFileSync(statusFile, 'utf8').trim().split('\n')[0].trim() || 'TODO';
  }

  let taskName = folder.replace(/^T-\d{3}-?/, '').replace(/-/g, ' ');
  if (fs.existsSync(briefFile)) {
    const briefContent = fs.readFileSync(briefFile, 'utf8');
    const nameMatch1 = briefContent.match(/^- Tên việc:\s*(.+)$/m);
    const nameMatch2 = briefContent.match(/^#\s*T-\d{3}:\s*(.+)$/m);
    if (nameMatch1) {
      taskName = nameMatch1[1].trim();
    } else if (nameMatch2) {
      taskName = nameMatch2[1].trim();
    }
  }

  let subsystem = 'features';
  if (['T-001', 'T-005'].includes(taskCode)) subsystem = 'auth';
  else if (['T-002', 'T-003', 'T-004'].includes(taskCode)) subsystem = 'core';
  else if (taskCode === 'T-006') subsystem = 'patient';
  else if (taskCode === 'T-007') subsystem = 'cleanup';
  else if (taskCode === 'T-008') subsystem = 'devops';
  else if (taskCode === 'T-009') subsystem = 'docs';
  else if (taskCode === 'T-010') subsystem = 'release';
  else if (taskCode === 'T-011') subsystem = 'quality';

  rows.push(`| **${taskCode}** | ${taskName} | ${subsystem} | - | ${status} | 1 |`);
});

fs.writeFileSync(boardFile, rows.join('\n') + '\n', 'utf8');
console.log(`✅ Đã đồng bộ thành công ${taskFolders.length} công việc vào workflow/board.md.`);
