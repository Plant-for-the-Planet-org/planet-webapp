import type { User, UserPublicProfile } from '@planet-sdk/common';
import type { ADDRESS_ACTIONS } from '../../../utils/addressManagement';

export type PrivateProfileV2Props = {
  userProfile: User;
  profilePageType: 'private';
};

export type PublicProfileV2Props = {
  userProfile: UserPublicProfile;
  profilePageType: 'public';
};

export type ProfileV2Props = PrivateProfileV2Props | PublicProfileV2Props;

// address management

export type AddressAction =
  (typeof ADDRESS_ACTIONS)[keyof typeof ADDRESS_ACTIONS];
