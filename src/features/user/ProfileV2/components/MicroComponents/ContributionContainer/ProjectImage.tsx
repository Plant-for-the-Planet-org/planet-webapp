import getImageUrl from '../../../../../../utils/getImageURL';
import TreesIcon from '../../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../../public/assets/images/icons/TreeIcon';
import myForestStyles from '../../../styles/MyForest.module.scss';

interface ProjectImageProps {
  imageUniqueKey: string | null;
  numberOfTreesPlanted: number | null;
}

const ProjectImage = ({
  imageUniqueKey,
  numberOfTreesPlanted,
}: ProjectImageProps) => {
  return (
    <>
      <div className={myForestStyles.image}>
        {imageUniqueKey ? (
          <img src={getImageUrl('project', 'medium', imageUniqueKey)} />
        ) : (
          <div className={myForestStyles.registerTreeIcon}>
            {numberOfTreesPlanted && numberOfTreesPlanted > 1 ? (
              <TreesIcon width={'100px'} height={'100px'} />
            ) : (
              <TreeIcon width={'100px'} height={'100px'} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectImage;
