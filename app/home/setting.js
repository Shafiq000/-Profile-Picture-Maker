import { Pressable, StyleSheet, Text, View, Share } from 'react-native';
import React from 'react';
import { theme } from '../../constants/theme';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../../helpers/common';
import { AntDesign, Entypo, Feather, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GradientText from "react-native-gradient-texts";
import { LinearGradient } from 'expo-linear-gradient';

const Setting = () => {
    const router = useRouter();
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Check out this amazing app: Profile Picture Maker - Download it here: [App Link]',
            });
            if (result.action === Share.sharedAction) {
                // Handle share success
            } else if (result.action === Share.dismissedAction) {
                // Handle dismissed action
            }
        } catch (error) {
            console.error('Error sharing the app:', error.message);
        }
    };

    return (
        <View style={[styles.mainContainer, { paddingTop }]}>
            <Pressable hitSlop={30} onPress={() => router.push('/home')} style={styles.header}>
                <AntDesign name='close' size={25} color={theme.colors.white} />
            </Pressable>
            <View style={styles.container}>
                <Animated.View entering={FadeInLeft.delay(200).springify()}>
                    <Pressable style={styles.iconTxtContainer}>
                        <Feather name='star' size={22} color={'#CE54E5'} />
                        <Text style={styles.text}>Rate & Review</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInLeft.delay(400).springify()}>
                    <Pressable onPress={onShare} style={styles.iconTxtContainer}>
                        <Entypo name='share-alternative' size={22} color={'#CE54E5'} />
                        <Text style={styles.text}>Share App</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInLeft.delay(600).springify()}>
                    <Pressable style={styles.iconTxtContainer}>
                        <Octicons name='note' size={22} color={'#CE54E5'} />
                        <Text style={styles.text}>Terms of Use</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInLeft.delay(800).springify()}>
                    <Pressable style={styles.iconTxtContainer}>
                        <MaterialIcons name='privacy-tip' size={22} color={'#CE54E5'} />
                        <Text style={styles.text}>Privacy Policy</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInLeft.delay(900).springify()} style={styles.inApMainContainer}>
                    <GradientText
                        text={"GO TO PREMIUM 🔥"}
                        fontSize={25}
                        isGradientFill
                        isGradientStroke
                        width={wp(80)}
                        height={hp(5)}
                        locations={{ x: 150, y: 28 }}
                        gradientColors={["#6710c2", "#CE54E5"]}
                    />
                    <Text style={styles.punchline}>Unlimited access to all features and exclusive content.</Text>
                    <Pressable style={styles.upgradeBtn}>
                        <LinearGradient
                            colors={['#6710c2', '#CE54E5']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.upgradeText}>Upgrade</Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        gap: 15,
        backgroundColor: theme.colors.blackgray,
    },
    header: {
        marginHorizontal: wp(4),
    },
    container: {
        flexDirection: 'column',
        paddingHorizontal: wp(10),
        paddingVertical: hp(5),
    },
    iconTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        gap: 20,
    },
    text: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.white,
    },
    inApMainContainer: {
        top: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: wp(80),
        height: hp(35),
        backgroundColor: theme.colors.black,
        borderRadius: theme.radius.xl,
    },
    punchline: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.white,
        textAlign: 'center',
    },
    upgradeBtn: {
        width: wp(65),
        height: hp(7),
        borderRadius: theme.radius.xxxl,
        shadowColor: '#CE54E5',  
        shadowOpacity: 20,  
        shadowOffset: { width: 0, height: 0 }, 
        shadowRadius: 20, 
        elevation: 15,         
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.xxxl,
        
    },
    upgradeText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
});
