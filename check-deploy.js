const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка готовности к деплою...\n');

// Проверяем структуру frontend
const frontendPath = path.join(__dirname, 'frontend');
const publicPath = path.join(frontendPath, 'public');
const srcPath = path.join(frontendPath, 'src');

console.log('📁 Проверка структуры файлов:');

// Список обязательных файлов
const requiredFiles = [
  'frontend/package.json',
  'frontend/public/index.html',
  'frontend/public/manifest.json',
  'frontend/src/App.js',
  'frontend/src/index.js',
  'netlify.toml'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ОТСУТСТВУЕТ!`);
    allFilesExist = false;
  }
});

console.log('\n📋 Проверка package.json:');
try {
  const packageJson = require('./frontend/package.json');
  console.log(`✅ Название: ${packageJson.name}`);
  console.log(`✅ Версия: ${packageJson.version}`);
  console.log(`✅ Scripts build: ${packageJson.scripts?.build ? 'есть' : 'ОТСУТСТВУЕТ!'}`);
} catch (error) {
  console.log('❌ Ошибка чтения package.json:', error.message);
  allFilesExist = false;
}

console.log('\n🔧 Проверка index.html:');
try {
  const indexPath = path.join(frontendPath, 'public', 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('<div id="root">')) {
    console.log('✅ Root div найден');
  } else {
    console.log('❌ Root div отсутствует!');
  }
  
  if (indexContent.includes('telegram-web-app.js')) {
    console.log('✅ Telegram SDK подключен');
  } else {
    console.log('⚠️  Telegram SDK не найден');
  }
} catch (error) {
  console.log('❌ Ошибка чтения index.html:', error.message);
  allFilesExist = false;
}

console.log('\n📊 Результат:');
if (allFilesExist) {
  console.log('🎉 Все файлы на месте! Готов к деплою на Netlify.');
  console.log('\n📋 Настройки для Netlify:');
  console.log('   Base directory: frontend');
  console.log('   Build command: npm run build');
  console.log('   Publish directory: build');
  process.exit(0);
} else {
  console.log('❌ Есть проблемы! Исправьте ошибки перед деплоем.');
  process.exit(1);
}