export interface Project {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
}

export interface MapSingleProject {
  type: string;
  geometry: unknown;
  properties: {
    [index: string]: unknown;
    id: string;
    name: string;
    slug: string;
    allowDonations: boolean;
    purpose: string;
    currency: string;
    unitCost: number;
  };
}

export interface SingleProjectGeojson {
  geometry: Geometry
  type: string
  properties: Properties
}

export interface Geometry {
  coordinates: number[][][]
  type: string
}

export interface Properties {
  lastUpdated: LastUpdated
  name: string
  description: string
  id: string
  status: string
}

export interface LastUpdated {
  date: string
  timezone: string
  timezone_type: number
}


// for sample plant location

  export interface DeviceLocation {
      coordinates: number[];
      type: string;
  }

  export interface App {
      appVersion: string;
      deviceSystemName: string;
      deviceSystemVersion: string;
      deviceModel: string;
      deviceManufacturer: string;
      deviceBrand: string;
      deviceLocation: DeviceLocation;
  }

  export interface Metadata {
      app: App;
      private: any[];
      public: any[];
  }

  export interface Measurements {
      width: number;
      height: number;
  }

  export interface Coordinate {
      image: string;
      created: string;
      coordinateIndex: string;
      id: string;
      updated: string;
      status: string;
  }

  export interface EventDate {
      date: string;
      timezone: string;
      timezone_type: number;
  }

  export interface Measurements2 {
      width: number;
      height: number;
  }

  export interface History {
      image: string;
      statusReason?: any;
      created: string;
      eventName: string;
      classification?: any;
      eventDate: EventDate;
      measurements: Measurements2;
      status: string;
  }

  export interface OriginalGeometry {
      coordinates: number[];
      type: string;
  }

  export interface Geometry {
      coordinates: number[];
      type: string;
  }

  export interface LastMeasurementDate {
      date: string;
      timezone: string;
      timezone_type: number;
  }

  export interface DeviceLocation2 {
      coordinates: number[];
      type: string;
  }

  export interface NextMeasurementDate {
    date: string;
    timezone: string;
    timezone_type : number;
}

  export interface SamplePlantLocation {
      parent: string;
      nextMeasurementDate?: NextMeasurementDate | null;
      metadata: Metadata;
      hid: string;
      scientificName: string;
      otherSpecies?: any;
      description?: any;
      geometryUpdatesCount: number;
      type: string;
      plantProjectSite?: any;
      statusReason?: any;
      registrationDate: string;
      id: string;
      tag: string;
      plantDate: string;
      measurements: Measurements;
      image?: any;
      idempotencyKey: string;
      profile: string;
      coordinates: Coordinate[];
      scientificSpecies: string;
      history: History[];
      originalGeometry: OriginalGeometry;
      captureMode: string;
      geometry: Geometry;
      lastMeasurementDate: LastMeasurementDate;
      captureStatus: string;
      deviceLocation: DeviceLocation2;
      status?: any;
  }