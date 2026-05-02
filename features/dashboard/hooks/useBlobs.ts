import { useState, useEffect } from 'react'
import type { BlobResult } from '../types'

export const useBlobs = () => {
  const [blobUrl, setBlobUrl] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getBlobs = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('api/blobs')
        if (!res.ok) throw new Error('Failed to fetch blobs')

        const data = await res.json()
        const blobList = data.blobs ?? data

        const urls = blobList.reduce(
          (acc: Record<string, string>, blob: BlobResult) => {
            acc[blob.pathname] = blob.url
            return acc
          },
          {} as Record<string, string>
        )

        setBlobUrl(urls)
      } catch (err) {
        setError('Gagal memuat gambar')
      } finally {
        setIsLoading(false)
      }
    }

    getBlobs()
  }, [])

  return { blobUrl, isLoading, error }
}