import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../../constants';
import getAxiosInstance from '../../api';
import { useRouter } from 'expo-router';

const HorizontalScrollView = ({ items }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      { items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Image source={ images.profile } style={{ width: 100, height: 150, borderRadius: 10}}/>
          <View>
            <Text >Book {index}</Text>
            <Text style={{ fontSize: 10, fontWeight: '300'}}>Author</Text>
          </View>
        </View>
      )) }
      
    </ScrollView>
  );
};
const Home = () => {
  const [items, setItems ] = useState([])
  const [page, setPage] = useState(1)
  const [isAtEndOfScroll, setIsAtEndOfScroll] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const router = useRouter()

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

  const getItems = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const axios_instance = await getAxiosInstance();
      const result = await axios_instance.get(`/resource/?page=${pageNumber}`);
      //console.log(result.data);
      setItems((prevItems) => [...prevItems, ...result.data.results]);
      setHasMoreItems(result.data.next !== null);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(items.length === 0){
      getItems()
      setPage(2)
    }
  },[])

  useEffect(() => {
    if (isAtEndOfScroll && hasMoreItems && !isLoading) {
      getItems(page);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isAtEndOfScroll, hasMoreItems, isLoading]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView 
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 12}}
        onScroll={handleScroll}
        scrollEventThrottle={16}
    
      >
        {/* <Text >Unisource</Text>
        <View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4}}>Popular</Text>
          <HorizontalScrollView items={[1,1,1,1,1,1,1,1,1,11,1]}/>
        </View> */}

        <View >
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4}}>All</Text>
            {isLoading && <Text>Loading</Text>}
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap', flex: 1}}>
              { items.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => router.push(`/detail/${item.id}`)}>
                  <View  style={styles.item}>
                    <Image source={item.image ? {uri: item.image}: images.nocover} style={{ width: 100, height: 150, borderRadius: 10}}/>
                      <View>
                        <Text numberOfLines={2} style={{maxWidth: 100}}>{item.name}</Text>
                        <Text style={{ fontSize: 10, fontWeight: '300'}}>{item.author}</Text>
                      </View>
                  </View>
                </TouchableOpacity>
              )) }
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    marginRight: 16,
    // Add your item styles here
  },
});

export default Home