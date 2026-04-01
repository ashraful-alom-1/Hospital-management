import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hlijcldkvjtlsrxpbmkj.supabase.co"
const supabaseKey = "sb_publishable_BU0U9f7rezY8YrIPcnlTFw_WRp95fj1"

export const supabase = createClient(supabaseUrl, supabaseKey)