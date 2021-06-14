// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import scriptLoader from 'react-async-script-loader';

class Paypal extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      window.React = React;
      window.ReactDOM = ReactDOM;
    }

    this.state = {
      showButton: false
    };
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
  }

  UNSAFE_componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    const isLoadedButWasntLoadedBefore =
      !this.state.showButton && !this.props.isScriptLoaded && isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true });
      }
    }
  }

  render() {
    let paypal;
    if (typeof window !== 'undefined') {
      paypal = window.paypal;
    }
    const {
      amount,
      mode,
      currency,
      onSuccess,
      donationId,
      clientID,
      donationUid
    } = this.props;

    const { showButton } = this.state;

    const CLIENT = {
        // users client id here
      [mode]: clientID
    };
    const invoice_number = `ttc-${donationId}`;
    //debug('invoice we are sending to paypal as donationId:', invoice_number);
    const payment = () => {
      return paypal.rest.payment.create(mode, CLIENT, {
        transactions: [
          {
            amount: {
              total: Math.round(amount * 100) / 100,
              currency
            },
            invoice_number: invoice_number,
            custom: donationUid
          }
        ]
      });
    };

    // see https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/customize-button/
    const buttonStyle = {
      color: 'silver', // gold | blue | silver | black
      shape: 'pill', // pill | rect
      label: 'pay', // checkout | credit | pay | buynow | paypal | installment
      size: 'large' // small | medium | large | responsive
    };

    const onAuthorize = data => {
      onSuccess(data);
    };

    const onError = data => {
      onSuccess(data);
    };

    const onCancel = data => {
      let error = {
        ...data,
        type: 'error',
        error: { message: 'Transaction cancelled' }
      };
      onSuccess(error);
    };

    return (
      <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:'18px'}}>
          {showButton && (
            <paypal.Button.react
              env={mode}
              style={buttonStyle}
              client={CLIENT}
              commit={false}
              payment={payment}
              onAuthorize={onAuthorize}
              onCancel={onCancel}
              onError={onError}
            />
          )}
      </div>
    );
  }
}

Paypal.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  isScriptLoaded: PropTypes.bool,
  isScriptLoadSucceed: PropTypes.bool,
  mode: PropTypes.string,
  onSuccess: PropTypes.func,
  donationUid: PropTypes.string
};

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(
  Paypal
);
