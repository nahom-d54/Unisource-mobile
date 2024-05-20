import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { images } from '../constants'
import { SignInButton, SignUpButton } from '../components/AuthButtons'
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
          <SignInButton handlePress={handlePress} route={'/signIn'}/>
          <SignUpButton handlePress={handlePress} route={'/signUp'}/>
          <Link href='/home' style={{
            color: '#3B82F6', 
            borderColor: '#3B82F6', 
            borderWidth: 0.5,
            paddingVertical: 8,
            marginTop: 3
            }}>Continue as guest </Link>

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