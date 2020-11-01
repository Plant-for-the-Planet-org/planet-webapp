import React from 'react'

interface PaypalButtonProps {
}

type State = {
    isEnabled: boolean
}

declare var paypal : any;

class PaypalButton extends React.Component<PaypalButtonProps, State> {
    public readonly state: State = {
        isEnabled: false
    }

    componentDidMount() {
        console.log("here")
        this.setState({isEnabled: true} as State)
        paypal.Button.render({
            style:{
                color: 'silver'
            },
            env: 'sandbox',
            client: {
                sandbox: 'AdjHuvCcGCzfBKbTYDCaBU5RIYerUCmW7uE3gMZgK6tC2VSg5X41FCtFoixrwx4d6SAn-YCUrho80ptC'
            },
            payment: function(data: any, actions: any) {
                return actions.payment.create({
                    transactions: [
                        {
                            amount: {
                                total: '1.00',
                                currency: 'USD'
                            }
                        }
                    ]
                })
            },

            commit: true, 
            onAuthorize: function(data: any, actions: any){
                return actions.payment.execute().then(function(response: any) {
                    console.log("The payment complete")
                })
            },
            onCancel: function(data: any) {
                console.log("payment canceled")
            }
        }, 
        '#paypal-btn')
    }

    render() {
        return (
            <div>
                <div id="paypal-btn"/> 
            </div>
        )
    }
} export default PaypalButton