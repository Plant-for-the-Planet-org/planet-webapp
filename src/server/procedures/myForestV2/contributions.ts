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
  MapLocation,
  SingleDonation,
  SingleGiftReceived,
} from '../../../features/common/types/myForestv2';
import getPointCoordinates from '../../../utils/getPointCoordinates';
import { fetchProfile } from '../../utils/fetchProfile';
import { fetchGroupTreecounterData } from '../../utils/fetchGroupTreecounterData';

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

/**
 * @returns List of projects (with basic details - purpose, id, guid) that are eligible to receive donations
 */
async function fetchProjects(): Promise<BriefProjectQueryResult[]> {
  const projects = await prisma.$queryRaw<BriefProjectQueryResult[]>`
			SELECT 
				id,
				guid, 
				purpose,
				country,
				geometry
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

async function fetchContributions(
  profileIds: number[]
): Promise<ContributionsQueryResult[]> {
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

async function fetchGifts(profileIds: number[]): Promise<GiftsQueryResult[]> {
  const gifts = await prisma.$queryRaw<GiftsQueryResult[]>`
			SELECT 
				round((g.value)/100, 2) as quantity, 
				g.metadata->>'$.giver.name' as giftGiver, 
				g.metadata->>'$.project.id' as projectGuid, 
				g.metadata->>'$.project.name' as projectName, 
				g.metadata->>'$.project.country' as country, 
				COALESCE(g.payment_date, g.redemption_date) as plantDate
			FROM 
				gift g
			WHERE 
				g.recipient_id IN (${Prisma.join(profileIds)}) AND 
				g.deleted_at is null AND
				g.value <> 0
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
  registrationLocationsMap: Map<string, MapLocation>,
  project: BriefProjectQueryResult | null
): void {
  // Updates myContributionsMap
  myContributionsMap.set(contribution.guid, {
    type: 'registration',
    contributionCount: 1,
    contributionUnitType: 'tree',
    totalContributionUnits: contribution.units,
    country: contribution.country || null,
    projectGuid: project?.guid || null,
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

  // Updates registrationLocationsMap
  if (contribution.geometry !== null) {
    registrationLocationsMap.set(contribution.guid, {
      geometry: {
        type: 'Point',
        coordinates: getPointCoordinates(contribution.geometry),
      },
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
  myContributionsMap: Map<string, MyContributionsMapItem>,
  projectLocationsMap: Map<string, MapLocation>
): void {
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
      if (!item.latestDonations) {
        item.latestDonations = [donationData];
      } else {
        if (item.latestDonations.length < 5) {
          item.latestDonations.push(donationData);
        }
      }
    } else {
      stats.contributedProjects.add(project.guid);
      // Adds a new key to the contributions map
      myContributionsMap.set(project.guid, {
        type: 'project',
        contributionCount: 1,
        totalContributionUnits: Number(contribution.units),
        contributionUnitType: contribution.unitType,
        latestContributions: [],
        latestDonations: [donationData],
      });
    }

    // Add a new key to the projectLocationsMap
    if (project.geometry !== null && !projectLocationsMap.has(project.guid)) {
      projectLocationsMap.set(project.guid, {
        geometry: project.geometry,
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
  project: BriefProjectQueryResult,
  stats: ContributionStats,
  myContributionsMap: Map<string, MyContributionsMapItem>,
  projectLocationsMap: Map<string, MapLocation>
): void {
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
    if (!item.latestGifts) {
      item.latestGifts = [giftData];
    } else {
      if (item.latestGifts.length < 5) {
        item.latestGifts.push(giftData);
      }
    }
  } else {
    stats.contributedProjects.add(gift.projectGuid);
    // Adds a new key to the contributions map
    myContributionsMap.set(gift.projectGuid, {
      type: 'project',
      contributionCount: 1,
      contributionUnitType: 'tree',
      totalContributionUnits: Math.round(gift.quantity * 100) / 100,
      latestContributions: [],
      latestGifts: [giftData],
    });
  }

  // Add a new key to the projectLocationsMap
  if (project.geometry !== null && !projectLocationsMap.has(project.guid)) {
    projectLocationsMap.set(project.guid, {
      geometry: project.geometry,
    });
  }
}

function mergeAndSortLatestContributions(
  singleProject: MyContributionsSingleProject
): void {
  singleProject.latestContributions = [
    ...(singleProject.latestDonations || []),
    ...(singleProject.latestGifts || []),
  ];
  // Sort latestContributions by plantDate in descending order
  singleProject.latestContributions.sort((a, b) => {
    return new Date(b.plantDate).getTime() - new Date(a.plantDate).getTime();
  });
  delete singleProject.latestDonations;
  delete singleProject.latestGifts;
}

function populateContributedCountries(
  country: string | undefined,
  projectCountry: string | undefined,
  contributedCountries: ContributionStats['contributedCountries']
): void {
  const contributedCountry = country || projectCountry;
  if (contributedCountry) contributedCountries.add(contributedCountry);
}

function getLatestPlantDate(value: MyContributionsMapItem): Date {
  try {
    if (
      value.type === 'project' &&
      value.latestContributions &&
      value.latestContributions.length > 0
    ) {
      return new Date(value.latestContributions[0].plantDate);
    } else if (
      value.type === 'registration' &&
      value.contributions &&
      value.contributions.length > 0
    ) {
      return new Date(value.contributions[0].plantDate);
    } else {
      return new Date(0); // Return earliest possible date if no plantDate found to make items without a date appear last
    }
  } catch (e) {
    console.log(e);
    return new Date(0);
  }
}

function getSortedContributionsMap(
  myContributionsMap: Map<string, MyContributionsMapItem>
): Map<string, MyContributionsMapItem> {
  // Convert map to array of entries
  const entries = Array.from(myContributionsMap.entries());

  // Sort entries by plantDate of first contribution or latestContribution
  entries.sort(([_keyA, valueA], [_keyB, valueB]) => {
    const dateA = getLatestPlantDate(valueA);
    const dateB = getLatestPlantDate(valueB);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order (most recent first)
  });

  // Create a new sorted map
  return new Map(entries);
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
    const registrationLocationsMap = new Map<string, MapLocation>();
    const projectLocationsMap = new Map<string, MapLocation>();

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
    const projectIdMap = new Map(
      projects.map((project) => [project.id, project])
    );
    const projectGuidMap = new Map(
      projects.map((project) => [project.guid, project])
    );

    const contributions = await fetchContributions(profileIds);
    const gifts = await fetchGifts(profileIds);

    // Process contribution data, updating stats, myContributionsMap, and registrationLocationsMap
    contributions.forEach((contribution) => {
      stats.contributionsMadeCount++;
      populateContributedCountries(
        contribution.country,
        projectIdMap.get(contribution.projectId)?.country,
        stats.contributedCountries
      );
      if (contribution.contributionType === 'planting') {
        handleRegistrationContribution(
          contribution,
          stats,
          myContributionsMap,
          registrationLocationsMap,
          projectIdMap.get(contribution.projectId) || null
        );
      } else {
        handleDonationContribution(
          contribution,
          projectIdMap,
          stats,
          myContributionsMap,
          projectLocationsMap
        );
      }
    });

    // Process gift data, updating myContributionsMap and stats
    gifts.forEach((gift) => {
      stats.giftsReceivedCount++;
      stats.treesDonated.received += Math.round(gift.quantity * 100) / 100;
      populateContributedCountries(
        gift.country,
        projectGuidMap.get(gift.projectGuid)?.country,
        stats.contributedCountries
      );
      // Handle individual gift contributions if the project is in the eligible project set
      const project = projectGuidMap.get(gift.projectGuid);
      if (project) {
        handleGiftContribution(
          gift,
          project,
          stats,
          myContributionsMap,
          projectLocationsMap
        );
      }
    });

    // combine latestGifts and latestDonations into latestContributions for each project
    myContributionsMap.forEach((item) => {
      if (item.type === 'project') {
        mergeAndSortLatestContributions(item);
      }
    });

    const sortedContributionsMap =
      getSortedContributionsMap(myContributionsMap);

    console.log(new Date().toLocaleString(), 'ending contributionsProcedure');

    return {
      stats,
      myContributionsMap: sortedContributionsMap,
      registrationLocationsMap,
      projectLocationsMap,
    };
  });
