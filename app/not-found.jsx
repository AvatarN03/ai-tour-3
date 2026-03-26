import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/custom/Logo'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Logo />

      <Image
        src="/404.gif"
        alt="Page not found"
        width={400}
        height={400}
        className="object-contain"
        unoptimized
      />

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Oops! Page not found
      </h1>

      <Button asChild >
        <Link
          href="/dashboard"
          
        >
          Go back
        </Link>
      </Button>

    </div>
  )
}

export default NotFound