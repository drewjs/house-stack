import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

import { useOptionalUser } from '~/utils/user'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  let user = useOptionalUser()
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pt-8 sm:pb-16">
        <div className="mx-auto max-w-7xl lg:px-8 sm:px-6">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://user-images.githubusercontent.com/2999006/275716943-32939de7-a923-4d76-ad9e-8fd01f411cf9.jpg"
                alt="Fabric London House Music Club"
              />
              <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pt-16 pb-8 lg:px-8 sm:px-6 lg:pt-32 sm:pt-24 lg:pb-20 sm:pb-14">
              <h1 className="text-center font-extrabold text-6xl tracking-tight lg:text-9xl sm:text-8xl">
                <span className="block text-yellow-500 uppercase drop-shadow-md">
                  House Stack
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-white text-xl sm:max-w-3xl">
                Check the README.md file for instructions on how to get this
                project deployed.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 font-medium text-base text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    View Notes for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 font-medium text-base text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-2 lg:px-8 sm:px-6">
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {[
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg',
                alt: 'Fly.io',
                href: 'https://fly.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg',
                alt: 'SQLite',
                href: 'https://sqlite.org',
              },
              {
                src: 'https://user-images.githubusercontent.com/2999006/275713474-8fa87b7a-19c3-4a1c-8b63-48852eeef5ea.png',
                alt: 'Drizzle ORM',
                href: 'https://orm.drizzle.team',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg',
                alt: 'Tailwind',
                href: 'https://tailwindcss.com',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg',
                alt: 'MSW',
                href: 'https://mswjs.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg',
                alt: 'Vitest',
                href: 'https://vitest.dev',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png',
                alt: 'Testing Library',
                href: 'https://testing-library.com',
              },
              {
                src: 'https://raw.githubusercontent.com/gist/drewjs/b5f1a65347cb958561ebdf0d278f4408/raw/0d8c31b9ad0d45897dfa2d4388df25550f0e4a41/biome-logo.cd0a0a87.svg',
                alt: 'Biome',
                href: 'https://biomejs.dev',
              },
              {
                src: 'https://raw.githubusercontent.com/gist/drewjs/b5f1a65347cb958561ebdf0d278f4408/raw/1a55b98122ea8fba51b1ddcf89bd16f050bacf27/typescript-logo.svg',
                alt: 'TypeScript',
                href: 'https://typescriptlang.org',
              },
              {
                src: 'https://raw.githubusercontent.com/gist/drewjs/b5f1a65347cb958561ebdf0d278f4408/raw/a131d9f8fd1478d943de5b0cf9da6bac402d25d5/sentry-logo.svg',
                alt: 'Sentry',
                href: 'https://sentry.io',
              },
            ].map(img => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition focus:grayscale-0 hover:grayscale-0"
              >
                <img alt={img.alt} src={img.src} className="object-contain" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
