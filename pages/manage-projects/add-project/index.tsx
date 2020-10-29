import React, { ReactElement } from 'react'
import ManageProjects from '../../../src/features/user/ManageProjects/screens'
import { useSession } from 'next-auth/client';

interface Props {
    
}

export default function ManageProjectsPage({}: Props): ReactElement {
    const [session, loading] = useSession();

    return (
        <ManageProjects  session={session}/>
    )
}
