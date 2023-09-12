'use client'

import { forwardRef } from 'react'

interface UploadProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

type Ref = HTMLInputElement

export const Uplaod = forwardRef<Ref, UploadProps>(function Upload({ onChange }, ref) {
  return (
    <div>
      <input
        data-testid="file"
        className="
          block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-700-50 file:indigo-red-700
          hover:file:bg-indigo-100
        "
        ref={ref}
        type="file"
        onChange={onChange}
      />
    </div>
  )
})
