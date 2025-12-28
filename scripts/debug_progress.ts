
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProgress() {
  // 1. Get the first user found (since we don't have auth context here, we assume single user or pick first)
  // Actually we need a user ID. Let's list users or just query user_problem_progress directly.
  
  // Query all progress
  const { data: allProgress, error } = await supabase
    .from('user_problem_progress')
    .select('*');

  if (error) {
    console.error('Error fetching progress:', error);
    return;
  }

  if (!allProgress || allProgress.length === 0) {
    console.log('No progress found.');
    return;
  }

  // Group by user
  const byUser = {};
  allProgress.forEach(p => {
    if (!byUser[p.user_id]) byUser[p.user_id] = [];
    byUser[p.user_id].push(p);
  });

  console.log(`Found progress for ${Object.keys(byUser).length} user(s).`);

  for (const userId of Object.keys(byUser)) {
    console.log(`\n=== User: ${userId} ===`);
    const progress = byUser[userId];
    
    // Calculate Due Reviews using logic
    const today = new Date();
    const isoToday = today.toISOString();
    
    console.log(`Current Time (ISO): ${isoToday}`);
    
    const due = progress.filter(p => {
       if (p.status === 'mastered') return false;
       return p.next_review_at && p.next_review_at <= isoToday;
    });

    console.log(`\nTotal Progress Records: ${progress.length}`);
    console.log(`Due Reviews: ${due.length}`);

    console.log('\n--- Details for Due items ---');
    due.forEach(p => {
        console.log(`- [${p.problem_title}] Status: ${p.status}, Reviews: ${p.reviews_completed}/${p.reviews_needed}, Next Due: ${p.next_review_at}`);
    });

    console.log('\n--- Details for Non-Due Learning items ---');
    const learning = progress.filter(p => p.status === 'learning' && !due.includes(p));
    learning.forEach(p => {
        console.log(`- [${p.problem_title}] Status: ${p.status}, Reviews: ${p.reviews_completed}/${p.reviews_needed}, Next Due: ${p.next_review_at}`);
    });

    // Check settings
    const { data: settings } = await supabase.from('user_study_settings').select('*').eq('user_id', userId).single();
    if (settings) {
        console.log('\n--- Settings ---');
        console.log(`Start Date: ${settings.start_date}`);
        console.log(`Target Days: ${settings.target_days}`);
        
        // Check days passed calculation
        const sDate = new Date(settings.start_date);
        const tDate = new Date();
        // Normalize
        sDate.setHours(0,0,0,0);
        tDate.setHours(0,0,0,0);
        const daysPassed = Math.floor((tDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        console.log(`Calculated Days Passed: ${daysPassed}`);
    }
  }
}

checkUserProgress();

