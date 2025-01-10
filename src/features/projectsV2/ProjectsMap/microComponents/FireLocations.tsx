import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Marker, Source } from 'react-map-gl-v7/maplibre';
import FirePopup from '../../../common/FirePopup';
import { getRequest } from '../../../../utils/apiRequests/api';
import type {
  FireFeature,
  FireFeatureCollection,
} from '../../../common/types/fireLocation';

export default function FireLocations(): ReactElement {
  const { query } = useRouter();

  const { site } = query;

  const [fires, setFires] = useState<FireFeature[]>();

  useEffect(() => {
    if (!site) return;
    (async () => {
      const qs = new URLSearchParams();
      qs.append('remoteId', site as string);
      const fa_api =
        process.env.NEXT_PUBLIC_FIREALERT_ENDPOINT ??
        'https://firealert-development.vercel.app/api/v1';
      const url = `${fa_api}/fires?${qs.toString()}`;
      const fetchedFires = await getRequest<FireFeatureCollection>(
        undefined,
        url
      );
      if (
        fetchedFires?.type === 'FeatureCollection' &&
        fetchedFires?.features?.length > 0
      ) {
        setFires([...fetchedFires.features]);
      }
    })();
  }, [site]);

  return (
    <>
      <Source
        id={'display-source-firealert'}
        type="geojson"
        data={{ type: 'FeatureCollection', features: fires }}
      >
        {fires?.map((f) => (
          <Marker
            key={'firealert'}
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
