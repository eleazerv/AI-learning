"use client";
import { useParams } from "next/navigation";
export default function Exercise() {
  const params = useParams();
  const exid = params.exid as string;
  return <div>tes</div>;
}
