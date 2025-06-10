import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { File, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => void
  loading: boolean
}

export default function FileUpload({ onUpload, loading }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="w-full p-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer dark:bg-gray-800 dark:border-gray-600"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-600 dark:text-gray-400">Drop the files here ...</p>
      ) : (
        <>
          <File className="h-10 w-10 text-gray-500 dark:text-gray-400 mb-4" />
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag files here or click to select files.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cadence AI understands .csv, .json, and .xlsx.
            </p>
          </div>
        </>
      )}
      <Button disabled={loading} className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload a file'
        )}
      </Button>
    </div>
  )
}
