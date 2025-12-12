import { openDB } from 'idb';

/**
 * Offline Queue Service
 * Handles offline data synchronization using IndexedDB
 */

const DB_NAME = 'ecofleet-offline';
const DB_VERSION = 1;
const QUEUE_STORE = 'sync-queue';

class OfflineQueue {
    constructor() {
        this.db = null;
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.listeners = [];

        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    /**
     * Initialize the IndexedDB database
     */
    async init() {
        if (this.db) return this.db;

        this.db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Create object store for sync queue
                if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                    const store = db.createObjectStore(QUEUE_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('timestamp', 'timestamp');
                    store.createIndex('type', 'type');
                }
            }
        });

        return this.db;
    }

    /**
     * Add an item to the sync queue
     * @param {string} type - Type of operation (e.g., 'order_update', 'order_accept')
     * @param {Object} data - Data to sync
     * @param {Function} syncFn - Function to call when syncing
     */
    async addToQueue(type, data, syncFn) {
        await this.init();

        const item = {
            type,
            data,
            timestamp: Date.now(),
            retries: 0,
            maxRetries: 3
        };

        // Store the sync function as a string (will need to be reconstructed)
        item.syncFnName = syncFn.name;

        const id = await this.db.add(QUEUE_STORE, item);
        console.log(`Added item ${id} to sync queue:`, type);

        // Try to sync immediately if online
        if (this.isOnline) {
            this.sync();
        }

        return id;
    }

    /**
     * Get all items in the queue
     */
    async getQueue() {
        await this.init();
        return await this.db.getAll(QUEUE_STORE);
    }

    /**
     * Remove an item from the queue
     */
    async removeFromQueue(id) {
        await this.init();
        await this.db.delete(QUEUE_STORE, id);
        console.log(`Removed item ${id} from sync queue`);
    }

    /**
     * Clear all items from the queue
     */
    async clearQueue() {
        await this.init();
        await this.db.clear(QUEUE_STORE);
        console.log('Cleared sync queue');
    }

    /**
     * Sync all queued items
     */
    async sync() {
        if (this.syncInProgress || !this.isOnline) {
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners({ type: 'sync_start' });

        try {
            const queue = await this.getQueue();
            console.log(`Syncing ${queue.length} items...`);

            for (const item of queue) {
                try {
                    // Attempt to sync the item
                    await this.syncItem(item);
                    await this.removeFromQueue(item.id);
                } catch (error) {
                    console.error(`Error syncing item ${item.id}:`, error);

                    // Increment retry count
                    item.retries++;

                    if (item.retries >= item.maxRetries) {
                        console.warn(`Max retries reached for item ${item.id}, removing from queue`);
                        await this.removeFromQueue(item.id);
                    } else {
                        // Update the item with new retry count
                        await this.db.put(QUEUE_STORE, item);
                    }
                }
            }

            this.notifyListeners({ type: 'sync_complete', success: true });
        } catch (error) {
            console.error('Sync error:', error);
            this.notifyListeners({ type: 'sync_complete', success: false, error });
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Sync a single item
     * This method should be overridden or configured with actual sync logic
     */
    async syncItem(item) {
        // This is a placeholder - in real implementation, you would:
        // 1. Call the appropriate API based on item.type
        // 2. Use item.data for the request
        // 3. Handle the response

        console.log('Syncing item:', item);

        // Example: if item.type === 'order_update', call updateOrder API
        // For now, we'll just simulate a successful sync
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }

    /**
     * Handle online event
     */
    handleOnline() {
        console.log('Device is online');
        this.isOnline = true;
        this.notifyListeners({ type: 'online' });
        this.sync();
    }

    /**
     * Handle offline event
     */
    handleOffline() {
        console.log('Device is offline');
        this.isOnline = false;
        this.notifyListeners({ type: 'offline' });
    }

    /**
     * Add a listener for queue events
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove a listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    /**
     * Notify all listeners of an event
     */
    notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in queue listener:', error);
            }
        });
    }

    /**
     * Get online status
     */
    getOnlineStatus() {
        return this.isOnline;
    }

    /**
     * Get queue size
     */
    async getQueueSize() {
        const queue = await this.getQueue();
        return queue.length;
    }
}

// Export singleton instance
export default new OfflineQueue();
