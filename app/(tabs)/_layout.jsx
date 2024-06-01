import { View, Image } from 'react-native'
import { useRouter } from 'expo-router'

import { isTokenExpired } from '../../api'
import { useEffect, useState } from 'react'

import { Appbar, IconButton, PaperProvider } from 'react-native-paper'

import { useTheme } from 'react-native-paper';

import { BottomNavigation, Text } from 'react-native-paper';

import Explore from './explore'
import Filter from './filter'
import Home from './home'
import Downloads from '../downloaded'



const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', gap: 2}}>
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                style={{ width: 20, height: 20}}
            />
            
        </View>
    )
}

const TabsLayout = () => {
    const [tokenExpired, setTokenExpired] = useState(false)
    const router = useRouter()
    useEffect(() => {
        async function func(){
          const checkToken = await isTokenExpired()
          setTokenExpired(checkToken)
        }
        func()
        
      })

      const [index, setIndex] = useState(0);
      const [routes] = useState([
          { key: 'home', title: 'Home', focusedIcon: 'home-circle', unfocusedIcon: 'home-circle-outline'},
          { key: 'filter', title: 'Filter', focusedIcon: 'filter', unfocusedIcon: 'filter-outline' },
          { key: 'search', title: 'Search', focusedIcon: 'magnify' },
          { key: 'downloads', title: 'Downloads', focusedIcon: 'folder-download-outline' },
      ]);
      const renderScene = BottomNavigation.SceneMap({
        home: Home,
        filter: Filter,
        search: Explore,
        downloads: Downloads,
      });

      
      const theme = useTheme()

  return (
    <>
        <PaperProvider theme={{ colors : { background: theme.colors.onPrimary}}}>
            <Appbar.Header mode='small' statusBarHeight={0}></Appbar.Header>
            <BottomNavigation
                activeColor='#000'
                barStyle={{ backgroundColor: '#fff',borderColor: '#999', borderTopWidth: 0.18 }}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                activeIndicatorStyle={{ backgroundColor: '#3B82F6', opacity: 0.2}}
                
        
            />

        </PaperProvider>
    {/* <Tabs screenOptions={{
        headerRight: () => tokenExpired ? <IconButton icon={props => <Ionicons name="log-in-outline" {...props} onPress={ () => router.push('/')} />} />: '',
        headerLeft: () => <IconButton icon={props => <Octicons name="file-directory" size={24} color="black"  onPress={() => router.push('/downloaded')}/>}/>,
        headerTitleAlign: 'center'
    
    }}>
        <Tabs.Screen 
            name='home'
            options={{
                title: "Home",
                headerShown: true,
                tabBarIcon: ({ color, focused}) => (
                    <TabIcon 
                    icon={ icons.home }
                    color={ color }
                    name="Home"
                    focused={focused}
                    />
                )

            }}
        />
        <Tabs.Screen 
            name='filter'
            options={{
                title: "Filter",
                headerShown: true,
                headerTitle: "",
                tabBarIcon: ({ color, focused}) => (
                    <TabIcon 
                    icon={ icons.filter }
                    color={ color }
                    name="Filter"
                    focused={focused}
                    />
                )

            }}
        />
        <Tabs.Screen 
            name='explore'
            options={{
                title: "Search",
                headerShown: true,
                tabBarIcon: ({ color, focused}) => (
                    <TabIcon 
                    icon={ icons.search }
                    color={ color }
                    name="Explore"
                    focused={focused}
                    />
                )

            }}
        />
        
        
    </Tabs> */}
    </>
  )
}

export default TabsLayout