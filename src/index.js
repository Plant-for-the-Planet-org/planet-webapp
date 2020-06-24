import 'react-native-gesture-handler';
import React from 'react'
import { SafeAreaView } from 'react-native'
import Navigation from './navigation'

const App = () => {

    return (
        <SafeAreaView style={{flex:1}}>
           <Navigation />
        </SafeAreaView> 
    )
}

export default App
