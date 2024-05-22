import { User, UserPublicProfile } from '@planet-sdk/common';
import { SetState } from './common';
import { PublicUser } from './user';

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
  profileType: 'private';
};

export type PublicProfileV2Props = {
  userProfile: UserPublicProfile;
  profileType: 'public';
};

export type ProfileV2Props = PrivateProfileV2Props | PublicProfileV2Props;
