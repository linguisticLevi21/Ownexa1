import supabase from "../../SupabaseClient.js";

const FindHoldings = async (user) => {
  if (!user?.id) {
    throw new Error("Authenticated user is required");
  }

  const { data, error } = await supabase
    .from("holdings")
    .select(`
      id,
      wallet_address,
      token_quantity,
      avg_price_inr,
      updated_at,
      properties (
        id,
        title,
        city,
        state,
        token_name,
        blockchain_id,
        property_images,
        status,
        is_listed
      ) ,
       redeemed ,
       holding_status
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
};

export default FindHoldings;