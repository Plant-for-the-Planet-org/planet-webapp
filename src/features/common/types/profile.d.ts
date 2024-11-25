import type { User, UserPublicProfile } from '@planet-sdk/common';
import type { SetState } from './common';
import type { PublicUser } from './user';
import type { ADDRESS_ACTIONS } from '../../user/Settings/EditProfile/AddressManagment/microComponents/AddressActionMenu';

export interface UserFeaturesProps {
  handleShare: () => void;
  userProfile: User | PublicUser;
  showSocialButton: boolean;
  setShowSocialButton: SetState<boolean>;
}

export interface ProfileProps {
  userProfile: User | PublicUser;
  authenticatedType?: string;
}

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
