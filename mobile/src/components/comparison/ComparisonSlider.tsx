import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, PanResponder } from 'react-native';

interface ComparisonSliderProps {
  capturedPhotoUri: string;
  referencePhotoUri: string;
  height?: number;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  capturedPhotoUri,
  referencePhotoUri,
  height = 420,
}) => {
  const [sliderPos, setSliderPos] = useState(0.5); // 0.0 to 1.0 (50% center)
  const [containerWidth, setContainerWidth] = useState(360);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.moveX;
        const normalized = Math.max(0.05, Math.min(0.95, newX / containerWidth));
        setSliderPos(normalized);
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Background layer: Reference Photo */}
      <View style={StyleSheet.absoluteFillObject}>
        <Image source={{ uri: referencePhotoUri }} style={styles.image} resizeMode="cover" />
        <View style={[styles.labelTag, styles.refLabel]}>
          <Text style={styles.labelText}>ẢNH THAM KHẢO</Text>
        </View>
      </View>

      {/* Foreground clipped layer: Captured Photo */}
      <View
        style={[
          styles.clippedContainer,
          { width: `${sliderPos * 100}%` },
        ]}
      >
        <Image
          source={{ uri: capturedPhotoUri }}
          style={[styles.image, { width: containerWidth }]}
          resizeMode="cover"
        />
        <View style={[styles.labelTag, styles.capturedLabel]}>
          <Text style={styles.labelText}>ẢNH BẠN ĐÃ CHỤP</Text>
        </View>
      </View>

      {/* Draggable Divider Handle */}
      <View
        style={[styles.dividerLine, { left: `${sliderPos * 100}%` }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleKnob}>
          <Text style={styles.handleArrow}>◀ ▶</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  clippedContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    borderRightWidth: 2,
    borderRightColor: '#FFFFFF',
  },
  labelTag: {
    position: 'absolute',
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  capturedLabel: {
    left: 12,
  },
  refLabel: {
    right: 12,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleKnob: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  handleArrow: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
