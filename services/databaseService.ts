import { supabase } from '../config/supabase';
import { SavedItem, SavedReport, PerformanceReport } from '../types';

// ========== SAVED ITEMS (Snippets) ==========

export const fetchSavedItems = async (userId: string): Promise<SavedItem[]> => {
    const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching saved items:', error);
        return [];
    }

    return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        date: item.created_at
    }));
};

export const createSavedItem = async (userId: string, item: Omit<SavedItem, 'id' | 'date'>): Promise<SavedItem | null> => {
    const { data, error } = await supabase
        .from('saved_items')
        .insert({
            user_id: userId,
            title: item.title,
            content: item.content,
            type: item.type
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating saved item:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type,
        date: data.created_at
    };
};

export const deleteSavedItem = async (itemId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error deleting saved item:', error);
        return false;
    }

    return true;
};

// ========== SAVED REPORTS ==========

export const fetchSavedReports = async (userId: string): Promise<SavedReport[]> => {
    const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching saved reports:', error);
        return [];
    }

    return data.map(report => ({
        id: report.id,
        title: report.title,
        type: report.type,
        rating: report.rating,
        reportData: report.report_data as PerformanceReport,
        date: report.created_at
    }));
};

export const createSavedReport = async (
    userId: string, 
    title: string, 
    type: 'coach' | 'rehearsal', 
    report: PerformanceReport
): Promise<SavedReport | null> => {
    const { data, error } = await supabase
        .from('saved_reports')
        .insert({
            user_id: userId,
            title: title || 'Untitled Session',
            type,
            rating: report.rating,
            report_data: report as any
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating saved report:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        type: data.type,
        rating: data.rating,
        reportData: data.report_data as PerformanceReport,
        date: data.created_at
    };
};

export const updateSavedReport = async (reportId: string, updates: Partial<SavedReport>): Promise<boolean> => {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.reportData !== undefined) updateData.report_data = updates.reportData;

    const { error } = await supabase
        .from('saved_reports')
        .update(updateData)
        .eq('id', reportId);

    if (error) {
        console.error('Error updating saved report:', error);
        return false;
    }

    return true;
};

export const deleteSavedReport = async (reportId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', reportId);

    if (error) {
        console.error('Error deleting saved report:', error);
        return false;
    }

    return true;
};

