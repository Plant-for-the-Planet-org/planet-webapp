import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { string } from 'prop-types';
export const ParamsContext = createContext({
    embed: string||undefined,
    singleProject : string||undefined
});



const QueryParamsProvider =({children}: any) => {
        
    const [embed, setEmbed] = React.useState < string| undefined >(undefined);
    const [singleProject, setSingleProject] = React.useState <string |undefined |string[] >(undefined);
    const router = useRouter();

    useEffect(()=>{
        setEmbed(router.query.embed);
        setSingleProject(router.query.singleproject);
    },[router]);

    return(
    <ParamsContext.Provider value={{
        embed,
        singleProject
    }}>
        {children}
    </ParamsContext.Provider>
    );
}

export default QueryParamsProvider;
