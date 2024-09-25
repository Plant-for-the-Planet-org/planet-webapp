import prisma from '../../../prisma/client';
import { ProfileGroupQueryResult } from '../../features/common/types/myForest';

export async function fetchProfileGroupData(profileId: number) {
  const data = await prisma.$queryRaw<ProfileGroupQueryResult[]>`
				SELECT pg.profile_id as profileId
				FROM profile_group AS pg
				WHERE pg.lft BETWEEN (
						SELECT root.lft
						FROM profile_group AS root
						WHERE root.profile_id = ${profileId}
				) AND (
						SELECT root.rgt
						FROM profile_group AS root
						WHERE root.profile_id = ${profileId}
				)
				AND pg.root_id = (
						SELECT root.root_id
						FROM profile_group AS root
						WHERE root.profile_id = ${profileId}
				)
				AND pg.profile_id IS NOT NULL;
			`;
  return data;
}
