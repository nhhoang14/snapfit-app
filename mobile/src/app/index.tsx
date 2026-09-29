import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSnapFitStore } from '@/store/useSnapFitStore';
import { SnapFitApi } from '@/services/api';
import { Category, ReferencePhoto } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export default function InspirationScreen() {
  const router = useRouter();
  const { setSelectedReference, selectedReference } = useSnapFitStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<ReferencePhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewRef, setPreviewRef] = useState<ReferencePhoto | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    const cats = await SnapFitApi.getCategories();
    setCategories(cats);

    const refs = await SnapFitApi.searchReferences(searchQuery, selectedCategory);
    setReferences(refs);
  };

  const handleSearch = async () => {
    const refs = await SnapFitApi.searchReferences(searchQuery, selectedCategory);
    setReferences(refs);
  };

  const handleStartWithRef = (ref: ReferencePhoto) => {
    setSelectedReference(ref);
    setPreviewRef(null);
    router.push('/camera');
  };

  const handleShootFreely = () => {
    setSelectedReference(null);
    router.push('/camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.brandName}>SnapFit</Text>
            <View style={styles.aiPill}>
              <Text style={styles.aiPillText}>AI Vision</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Tìm cảm hứng & Hướng dẫn chụp ảnh chuẩn mẫu</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Shoot Action Banner */}
        <TouchableOpacity
          style={styles.freeShootBanner}
          onPress={handleShootFreely}
          activeOpacity={0.85}
        >
          <View style={styles.freeShootContent}>
            <View style={styles.freeShootIcon}>
              <Ionicons name="camera-outline" size={24} color="#818CF8" />
            </View>
            <View style={styles.freeShootTextGroup}>
              <Text style={styles.freeShootTitle}>Chụp Tự Do Không Cần Mẫu</Text>
              <Text style={styles.freeShootDesc}>
                Sử dụng camera AI với đường lưới 1/3 và thước đo thăng bằng
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo kiểu ảnh (ví dụ: chân dung, OOTD...)"
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); loadData(); }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Horizontal Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chuyên Mục Ảnh</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === 'all' && styles.categoryChipTextActive,
              ]}
            >
              ✨ Tất cả
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* References Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ảnh Tham Khảo Nổi Bật</Text>
          <Text style={styles.sectionCount}>{references.length} mẫu</Text>
        </View>

        <View style={styles.gridContainer}>
          {references.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => setPreviewRef(item)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.thumbnail_url || item.image_url }} style={styles.cardImage} />

              {/* Tag pill */}
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>
                  {item.category.toUpperCase()}
                </Text>
              </View>

              {/* Card Footer Info */}
              <View style={styles.cardFooter}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.camera_guidance && (
                  <View style={styles.cardDistanceRow}>
                    <Ionicons name="locate-outline" size={12} color="#94A3B8" />
                    <Text style={styles.cardDistanceText}>
                      ~{item.camera_guidance.recommended_distance_meters}m • {item.camera_guidance.angle_type}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* AI Analysis Preview Modal */}
      {previewRef && (
        <Modal
          visible={!!previewRef}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setPreviewRef(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chi Tiết Phân Tích AI</Text>
                <TouchableOpacity onPress={() => setPreviewRef(null)}>
                  <Ionicons name="close" size={24} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: previewRef.image_url }} style={styles.modalImage} />

                <Text style={styles.modalRefTitle}>{previewRef.title}</Text>
                <Text style={styles.modalRefDesc}>{previewRef.description}</Text>

                {/* Specs breakdown */}
                <View style={styles.specsGrid}>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Khoảng cách</Text>
                    <Text style={styles.specValue}>
                      ~{previewRef.camera_guidance?.recommended_distance_meters || 1.8}m
                    </Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Góc máy</Text>
                    <Text style={styles.specValue}>
                      {previewRef.camera_guidance?.angle_type || 'Ngang tầm mắt'}
                    </Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Ống kính gợi ý</Text>
                    <Text style={styles.specValue}>
                      {previewRef.camera_guidance?.focal_length_hint || '1x'}
                    </Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Ánh sáng</Text>
                    <Text style={styles.specValue}>
                      {previewRef.lighting?.tone_mood || 'Tự nhiên'}
                    </Text>
                  </View>
                </View>

                {/* Tips */}
                {previewRef.suggested_tips && previewRef.suggested_tips.length > 0 && (
                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsHeader}>💡 Lời khuyên tạo dáng:</Text>
                    {previewRef.suggested_tips.map((tip, i) => (
                      <Text key={i} style={styles.tipText}>
                        • {tip}
                      </Text>
                    ))}
                  </View>
                )}
              </ScrollView>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.selectBtn}
                onPress={() => handleStartWithRef(previewRef)}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" />
                <Text style={styles.selectBtnText}>Chọn Mẫu Này & Mở Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  aiPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  aiPillText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  freeShootBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  freeShootContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  freeShootIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeShootTextGroup: {
    flex: 1,
  },
  freeShootTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  freeShootDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161F30',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionCount: {
    color: '#64748B',
    fontSize: 12,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  categoryChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#161F30',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardImage: {
    width: '100%',
    height: 190,
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    padding: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDistanceText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 14,
  },
  modalRefTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalRefDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  specBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
  },
  specLabel: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 4,
  },
  specValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  tipsHeader: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  tipText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 2,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
