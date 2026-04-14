let apiUrl = 'https://empl-dev.test-wa.ru';

if (process.env.EMPL_API_URL) {
  apiUrl = process.env.EMPL_API_URL;
}

module.exports = {
  '/data': {
    target: apiUrl,
    secure: true,
    changeOrigin: true,
    rejectUnauthorized: false,
  },
};
