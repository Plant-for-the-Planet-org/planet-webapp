import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import i18next from '../../../../i18n';
import MaterialTextField from "../../common/InputTypes/MaterialTextField";
import ToggleSwitch from "../../common/InputTypes/ToggleSwitch";
import styles from './../styles/Donations.module.scss';

const { useTranslation } = i18next;

interface Props {
  giftDetails: any;
  setGiftDetails: any;
  isGift:Boolean;
  setIsGift: Function;
}

export default function GiftForm({giftDetails,setGiftDetails,isGift,setIsGift}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate', 'common']);
  const [showEmail, setshowEmail] = React.useState(false);
  // const { giftDetails, setgiftDetails, isGift, setIsGift } =
  //   React.useContext(QueryParamContext);

  const defaultDeails = {
    recipientName: giftDetails.recipientName,
    recipientEmail: giftDetails.recipientEmail,
    giftMessage: giftDetails.giftMessage,
  };

  const { register, errors, handleSubmit, reset } = useForm({
    mode: "all",
    defaultValues: defaultDeails,
  });

  React.useEffect(() => {
    if (isGift && giftDetails) {
      setGiftDetails({ ...giftDetails, type: "invitation" });
    } else {
      setGiftDetails({ ...giftDetails, type: null });
    }
  }, [isGift]);

  const onSubmit = (data: any) => {
    setGiftDetails({ ...giftDetails, ...data });
  };

  const resetGiftForm = () => {
    const defaultDeails = {
      recipientName: "",
      recipientEmail: "",
      giftMessage: "",
    };
    setGiftDetails(defaultDeails);
    reset(defaultDeails);
  };

  const router = useRouter();

  return (
    <div>
      {giftDetails && giftDetails.recipientName === "" ? (
        <div>
          <div style={{marginTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label htmlFor="show-gift-form-toggle">{t("donate:myDonationGiftToSomeone")}</label>
            <ToggleSwitch
              name="show-gift-form-toggle"
              checked={isGift}
              onChange={() => {
                setIsGift(!isGift);
              }}
              id="show-gift-form-toggle"
            />
          </div>
          <div
            className={`donations-gift-form ${isGift ? "" : "display-none"}`}
          >
             <div style={{marginTop:'20px'}}>
              <MaterialTextField
                name={"recipientName"}
                label={t("donate:recipientName")}
                variant="outlined"
                inputRef={register({ required: true })}
              />
              {errors.recipientName && (
                <span className={styles.formErrors}>
                  {t("recipientNameRequired")}
                </span>
              )}
            </div>

            {showEmail ? (
              <div>
                 <div>
                  <div style={{marginTop:'20px',display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                    <p>{t("donate:giftRecipient")}</p>
                    <button
                      onClick={() => setshowEmail(false)}
                      className={"singleGiftRemove"}
                    >
                      {t("donate:removeRecipient")}
                    </button>
                  </div>

                  <MaterialTextField
                    name={"recipientEmail"}
                    label={t("donate:email")}
                    variant="outlined"
                    inputRef={register({
                      required: false,
                      pattern:
                        /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                    })}
                  />
                  {errors.recipientEmail && (
                    <span className={styles.formErrors}>{t("emailRequired")}</span>
                  )}
                </div>
                <div style={{marginTop:'20px'}}>
                  <MaterialTextField
                    multiline
                    rows="3"
                    rowsMax="4"
                    label={t("giftMessage")}
                    variant="outlined"
                    name={"giftMessage"}
                    inputRef={register()}
                  />
                </div>
              </div>
            ) : (
              <div style={{marginTop:'20px'}}>
                <button
                  onClick={() => setshowEmail(true)}
                  className={styles.addEmailButton}
                >
                  {t("donate:addEmail")}
                </button>
              </div>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              className="primaryButton"
              style={{marginTop:'20px'}}
            >
              {t("donate:continue")}
            </button>
          </div>
        </div>
      ) : (
        <div style={{marginTop:'20px',display:'flex',justifyContent:'space-between'}}>
          <p onClick={() => resetGiftForm()}>
            {t("directGiftRecipient", {
              name: giftDetails.recipientName,
            })}
          </p>
          {router && router.query.s ? (
            <></>
          ) : (
            <button
              onClick={() => resetGiftForm()}
              className={styles.singleGiftRemove}
            >
              {t("removeRecipient")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
