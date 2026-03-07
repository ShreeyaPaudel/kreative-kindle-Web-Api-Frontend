import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ActivityFormPage from "../../new/ActivityFormPage";

export const dynamic = "force-dynamic";

async function fetchActivity(token: string, id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res  = await fetch(`${base}/api/admin/activities/${id}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to fetch activity");
  return data?.data ?? data;
}

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const store  = await cookies();
  const token  = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  let activity: any;
  try { activity = await fetchActivity(token, id); }
  catch (e: any) {
    return (
      <div className="rounded-2xl p-5 text-sm" style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}>
        <p className="font-semibold mb-1">Could not load activity</p>
        <p>{e?.message}</p>
      </div>
    );
  }

  // Convert arrays back to newline-separated strings for the textarea
  const initialData = {
    title:       activity.title       ?? "",
    category:    activity.category    ?? "Art",
    age:         activity.age         ?? "Ages 3–6",
    duration:    activity.duration    ?? "30 min",
    description: activity.description ?? "",
    image:       activity.image       ?? "",
    materials:   Array.isArray(activity.materials) ? activity.materials.join("\n") : (activity.materials ?? ""),
    steps:       Array.isArray(activity.steps)     ? activity.steps.join("\n")     : (activity.steps     ?? ""),
  };

  return <ActivityFormPage initialData={initialData} activityId={id} />;
}