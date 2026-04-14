const cryptoJS = require('crypto-js');

const URL = 'https://demo-empl.wiseadvice.ru/lk_ru';
const LOGIN = 'employee-ru@wiseadvice.ru';
const PASSWORD = '1234';
const SK = 'MO2DRCg48pGM8mQB5xDV';

class CryptoService {
  encrypt(data) {
    return cryptoJS.AES.encrypt(JSON.stringify(data), SK).toString();
  }

  decrypt(data) {
    const bytes = cryptoJS.AES.decrypt(decodeURI(data).replace(/ /g, '+'), SK);
    try {
      return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    } catch (e) {
      return {};
    }
  }
}

const cipher = new CryptoService();

const hash = cipher.encrypt({
  type: 'login',
  login: LOGIN,
  pass: PASSWORD,
});

const link = `${URL}/auth/ml?t=${hash}`;

console.log(`Link: ${link}`);
