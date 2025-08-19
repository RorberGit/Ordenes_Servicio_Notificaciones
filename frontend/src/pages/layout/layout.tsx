import { menu } from './menu'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'
import almest from '../../assets/almest.jpg'

const logo = {
  url: 'https://www.almest.com',
  src: almest,
  alt: 'logo',
  title: '',
}

export default function Layout() {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <header className='flex h-16 flex-shrink-0 items-center shadow-sm'>
        <Navbar logo={logo} menu={menu} />
      </header>
      <main className='flex flex-1 items-center justify-center px-4 py-8'>
        <Outlet />
      </main>
      <footer className='bg-muted text-muted-foreground flex h-12 flex-shrink-0 items-center justify-center py-4 text-center text-xs'>
        Pie
      </footer>
    </div>
  )
}
