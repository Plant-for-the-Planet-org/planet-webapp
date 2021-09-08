function GetProjectClassification(classification: any) {
  let parseClassification;
  switch (classification) {
    case 'natural-regeneration':
      parseClassification = 'Natural Regeneration';
      break;
    case 'managed-regeneration':
      parseClassification = 'Managed Regeneration';
      break;
    case 'large-scale-planting':
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
