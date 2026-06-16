import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import RAnimated, { FadeInRight } from 'react-native-reanimated';

const ITEM_WIDTH = wp('96%');

const ADS = [
  {
    id: '1',
    image: require('../../../assets/images/1.jpg'),
    title: 'Scale Your Team',
    subtitle: 'Hire the best talent globally',
  },
  // {
  //   id: '2',
  //   image: require('../../assets/images/hiring_ad_2.png'),
  //   title: 'Manage with Ease',
  //   subtitle: 'Streamline your recruitment process',
  // },
];

const AdSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= ADS.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ADS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <RAnimated.View entering={FadeInRight.duration(600)} style={styles.cardContainer}>
            <Image source={item.image} style={styles.adImage} />
          </RAnimated.View>
        )}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1%'),
    alignItems: 'center',
  },
  cardContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    // paddingHorizontal: wp('2%'),
  },
  adImage: {
    width: ITEM_WIDTH,
    height: hp('20%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.border + '50',
  },
  overlay: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('6%'),
    right: wp('6%'),
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  title: {
    color: Colors.white,
    fontSize: wp('4%'),
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.white,
    fontSize: wp('3%'),
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    gap: wp('1.5%'),
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
});

export default AdSlider;
