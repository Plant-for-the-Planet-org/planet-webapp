import Footer from '../Footer'
import Header from '../Header'
import Navbar from '../Navbar'
import { useTheme } from "../../../utils/themeContext";

export default function Layout(props:any) {
    const { theme } = useTheme();
    return (
        <>
            <Header/>
            <div className={`${theme}`}>
            <Navbar theme={theme}/>
              {props.children}
            <Footer />
            </div>
        </>
    )
}
