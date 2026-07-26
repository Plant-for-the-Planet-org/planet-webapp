import type { TableHeader } from '../BulkCodesTypes';

import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import styles from '../BulkCodes.module.scss';

interface Props {
  header: TableHeader;
}

const RecipientHeader = ({ header }: Props) => {
  const { displayText, helpText } = header;
  // MUI renders this TableCell as <th scope="col"> because it sits inside <TableHead>
  return (
    <TableCell>
      <span>
        {displayText}
        {helpText !== undefined && helpText.length > 0 && (
          <>
            {' '}
            <Tooltip title={helpText} arrow>
              <span className={styles.headerInfoIcon}>
                <InfoIcon />
              </span>
            </Tooltip>
          </>
        )}
      </span>
    </TableCell>
  );
};
export default RecipientHeader;
