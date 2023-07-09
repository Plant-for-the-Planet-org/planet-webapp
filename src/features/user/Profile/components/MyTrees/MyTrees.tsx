import React, { useEffect } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../../../ProfileV2/components/PlantedTreesButton';
import ConservationButton from '../../../ProfileV2/components/ConservationButton';
import DonationInfo from '../../../ProfileV2/components/DonationInfo';
import TreeContributedProjectList from '../../../ProfileV2/components/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../../../ProfileV2/components/AreaConservedProjectList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';

const MyTreesMap = dynamic(
  () => import('../../../ProfileV2/components/MyForestMap'),
  {
    loading: () => <p>loading</p>,
  }
);

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const { logoutUser } = useUserProps();
  const [donationOtherInfo, setDonationOtherInfo] = React.useState(undefined);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState(false);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);

  // const detailInfo = trpc.myForest.stats.useQuery({
  //   profileId: `${profile?.id}`,
  // });

  // const contributionData = trpc.myForest.contribution.useQuery({
  //   profileId: `${profile?.id}`,
  // });

  // React.useEffect(() => {
  //   if (!contributionData.isLoading) {
  //     if (contributionData.error) {
  //       setErrors(
  //         handleError(
  //           new APIError(
  //             contributionData.error?.data?.httpStatus as number,
  //             contributionData.error
  //           )
  //         )
  //       );
  //     } else {
  //       setContributions(contributionData.data);
  //     }
  //     console.log('==>', contributionData.data);
  //   }
  // }, [contributionData.isLoading]);

  // React.useEffect(() => {
  //   if (!detailInfo.isLoading) {
  //     if (detailInfo.error) {
  //       setErrors(
  //         handleError(
  //           new APIError(
  //             detailInfo.error?.data?.httpStatus as number,
  //             detailInfo.error
  //           )
  //         )
  //       );
  //     } else {
  //       // console.log('===>', detailInfo.data);
  //       setDonationOtherInfo(detailInfo.data);
  //     }
  //   }
  // }, [detailInfo.isLoading]);

  // const _contributions = [
  //   {
  //     purpose: 'trees',
  //     treeCount: '1',
  //     quantity: 1,
  //     donationIssueDate: null,
  //     contributionType: 'donation',
  //     plantProject: {
  //       guid: 'proj_s0Dt9sivTkYLAptM2OfJSleb',
  //       name: 'Reforestation of our Forests in Germany',
  //       image: '62f3bac270a37408634575.jpg',
  //       description:
  //         'Der Zustand unserer Wälder wird immer kritischer. Klimawandel und Monokulturen gefährden auf Dauer unsere Lebensgrundlagen. Mit unseren Aktionen möchten wir informieren und ein Bewusstsein für den Wald und die Umwelt schaffen. Unser Spessart ist das größte zusammenhängende Gebiet aus Laubmischwäldern in Deutschland und das soll auch so bleiben. Die für die Anpassung der Wälder an den Klimawandel geeigneten Baumarten sollten ökologisch und ökonomisch gut in unseren Wald integriert oder integrierbar sein. So können heimische wie auch alternative Baumarten zum Zuge kommen. Insbesondere nahe Verwandte zu heimischen Arten aus dem europäisch-asiatischen Kontaktbereich kommen hierbei in den Fokus. Dabei ist insbesondere die Herkunft des Vermehrungsgutes für Anpassungsfähigkeit und den erfolgreichen Anbau von entscheidender Bedeutung. (Auszug aus der Leitlinie für die Baumartenwahl im Klimawandel der Bayerischen Forstverwaltung)\r\nIn der praktischen Umsetzung gilt es vorrangig seltene heimische Arten zu stärken.\r\nAus dem Fächer der seltenen heimischen Baumarten wurden folgende ausgewählt: Edelkastanie, Feldahorn, Flatterulme, Kirsche, Sommerlinde, Wildbirne, Spitzahorn, Eibe, Baumhasel, Rotbuche, Hainbuche. \r\nAls Startschuss einer tollen Zusammenarbeit fand in Mainaschaff die erste Pflanzaktion am 30. Oktober 2021 statt. Unser nächstes Ziel sind nun 30,000 neue Bäume für unseren Spessart.',
  //       countryCode: 'DE',
  //       unit: 'tree',
  //       location: null,
  //       geoLatitude: 50.13785949722,
  //       geoLongitude: 9.6402933227215,
  //       tpo: {
  //         id: 22408,
  //         guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
  //         name: 'Klimahelden (Plant-for-the-Planet e.V.)',
  //       },
  //     },
  //   },
  //   {
  //     purpose: 'trees',
  //     treeCount: '1',
  //     quantity: 1,
  //     donationIssueDate: null,
  //     contributionType: 'donation',
  //     plantProject: {
  //       guid: 'proj_s0Dt9sivTkYLAptM2OfJSleji',
  //       name: 'Reforestation of our Forests in Germany',
  //       image: '62f3bac270a37408634575.jpg',
  //       description:
  //         'Der Zustand unserer Wälder wird immer kritischer. Klimawandel und Monokulturen gefährden auf Dauer unsere Lebensgrundlagen. Mit unseren Aktionen möchten wir informieren und ein Bewusstsein für den Wald und die Umwelt schaffen. Unser Spessart ist das größte zusammenhängende Gebiet aus Laubmischwäldern in Deutschland und das soll auch so bleiben. Die für die Anpassung der Wälder an den Klimawandel geeigneten Baumarten sollten ökologisch und ökonomisch gut in unseren Wald integriert oder integrierbar sein. So können heimische wie auch alternative Baumarten zum Zuge kommen. Insbesondere nahe Verwandte zu heimischen Arten aus dem europäisch-asiatischen Kontaktbereich kommen hierbei in den Fokus. Dabei ist insbesondere die Herkunft des Vermehrungsgutes für Anpassungsfähigkeit und den erfolgreichen Anbau von entscheidender Bedeutung. (Auszug aus der Leitlinie für die Baumartenwahl im Klimawandel der Bayerischen Forstverwaltung)\r\nIn der praktischen Umsetzung gilt es vorrangig seltene heimische Arten zu stärken.\r\nAus dem Fächer der seltenen heimischen Baumarten wurden folgende ausgewählt: Edelkastanie, Feldahorn, Flatterulme, Kirsche, Sommerlinde, Wildbirne, Spitzahorn, Eibe, Baumhasel, Rotbuche, Hainbuche. \r\nAls Startschuss einer tollen Zusammenarbeit fand in Mainaschaff die erste Pflanzaktion am 30. Oktober 2021 statt. Unser nächstes Ziel sind nun 30,000 neue Bäume für unseren Spessart.',
  //       countryCode: 'DE',
  //       unit: 'tree',
  //       location: null,
  //       geoLatitude: 22.871808885231484,
  //       geoLongitude: 45.8608330782088,
  //       tpo: {
  //         id: 22408,
  //         guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
  //         name: 'Klimahelden (Plant-for-the-Planet e.V.)',
  //       },
  //     },
  //   },
  //   {
  //     purpose: 'conservation',
  //     treeCount: '1',
  //     quantity: 1,
  //     donationIssueDate: null,
  //     contributionType: 'donation',
  //     plantProject: {
  //       guid: 'proj_s0Dt9sivTkYLApfJSleb',
  //       name: 'it is an conservation project',
  //       image: '62f3bac270a37408634575.jpg',
  //       description:
  //         'Der Zustand unserer Wälder wird immer kritischer. Klimawandel und Monokulturen gefährden auf Dauer unsere Lebensgrundlagen. Mit unseren Aktionen möchten wir informieren und ein Bewusstsein für den Wald und die Umwelt schaffen. Unser Spessart ist das größte zusammenhängende Gebiet aus Laubmischwäldern in Deutschland und das soll auch so bleiben. Die für die Anpassung der Wälder an den Klimawandel geeigneten Baumarten sollten ökologisch und ökonomisch gut in unseren Wald integriert oder integrierbar sein. So können heimische wie auch alternative Baumarten zum Zuge kommen. Insbesondere nahe Verwandte zu heimischen Arten aus dem europäisch-asiatischen Kontaktbereich kommen hierbei in den Fokus. Dabei ist insbesondere die Herkunft des Vermehrungsgutes für Anpassungsfähigkeit und den erfolgreichen Anbau von entscheidender Bedeutung. (Auszug aus der Leitlinie für die Baumartenwahl im Klimawandel der Bayerischen Forstverwaltung)\r\nIn der praktischen Umsetzung gilt es vorrangig seltene heimische Arten zu stärken.\r\nAus dem Fächer der seltenen heimischen Baumarten wurden folgende ausgewählt: Edelkastanie, Feldahorn, Flatterulme, Kirsche, Sommerlinde, Wildbirne, Spitzahorn, Eibe, Baumhasel, Rotbuche, Hainbuche. \r\nAls Startschuss einer tollen Zusammenarbeit fand in Mainaschaff die erste Pflanzaktion am 30. Oktober 2021 statt. Unser nächstes Ziel sind nun 30,000 neue Bäume für unseren Spessart.',
  //       countryCode: 'DE',
  //       unit: 'm2',
  //       location: null,
  //       geoLatitude: 20.13785949722,
  //       geoLongitude: 9.6402933227215,
  //       tpo: {
  //         id: 22408,
  //         guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
  //         name: 'Klimahelden (Plant-for-the-Planet e.V.)',
  //       },
  //     },
  //   },
  //   {
  //     purpose: 'conservation',
  //     treeCount: '1',
  //     quantity: 1,
  //     donationIssueDate: null,
  //     contributionType: 'donation',
  //     plantProject: {
  //       guid: 'proj_s0Dt9sivTkYLAptM2OfJSleb',
  //       name: 'it is an conservation project',
  //       image: '62f3bac270a37408634575.jpg',
  //       description:
  //         'Der Zustand unserer Wälder wird immer kritischer. Klimawandel und Monokulturen gefährden auf Dauer unsere Lebensgrundlagen. Mit unseren Aktionen möchten wir informieren und ein Bewusstsein für den Wald und die Umwelt schaffen. Unser Spessart ist das größte zusammenhängende Gebiet aus Laubmischwäldern in Deutschland und das soll auch so bleiben. Die für die Anpassung der Wälder an den Klimawandel geeigneten Baumarten sollten ökologisch und ökonomisch gut in unseren Wald integriert oder integrierbar sein. So können heimische wie auch alternative Baumarten zum Zuge kommen. Insbesondere nahe Verwandte zu heimischen Arten aus dem europäisch-asiatischen Kontaktbereich kommen hierbei in den Fokus. Dabei ist insbesondere die Herkunft des Vermehrungsgutes für Anpassungsfähigkeit und den erfolgreichen Anbau von entscheidender Bedeutung. (Auszug aus der Leitlinie für die Baumartenwahl im Klimawandel der Bayerischen Forstverwaltung)\r\nIn der praktischen Umsetzung gilt es vorrangig seltene heimische Arten zu stärken.\r\nAus dem Fächer der seltenen heimischen Baumarten wurden folgende ausgewählt: Edelkastanie, Feldahorn, Flatterulme, Kirsche, Sommerlinde, Wildbirne, Spitzahorn, Eibe, Baumhasel, Rotbuche, Hainbuche. \r\nAls Startschuss einer tollen Zusammenarbeit fand in Mainaschaff die erste Pflanzaktion am 30. Oktober 2021 statt. Unser nächstes Ziel sind nun 30,000 neue Bäume für unseren Spessart.',
  //       countryCode: 'DE',
  //       unit: 'm2',
  //       location: null,
  //       geoLatitude: -5.765074497682126,
  //       geoLongitude: -55.80236804585672,
  //       tpo: {
  //         id: 22408,
  //         guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
  //         name: 'Klimahelden (Plant-for-the-Planet e.V.)',
  //       },
  //     },
  //   },
  //   {
  //     purpose: 'bouquet',
  //     treeCount: null,
  //     quantity: 6,
  //     donationIssueDate: '2022-06-02T11:35:09.000Z',
  //     contributionType: 'donation',
  //     bouquetContributions: [
  //       {
  //         purpose: 'trees',
  //         treeCount: '1',
  //         quantity: 1,
  //         donationIssueDate: null,
  //         contributionType: 'donation',
  //         plantProject: {
  //           guid: 'proj_s0Dt9sivTkYLAptM2OfJSleb',
  //           name: 'Reforestation of our Forests in Germany',
  //           image: '62f3bac270a37408634575.jpg',
  //           description:
  //             'Der Zustand unserer Wälder wird immer kritischer. Klimawandel und Monokulturen gefährden auf Dauer unsere Lebensgrundlagen. Mit unseren Aktionen möchten wir informieren und ein Bewusstsein für den Wald und die Umwelt schaffen. Unser Spessart ist das größte zusammenhängende Gebiet aus Laubmischwäldern in Deutschland und das soll auch so bleiben. Die für die Anpassung der Wälder an den Klimawandel geeigneten Baumarten sollten ökologisch und ökonomisch gut in unseren Wald integriert oder integrierbar sein. So können heimische wie auch alternative Baumarten zum Zuge kommen. Insbesondere nahe Verwandte zu heimischen Arten aus dem europäisch-asiatischen Kontaktbereich kommen hierbei in den Fokus. Dabei ist insbesondere die Herkunft des Vermehrungsgutes für Anpassungsfähigkeit und den erfolgreichen Anbau von entscheidender Bedeutung. (Auszug aus der Leitlinie für die Baumartenwahl im Klimawandel der Bayerischen Forstverwaltung)\r\nIn der praktischen Umsetzung gilt es vorrangig seltene heimische Arten zu stärken.\r\nAus dem Fächer der seltenen heimischen Baumarten wurden folgende ausgewählt: Edelkastanie, Feldahorn, Flatterulme, Kirsche, Sommerlinde, Wildbirne, Spitzahorn, Eibe, Baumhasel, Rotbuche, Hainbuche. \r\nAls Startschuss einer tollen Zusammenarbeit fand in Mainaschaff die erste Pflanzaktion am 30. Oktober 2021 statt. Unser nächstes Ziel sind nun 30,000 neue Bäume für unseren Spessart.',
  //           countryCode: 'DE',
  //           unit: 'tree',
  //           location: null,
  //           geoLatitude: 50.13785949722,
  //           geoLongitude: 9.6402933227215,
  //           tpo: {
  //             id: 22408,
  //             guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
  //             name: 'Klimahelden (Plant-for-the-Planet e.V.)',
  //           },
  //         },
  //       },
  //       {
  //         purpose: 'trees',
  //         treeCount: '5',
  //         quantity: 5,
  //         donationIssueDate: null,
  //         contributionType: 'donation',
  //         plantProject: {
  //           guid: 'proj_7WNIZ3c4U66QRlRsR6m5z57s',
  //           name: 'Habitat restoration in Uganda',
  //           image: '6193e2607c905669140950.jpg',
  //           description:
  //             'The main milestone of this project is the biodegradable system that we have developed, which allows not only to avoid the use of many plastics but also to generate added value to local communities. \r\n\r\nFor years one of the main challenges in reforestation projects was the tons of plastics used. We have developed, tested, and validated a system that avoids the use of plastics and generates a sustainable source of income for the nearby local communities with the manufacturing of the biodegradable pots.\r\n\r\nOur three pillars are:\r\n\r\n- Ecosystems: The project is located in an area that has suffered 95% deforestation in recent years. There are two families of chimpanzees struggling because they do not have enough space and food, which forces them to have to go out to eat in the nearby plantations, generating conflicts with the locals. The project consists of recovering these degraded areas and creating forest corridors.\r\n- Waste: The hundreds of thousands of plastic bags used for planting have always seemed a bit contradictory to us. We have found a solution that is simple but yet very effective. By using the dry banana leaves to make an organic bag. With this, we not only avoid generating all that plastic waste, but we also generate income in local communities. \r\n- People: An environmental recovery project cannot be understood without integrating people and looking for alternative ways so that they can earn a living from protecting nature. These sources include both the labor to plant the trees, guide tourists and scientists to see the chimpanzees and the manufacturing of the pots. Thanks to the manufacture of these pots we are employing women at risk of exclusion. Currently, the project generates sustenance for 1,500 families.',
  //           countryCode: 'UG',
  //           unit: 'tree',
  //           location: null,
  //           geoLatitude: 0.899304,
  //           geoLongitude: 31.255207,
  //           tpo: {
  //             id: 112999,
  //             guid: 'tpo_rnps80pF1YBZJDcFve14uCQa',
  //             name: 'Trees4humanity',
  //           },
  //         },
  //       },
  //     ],
  //     plantProject: {
  //       guid: 'proj_rIil8Af9QFw6yjBy1y8HNGEi',
  //       name: 'Wald Salesforce Deutschland',
  //       image: '6296422c32db4138597535.png',
  //       description:
  //         'Join us - Gemeinsam schaffen wir 1 Million Bäume bis 2030! #trailblazer',
  //       countryCode: 'DE',
  //       unit: 'currency',
  //       location: null,
  //       geoLatitude: null,
  //       geoLongitude: null,
  //       tpo: null,
  //     },
  //   },
  // ];

  return ready ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap />
      {/* <MyTreesMap
        contribution={contributions}
        isTreePlantedButtonActive={isTreePlantedButtonActive}
        isConservedButtonActive={isConservedButtonActive}
      /> */}
      {/* <div className={myForestStyles.mapButtonContainer}>
        <PlantedTreesButton
          plantedTrees={donationOtherInfo[0].treeCount}
          isTreePlantedButtonActive={isTreePlantedButtonActive}
          setIsConservedButtonActive={setIsConservedButtonActive}
          setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
        />
        <div>
          <ConservationButton
            conservedArea={donationOtherInfo[0].conserved}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />
        </div>
        <DonationInfo
          projects={donationOtherInfo[0]?.projects}
          countries={donationOtherInfo[0]?.countries}
          donations={donationOtherInfo[0]?.donations}
        />
      </div>
      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={contributions}
          userprofile={profile}
          authenticatedType={authenticatedType}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={contributions}
          isConservedButtonActive={isConservedButtonActive}
        />
      )} */}
    </div>
  ) : null;
}
