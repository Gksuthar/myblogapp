import { redirect } from "next/navigation";

// Services index: redirect to the services listing page to avoid 404
export default function ServicesIndex() {
  redirect("/services-list");
}
