import { redirect } from "next/navigation";

// Server-side redirect from '/' to '/home' to ensure a stable landing route on Vercel
export default function Page() {
  redirect("/home");
}
