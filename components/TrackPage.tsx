'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!

export default function TrackPage() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [mounted, setMounted] = useState(false)

  // wait until client hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!window.gtag) return

    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    window.gtag('config', GA_ID, {
      page_path: url,
    })
  }, [mounted, pathname, searchParams])

  return null
}
