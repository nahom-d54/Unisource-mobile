import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

const FormField = ({ title, value, placeholder, handleChangeText, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View style={{ gap: 5, marginBottom: 8, width: '100%'}}>
        <Text style={{marginBottom: 5}}>{title}</Text>
        <View style={{  width: '100%', height: 40, paddingHorizontal: 16, borderWidth: 0.5, backgroundColor: "#e3e8e7", borderRadius: 8}}>
            <TextInput style={{ display: 'flex', flex: 1}} value={ value } placeholder={ placeholder } placeholderTextColor='#7b7b8b' onChangeText={handleChangeText} secureTextEntry={title === 'Password' && !showPassword}/>
        </View>
    </View>
  )
}

export default FormField  