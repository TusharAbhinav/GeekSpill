// import { createClient } from "jsr:@supabase/supabase-js@2";

// const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
// const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// export const checkRSSFeeds = async (req: Request) => {
//   const supabase = createClient(supabaseUrl, serviceRoleKey, {
//     global: { headers: { Authorization: req.headers.get("Authorization")! } },
//   });

//   try {
//     const { data: feeds, error: fetchError } = await supabase
//       .from("rss_feeds")
//       .select("id, url")
//       .eq("is_active", true);

//     if (fetchError) {
//       throw new Error(`Error fetching feeds: ${fetchError.message}`);
//     }

//     for (const feed of feeds || []) {
//       try {
//         const response = await fetch(feed.url, {
//           method: "GET",
//           headers: {
//             Accept: "application/rss+xml, application/xml, text/xml",
//           },
//         });

//         if (!response.ok) {
//           await supabase
//             .from("rss_feeds")
//             .update({ is_active: false })
//             .eq("id", feed.id);

//           console.log(`Marked feed ${feed.id} as inactive due to failed fetch`);
//         }
//       } catch (error) {
//         await supabase
//           .from("rss_feeds")
//           .update({ is_active: false })
//           .eq("id", feed.id);

//         console.log(
//           `Marked feed ${feed.id} as inactive due to error: ${error.message}`
//         );
//       }
//     }

//     return { status: 200, message: "RSS feed check completed successfully" };
//   } catch (error) {
//     console.error("Error in checkRSSFeeds:", error);
//     return { status: 500, message: error.message };
//   }
// };

// Deno.serve(async (req) => {
//   try {
//     const result = await checkRSSFeeds(req);
//     return new Response(JSON.stringify(result), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ status: 500, error: error.message }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// });