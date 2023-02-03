import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yhvwtxoqpasglonyjmpe.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlodnd0eG9xcGFzZ2xvbnlqbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ5NzUxMTUsImV4cCI6MTk5MDU1MTExNX0.nA9J3Zhw53Omg7CrHOW2LDwy2j7_28dwQvIfOYS5sn4"
export const supabase = createClient(supabaseUrl, supabaseKey)