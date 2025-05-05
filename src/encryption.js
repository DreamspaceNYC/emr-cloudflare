class EncryptionService {
  static async generateKey() {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async exportKey(key) {
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  static async importKey(keyData) {
    const imported = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(atob(keyData).split('').map(c => c.charCodeAt(0))),
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return imported;
  }

  static async encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );

    return { iv: Array.from(iv), data: Array.from(new Uint8Array(encryptedContent)) };
  }

  static async decrypt(encryptedData, key) {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.data)
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
}

export { EncryptionService };
