import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RealtimeAlignmentFeedback, CameraGuidance } from '@/types';

interface GuidanceBannerProps {
  feedback: RealtimeAlignmentFeedback;
  cameraGuidance?: CameraGuidance;
}

export const GuidanceBanner: React.FC<GuidanceBannerProps> = ({
  feedback,
  cameraGuidance,
}) => {
  const isHighMatch = feedback.overall_score >= 80;
  const isMediumMatch = feedback.overall_score >= 60 && feedback.overall_score < 80;

  const scoreBadgeColor = isHighMatch
    ? '#10B981'
    : isMediumMatch
    ? '#F59E0B'
    : '#EF4444';

  const iconName = isHighMatch
    ? 'checkmark-circle'
    : isMediumMatch
    ? 'sparkles'
    : 'information-circle';

  return (
    <View style={styles.container}>
      {/* Floating glass pill */}
      <View style={styles.glassCard}>
        <View style={styles.headerRow}>
          <View style={styles.indicatorGroup}>
            <Ionicons name={iconName} size={18} color={scoreBadgeColor} />
            <Text style={styles.headerTitle}>HƯỚNG DẪN AI REALTIME</Text>
          </View>

          {/* Alignment score badge */}
          <View style={[styles.scoreBadge, { backgroundColor: scoreBadgeColor }]}>
            <Text style={styles.scoreText}>{feedback.overall_score}%</Text>
          </View>
        </View>

        {/* Primary Action Guidance */}
        <Text style={styles.guidanceText}>{feedback.primary_guidance}</Text>

        {/* Camera specs hint pill */}
        {cameraGuidance && (
          <View style={styles.specsRow}>
            <View style={styles.specTag}>
              <Ionicons name="camera-reverse-outline" size={12} color="#A0AEC0" />
              <Text style={styles.specTagText}>{cameraGuidance.focal_length_hint}</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="resize-outline" size={12} color="#A0AEC0" />
              <Text style={styles.specTagText}>~{cameraGuidance.recommended_distance_meters}m</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  indicatorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  guidanceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  specTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specTagText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
});
