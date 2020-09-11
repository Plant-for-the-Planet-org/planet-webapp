import React, { useRef } from "react";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from "react-component-export-image";

const MyComponent = () => {
    const componentRef = useRef();
  
    return (
    <React.Fragment>
        <div ref={componentRef} style={{backgroundColor:'red'}}>  hiiii all </div>
        <button onClick={() => exportComponentAsJPEG(componentRef)}>
            Export As JPEG
        </button>
        <button onClick={() => exportComponentAsPDF(componentRef)}>
            Export As PDF
        </button>
        <button onClick={() => exportComponentAsPNG(componentRef)}>
            Export As PNG
        </button>
    </React.Fragment>);
  }
  
  export default MyComponent;