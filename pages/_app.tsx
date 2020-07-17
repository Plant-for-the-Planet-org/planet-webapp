import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from "../src/utils/themeContext";
import {Provider} from 'react-redux'
import {createWrapper} from 'next-redux-wrapper'
import store from './../src/store/store'

import { getSession, Provider as AuthProvider } from 'next-auth/client'

function PlanetWeb({Component, pageProps}:any) {
  const { session } = pageProps

  return (
    <Provider store={store}>
      <AuthProvider options={{site: process.env.SITE ?? 'http://localhost:3000'}} session={session}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider> 
      </AuthProvider>
    </Provider>
    
  );
}
  
const makestore =()=>store;
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(PlanetWeb);