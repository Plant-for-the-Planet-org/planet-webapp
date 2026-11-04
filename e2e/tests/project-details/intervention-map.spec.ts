import { test, expect } from '../../support/fixtures';
import {
  allowSoftwareWebGL,
  boundsContain,
  expectMapOnIntervention,
  expectMapOnSite,
  findClickableIntervention,
  highlightedInterventions,
  interventionBounds,
  mapCanvas,
  mapCenter,
  waitForMapSites,
} from '../../support/map';
import {
  aboutProjectHeading,
  expectSelectionInUrl,
  interventionHid,
  openProject,
  projectPath,
} from '../../support/projectDetails';

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
