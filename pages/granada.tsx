import React, { ReactElement } from 'react'
import Anilloverdegranada from '../src/tenants/andalucia/Anilloverdegranada'
import { useRouter } from 'next/router';

interface Props {
    
}

function AnilloverdegranadaPage({}: Props): ReactElement {
  const router = useRouter();

    if(process.env.TENANT !== 'andalucia'){
        if(typeof window !== 'undefined'){
            router.push('/')
        }
    }
    return (
        <Anilloverdegranada/>
    )
}

export default AnilloverdegranadaPage
