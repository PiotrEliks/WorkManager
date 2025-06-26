import React from 'react'
import { X, LoaderCircle } from 'lucide-react'
import FormField from './FormField'

const DataForm = ({ fields, onSubmit, onCancel, isSubmitting, submitLabel }) => {
  return (
    <div className="w-full relative h-full flex flex-col overflow-auto text-sm">
      <div className="absolute top-0 right-0 cursor-pointer z-10" onClick={onCancel} title="Anuluj">
        <X className="size-6" />
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-10">
        {fields.map((field, i) => (
          <FormField key={i} {...field} />
        ))}
        <button
          type="submit"
          className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-5 animate-spin" />
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </div>
  )
}

export default DataForm