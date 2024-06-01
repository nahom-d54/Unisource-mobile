import { SafeAreaView, ScrollView, StyleSheet,View, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Button } from 'react-native-paper'
import { images } from '../constants'
import { isTokenExpired } from '../api/index'



export default function App() {
  const [tokenExpired, setTokenExpired] = useState(false)
  const router = useRouter()
  const handlePress = (route) => {
    router.push(route)
  }
  useEffect(() => {
    async function func(){
      const checkToken = await isTokenExpired()
      setTokenExpired(checkToken)
    }
    func()
    
  })
  
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View style={styles.container}>
          <Image source={ images.logo } style={{ width: 130, height: 130, borderRadius: 70 }} resizeMode='contain' />
          {/* create a onPress handler */}
          <Button mode='contained' buttonColor='#3B82F6' textColor='#fff' onPress={() => handlePress('/signIn')} style={{ width: '100%', marginVertical: 5}}>Sign In</Button>

          <Button mode='outlined' textColor='#3B82F6' onPress={() => handlePress('/signUp')} style={{ width: '100%', marginVertical: 5, borderColor: '#3B82F6'}}>Sign Up</Button>

          <Button mode='outlined' textColor='#3B82F6' onPress={() => handlePress('/home')} style={{ width: '100%', marginVertical: 5, borderColor: '#3B82F6'}}>Continue as guest</Button>          
        </View>

      </ScrollView>

    </SafeAreaView>
  
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16
  }
})