import { StyleSheet, Text, TouchableOpacity } from "react-native";


const SignInButton = ( {handlePress, route} ) => {
    return (
      <TouchableOpacity onPress={() => handlePress(route) } href='/signin' style={[styles.button, styles.signInButton]}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    );
  };
  
  const SignUpButton = ({handlePress, route}) => {
    return (
      <TouchableOpacity onPress={() => handlePress(route)} href='/signup' style={[styles.button, styles.signUpButton]}>
        <Text style={styles.buttonTextOutline}>Sign Up</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      paddingHorizontal: 16
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
      width: '100%'
    },
    signInButton: {
      backgroundColor: '#3B82F6', // Blue color for sign-in button
    },
    signUpButton: {
      backgroundColor: null,
      borderColor: '#3B82F6',
      borderWidth: 0.5,
      
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    buttonTextOutline: {
      color: '#3B82F6',
      fontWeight: 'bold',
    },
  })

export { SignInButton, SignUpButton};