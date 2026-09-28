import type { AppLocale } from './locales'

// Vietnamese source keys integrate with the existing t(text) API. Product names stay invariant.
const entries: Record<string, string> = {
  'Gói miễn phí': 'Free plan',
  'AezCheck': 'AezCheck',
  'Free': 'Free',
  'Free Plan': 'Free Plan',
  'Dành cho cá nhân / team nhỏ bắt đầu vận hành': 'For individuals / small teams getting started',
  'Trải nghiệm toàn bộ quy trình quản lý và kiểm tra tài sản với các giới hạn phù hợp. Hoàn toàn miễn phí, không giới hạn thời gian.': 'Explore the full asset management and checking workflow with practical limits. Completely free, with no time limit.',
  'Không giới hạn thời gian sử dụng': 'No time limit',
  'Không yêu cầu thẻ thanh toán': 'No payment card required',
  'Đầy đủ tính năng cốt lõi': 'All core features included',
  'Dễ dàng nâng cấp khi cần': 'Easy to upgrade when needed',
  'Bắt đầu trải nghiệm': 'Get started',
  'Free Plan hiện được áp dụng cho toàn bộ người dùng.': 'The Free Plan is currently available to all users.',
  'Giới hạn tài nguyên': 'Resource limits',
  'Workspace': 'Workspace',
  'Thành viên': 'Members',
  'VIA': 'VIA',
  'BM': 'BM',
  'TKQC': 'Ad accounts',
  'Page': 'Pages',
  'Thông tin khác': 'Other details',
  'Fanpage': 'Fanpage',
  '50 Page': '50 Pages',
  'Thời hạn': 'Duration',
  'Vô thời hạn': 'Unlimited',
  'Phù hợp với': 'Ideal for',
  'Cá nhân / team nhỏ': 'Individuals / small teams',
  'Trải nghiệm hệ thống': 'Exploring the platform',
  'Bắt đầu vận hành cơ bản': 'Starting basic operations',
  'AezCheck Free là bước khởi đầu hoàn hảo để bạn khám phá sức mạnh của hệ thống.': 'AezCheck Free is the perfect starting point to explore the power of the platform.',
  'Quản lý thông minh': 'Smart management',
  'Vận hành an toàn': 'Secure operations',
  'Phát triển bền vững': 'Sustainable growth',
}

export const pricingTranslations: Record<string, Record<AppLocale, string>> = Object.fromEntries(
  Object.entries(entries).map(([vi, en]) => [vi, { vi, en }]),
)
