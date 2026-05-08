import './Header.scss';
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Brand from '@views/components/Brand/Brand';
import MenuPrimary from '@views/components/MenuPrimary/MenuPrimary';
import MenuToggle from '@views/components/MenuToggle/MenuToggle';

export default function Header({ items, companyName }) {
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
    <header className={ `menu-fixed ${ (isScrolled ? 'scrolled' : '') }` }>
      <div className="container container-large inner inner-small inner-zero-x">
        <Brand name={ companyName } />
        <MenuPrimary items={ items } />
        <MenuToggle />
      </div>
    </header>
  )
}
