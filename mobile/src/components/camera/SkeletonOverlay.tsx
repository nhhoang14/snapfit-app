import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Keypoint } from '@/types';

interface SkeletonOverlayProps {
  keypoints: Keypoint[];
  connections: number[][];
  isAligned: boolean;
}

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  keypoints,
  connections,
  isAligned,
}) => {
  if (!keypoints || keypoints.length === 0) return null;

  const pointColor = isAligned ? '#10B981' : '#6366F1';
  const glowColor = isAligned ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.35)';

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Keypoints */}
      {keypoints.map((kp, idx) => {
        const leftPercent = `${(kp.x * 100).toFixed(1)}%`;
        const topPercent = `${(kp.y * 100).toFixed(1)}%`;

        return (
          <View
            key={`kp-${kp.name || idx}`}
            style={[
              styles.keypointContainer,
              { left: `${kp.x * 100}%` as any, top: `${kp.y * 100}%` as any },
            ]}
          >
            {/* Outer pulse glow */}
            <View style={[styles.keypointGlow, { backgroundColor: glowColor }]} />
            {/* Inner core */}
            <View style={[styles.keypointCore, { backgroundColor: pointColor }]} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  keypointContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypointGlow: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  keypointCore: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
