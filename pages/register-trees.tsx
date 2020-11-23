import React, { ReactElement } from 'react'
import RegisterTrees from '../src/features/user/UserProfile/components/RegisterTrees'

interface Props {

}

export default function Register({ }: Props): ReactElement {
    return (
        <div>
            <RegisterTrees />
        </div>
    )
}
