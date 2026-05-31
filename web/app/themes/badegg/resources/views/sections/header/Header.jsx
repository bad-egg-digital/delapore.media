import './Header.scss';
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import Brand from '@views/components/Brand/Brand';
import MenuPrimary from '@views/components/MenuPrimary/MenuPrimary';
import MenuToggle from '@views/components/MenuToggle/MenuToggle';

export default function Header({ isLoaded }) {
  const location = useLocation();
  const [ isScrolled, setIsScrolled ] = useState(false)

  useEffect( () => {
    const header = document.querySelector(".menu-fixed");

    if (!header) return;

    const toggleScrolledClass = () => {
      const body = document.querySelector("body");
      const scrolled = document.scrollingElement.scrollTop;
      const position = body.offsetTop;

      setIsScrolled(scrolled > position + (header.offsetHeight / 2));
    };

    // Initial check
    toggleScrolledClass();

    // Add scroll event listener
    window.addEventListener("scroll", toggleScrolledClass);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", toggleScrolledClass);
    };
  }, [])

  return (
    <header className={ clsx(
      'menu-fixed',
      isScrolled && 'scrolled',
      !isLoaded && 'loading-nudge-down'
    ) }>
      <div className="container container-large inner inner-small inner-zero-x">
        <Brand icon={ true } />
        <MenuPrimary />
        <MenuToggle />
      </div>
    </header>
  )
}
