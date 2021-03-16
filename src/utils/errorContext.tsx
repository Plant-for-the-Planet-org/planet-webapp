import { Modal } from '@material-ui/core';
import React, { Component } from 'react';
import ServerDownIcon from '../../public/assets/images/errors/ServerDown';
import Close from '../../public/assets/images/icons/headerIcons/close';
import AnimatedButton from '../features/common/InputTypes/AnimatedButton';
import { ThemeContext } from '../theme/themeContext';
import i18next from './../../i18n'
const { useTranslation } = i18next;

export const ErrorContext = React.createContext({
  modalOpen: false,
  toggleModal: (value: boolean) => {},
  setglobalErrorMessage: (value: string) => {},
  setglobalErrorImage: (value: any) => {},
  setglobalErrorCloseFunction: (value: any) => {
    () => {};
  },
});

export default function ErrorProvider({ children }: any) {
  const [modalOpen, setmodalOpen] = React.useState(false);
  const { t, ready } = useTranslation(['common']);
  const toggleModal = (value: boolean) => {
    setmodalOpen(value);
  };

  const { theme } = React.useContext(ThemeContext);
  const [globalErrorMessage, setglobalErrorMessage] = React.useState('');
  const [globalErrorImage, setglobalErrorImage] = React.useState(
    <ServerDownIcon />
  );
  const [
    globalErrorCloseFunction,
    setglobalErrorCloseFunction,
  ] = React.useState<any>(() => {});

  return (
    <ErrorContext.Provider
      value={{
        modalOpen,
        toggleModal,
        setglobalErrorMessage,
        setglobalErrorImage,
        setglobalErrorCloseFunction,
      }}
    >
      {children}
      <Modal
        className={`modal ${theme}`}
        open={modalOpen}
        onClose={() => setmodalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <div className={'errorModal'}>
          {globalErrorImage && (
            <div className={'errorModalImage'}>{globalErrorImage}</div>
          )}

          {globalErrorMessage && (
            <div className={'errorModalMessage'}>{globalErrorMessage}</div>
          )}

          <div className={'errorModalButton'}>
            <AnimatedButton
              className={'primaryButton'}
              style={{ marginBottom: '0px' }}
              onClick={() => {
                setmodalOpen(false);
                globalErrorCloseFunction();
              }}
            >
             { t('common:tryAgain')}
            </AnimatedButton>
          </div>

          <div
            className={'errorModalClose'}
            onClick={() => {
              setmodalOpen(false);
              globalErrorCloseFunction();
            }}
          >
            <Close />
          </div>
        </div>
      </Modal>
    </ErrorContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ErrorContext);
}
