import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

export const AppContext = createContext({
  appContext: {
    menuOpen: false,
  },
  setAppContext: () => {},
});

const AppContextProvider = ({ children }) => {
  const [ appContext, setAppContext] = useState({
    menuOpen: false,
  });

  useEffect( () => {
    if(appContext.menuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }, [ appContext ])

  return (
    <AppContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
