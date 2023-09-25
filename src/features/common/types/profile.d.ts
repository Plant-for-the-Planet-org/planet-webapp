import { User } from "@planet-sdk/common";
import { SetState } from "./common";
import { PublicUser } from "./user";

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