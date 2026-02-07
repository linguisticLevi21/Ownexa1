import supabase from "../Database/SupabaseClient.js";
import multer from "multer";

export const getAuthUser = async (req) => {
  const token = req.cookies?.Ownexa_Token;
  if (!token) throw new Error("Unauthorized");

  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;

  return data.user;
};

export const FindRole = async (userId) => {
 const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single(); 

  if (error) throw error;

  return data.role;
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB per file
  }
});