import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";

//


export const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
};

export async function saveHistory(uri, timestamp, filename, mime){
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

export async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      const folderUri = await selectFolder()
  
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      FileSystem.StorageAccessFramework.createFileAsync(folderUri, filename, mimetype)
      .then(async (uri) => {
        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
      })
      
    }
}

export const selectFolder = async () => {
    try {
      
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        return permissions.directoryUri
      }
    } catch (err) {
        Alert.alert('Error', 'An error occurred while selecting the folder.');
        console.log(err);
      
    }
};

export const downloadFile = async ( url, setIsDownloading, setDownloadProgress, downloadResumableRef, setFilename, filename ) => {
    // if (!folderUri) {
      //   Alert.alert('Error', 'Please select a folder first.');
      //   return;
      // }
      setFilename(getFileNameFromUrl(url));
      const history = await AsyncStorage.getItem('fileHistory')
      if(history){
          const historyValue = JSON.parse(history)
          const filterFiles = historyValue.filter((f) => filename === f.filename )
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
        FileSystem.documentDirectory + filename,
        {},
        callback
      );

      try {
        const output = await downloadResumableRef.current.downloadAsync();
        setIsDownloading(false);
        if(!isPaused){ 
          await saveHistory(output?.uri, Date.now(), filename, output?.headers["content-type"]);
          Alert.alert('Download Complete', `Finished downloading to ${uri}`);
        }
        //await saveFile(uri, filename, headers["content-type"]);
       
      } catch (e) {
        setIsDownloading(false);
        console.error(e);
      }
};

export const pauseDownload = async (downloadResumableRef, setIsPaused, setIsDownloading ) => {
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

export const resumeDownload = async (setDownloadProgress, setIsDownloading, setIsPaused) => {
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
      const { uri } = await downloadResumableRef.current.resumeAsync();
      setIsDownloading(false);
      await saveHistory(uri, Date.now(), filename, headers["content-type"])
      Alert.alert('Download Complete', `Finished downloading to ${uri}`);
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


export const toggleDownload = async () => {
    if (isPaused) {
      resumeDownload();
    } else {
      pauseDownload();
    }
  };