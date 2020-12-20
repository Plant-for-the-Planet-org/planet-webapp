import React, { ReactElement } from 'react'
import Andoalcala from '../src/tenants/andalucia/Andoalcala'
import { useRouter } from 'next/router';

interface Props {
    
}

function AnilloverdegranadaPage({}: Props): ReactElement {
    const router = useRouter();

    if(process.env.TENANT !== 'andalucia'){
        router.push('/')
    }
    return (
        <Andoalcala/>
    )
}

export default AnilloverdegranadaPage