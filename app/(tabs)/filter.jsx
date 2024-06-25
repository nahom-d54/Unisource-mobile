import { useRouter } from 'expo-router';
import getAxiosInstance from '../../api/index';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { MyLoader } from '../../components/Loader';

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [page, setPage] = useState(null);
  const router = useRouter()


  const getItems = async ( category = '', pageNumber = 1) => {
    try {
      if( pageNumber === null) pageNumber = 1;
      setIsLoading(true);
      const axios_instance = await getAxiosInstance();
      const url = `/resource/?page=${pageNumber}&category=${category}`
      const result = await axios_instance.get(url);
      setItems([...result.data.results]);
      setHasMoreItems(result.data.next !== null);
      if(hasMoreItems) setPage(page + 1);
    } catch (error) {
      console.error('Error fetching items:', error, category, pageNumber);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const axios_instance = await getAxiosInstance();
        const result = await axios_instance.get('/category/');
        setOptions([...result.data])
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if( selectedOption && selectedOption.id){
      setPage(1)
      console.log(page);
      getItems(selectedOption.id, page)   
    }
  }, [selectedOption])


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption({name: option.name, id: option.id});
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{selectedOption?.name ? selectedOption.name : 'Select Category'}</Text>
        <Text style={styles.dropdownText}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      <ScrollView>
        {isLoading && <ActivityIndicator animating={true} size={100} style={{ alignSelf: 'center', marginTop: '50%'}}/>}
        { items.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => router.push(`/detail/${item.id}`)}>
            <View style={styles.item}>
              <Image source={ item.image ? {uri: item.image}: images.nocover } style={{ width: 80, height: 110, borderRadius: 10}}/>
                <View style={{ padding: 2, width: '65%'}}>
                  <Text style={{ fontSize: 17, fontWeight: '600'}}>{item.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '400'}}>{item.author}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '300' }} numberOfLines={2} ellipsizeMode="tail">ISBN: { item.isbn }</Text>
                </View>
            </View>
          </TouchableOpacity>
        )) }
        {(hasMoreItems && !isLoading) && <Button theme={{colors: { primary: 'rgba(0,0,0,0.5)', outline: 'rgba(0,0,0,0.2)'}}} mode='outlined'  onPress={() => getItems(searchQuery,page)}>LoadMore ...</Button>}
      </ScrollView>
      <Portal>
        <PaperProvider>
        <Dialog visible={isOpen} onDismiss={toggleDropdown} style={{backgroundColor: '#fff'}}>
          <Dialog.Title theme={{colors: {primary: '#000'}}} style={{color: '#000'}}>Select Category</Dialog.Title>
          <Dialog.ScrollArea style={{ height: 300}}>
            <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
              {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.dropdownOptionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
           
            </ScrollView>
          </Dialog.ScrollArea>

        </Dialog>

        </PaperProvider>
      </Portal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: '80%',
    
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    width: '80%',
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    elevation: 4,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  item: {
    marginRight: 16,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 8
    // Add your item styles here
  },
});

export default Filter;