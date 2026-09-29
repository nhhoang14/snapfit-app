import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OverlayMode } from '@/store/useSnapFitStore';

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onSelectReference: () => void;
  referenceThumbnail?: string;
  isReadyToSnap: boolean;
  score: number;
  overlayMode: OverlayMode;
  onToggleOverlayMode: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  ghostOpacity: number;
  onChangeOpacity: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlipCamera,
  onSelectReference,
  referenceThumbnail,
  isReadyToSnap,
  score,
  overlayMode,
  onToggleOverlayMode,
  showGrid,
  onToggleGrid,
  ghostOpacity,
  onChangeOpacity,
}) => {
  const shutterGlowColor = isReadyToSnap
    ? '#10B981'
    : score >= 60
    ? '#F59E0B'
    : '#6366F1';

  return (
    <View style={styles.container}>
      {/* Top Floating Mini Controls */}
      <View style={styles.topToolbar}>
        {/* Opacity Cycle */}
        <TouchableOpacity style={styles.toolBtn} onPress={onChangeOpacity} activeOpacity={0.7}>
          <Ionicons name="color-filter-outline" size={20} color="#FFFFFF" />
          <Text style={styles.toolLabel}>{Math.round(ghostOpacity * 100)}%</Text>
        </TouchableOpacity>

        {/* Overlay Mode Switcher */}
        <TouchableOpacity style={styles.toolBtn} onPress={onToggleOverlayMode} activeOpacity={0.7}>
          <Ionicons name="layers-outline" size={20} color="#FFFFFF" />
          <Text style={styles.toolLabel}>
            {overlayMode === 'both' ? 'Tất cả' : overlayMode === 'ghost' ? 'Bóng mờ' : overlayMode === 'skeleton' ? 'Khung xương' : 'Tắt'}
          </Text>
        </TouchableOpacity>

        {/* Grid Toggle */}
        <TouchableOpacity
          style={[styles.toolBtn, showGrid && styles.toolBtnActive]}
          onPress={onToggleGrid}
          activeOpacity={0.7}
        >
          <Ionicons name="grid-outline" size={20} color={showGrid ? '#6366F1' : '#FFFFFF'} />
          <Text style={[styles.toolLabel, showGrid && styles.toolLabelActive]}>Lưới</Text>
        </TouchableOpacity>
      </View>

      {/* Main Shutter Bar */}
      <View style={styles.shutterRow}>
        {/* Left: Reference thumbnail or pick button */}
        <TouchableOpacity
          style={styles.referenceBtn}
          onPress={onSelectReference}
          activeOpacity={0.8}
        >
          {referenceThumbnail ? (
            <Image source={{ uri: referenceThumbnail }} style={styles.referenceThumb} />
          ) : (
            <Ionicons name="images-outline" size={24} color="#FFFFFF" />
          )}
          <View style={styles.refBadge}>
            <Text style={styles.refBadgeText}>Mẫu</Text>
          </View>
        </TouchableOpacity>

        {/* Center: Glowing Shutter Button */}
        <TouchableOpacity
          style={[
            styles.shutterOuterRing,
            { borderColor: shutterGlowColor, shadowColor: shutterGlowColor },
          ]}
          onPress={onCapture}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.shutterInnerCore,
              { backgroundColor: isReadyToSnap ? '#10B981' : '#FFFFFF' },
            ]}
          />
        </TouchableOpacity>

        {/* Right: Flip Camera */}
        <TouchableOpacity style={styles.flipBtn} onPress={onFlipCamera} activeOpacity={0.75}>
          <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toolBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: '#6366F1',
  },
  toolLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  toolLabelActive: {
    color: '#818CF8',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  referenceBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  referenceThumb: {
    width: '100%',
    height: '100%',
  },
  refBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  refBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  shutterOuterRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 10,
  },
  shutterInnerCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  flipBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
