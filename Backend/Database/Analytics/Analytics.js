import supabase from "../SupabaseClient.js";

export const Analytics = async () => {
  const { data, error } = await supabase
    .from("platform_stats")
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const AdminAnalytics = async (days = 14) => {
  const cutoff = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data, error } = await supabase
    .from("transaction_analytics")
    .select("day, tx_count, volume_inr")
    .gte("day", cutoff)
    .order("day", { ascending: true });

  if (error) throw error;
  return data || [];
};