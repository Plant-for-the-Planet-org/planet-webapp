import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import styles from '../src/features/user/UserProfile/styles/EditProfileModal.module.scss';
import CompleteSignup from '../src/features/user/CompleteSignup'

export default function UserProfile() {
  return(
    <Layout>
       <CompleteSignup
          style={{ height: '100vh', overflowX: 'hidden' }}
        />
    </Layout>
  );
}

// const btnSize = {
//   width: '172px',
//   height: '68px',
//   borderRadius: '10px',
//   border: 'solid 1.2px #000',
//   margin: '5px',
//   backgroundColor: 'white',
// };
// const btnColor = {
//   border: 'solid 1.2px #68b030',
//   margin: '5px',
//   width: '172px',
//   height: '68px',
//   borderRadius: '10px',
//   backgroundColor: 'white',
// };
// const btnContainer = {
//   display: 'flex',
//   justifyContent: 'space-between',
// };
