export interface SyncItem {
  id: string;
  type: string;
  payload: any;
  status: "pending" | "synced" | "failed";
  timestamp: number;
}

export const mobileSyncService = {
  async getPendingQueue(): Promise<SyncItem[]> {
    // In a real app, this would query IndexedDB or local storage
    return Promise.resolve([]);
  },

  async addToQueue(_type: string, _payload: any): Promise<void> {
    return Promise.resolve();
  },

  async syncNow(): Promise<void> {
    return Promise.resolve();
  }
};
