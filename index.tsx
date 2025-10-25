import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { initializeI18n } from './src/i18n';

async function startApp() {
  const rootElement = document.getElementById('root');

  // 等待i18n系统准备就绪。这将启动初始化过程或等待已在进行的初始化完成。
  await initializeI18n();

  // 仅当根元素实际存在时才挂载应用。
  // 这使得该脚本可以安全地包含在不承载React应用的页面上。
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </React.StrictMode>
    );
  } else {
    // 如果在没有#root div的页面上加载（例如，营销页面），
    // 只为开发人员记录一个警告，不抛出错误。
    console.warn("React script loaded, but no #root element found to mount to. This is expected on non-app pages.");
  }
}

// 启动应用
startApp();
