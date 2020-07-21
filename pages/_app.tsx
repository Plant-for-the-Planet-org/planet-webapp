import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from "../src/utils/themeContext";
import {Provider} from 'react-redux'
import {createWrapper} from 'next-redux-wrapper'
import store from './../src/store/store'
import { context } from '../src/utils/config';
import useLocalStorage from '../src/utils/useLocalStorage';
import React from 'react';
function PlanetWeb({Component, pageProps,stars,config}:any) {

  const [configStore, setConfig] = useLocalStorage('config', {});

  React.useEffect(()=>{
    setConfig(config)
  },[config])
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} config={config} />
      </ThemeProvider> 
    </Provider>
    
  );
}

PlanetWeb.getInitialProps = async () => {
  const res = await fetch(`${context.api_url}/public/v1.2/en/config`);
  const config =await res.json()
  return { config:config }
}
const makestore =()=>store;
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(PlanetWeb);