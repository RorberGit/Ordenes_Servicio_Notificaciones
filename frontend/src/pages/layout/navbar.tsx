import { Menu } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { MenuItem, Navbar1Props } from './types'
import { ModeToggle } from '@/components/mode-toggle'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProject } from '@/context/ProjectContext'

export default function Navbar({
  logo,
  menu,
  auth = {
    login: { title: 'Iniciar sesión', url: '#' },
    signup: { title: 'Cerrar sesión', url: '#' },
  },
}: Navbar1Props) {
  const { isAuthenticated, user } = useAuth() // * Context del usuario
  const { activeProject } = useProject() // * Context del proyecto

  return (
    <section className='w-full p-4'>
      {/* Desktop Menu */}
      <nav className='hidden justify-between lg:flex'>
        <div className='flex flex-grow items-center gap-6'>
          {/* Logo */}
          <a href={logo?.url} className='flex items-center gap-2'>
            <img src={logo?.src} className='max-h-8' alt={logo?.alt} />
            <span className='text-lg font-semibold tracking-tighter'>{logo?.title}</span>
          </a>
          {/* Menu */}
          <div className='flex items-center'>
            <NavigationMenu>
              <NavigationMenuList>{menu?.map(item => renderMenuItem(item))}</NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className='flex gap-2'>
          <ModeToggle /> {/* Cambio de tema Claro/Oscuro/Sistema */}
          <div className='grid content-center justify-items-center'>
            <span className='text-sm'>{user?.fullName}</span>
            {activeProject && <span className='text-[12px]'>Proyecto activo: {activeProject}</span>}
          </div>
          {/*Si el usuario a iniciado sesión
          ocultar botón de inicio de sesión y mostrar cerrar sesión*/}
          {!isAuthenticated ? (
            <Button asChild variant='outline' size='sm'>
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button>
          ) : (
            <Button asChild size='sm'>
              <a href={auth.signup.url}>{auth.signup.title}</a>
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className='block lg:hidden'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <a href={logo?.url} className='flex items-center gap-2'>
            <img src={logo?.src} className='max-h-8' alt={logo?.alt} />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='size-4' />
              </Button>
            </SheetTrigger>
            <SheetContent className='overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>
                  <a href={logo?.url} className='flex items-center gap-2'>
                    <img src={logo?.src} className='max-h-8' alt={logo?.alt} />
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-6 p-4'>
                <Accordion type='single' collapsible className='flex w-full flex-col gap-4'>
                  {menu?.map(item => renderMobileMenuItem(item))}
                </Accordion>

                <div className='flex flex-col gap-3'>
                  {/*Si el usuario a iniciado sesión
                  ocultar botón de inicio de sesión y mostrar cerrar sesión*/}
                  {!isAuthenticated ? (
                    <Button asChild variant='outline'>
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                  ) : (
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  )
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items && Array.isArray(item.items)) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className='bg-popover text-popover-foreground w-96'>
          {item.items.map(subItem => (
            <NavigationMenuLink asChild key={subItem.title}>
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          to={item.url}
          className='group bg-background hover:bg-muted hover:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors'
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items && Array.isArray(item.items)) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map(subItem => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <a key={item.title} href={item.url} className='text-md font-semibold'>
      {item.title}
    </a>
  )
}

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className='hover:bg-muted hover:text-accent-foreground flex w-96 flex-row gap-2 rounded-md p-1.5 leading-none no-underline transition-colors outline-none select-none'
      to={item.url}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-muted-foreground text-sm leading-snug'>{item.description}</p>
        )}
      </div>
    </Link>
  )
}
