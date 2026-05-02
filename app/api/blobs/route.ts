import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list(); // destructure di sini
  return NextResponse.json(blobs); // kirim array langsung
}