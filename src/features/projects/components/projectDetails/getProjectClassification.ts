function GetProjectClassification(classification: any) {
  let parseClassification;
  switch (classification) {
    case 'natural_regeneration':
      parseClassification = 'Natural Regeneration';
      break;
    case 'managed_regeneration':
      parseClassification = 'Managed Regeneration';
      break;
    case 'large_scale_planting':
      parseClassification = 'Large Scale Planting';
      break;
    case 'agroforestry':
      parseClassification = 'Agroforestry';
      break;
    default:
      parseClassification = '';
  }
  return parseClassification;
}

export default GetProjectClassification;
