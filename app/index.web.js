import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { hp, wp } from '../helpers/common'
import Animated, { FadeInDown, FadeInUp, FadeOutDown } from 'react-native-reanimated'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'
const WelcomeScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/wallpapr.png')}
                style={styles.bgImage}
                resizeMode='cover'
            />
            {/* linear gradiant */}
            <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                    style={styles.gradiant}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.8 }}
                />
                {/* content */}
                <View style={styles.contenContainer}>
                    <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.title}>PFP</Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(600).springify()} style={styles.punchLine}>Profile Picture Maker</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(700).springify()}>
                        <Pressable onPress={() => router.push('home')} style={styles.startButton}>
                            <Text style={styles.startText}>Start Make</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        // alignItems:'center',
        // backgroundColor:theme.colors.defaultblack
    },
    bgImage: {
        width:'70%',
        height: '100%',
        position: 'absolute',
        
        alignSelf:'center'
        // opacity: 0.5,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
      
    },
    gradiant: {
        width: '100%',
        height: '60%',
        bottom: 0,
        position: 'absolute'
    },
    contenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14
    },
    title: {
        fontSize: hp(7),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold
    },
    punchLine:{
        fontSize: hp(2),
        // color: theme.colors.neutral(0.9),
        letterSpacing: 1,
        marginBottom: 10,
        fontWeight: theme.fontWeights.medium
    },
    startButton:{
        marginBottom:50,
        backgroundColor: theme.colors.neutral(0.9),
        padding:15,
        paddingHorizontal:90,
        borderRadius: theme.radius.xl,
        borderCurve:'continuous'
    },
    startText:{
        color: theme.colors.white,
        fontSize:hp(3),
        fontWeight: theme.fontWeights.medium,
        letterSpacing:1
    }
})

export default WelcomeScreen
