import { supabase } from '../lib/supabaseClient';

/**
 * Service to handle file uploads to Supabase Storage
 */
export const StorageService = {
    /**
     * Uploads a file to the specified bucket and path
     * @param {File} file - The file object to upload
     * @param {string} bucket - The storage bucket name (default: 'driver-documents')
     * @param {string} path - The path within the bucket (e.g., 'userId/filename')
     * @returns {Promise<{path: string, url: string, error: object}>}
     */
    uploadFile: async (file, bucket = 'driver-documents', path) => {
        if (!supabase) {
            console.warn('Supabase not configured. Simulating upload.');
            return {
                path: path || `mock/${file.name}`,
                url: URL.createObjectURL(file),
                error: null
            };
        }

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = path ? `${path}/${fileName}` : fileName;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return { path: filePath, url: publicUrl, error: null };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { path: null, url: null, error };
        }
    }
};
