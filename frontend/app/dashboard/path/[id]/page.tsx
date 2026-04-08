// import React from 'react'
"use client";
// const page = () => {
//      const path = [
//     {
//       judul: "matematika",
//     },
//     {
//       judul: "fisika",
//     },
//     {
//       judul: "biologi",
//     },
//   ];
//   return (
//     <div className="mx-8 my-8 flex gap-4">
//           {path.map((res) => (
//             <div key={res.judul} className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center flex border-2 border-gray-300">
//               <p className="break-words text-center w-full">{res.judul}</p>
//             </div>
//           ))}
//         </div>
//   )
// }

// export default page

import Link from "next/link";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useLearningStore } from "@/stores/learning-store";
import { use, useEffect } from "react";
import { useParams } from "next/navigation";
export default function CheckpointList() {
  const {paths,currentPath,currentCheckpoint,loading,checkpointLoading,error, fetchPaths, fetchPath,fetchCheckpoint} = useLearningStore()
  const checkpoints = currentPath?.checkpoints
  const params = useParams()
  const pathId = params.id as string
  
  useEffect(() => {
      if (pathId) fetchPath(pathId)
    }, [pathId])
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  


  return (
    <div className=" gap-10 relative pl-10 space-y-10">
      
   
      {checkpoints?.map((checkpoint, index) => (
        <Link key={checkpoint.id} className="relative m-20" 
              href={`/dashboard/path/${pathId}/checkpoint/${checkpoint.id}`
              
              }>
          
          {/* Card */}
          <Card className="bg-stone-700 text-white border border-zinc-700 rounded-xl
                            hover:bg-gray-700 ">
            <CardContent className="p-6 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-400">
                  CHECKPOINT {String(checkpoint.orderIndex + 1).padStart(2, "0")}
                </p>
                {(checkpoint.status == "completed")&& (
                  <Badge className="bg-green-200 text-green-800">
                    Selesai
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-semibold">
                {checkpoint.title}
              </h3>

              <p className="text-sm text-zinc-400">
                Exervise • {checkpoint.exercises.length} 
              </p>

              <div className="border-t border-zinc-700 pt-3 text-sm text-zinc-400">
                +{checkpoint.xpReward} XP  
              </div>

            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

