"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LimitSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLimit = searchParams.get("limit") || "5";

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLimit = e.target.value;

    // keep other params, but reset page to 1 when limit changes
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", nextLimit);
    params.set("page", "1");

    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Show</span>
      <select
        value={currentLimit}
        onChange={onChange}
        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm"
      >
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <span className="text-sm text-gray-600">per page</span>
    </div>
  );
}