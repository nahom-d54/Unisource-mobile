import { View, Text, TextInput, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { icons } from '../../constants'
import { images } from '../../constants'
import _ from 'lodash'

const Explore = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAtEndOfScroll, setIsAtEndOfScroll] = useState(false);

  const getItems = async (pageNumber = 1, query = '') => {
    try {
      setIsLoading(true);
      const axios = getAxiosInstance();
      const result = await axios.get(`/resources/?page=${pageNumber}&query=${query}`);
      setItems((prevItems) => [...prevItems, ...result.data.results]);
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
    _.debounce((pageNumber, query) => getItems(pageNumber, query), 500),
    []
  );

  useEffect(() => {
    if (isAtEndOfScroll && hasMoreItems && !isLoading) {
      debouncedGetItems(page, searchQuery);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isAtEndOfScroll, hasMoreItems, isLoading, searchQuery, debouncedGetItems, page]);

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
      <ScrollView style={{marginVertical: 15}} 
      onScroll={handleScroll} 
      scrollEventThrottle={16}>
              { items.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Image source={ item.image } style={{ width: 80, height: 110, borderRadius: 10}}/>
                    <View style={{ padding: 2, width: '65%'}}>
                      <Text style={{ fontSize: 17, fontWeight: '600'}}>{item.name}</Text>
                      <Text style={{ fontSize: 16, fontWeight: '400'}}>{item.author}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '300' }} numberOfLines={2} ellipsizeMode="tail">ISBN: { item.isbn }</Text>
                    </View>
                </View>
              )) }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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

export default Explore