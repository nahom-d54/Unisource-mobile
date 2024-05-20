import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { images } from '../../constants';

const Detail = ({ navigation }) => {
    const [headerTitle, setHeaderTitle] = useState('Default Title');
    const [data, setData] = useState(null)

    useEffect(() => {
        // Update the header title whenever the headerTitle state changes
        // fetch the book data and set title
        
        navigation.setOptions({
        title: data.name,
        });
    }, [navigation, headerTitle]);
  return (
    <View>
        {data && 
        (
            <>
            <Image source={images.profile}/>
            <Text>Book Title</Text>
            <View>
                <Text>what's it about?</Text>
                <Text>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat, saepe!</Text>
            </View>
            <ScrollView>
                <Text>Rating</Text>
                {/* list of rating with name date rating score bar */}
            </ScrollView>
            <TouchableOpacity><Text>Download Now</Text></TouchableOpacity>
            </>

        )
        }
      {/*
      image
      title
      what is it about
      ratings
      download button
       */}
    </View>
  )
}

export default Detail