import { test, expect } from '../../support/fixtures';
import {
  allowSoftwareWebGL,
  boundsContain,
  mapCanvas,
  mapCenter,
} from '../../support/map';
import { openProject, projectPath } from '../../support/projectDetails/data';
import {
  expectMapOnIntervention,
  expectMapOnSite,
  findClickableIntervention,
  highlightedInterventions,
  interventionBounds,
  mapInterventionTypes,
  waitForMapInterventionTypes,
  waitForMapSites,
} from '../../support/projectDetails/map';
import {
  aboutProjectHeading,
  expectSelectionInUrl,
  interventionHid,
  interventionTypeOption,
  interventionTypeToggle,
} from '../../support/projectDetails/page';

test.beforeEach(async ({ page }) => {
  await allowSoftwareWebGL(page);
  // The map renders in software without a GPU, as in CI, and interventions load from TreeMapper, so both are slow.
  test.slow();
});

test('a shared intervention link moves the map to it and highlights it', async ({
  page,
}) => {
  // The first load only reads live ids. The shared link then opens at the world view, so reaching the intervention proves the map moved.
  const { interventions } = await openProject(page);
  // The map zooms only to points and polygons.
  const intervention = (await interventions()).find(
    (item) => interventionBounds(item) !== null
  );
  if (!intervention) {
    throw new Error('The project has no point or polygon intervention.');
  }

  await page.goto(projectPath(`?ploc=${intervention.hid}`));

  await expectSelectionInUrl(page, { site: null, ploc: intervention.hid });
  // Check that the map moves to the selected intervention and stops there.
  await expectMapOnIntervention(page, intervention);
  await expect
    .poll(() => highlightedInterventions(page), {
      message: 'the highlighted interventions',
    })
    .toContain(intervention.id);
});

test('clicking an intervention on the map selects it', async ({ page }) => {
  const { interventions } = await openProject(page);
  const [firstSite] = await waitForMapSites(page);
  // Clicks only work once the map has settled on the default site, or the intervention moves away under the pointer.
  await expectMapOnSite(page, firstSite);
  // Skip interventions around the map's center. The map is already on them, so the test would pass even if the map never moved.
  const center = await mapCenter(page);
  const awayFromCenter = (await interventions()).filter((item) => {
    const bounds = interventionBounds(item);
    return bounds !== null && !boundsContain(bounds, center);
  });
  const { intervention, point } = await findClickableIntervention(
    page,
    awayFromCenter
  );

  await mapCanvas(page).click({ position: point });

  await expectSelectionInUrl(page, { site: null, ploc: intervention.hid });
  await expect(interventionHid(page, intervention)).toBeVisible();
  await expect(aboutProjectHeading(page)).toBeHidden();
  // No highlight check here. The pointer is still over the intervention, so its hover highlight would pass for a selected one. The shared link test checks the highlight.
  await expectMapOnIntervention(page, intervention);
});

test('choosing an intervention type shows only that type on the map', async ({
  page,
}) => {
  await openProject(page);
  const typesOnMap = await waitForMapInterventionTypes(page);
  // Each type needs another one to hide, or a map that ignored the filter would still pass.
  expect(typesOnMap.length, 'intervention types on the map').toBeGreaterThan(1);

  // Covers every type, such as points for single trees and polygons for multi trees.
  for (const type of typesOnMap) {
    await interventionTypeToggle(page).click();
    await interventionTypeOption(page, type).click();

    await expect
      .poll(() => mapInterventionTypes(page), {
        message: `intervention types on the map after choosing ${type}`,
      })
      .toEqual([type]);
  }
});
