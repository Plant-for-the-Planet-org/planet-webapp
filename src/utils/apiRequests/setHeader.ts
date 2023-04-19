import {ImpersonationData} from "../../features/user/Settings/ImpersonateUser/ImpersonateUserForm"

export const setHeader =  (header: any, impersonatedData?: ImpersonationData) => {

    const impersonatedDataFromLocal:ImpersonationData = JSON.parse(`${localStorage.getItem("impersonationData")}`);
        if(impersonatedDataFromLocal || impersonatedData){
            if(impersonatedData?.targetEmail || impersonatedDataFromLocal?.targetEmail ){
                 header["X-SWITCH-USER"] = impersonatedData?.targetEmail || impersonatedDataFromLocal?.targetEmail 
            }
    
            if(impersonatedData?.supportPin || impersonatedDataFromLocal?.supportPin){
                header["X-USER-SUPPORT-PIN"] = impersonatedData?.supportPin || impersonatedDataFromLocal?.supportPin 
        }
        const impersonationHeader = header
        return impersonationHeader
        }else {
      return header
    }
}