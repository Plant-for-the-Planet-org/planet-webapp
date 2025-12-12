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
          setFireFeatures([...fetchedFires.features]);
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
      fireFeatures?.slice(fireFeatures?.length - 100).map((f) => {
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
    [fireFeatures.length]
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
