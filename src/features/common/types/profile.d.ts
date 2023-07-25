import { User } from "@planet-sdk/common";
import { SetState } from "./common";

export interface UserFeaturesProps {
    handleShare: () => void;
    userprofile: User;
    showSocialButton: boolean;
    setShowSocialButton: SetState<boolean>;
  }

export interface SharePlatformsProps {
    setShowSocialButton: SetState<boolean>;
    userprofile: User;
  }

 export interface ProfileProps {
    userProfile: User;
  }