import React, { useRef } from 'react';
import styles from './../styles/ThankYou.module.scss';
import EmailIcon from '../../../../assets/images/icons/share/Email';
import EmailSolid from '../../../../assets/images/icons/share/EmailSolid';
import FacebookIcon from '../../../../assets/images/icons/share/Facebook';
import TwitterIcon from '../../../../assets/images/icons/share/Twitter';
import DownloadIcon from '../../../../assets/images/icons/share/Download';
import DownloadSolid from '../../../../assets/images/icons/share/DownloadSolid';
import InstagramIcon from '../../../../assets/images/icons/share/Instagram';
import { isMobileBrowser } from '../../../../utils/isMobileBrowser';
import tenantConfig from '../../../../../tenant.config';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';

const config = tenantConfig();

const titleToShare = 'Planting trees against the climate crisis!';
const urlToShare = config.tenantURL
const linkToShare = config.tenantURL
const textToShare = `Preventing the climate crisis requires drastically reducing carbon emissions and planting trees. That’s why I just planted some.\nCheck out ${linkToShare} if you want to plant some too!\n`;

const ShareOptions = (props) => {

  const saveAs = (uri, filename) => {
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
};

  const exportComponent = (node, fileName, backgroundColor, type) => {
    const element = ReactDOM.findDOMNode(node.current);
    return html2canvas(element, {
        backgroundColor: backgroundColor,
        scrollY: -window.scrollY,
        useCORS: true,
        allowTaint : true,
        letterRendering:true,
    }).then(canvas => {
            saveAs(canvas.toDataURL(type, 1.0), fileName); 
    });
};

  const exportComponentAsPNG = (node, fileName = 'component.png', backgroundColor = null, type = 'image/png') => {
    return exportComponent(node, fileName, backgroundColor, type);
};

  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = async (shareUrl) => {
    if (navigator.share !== undefined) {
      // if in phone and web share API supported
      try {
        const response = await navigator.share({
          title: titleToShare,
          text: textToShare,
        });
      } catch (error) {}
    } else {
      if (isMobileBrowser()) {
        // if in phone, copy to clipboard
        navigator.clipboard.writeText(textToShare);
        props.handleTextCopiedSnackbarOpen();
      } else {
        // desktop
        window.open(shareUrl, '_blank');
      }
    }
  };

  return (
    <div className={styles.shareRow} onMouseOut={() => setCurrentHover(-1)} style={{cursor:'pointer'}}>
      <div
        className={styles.shareIcon}
        onClick={() => {
          if (props.sendRef) {
            exportComponentAsPNG(props.sendRef(), `My ${props.treeCount} tree donation`);
          }
        }}
        onMouseOver={() => setCurrentHover(1)}
      >
        {currentHover === 1 ? (
          <DownloadSolid color={styles.blueishGrey} />
        ) : (
          <DownloadIcon color={styles.blueishGrey} />
        )}
      </div>

      <div
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(
            `https://www.facebook.com/sharer.php?u=${urlToShare}&quote=${textToShare}`,
            '_blank'
          )
        }
        onMouseOver={() => setCurrentHover(2)}
      >
        <FacebookIcon
          color={currentHover === 2 ? '#3b5998' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onClick={() =>
          shareClicked(`https://www.instagram.com/plantfortheplanet_official/`)
        }
      >
        <InstagramIcon
          color={currentHover === 3 ? '#dd217b' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(4)}
        onClick={() =>
          shareClicked(`https://twitter.com/intent/tweet?text=${textToShare}`)
        }
      >
        <TwitterIcon
          color={currentHover === 4 ? '#00acee' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(`mailto:?subject=${titleToShare}&body=${textToShare}`)
        }
        onMouseOver={() => setCurrentHover(5)}
      >
        {currentHover === 5 ? (
          <EmailSolid color={styles.blueishGrey} />
        ) : (
          <EmailIcon color={styles.blueishGrey} />
        )}
      </div>
    </div>
  );
};

export default ShareOptions;