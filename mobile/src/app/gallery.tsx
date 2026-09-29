import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSnapFitStore } from '@/store/useSnapFitStore';
import { CapturedPhoto } from '@/types';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 44) / 2;

// Initial sample data if brand new session
const SAMPLE_GALLERY_PHOTOS: CapturedPhoto[] = [
  {
    id: 'sample-photo-1',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    reference_id: 'pin-port-1',
    reference_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    similarity_score: 91,
    created_at: new Date().toISOString(),
    filter_applied: 'vintage_warm',
  },
  {
    id: 'sample-photo-2',
    uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    reference_id: 'pin-ootd-1',
    reference_image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    similarity_score: 87,
    created_at: new Date().toISOString(),
    filter_applied: 'original',
  },
];

export default function GalleryScreen() {
  const router = useRouter();
  const { capturedPhotos, setActiveComparison, selectedReference } = useSnapFitStore();

  const allPhotos =
    capturedPhotos.length > 0 ? capturedPhotos : SAMPLE_GALLERY_PHOTOS;

  const [activeTab, setActiveTab] = useState<'all' | 'high_match'>('all');

  const displayedPhotos =
    activeTab === 'high_match'
      ? allPhotos.filter((p) => (p.similarity_score || 0) >= 88)
      : allPhotos;

  const handleSelectPhoto = (photo: CapturedPhoto) => {
    setActiveComparison(photo, selectedReference);
    router.push('/compare');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bộ Sưu Tập Ảnh</Text>
          <Text style={styles.headerSubtitle}>
            {allPhotos.length} bức ảnh đã chụp cùng trợ lý AI
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newShotBtn}
          onPress={() => router.push('/camera')}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={18} color="#FFFFFF" />
          <Text style={styles.newShotBtnText}>Chụp Mới</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.tabChip, activeTab === 'all' && styles.tabChipActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabChipText,
              activeTab === 'all' && styles.tabChipTextActive,
            ]}
          >
            Tất Cả ({allPhotos.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, activeTab === 'high_match' && styles.tabChipActive]}
          onPress={() => setActiveTab('high_match')}
        >
          <Text
            style={[
              styles.tabChipText,
              activeTab === 'high_match' && styles.tabChipTextActive,
            ]}
          >
            ⭐ Điểm Cao &gt;88%
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photos Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {displayedPhotos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              onPress={() => handleSelectPhoto(photo)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: photo.uri }} style={styles.photoThumb} />

              {/* Match Score Badge */}
              <View style={styles.scoreBadge}>
                <Ionicons name="sparkles" size={12} color="#10B981" />
                <Text style={styles.scoreText}>{photo.similarity_score}% khớp</Text>
              </View>

              <View style={styles.photoOverlayFooter}>
                <Text style={styles.photoDate}>
                  {new Date(photo.created_at).toLocaleDateString('vi-VN')}
                </Text>
                <Ionicons name="git-compare-outline" size={14} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  newShotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newShotBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#6366F1',
  },
  tabChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: '#818CF8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.35,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#161F30',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  scoreBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  photoOverlayFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoDate: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
});
