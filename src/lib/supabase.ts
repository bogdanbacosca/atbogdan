import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afjrawilaiujmdpheenx.supabase.co'
const supabaseKey = 'sb_publishable_3cyZL4gSFGBH5nv8lHJIdQ_yztngMNz'

export const supabase = createClient(supabaseUrl, supabaseKey)
