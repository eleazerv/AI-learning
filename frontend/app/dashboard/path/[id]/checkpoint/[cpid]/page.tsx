"use client";
import React from 'react'

import { useParams } from 'next/navigation'
import { useCheckpointStore } from '@/stores/checkpoint-store';

const page = () => {
  const params = useParams()
  const id = params.cpid as string 
  const { fetchCheckpoint} = useCheckpointStore() 
  return (
    <div>{id}</div>
  )
}

export default page