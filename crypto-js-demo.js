'use strict';
const CryptoJS = require('crypto-js');

/**
 * 加解密类, AES-256-CBC-Pkcs7
 */
class AES {
  /**
   * 构造函数
   * @param {String} key 密钥
   * @param {String} iv
   */
  constructor(key, iv) {
    this.key = CryptoJS.enc.Utf8.parse(key);
    this.iv = CryptoJS.enc.Utf8.parse(iv);
  }

  /**
   * AES-CBC-Pkcs7-256加密
   * @param {*} data 需要加密的数据，如果是对象，请先转成字符串
   * @return {String} 加密后的数据
   */
  encrypt(data) {
    const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const Encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return Encrypted.ciphertext.toString().toUpperCase();
  }

  /**
   * AES-CBC-Pkcs7-256解密
   * @param {String} data 加密后的数据
   * @return {*} 解密后的数据
   */
  decrypt(data) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypted = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    // base64输出 decrypted.toString(CryptoJS.enc.Base64);
    // 明文输出
    const encrypted = decrypted.toString(CryptoJS.enc.Utf8);
    // 替换掉不可见的unicode字符
    let result = encrypted.replace(
      // eslint-disable-next-line no-control-regex
      /[\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f]/g,
      ''
    );
    try {
      // 解析JSON对象数据
      result = JSON.parse(result);
    } catch (error) {
      console.log('decrypt json parse ', error);
    }
    return result;
  }
}

const keyStr = 'H62JDFBEF5591CB68C30CFHDJHFDS3H7';
const ivStr = 'abc7394037121409';
const aes = new AES(keyStr, ivStr);

const message = {
  name: '世界那么大',
  text: '我想去看看',
  detail: '一起飞',
  lucky: 17,
};
const encrypted = aes.encrypt(message);
console.log('encrypted', encrypted); // AB35961F9F1CEB1DE896464D7F75712E83168C9E97668283F8C855AF9C248FB62DA9FE2B00027C7B91B199E145D2D6C9156DF33E6382F2FB878207CA2B35FCEA663431CF516CB3F7EA5553C0AE974E83A7C2FDEC2E454103EBD2343216119D94

const decrypted = aes.decrypt(encrypted);
console.log('decrypted', decrypted); // { name: '世界那么大', text: '我想去看看', detail: '一起飞', lucky: 17 }
