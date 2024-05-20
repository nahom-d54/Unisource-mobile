import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'

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
  return (
    <>
    <Tabs>
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
        
    </Tabs>
    </>
  )
}

export default TabsLayout