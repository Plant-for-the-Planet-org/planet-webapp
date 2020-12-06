import React, { useRef } from 'react';
import styles from './../styles/ThankYou.module.scss';
import EmailIcon from '../../../../public/assets/images/icons/share/Email';
import EmailSolid from '../../../../public/assets/images/icons/share/EmailSolid';
import FacebookIcon from '../../../../public/assets/images/icons/share/Facebook';
import TwitterIcon from '../../../../public/assets/images/icons/share/Twitter';
import DownloadIcon from '../../../../public/assets/images/icons/share/Download';
import DownloadSolid from '../../../../public/assets/images/icons/share/DownloadSolid';
import InstagramIcon from '../../../../public/assets/images/icons/share/Instagram';
import tenantConfig from '../../../../tenant.config';
import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import i18next from '../../../../i18n/';

const ShareOptions = (props) => {
  const { useTranslation } = i18next;
  const { t, i18n } = useTranslation(['donate', 'common']);
  const config = tenantConfig();

  const titleToShare = t('donate:titleToShare');
  const urlToShare = config.tenantURL;
  const linkToShare = config.tenantURL;
  const userName = props.contactDetails.firstName + ' ' + props.contactDetails.lastName;
  const textToShare = t('donate:textToShareLinkedin', { name: userName});

  const exportComponent = (node, fileName, backgroundColor, type) => {
    const element = ReactDOM.findDOMNode(node.current);
    var options = {
      quality: 1,
    };
    domtoimage
      .toJpeg(element, options)
      .then((dataUrl) => {
        domtoimage.toJpeg(element, options).then((dataUrl) => {
          domtoimage.toJpeg(element, options).then((dataUrl) => {
            var link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
          });
        });
      })
      .catch(function (error) {
        console.error('Image cannot be downloaded', error);
      });
  };

  const exportComponentAsJPEG = (
    node,
    fileName = `My_${props.treeCount}_tree_donation.jpeg`,
    backgroundColor = null,
    type = 'image/jpeg'
  ) => {
    return exportComponent(node, fileName, backgroundColor, type);
  };

  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };

  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = async (shareUrl) => {
    openWindowLinks(shareUrl);
  };

  return (
    <div
      className={styles.shareRow}
      onMouseOut={() => setCurrentHover(-1)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={styles.shareIcon}
        onClick={() => {
          if (props.sendRef) {
            exportComponentAsJPEG(
              props.sendRef(),
              `My_${props.treeCount}_tree_donation.jpeg`
            );
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
            `https://www.facebook.com/sharer.php?u=${urlToShare}&quote=${textToShare}&hashtag=%23StopTalkingStartPlanting`,
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
          shareClicked(`https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=PftP_int&url=${linkToShare}&text=${textToShare}`)
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
