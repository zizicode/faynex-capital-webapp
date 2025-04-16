
import { supabase } from '@/lib/supabase';

export async function registerUser(userData) {
  try {
    // Check if email or username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${userData.email},username.eq.${userData.username}`)
      .single();

    if (existingUser) {
      throw new Error('El correo o nombre de usuario ya está registrado');
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        referral_code: userData.username,
        referred_by: userData.referredBy || null,
        referrer_id: userData.referrer?.id || null,
        second_level_id: userData.secondLevel?.id || null,
        third_level_id: userData.thirdLevel?.id || null,
        is_active: true,
        join_date: new Date().toISOString(),
        last_active_date: new Date().toISOString(),
        total_earnings: 0,
        available_balance: 0,
        active_referrals: 0,
        active_plan: null,
        restricted_access: true,
        account_status: 'active',
        copy_trading_active: false,
        monthly_earnings: 0,
        next_level_progress: 0,
        level: 'Bronce'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(emailOrUsername, password) {
  try {
    const { data: user, error } = await supabase
      .rpc('verify_user_credentials', { 
        p_email_or_username: emailOrUsername,
        p_password: password 
      });

    if (error) throw error;
    if (!user) throw new Error('Credenciales incorrectas');

    return user;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}
