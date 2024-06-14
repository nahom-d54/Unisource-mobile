import { Alert, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Divider, List, PaperProvider, Portal, Dialog, Button, Appbar, IconButton } from 'react-native-paper'
import { startActivityAsync } from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { saveFile } from '../utils/download';

const downloadedFiles = () => {
  const router = useRouter()
  const [historyItems, setHistoryItems] = useState([])
  const [visible, setVisible] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const showDialog = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const showconfirmDeleteDialog = () => {
    AsyncStorage.getItem('fileHistory').then(item => {
      if(item) setConfirmDelete(true);
      else Alert.alert('Error','No items to delete! ')
    })

  };
  const handleAllDelete = () => {
    setConfirmDelete(false);
    deleteAll()
  };
  const hideAllDialog = () => {
    setConfirmDelete(false);
  };
  
  const handleDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem);
      hideDialog();
    }
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedItem(null);
  };


  async function deleteItem (item) {
    try {
      await FileSystem.deleteAsync(item.path, {idempotent: true})
      const i = await AsyncStorage.getItem('fileHistory')
      const parsedItems = JSON.parse(i);
      if(!parsedItems) return;
      const filterdItems = parsedItems.filter((fitem) => fitem.timestamp != item.timestamp)
      await AsyncStorage.setItem('fileHistory', JSON.stringify(filterdItems))
    }catch(err) {
      console.log(err, 'deleting item');
    }

  } 


  useEffect(() => {
    async function loadDownlodedFiles(){
      const history = await AsyncStorage.getItem('fileHistory')
      setHistoryItems(history ? JSON.parse(history): [])
    }
    loadDownlodedFiles()
  })

  const getDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  }
  const openFile = async ( fileUri, mimeType ) => {
    // Replace 'file.ext' with the actual file you want to share
    
    try {
      // Ensure the file exists at the specified path
      
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log(fileInfo);
      if (fileInfo.exists) {
        //await Linking.openURL(fileInfo.uri)
        FileSystem.getContentUriAsync(fileUri).then(cUri => {
          console.log(cUri);
          startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
          });
        });

      } else {
        console.error('File does not exist:', fileUri);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };
  const deleteAll = () => {
    AsyncStorage.getItem('fileHistory').then(async items => {
      const parsedItems = JSON.parse(items);

      for (const item of parsedItems) {
        await deleteItem(item);
      }
    }).catch(err => {
      console.log('No File Found');
    })
    AsyncStorage.removeItem('fileHistory').catch(error => {
      console.log('Unable to delete items');
    })
  }

  const saveFileHandler = async (item) => {
    try {
      await saveFile(item.path, item.filename, item.mimetype)
      Alert.alert('Success', 'Item saved sucessfully')
    }catch(err) {
      Alert.alert('Error', `Unknown Error occured ${err}`)
    }

  }

  return (
    <>
    <Appbar.Header  style={{ backgroundColor: '#fff'}} mode='small' elevated={true}>
          {/* <Appbar.Action icon="arrow-left" onPress={() => { router.back()}} /> */}

          <Appbar.Content title='Downloaded Files'/>
          
          <Appbar.Action icon="delete-outline" onPress={() => { showconfirmDeleteDialog()}} />
          
    </Appbar.Header>
    <PaperProvider>
      <List.Section style={{ backgroundColor: '#fff'}}>
        { historyItems && historyItems.map((item, index) => (
            <View key={index}>
              <List.Item titleStyle={{color: '#000'}} theme={{ colors: { primary: '#000'}}} onLongPress={ () => showDialog(item) } onPress={() => openFile(item.path, item.mimetype)} descriptionStyle={{ opacity: 0.5 }} style={{ paddingHorizontal: 16 }} description={getDate(item.timestamp)} title={item.filename} left={() => <List.Icon icon="file-check-outline" />}  right={() => <IconButton icon='export' size={20} onPress={() => saveFileHandler(item)}/>}/>
              <Divider/>

            </View>
           
        ))}
        
     </List.Section>

     <Portal>
          <Dialog style={{ backgroundColor: '#fff'}} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Delete Item</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to delete this item?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={handleDelete}>Delete</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog style={{ backgroundColor: '#fff'}}  visible={confirmDelete} onDismiss={hideAllDialog}>
            <Dialog.Title>Delete All Items</Dialog.Title>
            <Dialog.Content>
                <Text>Are you sure you want to delete all items ?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideAllDialog}>Cancel</Button>
              <Button onPress={handleAllDelete}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>

    </PaperProvider>
    </>
  )
}

export default downloadedFiles

const styles = StyleSheet.create({})