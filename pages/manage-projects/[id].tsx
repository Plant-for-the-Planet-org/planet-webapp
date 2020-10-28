import React, { ReactElement,useEffect } from 'react'
import { useRouter } from 'next/router';

interface Props {
    
}

function ManageSingleProject({}: Props): ReactElement {
    const [projectGUID, setProjectGUID] = React.useState(null);
    const [ready, setReady] = React.useState(false);

    const router = useRouter();

    useEffect(() => {
        if (router && router.query.id !== undefined) {
            setProjectGUID(router.query.id);
          setReady(true);
        }
      }, [router]);
    return (
        <div>
            <h2> {projectGUID} </h2>
        </div>
    )
}

export default ManageSingleProject
