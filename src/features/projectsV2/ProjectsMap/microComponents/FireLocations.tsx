import type { ReactElement } from 'react';
import type {
  FireFeature,
  FireFeatureCollection,
} from '../../../common/types/fireLocation';

import { APIError } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Marker, Source } from 'react-map-gl-v7/maplibre';
import { getRequest } from '../../../../utils/apiRequests/api';
import FirePopup from '../FirePopup';

export default function FireLocations(): ReactElement {
  const { query } = useRouter();

  const { site } = query;

  const [fireFeatures, setFireFeatures] = useState<FireFeature[]>([]);

  useEffect(() => {
    if (!site) return;

    const fetchFires = async () => {
      try {
        const qs = new URLSearchParams();
        qs.append('remoteId', site as string);
        qs.append('span', '30d');
        const fireAlertApiUrl =
          process.env.NEXT_PUBLIC_FIREALERT_ENDPOINT ??
          'https://fa.pp.eco/api/v1';
        const url = `${fireAlertApiUrl}/fires?${qs.toString()}`;
        const fetchedFires = await getRequest<FireFeatureCollection>({ url });
        if (
          fetchedFires?.type === 'FeatureCollection' &&
          fetchedFires?.features?.length > 0
        ) {
          // There was not direct z-index method - this is a workaround
          // Since all popover placed on top. sort by latitude would place all the fires such that fires won't overlap popover
          fetchedFires.features.sort((a, b) => {
            return b.geometry.coordinates[1] - a.geometry.coordinates[1];
          });
          setFireFeatures([...fetchedFires.features]);
        }
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.errors?.message ?? error.message);
        }
      }
    };
    fetchFires();
  }, [site]);

  return (
    <>
      <Source
        id={'display-source-firealert'}
        type="geojson"
        data={{ type: 'FeatureCollection', features: fireFeatures }}
      >
        {fireFeatures?.map((f) => (
          <Marker
            key={`firealert-alert-${f.properties.id}`}
            latitude={f.geometry.coordinates[1]}
            longitude={f.geometry.coordinates[0]}
            anchor="center"
          >
            <FirePopup isOpen={false} feature={f} />
          </Marker>
        ))}
      </Source>
    </>
  );
}
