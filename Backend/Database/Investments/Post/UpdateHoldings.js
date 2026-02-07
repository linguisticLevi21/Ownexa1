import supabase from "../../SupabaseClient.js";

const UpdateHolding = async (data, user) => {
  if (!data?.holdingId || !data?.tokenQuantity) {
    throw new Error("Holding ID and token quantity are required");
  }

  if (!user?.id) {
    throw new Error("Authenticated user required");
  }

  const deductQty = Number(data.tokenQuantity);

  const { data: holding, error: fetchError } = await supabase
    .from("holdings")
    .select("id, token_quantity, holding_status")
    .eq("id", data.holdingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!holding) throw new Error("Holding not found");

  if (holding.token_quantity < deductQty) {
    throw new Error("Insufficient holding quantity");
  }

  const newQty = holding.token_quantity - deductQty;

  if (newQty === 0) {
    const { data: disabledHolding, error: disableError } = await supabase
      .from("holdings")
      .update({
        token_quantity: 0,
        holding_status: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", holding.id)
      .select()
      .maybeSingle();

    if (disableError) throw disableError;

    return {
      type: "DISABLED",
      holdingId: holding.id,
    };
  }

  const { data: updatedHolding, error: updateError } = await supabase
    .from("holdings")
    .update({
      token_quantity: newQty,
      updated_at: new Date().toISOString(),
    })
    .eq("id", holding.id)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;
  if (!updatedHolding) throw new Error("Holding update failed");

  return {
    type: "UPDATED",
    holdingId: holding.id,
    token_quantity: newQty,
  };
};

export default UpdateHolding;