"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCheckpointStore } from "@/stores/checkpoint-store";
import Link from "next/link";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";

import { check } from "zod";

export default function Container() {
  const router = useRouter();
  const params = useParams();
  const cpid = params.cpid as string;
  const id = params.id as string;
  const fetchCheckpoint = useCheckpointStore((state) => state.fetchCheckpoint);
  const checkpoint = useCheckpointStore((state) => state.current);
  const readPdf = useCheckpointStore((state) => state.markReadPdf);
  const loading = useCheckpointStore((state) => state.loading);

  useEffect(() => {
    fetchCheckpoint(cpid);
  }, [cpid]);


  const handleClick = async () => {
    const res = await readPdf(cpid);
    console.log(res);
    router.push(`http://localhost:4000/dashboard/path/${id}`);
  };
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Exercise</h2>
        <Link
          href={`/dashboard/path/${params.id}/checkpoint/${cpid}/exercise/`}
          className="text-blue-600 underline"
        >
          Exercise
        </Link>
      </div>

      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">PDF</h2>
        <Button >
          <Link href={checkpoint?.materialPdfUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                  {loading ? "Loading..." : "See PDF" }
          </Link>
        </Button>
      </div>
    </div>
  );
}
