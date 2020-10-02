import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
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