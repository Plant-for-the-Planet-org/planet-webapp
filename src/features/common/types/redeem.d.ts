export interface Organization {
  name: string
  slug: string
}
export interface Project {
  id: string
  name: string
  slug: string
  country: string
  location: string
  coordinates: number[]
  organization: Organization
}
export interface RedeemedCodeData {
    id: string
    type: string
    code: string
    units: number
    status: string
    project: Project
  }
  
  
  