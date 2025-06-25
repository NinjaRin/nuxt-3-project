import { defineEventHandler } from "h3";
import { supabaseServer } from "~/server/utils/supabaseServer";

export default defineEventHandler(async (event) => {
  const supabase = supabaseServer;
  const id = event.context.params?.id as string | undefined;

  if (!id) {
    return { statusCode: 400, error: "Missing article id", success: false };
  }

  const { error: tagError } = await supabase
    .from("article_tags")
    .delete()
    .eq("article_id", id);

  const { error: articleError } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  if (articleError || tagError) {
    return {
      statusCode: 500,
      error: `${articleError?.message || ""}${tagError?.message || ""}`,
      success: false
    };
  }

  return {
    statusCode: 200,
    message: "Article and related tags deleted",
    success: true,
  };
});
