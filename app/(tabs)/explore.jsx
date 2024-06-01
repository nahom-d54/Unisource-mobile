import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { icons } from '../../constants'
import { images } from '../../constants'
import _ from 'lodash'
import getAxiosInstance from '../../api'
import { useRouter } from 'expo-router'
import { ActivityIndicator, List, PaperProvider, Provider } from 'react-native-paper'


const ItemComponent = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.isbn} numberOfLines={2} ellipsizeMode="tail">
          ISBN: {item.isbn}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);


const Explore = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAtEndOfScroll, setIsAtEndOfScroll] = useState(false);
  const router = useRouter()

  const getItems = async ( query = '', pageNumber = 1) => {
    try {
      setIsLoading(true);
      const axios_instance = await getAxiosInstance();
      const result = await axios_instance.get(`/resource/?page=${pageNumber}&query=${query}`);
      setItems((prevItems) => [...result.data.results]);
      
      setHasMoreItems(result.data.next !== null);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.y;
    const contentSize = event.nativeEvent.contentSize.height;
    const layoutMeasurement = event.nativeEvent.layoutMeasurement.height;

    if (contentOffset + layoutMeasurement >= contentSize) {
      setIsAtEndOfScroll(true);
    } else {
      setIsAtEndOfScroll(false);
    }
  };

  const debouncedGetItems = useCallback(
    _.debounce((pageNumber, query) => getItems(pageNumber, query), 1000),
    []
  );

  useEffect(() => {
    if (isAtEndOfScroll && hasMoreItems && !isLoading) {
      debouncedGetItems(page, searchQuery);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isAtEndOfScroll, hasMoreItems, isLoading, searchQuery, debouncedGetItems, page]);

  useEffect(() => {
    console.log(searchQuery);
    getItems(searchQuery)
  },[searchQuery])

  const handleChangeText = (e) => {
    setSearchQuery(e)
  }
  const loadMoreItems = () => {
      if (hasMoreItems && !isLoading) {
        debouncedGetItems(page, searchQuery);
        setPage((prevPage) => prevPage + 1);
      }
  }
  const renderItem = ({ item }) => (
    <ItemComponent item={item} onPress={() => router.push(`/detail/${item.id}`)} />
  );
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
  

      <ScrollView style={{marginVertical: 15}} 
        
      onScroll={handleScroll} 
      scrollEventThrottle={16}>
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
            {isLoading && <ActivityIndicator animating={true} size={'small'} />}
          </TouchableOpacity>
        )) }
      </ScrollView>

      
        
      
      
    </View>
  )
}



const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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