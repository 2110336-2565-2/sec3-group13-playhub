// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { updateNationalID } from "./updateNationalID.ts";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (req: Request) => {
  try {
    const connection = await pool.connect();
    try {
      const body = await req.json();
      const idSearchResult =
        await connection.queryObject`SELECT id FROM public.user WHERE national_id=${body.national_id}`;
      if (idSearchResult.rows.length > 0) {
        return new Response(JSON.stringify({ message: "national_id is already exist" }), {
          status: 403,
        });
      }
      const result = updateNationalID(body);
      if (result.success) {
        await connection.queryObject`UPDATE public.user SET national_id=${body.national_id} 
          WHERE id=${body.id}`;
      }
      return new Response(JSON.stringify({ message: result.message }), {
        headers: { "Content-Type": "application/json" },
        status: result.success ? 200 : 403,
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
