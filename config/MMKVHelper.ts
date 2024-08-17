import MMKVStorage from "react-native-mmkv-storage";

class MMKVStoragePersistHelper {
  private storage: MMKVStorage.API;

  constructor(instanceID: string) {
    this.storage = new MMKVStorage.Loader()
      .withInstanceID(instanceID)
      .withEncryption()
      .initialize();
  }

  setItem(key: string, value: string | boolean | number): void {
    this.storage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | boolean | number | undefined> {
    const value = await this.storage.getItem(key);
    return value;
  }

  async deleteItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    await this.storage.clearStore();
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await this.storage.getAllKeys();
    return keys;
  }
}

export default MMKVStoragePersistHelper;
