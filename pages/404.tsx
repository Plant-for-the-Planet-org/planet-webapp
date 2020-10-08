import Custom404Image from '../public/assets/images/Custom404Image';

interface Props {
  initialized: Boolean;
}

export default function Custom404(initialized: Props) {
  const styles = {
    width: '100vw',
    height: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '80px',
  }
  return (
    <>
      {initialized ? (
           <div style={styles}>
            <Custom404Image />
          </div>
      ) : (
        <></>
      )}
    </>
  );
}
