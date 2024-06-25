import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../../constants';
import getAxiosInstance from '../../api';
import { useRouter } from 'expo-router';
import { Button, Icon, IconButton, useTheme } from 'react-native-paper';
import {MyLoader} from '../../components/Loader';


const Home = () => {
  const [items, setItems ] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [networkError, setNetworkError] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const getItems = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const axios_instance = await getAxiosInstance();
      const result = await axios_instance.get(`/resource/?page=${pageNumber}`);
      //console.log(result.data);
      setItems((prevItems) => [...prevItems, ...result.data.results]);
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
  useEffect(() => {
    if(items.length === 0){
      getItems()
    }
  },[])



  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView 
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 12}}    
      >
        <View >
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4}}>All</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap', flex: 1}}>
              {isLoading && Array.from({length: 12}).map((_, index) => (<MyLoader key={index} width={110} height={170}/>))}
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
            {(hasMoreItems && !isLoading) && <Button theme={{colors: { primary: 'rgba(0,0,0,0.5)', outline: 'rgba(0,0,0,0.2)'}}} mode='outlined'  onPress={() => getItems(searchQuery,page)}>LoadMore ...</Button>}
        </View>
        {networkError && <Button mode='outlined' onPress={() => getItems(page)}>Reload <Icon source='reload'/></Button>}

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
  },
});

export default Home