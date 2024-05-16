import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {
  BriefProjectQueryResult,
  ContributionStats,
  MyContributionsMapItem,
  MyContributionsSingleProject,
  ContributionsQueryResult,
  GiftsQueryResult,
  GroupTreecounterQueryResult,
  RegistrationLocation,
  SingleDonation,
  SingleGiftReceived,
} from '../../../features/common/types/myForestv2';

function initializeStats(): ContributionStats {
  return {
    giftsReceivedCount: 0,
    contributionsMadeCount: 0,
    contributedProjects: new Set<string>(),
    contributedCountries: new Set<string>(),
    treesRegistered: 0,
    treesDonated: {
      personal: 0,
      received: 0,
    },
    areaRestoredInM2: {
      personal: 0,
      received: 0,
    },
    areaConservedInM2: {
      personal: 0,
      received: 0,
    },
  };
}

async function fetchProfile(profileId: string) {
  const profile = await prisma.profile.findFirst({
    select: {
      id: true,
      guid: true,
      treecounterId: true,
    },
    where: {
      guid: profileId,
      deleted_at: null,
    },
  });
  return profile;
}

async function fetchGroupTreecounterData(
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

/**
 * @returns List of projects (with basic details - purpose, id, guid) that are eligible to receive donations
 */
async function fetchProjects() {
  const projects = await prisma.$queryRaw<BriefProjectQueryResult[]>`
			SELECT 
				id,
				guid, 
				purpose
			FROM
				project
			WHERE
				purpose IN ('trees' , 'conservation')
					AND deleted_at IS NULL
					AND verification_status NOT IN ('incomplete' , 'pending', 'processing')
			;
		`;
  return projects;
}

async function fetchContributions(profileIds: number[]) {
  const contributions = await prisma.$queryRaw<ContributionsQueryResult[]>`
			SELECT 
				c.guid,
				COALESCE(c.quantity, c.tree_count) as units,
				c.unit_type as unitType,
				c.plant_date as plantDate,
				c.contribution_type as contributionType,
				c.plant_project_id as projectId,
				c.amount,
				c.currency,
				c.country,
				c.geometry,
				c.gift_method as giftMethod, 
				c.gift_data->>'$.recipientName' as giftRecipient, 
				c.gift_data->>'$.type' as giftType
			FROM
				contribution c
			WHERE
				c.deleted_at is null AND 
				c.profile_id IN (${Prisma.join(profileIds)}) AND
				(
					(c.contribution_type = 'donation' AND c.payment_status = 'paid')
					OR 
					(c.contribution_type = 'planting' AND c.is_verified = '1')
				)
			ORDER BY
				c.id DESC;
		`;
  return contributions;
}

async function fetchGifts(profileIds: number[]) {
  const gifts = await prisma.$queryRaw<GiftsQueryResult[]>`
			SELECT 
				round((g.value)/100, 2) as quantity, 
				g.metadata->>'$.giver.name' as giftGiver, 
				g.metadata->>'$.project.id' as projectGuid, 
				g.metadata->>'$.project.name' as projectName, 
				g.metadata->>'$.project.country' as country, 
				g.payment_date as plantDate
			FROM 
				gift g
			WHERE 
				g.recipient_id IN (${Prisma.join(profileIds)}) AND 
				g.deleted_at is null
			ORDER BY
				g.id DESC;
		`;
  return gifts;
}

/**
 * Accepts a registration contribution and mutates the stats, myContributionsMap, and registrationLocationsMap data passed in.
 * @param stats
 * @param myContributionsMap
 * @param registrationLocationsMap
 * @param contribution
 */
function handleRegistrationContribution(
  contribution: ContributionsQueryResult,
  stats: ContributionStats,
  myContributionsMap: Map<string, MyContributionsMapItem>,
  registrationLocationsMap: Map<string, RegistrationLocation>
) {
  // Updates myContributionsMap
  myContributionsMap.set(contribution.guid, {
    type: 'registration',
    contributionCount: 1,
    contributionUnitType: 'tree',
    totalContributionUnits: contribution.units,
    contributions: [
      {
        dataType: 'treeRegistration',
        quantity: contribution.units,
        plantDate: contribution.plantDate,
        unitType: 'tree',
      },
    ],
  });
  // Updates stats
  stats.treesRegistered += Number(contribution.units);

  if (contribution.country !== null) {
    stats.contributedCountries.add(contribution.country);
  }

  // Updates registrationLocationsMap
  if (contribution.geometry !== null) {
    registrationLocationsMap.set(contribution.guid, {
      geometry: contribution.geometry,
    });
  }
}

/**
 * Accepts a donation contribution and projectMap and mutates the stats, myContributionsMap data passed in.
 * @param contribution
 * @param projectMap
 * @param stats
 * @param myContributionsMap
 */
function handleDonationContribution(
  contribution: ContributionsQueryResult,
  projectMap: Map<string, BriefProjectQueryResult>,
  stats: ContributionStats,
  myContributionsMap: Map<string, MyContributionsMapItem>
) {
  // Initialize data
  const donationData: SingleDonation = {
    dataType: 'donation',
    plantDate: contribution.plantDate,
    quantity: contribution.units,
    unitType: contribution.unitType,
    isGifted: contribution.giftMethod !== null,
    giftDetails:
      contribution.giftMethod !== null
        ? {
            recipient: contribution.giftRecipient,
            type: contribution.giftType,
          }
        : null,
  };

  const project = projectMap.get(contribution.projectId);
  if (project) {
    // Check if the project is already in the contributions map.
    // If yes, increment the contributionCount and push contributionData to the contributions array
    if (myContributionsMap.has(project.guid)) {
      const item = myContributionsMap.get(
        project.guid
      ) as MyContributionsSingleProject;

      item.contributionCount++;
      item.totalContributionUnits += Number(contribution.units);
      if (item.latestContributions.length < 5) {
        item.latestContributions.push(donationData);
      }
    } else {
      stats.contributedProjects.add(project.guid);
      // Adds a new key to the contributions map
      myContributionsMap.set(project.guid, {
        type: 'project',
        contributionCount: 1,
        totalContributionUnits: Number(contribution.units),
        contributionUnitType: contribution.unitType,
        latestContributions: [donationData],
      });
    }

    if (project.purpose === 'trees') {
      if (contribution.unitType === 'tree') {
        stats.treesDonated.personal += Number(contribution.units);
      }
      if (contribution.unitType === 'm2') {
        stats.areaRestoredInM2.personal += Number(contribution.units);
      }
    } else {
      stats.areaConservedInM2.personal += Number(contribution.units);
    }

    if (contribution.country !== null) {
      stats.contributedCountries.add(contribution.country);
    }
  }
}

/**
 * Accepts a gift contribution and mutates the stats and myContributionsMap data passed in.
 * @param gift
 * @param stats
 * @param myContributionsMap
 */
function handleGiftContribution(
  gift: GiftsQueryResult,
  stats: ContributionStats,
  myContributionsMap: Map<string, MyContributionsMapItem>
) {
  // Initialize data
  const giftData: SingleGiftReceived = {
    dataType: 'receivedGift',
    plantDate: gift.plantDate,
    quantity: Math.round(gift.quantity * 100) / 100,
    unitType: 'tree',
    isGift: true,
    giftDetails: {
      giverName: gift.giftGiver,
    },
  };

  // Check if the project is already in the contributions map.
  if (myContributionsMap.has(gift.projectGuid)) {
    const item = myContributionsMap.get(
      gift.projectGuid
    ) as MyContributionsSingleProject; //Only donations are mapped with a project guid

    item.contributionCount++;
    item.totalContributionUnits += Math.round(gift.quantity * 100) / 100;
    if (item.latestContributions.length < 5) {
      item?.latestContributions.push(giftData);
    }
  } else {
    stats.contributedProjects.add(gift.projectGuid);
    // Adds a new key to the contributions map
    myContributionsMap.set(gift.projectGuid, {
      type: 'project',
      contributionCount: 1,
      contributionUnitType: 'tree',
      totalContributionUnits: Math.round(gift.quantity * 100) / 100,
      latestContributions: [giftData],
    });
  }
}

export const contributionsProcedure = procedure
  .input(
    z.object({
      profileId: z.string(),
      slug: z.string(),
    })
  )
  .query(async ({ input: { profileId, slug } }) => {
    console.log(new Date().toLocaleString(), 'starting contributionsProcedure');

    // Initialize return values
    const stats = initializeStats();
    /**
     * Map of project guid / contribution id (to identify registrations) to contribution data.
     * This groups data for donations and gifts by project, and tree registrations by contribution id
     * */
    const myContributionsMap: Map<string, MyContributionsMapItem> = new Map();
    /** Maps contribution id to geometry of registered tree */
    const registrationLocationsMap = new Map<string, RegistrationLocation>();

    // Check that the profile actually exists
    const profile = await fetchProfile(profileId);

    if (!profile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Profile not found',
      });
    }

    // Check if the profile is associated with a group treecounter, and fetch all profile ids for that group (parent and children)
    // slug and treecounterId are used to identify the group treecounter, if there is a mismatch, it will be treated as a normal profile
    const groupTreecounterData = await fetchGroupTreecounterData(
      slug,
      profile.treecounterId
    );
    const profileIds =
      groupTreecounterData.length > 0
        ? groupTreecounterData.map(({ profileId }) => profileId)
        : [profile.id];

    // Fetch eligible projects
    const projects = await fetchProjects();
    /** Map of project id to project information */
    const projectMap = new Map(
      projects.map((project) => [project.id, project])
    );
    const projectSet = new Set(projects.map((project) => project.guid));

    const contributions = await fetchContributions(profileIds);
    const gifts = await fetchGifts(profileIds);

    // Process contribution data, updating stats, myContributionsMap, and registrationLocationsMap
    contributions.forEach((contribution) => {
      stats.contributionsMadeCount++;
      if (contribution.contributionType === 'planting') {
        handleRegistrationContribution(
          contribution,
          stats,
          myContributionsMap,
          registrationLocationsMap
        );
      } else {
        handleDonationContribution(
          contribution,
          projectMap,
          stats,
          myContributionsMap
        );
      }
    });

    // Process gift data, updating myContributionsMap and stats
    gifts.forEach((gift) => {
      stats.giftsReceivedCount++;
      stats.treesDonated.received += Math.round(gift.quantity * 100) / 100;
      if (gift.country !== null) {
        stats.contributedCountries.add(gift.country);
      }
      // Handle individual gift contributions if the project is in the eligible project set
      if (projectSet.has(gift.projectGuid)) {
        handleGiftContribution(gift, stats, myContributionsMap);
      }
    });

    console.log(new Date().toLocaleString(), 'ending contributionsProcedure');

    return {
      stats,
      myContributionsMap,
      registrationLocationsMap,
    };
  });
