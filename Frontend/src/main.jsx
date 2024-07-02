import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserProvider from '../Context/UserContext.jsx'
import { Provider } from 'react-redux'
import { store } from '../Toolkit/store.js'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root')).render(

  <UserProvider>
        <Provider store={store}>
         
            <SnackbarProvider  anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={2000}
          
          >
                  <App />
            </SnackbarProvider>
           
    
        </Provider>
      </UserProvider>
 
  
)
