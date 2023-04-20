import {ImpersonationData} from "../../features/user/Settings/ImpersonateUser/ImpersonateUserForm"
//this function set keys for header in impersonation mode
export const setHeaderForImpersonation =  (header: any, impersonationData?: ImpersonationData) => {

    const impersonationDataFromLocal:ImpersonationData = JSON.parse(`${localStorage.getItem("impersonationData")}`);
        if(impersonationDataFromLocal || impersonationData){
            if(impersonationData?.targetEmail || impersonationDataFromLocal?.targetEmail ){
                 header["X-SWITCH-USER"] = impersonationData?.targetEmail || impersonationDataFromLocal?.targetEmail 
            }
    
            if(impersonationData?.supportPin || impersonationDataFromLocal?.supportPin){
                header["X-USER-SUPPORT-PIN"] = impersonationData?.supportPin || impersonationDataFromLocal?.supportPin 
        }
        const impersonationHeader = header
        return impersonationHeader
        }else {
      return header
    }
}