import React, { ReactElement,useEffect } from 'react'
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects/screens'
import { useSession } from 'next-auth/client';

interface Props {
    
}

function ManageSingleProject({}: Props): ReactElement {
    const [projectGUID, setProjectGUID] = React.useState(null);
    const [ready, setReady] = React.useState(false);
    const [session, loading] = useSession();

    const router = useRouter();

    useEffect(() => {
        if (router && router.query.id !== undefined) {
            setProjectGUID(router.query.id);
          setReady(true);
        }
      }, [router]);
    return ready && session ? (
        <ManageProjects GUID={projectGUID} session={session} />
    ): (<h2>NO Project ID FOUND</h2>)
}

export default ManageSingleProject
