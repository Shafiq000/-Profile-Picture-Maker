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

const CategoryItem = React.memo(({ images, handleImage }) => {
    return (
        <FlatList
            data={images}
            numColumns={4} 
            keyExtractor={(image, index) => index.toString()}
            renderItem={({ item, index }) => (
                <Pressable
                    onPress={() => handleImage(item)}
                    style={styles.imageContainer}
                >
                    <Image source={item} style={styles.image} />
                    <View style={styles.imageBodyView} />
                </Pressable>
            )}
            columnWrapperStyle={styles.row} 
        />
    );
});



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
    row: {
        justifyContent: 'flex-start', 
        flexWrap: 'wrap', 
        paddingHorizontal:wp(2.5)
    },
    tabLabel: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.extrabold,
        marginHorizontal: wp(2.8),
        lineHeight: hp(2.5),
        borderRadius:8,
        borderWidth:1,
        padding:8,
        borderColor:theme.colors.darkgray
    },
    image: {
        width: wp(21.2),
        height:  hp(10),
        borderRadius: wp(15),
        // marginHorizontal: wp(2.5),
        marginVertical: hp(1),
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '25%', 
        marginHorizontal: wp(1),
    },
    imageBodyView: {
        position: 'absolute',
        width:  wp(14.2),
        height:  hp(6.8),
        borderRadius: wp(10),
        backgroundColor: theme.colors.defaultblack,
        top:  '51.5%',
        left:  '52.5%',
        transform: [{ translateX: -wp(7.6) }, { translateY:  -wp(7.6) }],
    },
    container: {
        flex: 1,
        width: wp(100),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
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
    },
    tabBarIndicatorStyle: {
        flex: 1,
        minHeight: 2,
        width: wp(100),
        paddingHorizontal: wp(2),
        backgroundColor: 'transparent',
    },
    tabBarTabStyle: {
        width: 'auto',
        padding: 0,
    },
});
