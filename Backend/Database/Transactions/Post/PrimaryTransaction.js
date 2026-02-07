import supabase from "../../SupabaseClient.js";

const PrimaryTransaction = async (data, user, type) => {
  if (!user?.id) {
    throw new Error("Unauthorized: User not found");
  }
  const { data: transaction, error } = await supabase
    .from("primary_transactions")
    .insert({
      property_id: data.propertyId,
      buyer_id: user.id,
      buyer_address: data.accountaddress.toLowerCase(),
      token_quantity: data.tokenQuantity,
      token_name: data.tokenName,
      price_per_token_inr: data.pricePerTokenInr,
      transaction_hash: data.transactionhash,
      status: data.status,
      type: type
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return transaction;
};

export default PrimaryTransaction;