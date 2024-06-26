import { View, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { images } from '../../constants';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ActivityIndicator, Appbar, Button, Divider, ProgressBar, Surface, Text } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import getAxiosInstance from '../../api';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveFile } from '../../utils/download';


const Detail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null)
    const [ratings, setRatings] = useState([])
    const { id } = useLocalSearchParams();

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [folderUri, setFolderUri] = useState(null); // remove
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [filename, setFilename] = useState(null)
    const downloadResumableRef = useRef(null);
    const router = useRouter()


  const getFileNameFromUrl = (url) => {
      const parts = url.split('/');
      return parts[parts.length - 1];
  };
  
  async function saveHistory(uri, timestamp, filename, mime){
    try {
      let historyValue = []
      const history = await AsyncStorage.getItem('fileHistory')
      if(history){
        historyValue = JSON.parse(history)
      }
      historyValue.push({path: uri, timestamp, filename, mimetype: mime})
      await AsyncStorage.setItem('fileHistory',JSON.stringify(historyValue))
    } catch (error) {
      console.log(error);
    }
  }
  
  const downloadFile = async ( url ) => {
      // if (!folderUri) {
        //   Alert.alert('Error', 'Please select a folder first.');
        //   return;
        // }
        console.log(url);
        const fn = getFileNameFromUrl(url)
        setFilename(fn);
        const history = await AsyncStorage.getItem('fileHistory')
        if(history){
            const historyValue = JSON.parse(history)
            const filterFiles = historyValue.filter((f) => fn === f.filename )
            if (filterFiles.length > 0) {
              Alert.alert('Error', 'File is already downloaded')
              // router.push('/downloaded')
              return
            }
            }
      
    
        setIsDownloading(true);
        setDownloadProgress(0);
  
        const callback = downloadProgress => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        };
        
        
        
        downloadResumableRef.current = FileSystem.createDownloadResumable(
          url,
          FileSystem.documentDirectory + fn,
          {},
          callback
        );
  
        try {
          const output = await downloadResumableRef.current.downloadAsync();
          setIsDownloading(false);
          if(output.uri){
            console.log(output);
            await saveHistory(output?.uri, Date.now(), fn, output?.headers["content-type"]);
            Alert.alert('Download Complete', `Finished downloading to ${output.uri}`);
          }

          //await saveFile(uri, filename, headers["content-type"]);
         
        } catch (e) {
          setIsDownloading(false);
          console.log(e);
        }
  };
  
   const pauseDownload = async () => {
      if (downloadResumableRef.current) {
        try {
          await downloadResumableRef.current.pauseAsync();
          await AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumableRef.current.savable()));
          setIsPaused(true);
          setIsDownloading(false);
          Alert.alert('Paused', 'Download paused.');
        } catch (e) {
          console.error(e);
        }
    }
    };
  
  const resumeDownload = async () => {
    const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
    if (downloadSnapshotJson) {
      const downloadSnapshot = JSON.parse(downloadSnapshotJson);
  
      const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
      };
  
      downloadResumableRef.current = new FileSystem.DownloadResumable(
        downloadSnapshot.url,
        downloadSnapshot.fileUri,
        downloadSnapshot.options,
        callback,
        downloadSnapshot.resumeData
      );
  
      setIsDownloading(true);
      setIsPaused(false);
  
      try {
        const output = await downloadResumableRef.current.resumeAsync();
        setIsDownloading(false);
        if(output.uri){
          console.log(downloadSnapshot);
          await saveHistory(output?.uri, Date.now(), filename, output?.headers["content-type"]);
          Alert.alert('Download Complete', `Finished downloading to ${output.uri}`);
        }
      } catch (e) {
        if (e.message !== 'Aborted') {
          console.error(e);
        }
        setIsDownloading(false);
      }
    } else {
      Alert.alert('Error', 'No paused download found.');
    }
    };
  
  
  



    const getItem = async ( id ) => {
      try {
        setIsLoading(true);
        const axios_instance = await getAxiosInstance();
        const result = await axios_instance.get(`/resource/${id}`);
        setData(result.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getRating = async ( id ) => {
      try {
        setIsLoading(true);
        const axios_instance = await getAxiosInstance();
        const result = await axios_instance.get(`/resource/${id}`);
        setRatings(result.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
        // Update the header title whenever the headerTitle state changes
        getItem(id)
    }, []);

    ////////////////////////////

    

  const toggleDownload = async () => {
    if (isPaused) {
      resumeDownload(setDownloadProgress,setIsDownloading, setIsPaused);
    } else {
      pauseDownload(downloadResumableRef,setIsPaused, setIsDownloading);
    }
  };


    
  return (
    <>
    <Appbar.Header style={{ backgroundColor: '#fff', margin: 0, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.1)'}}>
          <Appbar.Action icon="arrow-left" onPress={() => { router.back()}}/>
          {data && <Appbar.Content title={data.name} titleStyle={{ marginLeft: 10, fontSize: 18, maxWidth: '70%' }}/>}
      </Appbar.Header>
    <View style={{width: '100%', display: 'flex', padding: 20, backgroundColor: '#fff', minHeight: '90%'}}>
      
                    {isLoading && <ActivityIndicator animating={true} size={100} style={{ alignSelf: 'center', marginTop: '50%'}}/>}
        {data &&
        (
            <>
            <Image  style={{ alignSelf: 'center', width: 130, height: 170, borderRadius: 10 }} source={data.image ? {uri: data.image}: images.nocover}/>
            <View style={{display: 'flex', alignItems: 'center', marginVertical: 10}}>
              <Text variant='titleMedium'>{ data.name }</Text>
              <Text style={{ opacity: 0.7, fontSize: 15, maxWidth: '80%', textAlign: 'center'}}>{ data.author }</Text>
            </View>
            <Divider/>
              <View>
                  <Text style={{fontSize: 18}} variant='titleMedium'>what's it about?</Text>
                  
                  <Text>{ data.description }</Text>
              </View>
              <ScrollView style={{ marginVertical: 10}}>
                { (ratings.length > 0) && 
                (
                  <View classname='ratestar' style={{marginVertical: 10}}>
                    <Text>Abebech</Text>
                    <Surface>
                      <Entypo name="star" size={18} color="#3B82F6" />
                    </Surface>
                  </View>

                ) }
                  
              </ScrollView>
              
              <View style={{width: '100%', paddingHorizontal: 8}}>
                {(isDownloading || isPaused) && 
                <View style={{ display: 'flex' }}>
                  <ProgressBar animatedValue={downloadProgress} style={{ width: '100%', marginBottom: 8}} color='#3B82F6' progress={downloadProgress} />
                  <Text>Download Progress: {(downloadProgress * 100).toFixed(2)}%</Text>
                </View>
                }
                {(isDownloading || isPaused) && (
                  <View style={styles.progressContainer}>
                    <Button 
                      onPress={toggleDownload} 
                      disabled={!isDownloading && !isPaused}
                      mode='outlined'
                      style={{ marginVertical: 5}}
                    >{isPaused ? "Resume Download" : "Pause Download"} </Button>
                  </View>
                )}
              { (data !== null && !(isDownloading || isPaused)) && <Button disabled={ isDownloading } icon='file-download' onPress={() => downloadFile(data.file )} buttonColor='#3B82F6' textColor='#fff' mode='contained'>Download</Button>}
              </View>
            </>

        )
        }
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    marginTop: 10,
    height: 10,
    width: '100%',
  },
});



export default Detail