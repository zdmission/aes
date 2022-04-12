const crypto = require('crypto');

/**
 * 加解密类
 */
class AES {
  /**
   * 构造函数
   * @param {String} algorithm 算法名称
   * @param {String} key 密钥
   * @param {String} iv
   */
  constructor(algorithm, key, iv) {
    this.algorithm = algorithm;
    this.key = Buffer.from(key);
    this.iv = Buffer.from(iv);
  }
  /**
   * 加密
   * @param {*} text 待加密数据
   * @returns {Object} 返回hex和base64数据
   */
  encrypt(text) {
    let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(JSON.stringify(text));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      hexStr: encrypted.toString('hex').toUpperCase(),
      base64Str: encrypted.toString('base64'),
    };
  }
  /**
   * 解密
   * @param {String} text hex或者base64类型的数据
   * @param {String} type hex或者base64
   * @returns {*} 返回结果
   */
  decrypt(text, type = 'hex') {
    let encrypted = '';
    if (type === 'base64') {
      // base64数据转化成hex
      encrypted = Buffer.from(text, 'base64').toString('hex');
      // hex数据转成buffer
      encrypted = Buffer.from(encrypted, 'hex');
    } else {
      encrypted = Buffer.from(text, 'hex');
    }

    let decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    let result = decrypted.toString();
    // 替换掉不可见的unicode字符
    result = result.replace(
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

const algorithm = 'aes-256-cbc';
const keyStr = 'H62JDFBEF5591CB68C30CFHDJHFDS3H7';
const ivStr = 'abc7394037121409';
const aes = new AES(algorithm, keyStr, ivStr);

const message = {
  name: '世界那么大',
  text: '我想去看看',
  detail: '一起飞',
  lucky: 17,
};
const { hexStr, base64Str } = aes.encrypt(message);
console.log('hexStr', hexStr); // AB35961F9F1CEB1DE896464D7F75712E83168C9E97668283F8C855AF9C248FB62DA9FE2B00027C7B91B199E145D2D6C9156DF33E6382F2FB878207CA2B35FCEA663431CF516CB3F7EA5553C0AE974E83A7C2FDEC2E454103EBD2343216119D94
console.log('base64Str', base64Str); // qzWWH58c6x3olkZNf3VxLoMWjJ6XZoKD+MhVr5wkj7Ytqf4rAAJ8e5GxmeFF0tbJFW3zPmOC8vuHggfKKzX86mY0Mc9RbLP36lVTwK6XToOnwv3sLkVBA+vSNDIWEZ2U

const decryptedHex = aes.decrypt(hexStr);
console.log('decryptedHex', decryptedHex); // { name: '世界那么大', text: '我想去看看', detail: '一起飞', lucky: 17 }

const decryptedBase64 = aes.decrypt(base64Str, 'base64');
console.log('decryptedBase64', decryptedBase64); // { name: '世界那么大', text: '我想去看看', detail: '一起飞', lucky: 17 }

