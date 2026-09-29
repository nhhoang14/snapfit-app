import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FilterPreset } from '@/types';

const FILTERS: FilterPreset[] = [
  { id: 'original', name: 'Nguyên bản', description: 'Màu gốc camera' },
  { id: 'vintage_warm', name: 'Vintage Ấm', description: 'Tông phim cổ điển' },
  { id: 'clean_portrait', name: 'Trong Trẻo', description: 'Mịn màng tự nhiên' },
  { id: 'cyber_moody', name: 'Điện Ảnh', description: 'Tương phản sâu' },
  { id: 'korean_soft', name: 'Hàn Quốc', description: 'Tone pastel sáng dịu' },
  { id: 'monochrome', name: 'Trắng Đen', description: 'Đen trắng kinh điển' },
];

interface FilterPickerProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
}

export const FilterPicker: React.FC<FilterPickerProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bộ Lọc Tông Màu (Color Grade)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {FILTERS.map((f) => {
          const isSelected = selectedFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => onSelectFilter(f.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterName, isSelected && styles.filterNameActive]}>
                {f.name}
              </Text>
              <Text style={styles.filterDesc}>{f.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  scrollList: {
    gap: 10,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 100,
  },
  filterChipActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  filterName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  filterNameActive: {
    color: '#818CF8',
  },
  filterDesc: {
    color: '#94A3B8',
    fontSize: 10,
  },
});
