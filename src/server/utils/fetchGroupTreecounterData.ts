import prisma from '../../../prisma/client';
import { GroupTreecounterQueryResult } from '../../features/common/types/myForestv2';

export async function fetchGroupTreecounterData(
  slug: string,
  parentTreecounterId: number
) {
  const data = await prisma.$queryRaw<GroupTreecounterQueryResult[]>`
				SELECT p.id as profileId
				FROM profile p
					INNER JOIN treecounter t ON p.treecounter_id = t.id
					INNER JOIN treecounter_group child ON child.treecounter_id = t.id
					INNER JOIN treecounter_group parent ON child.root_id = parent.id
				WHERE parent.slug = ${slug} AND parent.treecounter_id = ${parentTreecounterId};
			`;
  return data;
}
