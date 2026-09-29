import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

interface GhostOverlayProps {
  imageUrl: string;
  opacity: number;
}

export const GhostOverlay: React.FC<GhostOverlayProps> = ({ imageUrl, opacity }) => {
  if (!imageUrl || opacity <= 0) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Image
        source={{ uri: imageUrl }}
        style={[styles.ghostImage, { opacity }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ghostImage: {
    width: '100%',
    height: '100%',
  },
});
