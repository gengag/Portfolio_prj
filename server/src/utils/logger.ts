type LogCategory = 'AI' | 'AUTH' | 'QUIZ' | 'PERFORMANCE' | 'DOCS' | 'SERVER' | 'ERROR';

export const logger = {
  info: (category: LogCategory, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${category}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  warn: (category: LogCategory, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [${category}] ⚠️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (category: LogCategory, message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${category}] ❌ ${message}`, error?.message || error || '');
  }
};
