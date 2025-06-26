import React from 'react'
import { LoaderCircle } from 'lucide-react';

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderCircle className="size-8 animate-spin text-blue-700" />
    </div>
  )
}

export default Loader
