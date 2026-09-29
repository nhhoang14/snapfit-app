import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonResult } from '@/types';

interface ScoreBreakdownCardProps {
  result: ComparisonResult;
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({ result }) => {
  return (
    <View style={styles.card}>
      {/* Top Header with Overall Score */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Đánh Giá Khớp Reference</Text>
          <Text style={styles.subtitle}>Phân tích bởi SnapFit AI Vision</Text>
        </View>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{result.overall_match_percentage}%</Text>
          <Text style={styles.scoreLabel}>Độ khớp</Text>
        </View>
      </View>

      {/* Progress Bars for Detailed Metrics */}
      <View style={styles.metricsContainer}>
        <MetricBar label="Tư thế (Pose)" score={result.pose_match_score} color="#10B981" />
        <MetricBar label="Bố cục (Composition)" score={result.composition_match_score} color="#6366F1" />
        <MetricBar label="Ánh sáng (Lighting)" score={result.lighting_similarity} color="#F59E0B" />
        <MetricBar label="Màu sắc (Colors)" score={result.color_palette_similarity} color="#EC4899" />
      </View>

      {/* Positive Highlights */}
      {result.positive_highlights && result.positive_highlights.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={16} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: '#10B981' }]}>Điểm Nổi Bật</Text>
          </View>
          {result.positive_highlights.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Improvement Tips */}
      {result.improvement_tips && result.improvement_tips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: '#F59E0B' }]}>Mẹo Cải Thiện Thêm</Text>
          </View>
          {result.improvement_tips.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const MetricBar: React.FC<{ label: string; score: number; color: string }> = ({
  label,
  score,
  color,
}) => (
  <View style={styles.metricRow}>
    <View style={styles.metricLabelRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricScore}>{score}%</Text>
    </View>
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${score}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  scoreLabel: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '600',
  },
  metricsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  metricRow: {
    gap: 6,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  metricScore: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  barTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  section: {
    marginTop: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 14,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  bulletDot: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 18,
  },
  bulletText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
