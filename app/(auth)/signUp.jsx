import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { SignUpButton } from '../../components/AuthButtons'

const signUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  return (
    <SafeAreaView style={{ height: '100%'}}>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View style={styles.container}>
          <Image source={images.logo} style={{ width: 90, height: 90, borderRadius: 70, marginBottom: 10}} resizeMode='contain'/>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>SignUp</Text>


          <FormField title="Email" value={form.password} handleChangeText={(e) => setForm({...form, password: e})}/>
          
          <FormField title="Password" value={form.email} handleChangeText={(e) => setForm({...form, email: e})} keyboardType="email-address"/>

          <SignUpButton/>
          <Text>Already have an account ? <Link href='/signIn' style={{ color: '#3B82F6'}}>SignIn</Link></Text>
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
    paddingHorizontal: 30
  },
})

export default signUp