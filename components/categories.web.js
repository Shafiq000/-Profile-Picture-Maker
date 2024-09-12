import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, Platform, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { theme } from '../constants/theme';
import { wp, hp } from '../helpers/common';
import { data } from '../constants/data';
import Animated, { FadeInRight } from 'react-native-reanimated';

const initialLayout = { width: Dimensions.get('window').width };

const renderTabBar = props => (
    <TabBar
        {...props}
        indicatorStyle={styles.tabBarIndicatorStyle}
        style={styles.tabBarStyle}
        tabStyle={styles.tabBarTabStyle}
        renderLabel={({ route, focused }) => (
            <Animated.Text
                entering={FadeInRight.delay(500).springify()}
                style={[
                    styles.tabLabel,
                    {
                        color: focused ? theme.colors.white : theme.colors.darkgray,
                    },
                ]}
            >
                {route.title}
            </Animated.Text>
        )}
        scrollEnabled
    />
);

const CategoryItem = React.memo(({ images, handleImage }) => (
    <View style={styles.container}>
        <FlatList
            data={images}
            // horizontal
            numColumns={8}
            keyExtractor={(image, index) => index.toString()}
            renderItem={({ item }) =>
                <Pressable onPress={() => handleImage(item)} style={styles.imageContainer}>
                    <Image source={item} style={styles.image} />
                    <View style={styles.imageBodyView} />
                </Pressable>
            }
        />
    </View>
));

const Categories = ({ activeCategory, handleChangeCategory }) => {
    const handleImage = useCallback((image) => {
        console.log("Image pressed:", image);
        handleChangeCategory(image);
    }, [handleChangeCategory]);

    const [index, setIndex] = useState(0);
    const [routes] = useState(
        data.categories.map(category => ({
            key: category.title,
            title: category.title,
            images: category.images,
        }))
    );

    const renderScene = useCallback(
        SceneMap(
            routes.reduce((scenes, category) => {
                scenes[category.key] = () => <CategoryItem images={category.images} handleImage={handleImage} />;
                return scenes;
            }, {})
        ),
        [routes]
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
        />
    );
};

export default Categories;

const styles = StyleSheet.create({
    tabLabel: {
        fontSize: hp(2.5),
        fontWeight: theme.fontWeights.extrabold,
        marginHorizontal: wp(2.8),
        lineHeight: 30,
        marginVertical:25,
        borderRadius:8,
        borderWidth:1,
        padding:8,
        borderColor:theme.colors.darkgray
    },
    image: {
        width:Platform.OS === 'web' ? wp(26.8) : wp(22),
        height:Platform.OS === 'web' ? hp(12.4) : hp(10.5),
        borderRadius: wp(15),
        // marginHorizontal: wp(1),
        marginVertical: hp(2),
    },
    imageContainer: {
        // flex:1,
        // position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
         paddingHorizontal:10
    },
    imageBodyView: {
        position: 'absolute',
        // width:Platform.OS === 'web' ? wp(14) : wp(15),
        // height:Platform.OS === 'web' ? hp(6.8) : hp(7.3),
        width:70,
        height:70,
        borderRadius: wp(10),
        backgroundColor: theme.colors.defaultblack,
        // top:190,
        left:36,
        // transform: [{ translateX: Platform.OS === 'web' ? -wp(3) : -wp(7.6) }, { translateY: Platform.OS === 'web' ? -wp(7.6) : -wp(7.6) }],
    },
    container: {
        // flex: 1,
        // width: wp(100),
        // paddingHorizontal: wp(2),
        // paddingVertical: hp(1),
        justifyContent:'center',
        alignItems:'center'
    },
    tabBarStyle: {
        backgroundColor: theme.colors.defaultblack,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 0,
        borderRadius:10
    },
    tabBarIndicatorStyle: {
        flex: 1,
        minHeight: 2,
        // width: wp(100),
        paddingHorizontal: wp(2),
        backgroundColor: 'transparent'
    },
    tabBarTabStyle: {
        width: 'auto',
        padding: 0,
    },
});
