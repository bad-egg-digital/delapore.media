import './assets'
import ReactDOM from 'react-dom/client'
import App from '@views/layouts/App'
import AppContextProvider from '@views/layouts/AppContext'

ReactDOM.createRoot(document.getElementById('app')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
