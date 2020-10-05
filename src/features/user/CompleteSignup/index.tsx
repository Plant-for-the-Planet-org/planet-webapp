import { useSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './CompleteSignup.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { signOut } from 'next-auth/client';

export default function CompleteSignup() {
  //  snackbars (for warnings, success messages, errors)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const router = useRouter();
  const [session, loading] = useSession();
  const [isPrivateAccount, setIsPrivateAccount] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [accountType, setAccountType] = useState('RO');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameOfOrg, setNameOfOrg] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
  const [severity, setSeverity] = useState('info');
  const [requestSent, setRequestSent] = useState(false);

  const checkIfEmpty = (params: any[]) => {
    var param;
    var flag = false;
    for (param of params) {
      if (!param || param.trim() === '') {
        flag = true;
        setSnackbarMessage('Please fill all the details');
        setSeverity("warning")
        handleSnackbarOpen();
        break;
      }
    }
    if (!flag) {
      return true;
    } else {
      return false;
    }
  };

  const sendRequest = async (bodyToSend: any) => {
    setRequestSent(true);
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/app/profiles`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(bodyToSend),
      });
      setRequestSent(false);
      if (res.status === 200) {
        // successful signup -> goto me page
        setSnackbarMessage('Profile Successfully created!');
        setSeverity("success")
        handleSnackbarOpen();
        if (typeof window !== 'undefined') {
          router.push('/me');
        }
      } else {
        setSnackbarMessage('Error in creating profile');
        setSeverity("error")
        handleSnackbarOpen();
      }
    } catch {
      setSnackbarMessage('Error in creating profile');
      setSeverity("error")
      handleSnackbarOpen();
    }
  };

  const createButtonClicked = async () => {
    var bodyToSend;
    var allValidated;
    switch (accountType) {
      case 'individual':
        allValidated = checkIfEmpty([firstName, lastName, country]);
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'individual',
            firstname: firstName,
            lastname: lastName,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken,
          };
          sendRequest(bodyToSend);
        }

        break;
      case 'RO':
        allValidated = checkIfEmpty([
          firstName,
          lastName,
          country,
          nameOfOrg,
          address,
          city,
          zipCode,
        ]);
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'tpo',
            firstname: firstName,
            lastname: lastName,
            name: nameOfOrg,
            address: address,
            zipCode: zipCode,
            city: city,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken,
          };
          sendRequest(bodyToSend);
        }
        break;
      case 'education':
        allValidated = checkIfEmpty([firstName, lastName, country, nameOfOrg]);
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'education',
            firstname: firstName,
            lastname: lastName,
            name: nameOfOrg,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken,
          };
          sendRequest(bodyToSend);
        }
        break;
      case 'organisation':
        allValidated = checkIfEmpty([firstName, lastName, country, nameOfOrg]);
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'organization',
            firstname: firstName,
            lastname: lastName,
            name: nameOfOrg,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken,
          };
          sendRequest(bodyToSend);
        }
        break;
      default:
        setSnackbarMessage('Some Error has occured');
        setSeverity("error")
        handleSnackbarOpen();
        break;
    }
  };

  if (loading) {
    return null;
  }

  const SelectType = (type: any) => {
    let name;
    switch (type) {
      case 'individual':
        name = 'Individual';
        break;
      case 'RO':
        name = 'Reforestation Organisation';
        break;
      case 'education':
        name = 'School';
        break;
      case 'organisation':
        name = 'Company';
        break;
      default:
        name = 'Reforestation Organisation';
        break;
    }
    return name;
  };
  return (
    <div
      className={styles.signUpPage}
      style={{
        backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
        display:'flex',
        flexDirection:'column'
      }}
    >
      <div className={requestSent ? styles.signupRequestSent : styles.signup }>
        <div className={styles.btnContainer}>
          <button
            type="button"
            className={
              accountType === 'individual' ? styles.btnColor : styles.btnSize
            }
            onClick={() => setAccountType('individual')}
          >
            <p
              className={
                accountType === 'individual'
                  ? styles.accountTypeTextSelected
                  : styles.accountTypeText
              }
            >
              Individual{' '}
            </p>
          </button>
          <button
            type="button"
            className={
              accountType === 'organisation' ? styles.btnColor : styles.btnSize
            }
            onClick={() => setAccountType('organisation')}
          >
            <p
              className={
                accountType === 'organisation'
                  ? styles.accountTypeTextSelected
                  : styles.accountTypeText
              }
            >
              Organisation{' '}
            </p>
          </button>
        </div>
        <div className={styles.btnContainer}>
          <button
            type="button"
            className={accountType === 'RO' ? styles.btnColor : styles.btnSize}
            onClick={() => setAccountType('RO')}
          >
            <p
              className={
                accountType === 'RO'
                  ? styles.accountTypeTextSelected
                  : styles.accountTypeText
              }
            >
              Reforestation Organisation
            </p>
          </button>
          <button
            type="button"
            className={
              accountType === 'education' ? styles.btnColor : styles.btnSize
            }
            onClick={() => setAccountType('education')}
          >
            <p
              className={
                accountType === 'education'
                  ? styles.accountTypeTextSelected
                  : styles.accountTypeText
              }
            >
              Education{' '}
            </p>
          </button>
        </div>

        <div className={styles.namesDiv}>
          <div className={styles.firstNameDiv}>
            <MaterialTextField
              label="First Name"
              variant="outlined"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className={styles.lastNameDiv}>
            <MaterialTextField
              label="Last Name"
              variant="outlined"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        {accountType === 'education' ||
        accountType === 'organisation' ||
        accountType === 'RO' ? (
          <div className={styles.addressDiv}>
            <MaterialTextField
              label={`Name of ${SelectType(accountType)}`}
              variant="outlined"
              onChange={(e) => setNameOfOrg(e.target.value)}
            />
          </div>
        ) : null}
        {accountType === 'RO' ? (
          <div>
            <div className={styles.addressDiv}>
              <MaterialTextField
                label="Address"
                variant="outlined"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className={styles.cityZipDiv}>
              <div className={styles.cityDiv}>
                <MaterialTextField
                  label="City"
                  variant="outlined"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className={styles.zipDiv}>
                <MaterialTextField
                  label="Zip Code"
                  variant="outlined"
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.countryDiv}>
          <MaterialTextField
            label="Country"
            variant="outlined"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className={styles.isPrivateAccountDiv}>
          <div>
            <div className={styles.mainText}>Private Account</div>
            <div className={styles.isPrivateAccountText}>
              Your profile is hidden and only your first name appears in the
              leaderboard
            </div>
          </div>
          <ToggleSwitch
            checked={isPrivateAccount}
            onChange={() => setIsPrivateAccount(!isPrivateAccount)}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>

        <div className={styles.isPrivateAccountDiv}>
          <div className={styles.mainText}>Subscribe to news via email</div>
          <ToggleSwitch
            checked={isSubscribed}
            onChange={() => setIsSubscribed(!isSubscribed)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>

        <div className={styles.horizontalLine} />

        <div className={styles.saveButton} onClick={createButtonClicked}>
          Create Account
        </div>
      </div>
      <div className={styles.logoutButton} onClick={() => signOut({ callbackUrl: '/' })}>
          <b> Logout </b>
      </div>
      {/* snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={severity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
