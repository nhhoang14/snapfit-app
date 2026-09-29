import { Category, ReferencePhoto, RealtimeAlignmentFeedback, Keypoint, ComparisonResult } from '@/types';
import { MOCK_CATEGORIES, MOCK_REFERENCES } from '@/services/mockData';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const SnapFitApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/pinterest/categories`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return MOCK_CATEGORIES;
  },

  async searchReferences(query: string = '', category?: string): Promise<ReferencePhoto[]> {
    try {
      const url = new URL(`${API_BASE_URL}/pinterest/search`);
      if (query) url.searchParams.append('q', query);
      if (category && category !== 'all') url.searchParams.append('category', category);

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        return data.items || [];
      }
    } catch {
      // Fallback
    }

    let filtered = MOCK_REFERENCES;
    if (category && category !== 'all') {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      );
    }
    return filtered.length > 0 ? filtered : MOCK_REFERENCES;
  },

  async getReferenceAnalysis(referenceId: string): Promise<ReferencePhoto | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/reference/${referenceId}`, {
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const found = MOCK_REFERENCES.find((r) => r.id === referenceId);
    return found || MOCK_REFERENCES[0];
  },

  async evaluateLiveAlignment(
    referenceId: string,
    currentKeypoints: Keypoint[],
    pitch: number = 0,
    roll: number = 0
  ): Promise<RealtimeAlignmentFeedback> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/live-alignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_id: referenceId,
          current_keypoints: currentKeypoints,
          device_pitch: pitch,
          device_roll: roll,
        }),
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Client-side simulated feedback
    return {
      overall_score: 86,
      pose_score: 88,
      composition_score: 90,
      angle_score: 85,
      distance_score: 82,
      primary_guidance: 'Rất tốt! Cân bằng vai và bấm chụp!',
      secondary_guidance: 'Độ tương thích: 86%',
      is_aligned_well: true,
      ready_to_snap: true,
    };
  },

  async comparePhoto(capturedId: string, refId: string): Promise<ComparisonResult> {
    try {
      const formData = new FormData();
      formData.append('captured_photo_id', capturedId);
      formData.append('reference_id', refId);

      const res = await fetch(`${API_BASE_URL}/photos/compare`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      captured_photo_id: capturedId,
      reference_id: refId,
      overall_match_percentage: 89,
      pose_match_score: 91,
      composition_match_score: 93,
      color_palette_similarity: 82,
      lighting_similarity: 86,
      feedback_notes: [
        'Bức ảnh đạt độ tương thích 89% so với ảnh mẫu!',
        'Đường nét cơ thể và hướng nhìn rất đồng điệu.',
      ],
      positive_highlights: [
        'Bố cục 93%: Khớp xuất sắc với đường giao điểm vàng 1/3.',
        'Tư thế 91%: Độ nghiêng cằm và vai tôn lên nét tự nhiên.',
      ],
      improvement_tips: [
        'Lần tới bạn có thể hạ nhẹ độ sáng xung quanh để chủ thể nổi bật hơn.',
      ],
    };
  },
};
