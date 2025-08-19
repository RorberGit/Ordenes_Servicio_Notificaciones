import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='mx-auto flex h-screen max-w-screen-xl items-center justify-center px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl'>
            404
          </h1>
          <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white'>
            Lo sentimos, no hemos podido encontrar la página solicitada.
          </p>
          <Link
            to='/'
            className='bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none'
          >
            Regresar a la página principal
          </Link>
        </div>
      </div>
    </section>
  )
}
