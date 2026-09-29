import React from 'react';
import { StyleSheet, View } from 'react-native';

export const RuleOfThirdsGrid: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Horizontal grid lines */}
      <View style={[styles.gridLineHorizontal, { top: '33.33%' }]} />
      <View style={[styles.gridLineHorizontal, { top: '66.66%' }]} />

      {/* Vertical grid lines */}
      <View style={[styles.gridLineVertical, { left: '33.33%' }]} />
      <View style={[styles.gridLineVertical, { left: '66.66%' }]} />

      {/* Intersection Power Points */}
      <View style={[styles.powerPoint, { top: '33.33%', left: '33.33%' }]} />
      <View style={[styles.powerPoint, { top: '33.33%', left: '66.66%' }]} />
      <View style={[styles.powerPoint, { top: '66.66%', left: '33.33%' }]} />
      <View style={[styles.powerPoint, { top: '66.66%', left: '66.66%' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth * 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth * 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  powerPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginLeft: -3,
    marginTop: -3,
  },
});
