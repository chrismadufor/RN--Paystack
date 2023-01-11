import React, {type PropsWithChildren} from 'react';
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  Alert,
  useColorScheme,
  View,
} from 'react-native';

import  {Paystack , paystackProps}  from 'react-native-paystack-webview';

// library directly

// import Paystack from './src/Paystack/paystack';
// import * as paystackProps from './src/Paystack/types';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  let [payModal, setPayModal] = useState(false);
  useEffect(() => console.log('Hi'));
  const isDarkMode = useColorScheme() === 'dark';

  // const paystackWebViewRef = useRef<paystackProps.PayStackRef>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const pay = () => {
    // paystackWebViewRef.current?.startTransaction();
    console.log("clicked")
    setPayModal(true)
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {payModal && (
            <Paystack
              amount={'1000'}
              // paystackKey={'pk_live_589423f98c01621a714ee91428ae679703acb905'}
              paystackKey={'pk_test_964844708948f6e10481cf3c2dc475e48c0e0e11'}
              billingEmail={'chrismadufor@gmail.com'}
              onCancel={() => {
                console.log('Payment cancelled');
                // setPayModal(false)
              }}
              autoStart={true}
              onSuccess={() => {
                console.log('Success');
                // setPayModal(false)
              }}
              // ref={paystackWebViewRef}
              // refNumber={'7645rtyds'}
            />
          )}
          <Button title="Press me" onPress={() => pay()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
