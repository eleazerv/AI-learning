"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCheckpointStore } from "@/stores/checkpoint-store";
import Link from "next/link";

interface Exercise {
  id: string;
  checkpointId: string;
  difficulty: string;
}

export default function Container() {
  const params = useParams();
  const cpid = params.cpid as string;
  const { fetchCheckpoint, current } = useCheckpointStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    fetchCheckpoint(cpid);
  }, [cpid, fetchCheckpoint]);
  useEffect(() => {
    if (current?.exercises) {
      setExercises(current.exercises);
    }
  }, [current]);

  if (!current) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Exercise</h2>
        <ul>
          {current.exercises?.map((ex) => (
            <li key={ex.id}>
              <Link
                href={`/dashboard/path/${params.id}/checkpoint/${cpid}/exercise/${ex.id}`}
                className="text-blue-600 underline"
              >
                Exercise {ex.id} - {ex.difficulty}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">PDF</h2>
        <ul>
          {current.exercises?.map((ex) => (
            <li key={ex.id}>
              <Link
                href={`/dashboard/path/${params.id}/checkpoint/${cpid}/pdf/${ex.id}`}
                className="text-green-600 underline"
              >
                PDF for Exercise {ex.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
