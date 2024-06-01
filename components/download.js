import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
};

export async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      if (!folderUri) {
        Alert.alert('Error', 'Please select a folder first.');
        return;
      }
  
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(folderUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
            await saveHistory(uri, Date.now(), filename, mimetype)
          })
          .catch(e => console.log(e));
      
    }
}

export const selectFolder = async (setFolderUri, folderUri) => {
    try {
      
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        await AsyncStorage.setItem('folderUri', permissions.directoryUri);
        setFolderUri(permissions.directoryUri);
        Alert.alert('Success', 'Folder selected successfully.');
        console.log(folderUri);
      }
    } catch (err) {
        Alert.alert('Error', 'An error occurred while selecting the folder.');
        console.log(err);
      
    }
};

export const downloadFile = async ( url, setIsDownloading, setDownloadProgress, downloadResumableRef) => {
    if (!folderUri) {
      Alert.alert('Error', 'Please select a folder first.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setDownloadProgress(progress);
    };
    
    const filename = getFileNameFromUrl(url);
    
    downloadResumableRef.current = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + filename,
      {},
      callback
    );

    try {
      const { uri, headers } = await downloadResumableRef.current.downloadAsync();
      setIsDownloading(false);
      await saveFile(uri, filename, headers["content-type"]);
      Alert.alert('Download Complete', `Finished downloading to ${folderUri}`);
     
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