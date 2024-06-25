import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { icons } from '../../constants'
import { images } from '../../constants'
import _ from 'lodash'
import getAxiosInstance from '../../api'
import { useRouter } from 'expo-router'
import { ActivityIndicator, Button, List, PaperProvider, Provider} from 'react-native-paper'
import { MyLoader2 } from '../../components/Loader'


const Explore = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter()

  const getItems = async ( query = '', pageNumber = 1) => {
    try {
      setIsLoading(true);
      const axios_instance = await getAxiosInstance();
      const result = await axios_instance.get(`/resource/?page=${pageNumber}&query=${query}`);
      setItems([...items,...result.data.results]);
      setHasMoreItems(result.data.next !== null);
      if(hasMoreItems){
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedGetItems = useCallback(
    _.debounce((pageNumber, query) => getItems(query, pageNumber), 500),
    []
  );


  useEffect(() => {
    setPage(1)
    setItems([])
    //getItems(searchQuery)
    debouncedGetItems(page, searchQuery)
  },[searchQuery])

  const handleChangeText = (e) => {
    setSearchQuery(e)
  }

  return (
    <View style={{
      paddingVertical: 8,
      paddingHorizontal: 16
    }}>
      <View style={{ flexDirection: 'row',  width: '100%', height: 40, paddingHorizontal: 16, borderWidth: 0.5, backgroundColor: "#e3e8e7", borderRadius: 8, alignItems: 'center'}}>
            {/* make it touchableopacity */}
            <Image source={ icons.search } tintColor='#3B82F6' style={{ width: 20, height: 20}} resizeMode='contain'/>
            <TextInput style={{ display: 'flex', flex: 1, paddingLeft: 20}} placeholder="Search" placeholderTextColor='#7b7b8b' onChangeText={handleChangeText}/>
      </View>
  

      <ScrollView style={{marginVertical: 15}} >
        {isLoading &&  Array.from({length: 4}).map((_, index) => (<MyLoader2 key={index} width={400} height={150}/>))}
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

    </View>
  )
}



const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 110,
    borderRadius: 10,
  },
  textContainer: {
    padding: 2,
    width: '65%',
    marginLeft: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  author: {
    fontSize: 16,
    fontWeight: '400',
  },
  isbn: {
    fontSize: 12,
    fontWeight: '300',
  },
  container: {
    flexDirection: 'row',
  },
});

export default Explore