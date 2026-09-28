import { useLanguage } from './LanguageContext'

const labels = {
  vi: { toc: 'Nội dung hướng dẫn', search: 'Tìm trong hướng dẫn', placeholder: 'Tìm trong hướng dẫn...', empty: 'Không tìm thấy mục phù hợp.', toggle: 'Mở/thu gọn', tip: 'Mẹo', zoom: 'Phóng to', image: 'Xem ảnh hướng dẫn', close: 'Đóng ảnh' },
  en: { toc: 'Guide contents', search: 'Search the guide', placeholder: 'Search the guide...', empty: 'No matching sections found.', toggle: 'Expand/collapse', tip: 'Tip', zoom: 'Enlarge', image: 'View guide image', close: 'Close image' },
}
export const useGuideLabels = () => labels[useLanguage().locale === 'vi' ? 'vi' : 'en']
