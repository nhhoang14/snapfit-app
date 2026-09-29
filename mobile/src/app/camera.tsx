import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSnapFitStore } from '@/store/useSnapFitStore';
import { SnapFitApi } from '@/services/api';
import { GhostOverlay } from '@/components/camera/GhostOverlay';
import { SkeletonOverlay } from '@/components/camera/SkeletonOverlay';
import { RuleOfThirdsGrid } from '@/components/camera/RuleOfThirdsGrid';
import { GuidanceBanner } from '@/components/camera/GuidanceBanner';
import { CameraControls } from '@/components/camera/CameraControls';
import { CapturedPhoto } from '@/types';

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const {
    selectedReference,
    ghostOpacity,
    setGhostOpacity,
    overlayMode,
    setOverlayMode,
    showGrid,
    toggleGrid,
    cameraFacing,
    toggleCameraFacing,
    alignmentFeedback,
    setAlignmentFeedback,
    addCapturedPhoto,
    setActiveComparison,
  } = useSnapFitStore();

  const [simulatedScore, setSimulatedScore] = useState(alignmentFeedback.overall_score);

  // Periodically evaluate / simulate alignment adjustments
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live AI evaluation drift / feedback
      const score = Math.floor(82 + Math.random() * 12);
      setSimulatedScore(score);

      const tips = [
        'Rất tốt! Cân bằng vai và bấm chụp!',
        'Bố cục chuẩn 1/3! Giữ nguyên vị trí.',
        'Hơi nâng cằm lên một chút.',
        'Tuyệt vời! Đã khớp 88% so với ảnh mẫu.',
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      setAlignmentFeedback({
        overall_score: score,
        pose_score: score + 2,
        composition_score: 92,
        angle_score: 88,
        distance_score: 85,
        primary_guidance: randomTip,
        secondary_guidance: `Độ khớp: ${score}%`,
        is_aligned_well: score >= 80,
        ready_to_snap: score >= 85,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleOpacityCycle = () => {
    if (ghostOpacity >= 0.6) setGhostOpacity(0.15);
    else if (ghostOpacity >= 0.35) setGhostOpacity(0.6);
    else setGhostOpacity(0.35);
  };

  const handleToggleOverlayMode = () => {
    if (overlayMode === 'both') setOverlayMode('ghost');
    else if (overlayMode === 'ghost') setOverlayMode('skeleton');
    else if (overlayMode === 'skeleton') setOverlayMode('none');
    else setOverlayMode('both');
  };

  const handleCapture = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // Haptics fallback
    }

    let photoUri = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080';
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
        if (photo?.uri) photoUri = photo.uri;
      } catch {
        // Fallback photo uri
      }
    }

    const newPhoto: CapturedPhoto = {
      id: `photo-${Date.now()}`,
      uri: photoUri,
      reference_id: selectedReference?.id,
      reference_image_url: selectedReference?.image_url,
      similarity_score: alignmentFeedback.overall_score,
      created_at: new Date().toISOString(),
      filter_applied: 'original',
    };

    addCapturedPhoto(newPhoto);

    // Calculate comparison result
    const comparisonResult = await SnapFitApi.comparePhoto(
      newPhoto.id,
      selectedReference?.id || 'pin-port-1'
    );

    setActiveComparison(newPhoto, selectedReference, comparisonResult);

    // Navigate to comparison / editor
    router.push('/compare');
  };

  const showGhost =
    selectedReference && (overlayMode === 'both' || overlayMode === 'ghost');
  const showSkeleton =
    selectedReference?.pose && (overlayMode === 'both' || overlayMode === 'skeleton');

  return (
    <View style={styles.container}>
      {/* Real CameraView or fallback */}
      {permission?.granted ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
        />
      ) : (
        <View style={styles.simulatedCamera}>
          <View style={styles.simulatedBackdrop} />
          {/* Permission Prompt Banner if not granted */}
          {!permission?.granted && (
            <View style={styles.permissionCard}>
              <Ionicons name="camera" size={32} color="#818CF8" />
              <Text style={styles.permissionTitle}>Cần Quyền Truy Cập Camera</Text>
              <Text style={styles.permissionDesc}>
                Cho phép SnapFit sử dụng camera để hiển thị hướng dẫn tư thế và góc chụp theo thời gian thực.
              </Text>
              <TouchableOpacity
                style={styles.permissionBtn}
                onPress={requestPermission}
                activeOpacity={0.8}
              >
                <Text style={styles.permissionBtnText}>Cấp Quyền Camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* 1. Rule of Thirds Grid */}
      {showGrid && <RuleOfThirdsGrid />}

      {/* 2. Ghost Overlay of Reference Photo */}
      {showGhost && selectedReference && (
        <GhostOverlay imageUrl={selectedReference.image_url} opacity={ghostOpacity} />
      )}

      {/* 3. Skeleton Wireframe Overlay */}
      {showSkeleton && selectedReference?.pose && (
        <SkeletonOverlay
          keypoints={selectedReference.pose.keypoints}
          connections={selectedReference.pose.keypoint_connections}
          isAligned={alignmentFeedback.is_aligned_well}
        />
      )}

      {/* 4. Top Guidance Banner */}
      <GuidanceBanner
        feedback={alignmentFeedback}
        cameraGuidance={selectedReference?.camera_guidance}
      />

      {/* 5. Bottom Controls (Shutter, Flips, Opacity, Thumbnail) */}
      <CameraControls
        onCapture={handleCapture}
        onFlipCamera={toggleCameraFacing}
        onSelectReference={() => router.push('/')}
        referenceThumbnail={selectedReference?.thumbnail_url || selectedReference?.image_url}
        isReadyToSnap={alignmentFeedback.ready_to_snap}
        score={alignmentFeedback.overall_score}
        overlayMode={overlayMode}
        onToggleOverlayMode={handleToggleOverlayMode}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
        ghostOpacity={ghostOpacity}
        onChangeOpacity={handleOpacityCycle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  simulatedCamera: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatedBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B1120',
  },
  permissionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  permissionDesc: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
