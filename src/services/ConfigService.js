import { supabase } from '../lib/supabaseClient';
import { chileanRegions } from '../data/chileanRegions';

export const ConfigService = {
    /**
     * Get the list of allowed regions.
     * Tries to fetch from Supabase 'app_settings' table.
     * Fallback: Returns all regions (or a default set).
     */
    getAllowedRegions: async () => {
        if (!supabase) return chileanRegions.map(r => r.name);

        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'allowed_regions')
                .single();

            if (error) {
                // If table doesn't exist or key not found, return default (RM only for now as per previous request)
                console.warn('Error fetching allowed regions, using default:', error.message);
                return ["Región Metropolitana de Santiago"];
            }

            return data?.value || [];
        } catch (error) {
            console.error('Unexpected error fetching regions:', error);
            return ["Región Metropolitana de Santiago"];
        }
    },

    /**
     * Save the list of allowed regions.
     */
    setAllowedRegions: async (regions) => {
        if (!supabase) return { success: true }; // Mock success

        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'allowed_regions',
                    value: regions
                });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error saving allowed regions:', error);
            return { success: false, error: error.message };
        }
    }
};
