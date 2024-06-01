import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from "jwt-decode";


const baseUrl = 'https://unisource.nahom.eu.org/api/v1/'


async function getToken() {
    try {
      const value = await AsyncStorage.getItem("auth_keys");
      if (value !== null) {
        const { token, refresh } = JSON.parse(value);
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Expiration time in milliseconds
        const now = new Date().getTime();
        if (now >= expirationTime - 60000) {
          // Token is about to expire, refresh it
          const newToken = await refreshToken(refresh);
          await AsyncStorage.setItem("auth_keys", JSON.stringify({ token: newToken, refresh }));
          return { token: newToken, refresh };
        } else {
          return { token, refresh };
        }
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
}
async function refreshToken(refreshToken) {
    try {
      const response = await axios.post(baseUrl + 'token/refresh', {
        refresh: refreshToken,
      });
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

async function getAxiosInstance() {
    const { token } = await getToken();
    
    return axios.create({
      baseURL: baseUrl,
      //timeout: 10000,
      
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
}


export async function isTokenExpired() {
  try {
    const value = await AsyncStorage.getItem("auth_keys");
    if (value !== null) {
      const { refresh } = JSON.parse(value);
      const refreshDecoded = jwtDecode(refresh);

      const refreshExpirationTime = refreshDecoded.exp * 1000; // Refresh token expiration time in milliseconds
      const now = Date.now();

      return now >= refreshExpirationTime;
    } else {
      return true; // No refresh token in AsyncStorage, assume it's expired
    }
  } catch (err) {
    console.log(err);
    return true; // Error retrieving refresh token, assume it's expired
  }
}

export default getAxiosInstance;
