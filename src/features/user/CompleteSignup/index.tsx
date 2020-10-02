import { useSession, } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import styles from './CompleteSignup.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';

export default function CompleteSignup() {
  const [session, loading] = useSession();
  const [isPrivateAccount, setIsPrivateAccount] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [accountType, setAccountType] = useState('RO');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameOfOrg, setNameOfOrg] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const checkIfEmpty = (params:any[]) => {
    var param;
    var flag = false;
    for (param of params) {
      if (!param || param.trim() === "") {
        flag = true;
        //TODO : alert
        break
      }
    }
    if (!flag){
      return true;
    } else {
      return false
    }
  }

  const sendRequest = async(body:any) => {
    try { 
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/profiles`, {
          headers: { 
            'Content-Type': 'application/json'
          },
           method: 'POST',
        },
      );
      console.log('res', res)
    } catch { 
      console.log('Error')
    }
  }

  const createButtonClicked = async () => {
    var bodyToSend;
    var allValidated;
    switch (accountType) {
      case 'individual':
        allValidated = checkIfEmpty([firstName, lastName, country])
        if (allValidated && !loading && session) {
          bodyToSend = {
            type:'individual',
            firstname: firstName,
            lastname: lastName,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken
          }
          sendRequest(bodyToSend)
        }

        break;
      case 'RO':
        allValidated = checkIfEmpty([firstName, lastName, country, nameOfOrg, address, city, zipCode])
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
            oAuthAccessToken: session.accessToken
          }
          sendRequest(bodyToSend)
        }
        break;
      case 'education':
        allValidated = checkIfEmpty([firstName, lastName, country, nameOfOrg])
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'education',
            firstname: firstName,
            lastname: lastName,
            name: nameOfOrg,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken
          }
          sendRequest( bodyToSend)
        }
        break;
      case 'organisation':
        allValidated = checkIfEmpty([firstName, lastName, country, nameOfOrg])
        if (allValidated && !loading && session) {
          bodyToSend = {
            type: 'organization', 
            firstname: firstName,
            lastname: lastName,
            name: nameOfOrg,
            country: country,
            mayPublish: !isPrivateAccount,
            mayContact: isSubscribed,
            oAuthAccessToken: session.accessToken
          }
          sendRequest(bodyToSend)
        }
        break;
      default:
        // TODO: alert error occured
        break;
    }
  }

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
    <div className={styles.signUpPage}
      style={{ backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)` }}
    >

      <div className={styles.signup}>
        <div className={styles.btnContainer}>
          <button
            type="button"
            className={accountType === 'individual' ? styles.btnColor : styles.btnSize}
            onClick={() => setAccountType('individual')}
          >
            <div className={styles.accountTypeDiv}>
              <p
                style={{
                  paddingTop: '30px',
                  fontSize: '14px',
                  justifyContent: 'flex-start',
                  fontWeight: accountType === 'individual' ? 'bolder' : 'normal',
                  textTransform: 'capitalize',
                  color: accountType === 'individual' ? styles.primaryColor : styles.dark,
                }}
              >
                Individual{' '}
              </p>
            </div>
          </button>
          <button
            type="button"
            className={accountType === 'organisation' ? styles.btnColor : styles.btnSize}
            onClick={() => setAccountType('organisation')}
          >
            <div className={styles.accountTypeDiv}>
              <p
                style={{
                  paddingTop: '30px',
                  fontSize: '14px',
                  justifyContent: 'flex-start',
                  fontWeight: accountType === 'organisation' ? 'bolder' : 'normal',
                  textTransform: 'capitalize',
                  color: accountType === 'organisation' ? styles.primaryColor : styles.dark,
                }}
              >
                Organisation{' '}
              </p>
            </div>
          </button>
        </div>
        <div className={styles.btnContainer}>
          <button
            type="button"
            className={accountType === 'RO' ? styles.btnColor : styles.btnSize}
            onClick={() => setAccountType('RO')}
          >
            <div className={styles.accountTypeDiv}>
              <p
                style={{
                  paddingTop: '15px',
                  fontSize: '14px',
                  justifyContent: 'flex-start',
                  textTransform: 'capitalize',
                  fontWeight: accountType === 'RO' ? 'bolder' : 'normal',
                  paddingRight: '60px',
                  color: accountType === 'RO' ? styles.primaryColor : styles.dark,
                }}
              >
                Reforestation Organisation
                  </p>
            </div>
          </button>
          <button
            type="button"
            className={accountType === 'education' ? styles.btnColor : styles.btnSize}
            onClick={() => setAccountType('education')}
          >
            <div className={styles.accountTypeDiv}>
              <p
                style={{
                  paddingTop: '30px',
                  fontSize: '14px',
                  justifyContent: 'flex-start',
                  textTransform: 'capitalize',
                  fontWeight: accountType === 'education' ? 'bolder' : 'normal',
                  color: accountType === 'education' ? styles.primaryColor : styles.dark,
                }}
              >
                Education{' '}
              </p>
            </div>
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

        <div className={styles.saveButton} onClick={createButtonClicked}>Create Account</div>
      </div>
    </div>
  );
}