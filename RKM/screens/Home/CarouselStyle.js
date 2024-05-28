import { StyleSheet, Dimensions } from 'react-native';

export default CarouselStyle = StyleSheet.create({
    carouselDotContainer: {
        padding: 0,
        position: 'absolute',
        bottom: 0,
    },
    carouselDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    carouselContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    paginationContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselTitle: {
        fontSize: 20,
    },
    carouselItem: {
        width: '100%',
        height: Dimensions.get('screen').width,
    },
    carouselImageContainer: {
        flex: 1,
        borderRadius: 0,
        marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
    },
    carouselImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    carouselDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
  });