import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from "./../src/utils/themeContext";

function PlanetWeb({Component, pageProps}) {
    return (
      <ThemeProvider>
         <Component {...pageProps} />
      </ThemeProvider> 
    );
  }
  
export default PlanetWeb;