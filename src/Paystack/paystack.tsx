import * as React from 'react';
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {Modal, View, ActivityIndicator, SafeAreaView} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
// import {showToast} from '../../reducerSlices/toastSlice';
import {getAmountValueInKobo, getChannels} from './helper';
import {PayStackProps, PayStackRef} from './types';

const CLOSE_URL = 'https://standard.paystack.co/close';

const Paystack: React.ForwardRefRenderFunction<
  React.ReactNode,
  PayStackProps
> = (
  {
    amount,
    paystackKey,
    billingEmail,
    currency = 'NGN',
    channels = ['card'],
    refNumber,
    handleWebViewMessage,
    onCancel,
    autoStart = false,
    onSuccess,
    activityIndicatorColor = 'green',
    transData,
    metadata,
  },
  ref,
) => {
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const webView = useRef(null);

  useEffect(() => {
    autoStartCheck();
    onNavigationStateChange
  }, []);

  useImperativeHandle(ref, (): any => ({
    startTransaction() {
      setshowModal(true);
    },
    endTransaction() {
      console.log('imperative')
      setshowModal(false);
    },
  }));

  const autoStartCheck = () => {
    if (autoStart) {
      setshowModal(true);
    }
  };

  const refNumberString = refNumber ? `ref: '${refNumber}',` : ''; // should only send ref number if present, else if blank, paystack will auto-generate one

  const Paystackcontent = `   
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paystack</title>
        </head>
          <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh">
            <script src="https://js.paystack.co/v1/inline.js"></script>
            <script type="text/javascript">
              window.onload = payWithPaystack;
              function payWithPaystack(){
              var handler = PaystackPop.setup({ 
                key: '${paystackKey}',
                email: '${billingEmail}',
                amount: ${amount}, 
                currency: '${currency}',
                ${getChannels(channels)}
                ${refNumberString}
                metadata: ${JSON.stringify(metadata)},
                callback: function(response){
                      var resp = {event:'successful', transactionRef:response};
                        window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                },
                onClose: function(){
                    var resp = {event:'cancelled'};
                    window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                }
                });
                handler.openIframe();
                }
            </script> 
          </body>
      </html> 
      `;

  const messageReceived = (data: string) => {
    const webResponse = JSON.parse(data);
    if (handleWebViewMessage) {
      handleWebViewMessage(data);
    }
    switch (webResponse.event) {
      case 'cancelled':
        console.log('Transaction cancelled');
        setshowModal(false);
        onCancel({status: 'cancelled'});
        break;

      case 'successful':
        console.log("switch statement")
        setshowModal(false);
        const reference = webResponse.transactionRef;

        if (onSuccess) {
          onSuccess({
            status: 'success',
            transactionRef: reference,
            data: webResponse,
          });
          //navigate to home
        } else console.log('Transaction failed');
        break;

      default:
        if (handleWebViewMessage) {
          handleWebViewMessage(data);
        }
        break;
    }
  };

  const onNavigationStateChange = (state: WebViewNavigation) => {
    console.log("From nav", state)
    const {url} = state;
    console.log("Here is the URL --> ", url)
    if (url === CLOSE_URL) {
      setshowModal(false);
    }
  };

  return (
    <Modal
      style={{flex: 1}}
      visible={showModal}
      animationType="slide"
      transparent={false}>
      <SafeAreaView style={{flex: 1}}>
        <WebView
          style={[{flex: 1}]}
          source={{html: Paystackcontent}}
          onMessage={e => {
            console.log('Webview message', e)
            // messageReceived(e.nativeEvent?.data);
          }}
          onLoadStart={() => setisLoading(true)}
          onLoadEnd={() => setisLoading(false)}
          // onNavigationStateChange={onNavigationStateChange}
          ref={webView}
          cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'}
        />
        {isLoading && (
          <View>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default forwardRef(Paystack);

function dispatch(arg0: any) {
  // throw new Error('Function not implemented.');
}
