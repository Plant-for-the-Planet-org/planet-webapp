import type { ReactElement } from 'react';
import type {
  FireFeature,
  FireFeatureCollection,
} from '../../../common/types/fireLocation';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Source } from 'react-map-gl-v7/maplibre';
import FireIcon from '../../../../../public/assets/images/icons/FireIcon';
import { useApi } from '../../../../hooks/useApi';
import FirePopup from '../FirePopup';
import styles from '../FirePopup/FirePopup.module.scss';

const ALERT_DURATION = '30d';

const CONFIDENCE_PRIORITY: Record<
  FireFeature['properties']['confidence'],
  number
> = {
  high: 0,
  medium: 1,
  low: 2,
};

function selectFiresForDisplay(allFeatures: FireFeature[]): FireFeature[] {
  if (allFeatures.length <= 100) {
    return [...allFeatures];
  }

  const now = Date.now();
  const daysSinceEvent = (feature: FireFeature): number => {
    const eventTime = new Date(feature.properties.eventDate).getTime();
    return (now - eventTime) / (1000 * 60 * 60 * 24);
  };

  const inLast3Days: FireFeature[] = [];
  const inLast3To7Days: FireFeature[] = [];
  const inLast7To30Days: FireFeature[] = [];

  for (const feature of allFeatures) {
    const days = daysSinceEvent(feature);

    if (days <= 3) {
      inLast3Days.push(feature);
    } else if (days <= 7) {
      inLast3To7Days.push(feature);
    } else if (days <= 30) {
      inLast7To30Days.push(feature);
    }
  }

  const sortByConfidenceThenDate = (a: FireFeature, b: FireFeature) => {
    const confidenceDiff =
      CONFIDENCE_PRIORITY[a.properties.confidence] -
      CONFIDENCE_PRIORITY[b.properties.confidence];

    if (confidenceDiff !== 0) return confidenceDiff;

    return (
      new Date(b.properties.eventDate).getTime() -
      new Date(a.properties.eventDate).getTime()
    );
  };

  // 0–3 days: take up to 30, high then medium then low, most recent first
  const mostRecentLast3Days = inLast3Days
    .slice()
    .sort(sortByConfidenceThenDate)
    .slice(0, 30);

  // 3–7 days: only medium/high, up to 30, high then medium, most recent first
  const mediumHigh3To7Days = inLast3To7Days
    .filter((f) => f.properties.confidence !== 'low')
    .slice()
    .sort(sortByConfidenceThenDate)
    .slice(0, 30);

  // 7–30 days: only high, up to 40, most recent first
  const high7To30Days = inLast7To30Days
    .filter((f) => f.properties.confidence === 'high')
    .slice()
    .sort(sortByConfidenceThenDate)
    .slice(0, 40);

  const combined = [
    ...mostRecentLast3Days,
    ...mediumHigh3To7Days,
    ...high7To30Days,
  ];

  const uniqueById = new Map<string, FireFeature>();
  for (const feature of combined) {
    uniqueById.set(feature.properties.id, feature);
  }

  return Array.from(uniqueById.values());
}

export default function FireLocationsMarker(): ReactElement {
  const { query } = useRouter();

  const { site } = query;
  const { getApi } = useApi();
  const [fireFeatures, setFireFeatures] = useState<FireFeature[]>([]);
  const [activePopupFeature, setActivePopupFeature] =
    useState<FireFeature | null>(null);
  const markerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!site) return;

    const fetchFires = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('remoteId', site as string);
        searchParams.append('span', ALERT_DURATION);
        const fireAlertApiUrl =
          process.env.NEXT_PUBLIC_FIREALERT_ENDPOINT ??
          'https://fa.pp.eco/api/v1';
        const url = `${fireAlertApiUrl}/fires?${searchParams.toString()}`;
        const fetchedFires = await getApi<FireFeatureCollection>(url);
        if (
          fetchedFires?.type === 'FeatureCollection' &&
          fetchedFires?.features?.length > 0
        ) {
          const allFeatures = fetchedFires.features;
          const selectedFeatures = selectFiresForDisplay(allFeatures);
          setFireFeatures(selectedFeatures);
        }
      } catch (error: unknown) {
        const apiMessage = (error as { errors?: { message?: string } })?.errors
          ?.message;
        const fallbackMessage =
          error instanceof Error
            ? error.message
            : (error as { message?: string }).message;
        console.log(apiMessage ?? fallbackMessage ?? String(error));
      }
    };
    fetchFires();
  }, [site]);

  const renderFireMarkers = useMemo(
    () =>
      fireFeatures.map((f) => {
        const featureId = `${f.properties.id}`;
        return (
          <Marker
            key={`firealert-alert-${featureId}`}
            latitude={f.geometry.coordinates[1]}
            longitude={f.geometry.coordinates[0]}
            anchor="center"
          >
            <div
              ref={(el) => {
                markerRefs.current[featureId] = el;
              }}
              className={styles.fireIcon}
              onMouseEnter={() => setActivePopupFeature(f)}
              onMouseLeave={() =>
                setActivePopupFeature((current) =>
                  current?.properties.id === f.properties.id ? null : current
                )
              }
            >
              <FireIcon width={24} />
            </div>
          </Marker>
        );
      }),
    [fireFeatures]
  );

  return (
    <>
      <Source
        id={'display-source-firealert'}
        type="geojson"
        data={{ type: 'FeatureCollection', features: fireFeatures }}
      >
        {renderFireMarkers}
      </Source>
      {activePopupFeature && (
        <FirePopup
          key={`firealert-popup-${activePopupFeature.properties.id}`}
          isOpen
          feature={activePopupFeature}
          anchorEl={markerRefs.current[`${activePopupFeature.properties.id}`]}
          onMouseEnter={() => setActivePopupFeature(activePopupFeature)}
          onMouseLeave={() => setActivePopupFeature(null)}
        />
      )}
    </>
  );
}
