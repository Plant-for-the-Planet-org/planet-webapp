import React, { ReactElement } from 'react'
import Andodonana from '../src/tenants/andalucia/Andodonana'
import { useRouter } from 'next/router';

interface Props {
    
}

function AnilloverdegranadaPage({}: Props): ReactElement {
    const router = useRouter();

    if(process.env.TENANT !== 'andalucia'){
        router.push('/')
    }
    return (
        <Andodonana/>
    )
}

export default AnilloverdegranadaPage