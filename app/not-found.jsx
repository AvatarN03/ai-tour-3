

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Image
        src="/404.gif"
        alt="Page not found"
        width={400}
        height={400}
        unoptimized
      />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Oops! Page not found
      </h1>
      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-purple-500 transition-colors"
      >
        Go back
      </Link>
    </div>
  )
}