
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjoeuylpkdqjydmpfxrd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb2V1eWxwa2RxanlkbXBmeHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODIxMzMsImV4cCI6MjA2MDE1ODEzM30.VqM0kqOqU5mWTVutsptoWWfTjivyfWI81qQrAw0eD00';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
