import supabase from "../../SupabaseClient.js";

const CancelListing = async (listingId, user, status) => {
    if (!listingId) throw new Error("Listing ID is required");
    if (!user?.id) throw new Error("Authenticated user required");

    const { data: cancelledListing, error } = await supabase
        .from("listings")
        .update({
            status: status,
            updated_at: new Date().toISOString(),

        })
        .eq("id", listingId)
        .select()
        .single();

    if (error) throw error;
    if (!cancelledListing) throw new Error("Listing not found or already updated");

    return cancelledListing;
};

export default CancelListing; 