import { read, utils } from 'xlsx';

/**
 * Accepts xlsx and csv files, converts to csv (if required) and calls onFileUploaded for processing
 * @param acceptedFile - file uploaded by the user
 * @param handleError - function to handle an error
 * @param onFileUploaded - function that performs further actions on the csv string
 */
const handleFileUpload = (
  acceptedFile: File,
  handleError: (errorType: string) => void,
  onFileUploaded: (fileContents: string) => void
): void => {
  const reader = new FileReader();
  reader.onabort = () => handleError('file reading was aborted');
  reader.onerror = () => handleError('file reading has failed');
  switch (acceptedFile.type) {
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      reader.readAsBinaryString(acceptedFile);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const bstr = event.target?.result;
        const workbook = read(bstr, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const csv = utils.sheet_to_csv(worksheet);
        onFileUploaded(csv);
      };
      break;
    case 'text/csv':
    default:
      reader.readAsText(acceptedFile);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const csv = event.target?.result as string;
        onFileUploaded(csv);
      };
      break;
  }
};

export default handleFileUpload;
