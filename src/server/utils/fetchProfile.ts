import prisma from '../../../prisma/client';

export async function fetchProfile(profileId: string) {
  const profile = await prisma.profile.findFirst({
    select: {
      id: true,
      guid: true,
    },
    where: {
      guid: profileId,
      deleted_at: null,
    },
  });
  return profile;
}
