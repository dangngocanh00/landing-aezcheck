type Copy = readonly [string, string]
export type MockCell = string | { label: Copy; tone?: 'success' | 'warning' | 'danger' | 'neutral' }
export type AdMockRow = { name: string; id: string; cells: MockCell[] }
type AdMockTab = { label: Copy; columns: Copy[]; rows: AdMockRow[] }
const active: MockCell = { label: ['Hoạt động', 'Active'], tone: 'success' }
const paused: MockCell = { label: ['Tạm dừng', 'Paused'], tone: 'neutral' }
const delivering: MockCell = { label: ['Đang phân phối', 'Delivering'], tone: 'success' }
const learning: MockCell = { label: ['Đang học', 'Learning'], tone: 'warning' }
const business: MockCell = { label: ['Doanh nghiệp', 'Business'] }
const synced: MockCell = { label: ['Hoàn tất', 'Complete'], tone: 'success' }
const account: Copy = ['Tài khoản quảng cáo', 'Ad account']
const campaign: Copy = ['Chiến dịch', 'Campaign']
const status: Copy = ['Trạng thái', 'Status']
const delivery: Copy = ['Phân phối', 'Delivery']
const budget: Copy = ['Ngân sách', 'Budget']

// Fictional landing examples only. DEMO IDs are intentionally not platform IDs.
export const adMockTabs: AdMockTab[] = [
  { label: ['Tài khoản quảng cáo', 'Ad accounts'], columns: [account, ['Trạng thái tài khoản', 'Account status'], ['Loại tài khoản', 'Account type'], ['Đơn vị tiền tệ', 'Currency'], ['Trạng thái đồng bộ', 'Sync status'], ['Quốc gia', 'Country']], rows: [
    { name: 'Cedar Studio Ads', id: 'DEMO-AC01', cells: [active, business, 'USD', synced, 'US'] },
    { name: 'Lumen Market VN', id: 'DEMO-AC02', cells: [active, business, 'VND', { label: ['Đã đồng bộ gần đây', 'Recently synced'], tone: 'success' }, 'VN'] },
    { name: 'Harbor Discovery', id: 'DEMO-AC03', cells: [{ label: ['Cảnh báo', 'Warning'], tone: 'warning' }, { label: ['Cá nhân', 'Personal'] }, 'USD', { label: ['Cần kiểm tra', 'Review needed'], tone: 'warning' }, 'SG'] },
    { name: 'Willow Retail EU', id: 'DEMO-AC04', cells: [active, business, 'EUR', synced, 'DE'] },
    { name: 'Pebble Creative AU', id: 'DEMO-AC05', cells: [{ label: ['Vô hiệu hóa', 'Disabled'], tone: 'danger' }, { label: ['Cá nhân', 'Personal'] }, 'USD', { label: ['Cần kiểm tra', 'Review needed'], tone: 'warning' }, 'AU'] },
  ] },
  { label: ['Chiến dịch', 'Campaigns'], columns: [campaign, account, status, delivery, ['Chiến lược giá thầu', 'Bid strategy'], budget], rows: [
    { name: 'Cedar Launch Leads', id: 'DEMO-CP01', cells: ['Cedar Studio Ads', active, delivering, 'Lowest Cost', '$640'] },
    { name: 'Lumen Returning Buyers', id: 'DEMO-CP02', cells: ['Lumen Market VN', active, learning, 'Cost Cap', '₫4.800.000'] },
    { name: 'Harbor Brand Stories', id: 'DEMO-CP03', cells: ['Harbor Discovery', paused, { label: ['Không hoạt động', 'Inactive'], tone: 'neutral' }, 'Bid Cap', '$920'] },
    { name: 'Willow Collection Launch', id: 'DEMO-CP04', cells: ['Willow Retail EU', active, delivering, 'Lowest Cost', '€760'] },
    { name: 'Pebble Creative Trial', id: 'DEMO-CP05', cells: ['Pebble Creative AU', paused, { label: ['Không hoạt động', 'Inactive'], tone: 'neutral' }, 'Cost Cap', '$380'] },
  ] },
  { label: ['Nhóm quảng cáo', 'Ad sets'], columns: [['Nhóm quảng cáo', 'Ad set'], campaign, account, status, delivery, budget], rows: [
    { name: 'Broad Discovery 25–44', id: 'DEMO-AS01', cells: ['Cedar Launch Leads', 'Cedar Studio Ads', active, delivering, '$210'] },
    { name: 'Returning Visitors 14D', id: 'DEMO-AS02', cells: ['Lumen Returning Buyers', 'Lumen Market VN', active, delivering, '₫1.600.000'] },
    { name: 'Similar Shoppers 2%', id: 'DEMO-AS03', cells: ['Willow Collection Launch', 'Willow Retail EU', active, learning, '€240'] },
    { name: 'Creative Interest Group', id: 'DEMO-AS04', cells: ['Harbor Brand Stories', 'Harbor Discovery', active, { label: ['Học giới hạn', 'Learning limited'], tone: 'warning' }, '$180'] },
    { name: 'Engaged Viewers 7D', id: 'DEMO-AS05', cells: ['Pebble Creative Trial', 'Pebble Creative AU', paused, { label: ['Không hoạt động', 'Inactive'], tone: 'neutral' }, '$140'] },
  ] },
  { label: ['Quảng cáo', 'Ads'], columns: [['Quảng cáo', 'Ad'], campaign, account, status, delivery, ['Mục tiêu', 'Objective']], rows: [
    { name: 'Creator Story Cut 03', id: 'DEMO-AD01', cells: ['Cedar Launch Leads', 'Cedar Studio Ads', active, delivering, 'Leads'] },
    { name: 'Weekend Product Still', id: 'DEMO-AD02', cells: ['Lumen Returning Buyers', 'Lumen Market VN', active, learning, 'Sales'] },
    { name: 'Collection Carousel', id: 'DEMO-AD03', cells: ['Willow Collection Launch', 'Willow Retail EU', active, delivering, 'Traffic'] },
    { name: 'Behind The Brand 15s', id: 'DEMO-AD04', cells: ['Harbor Brand Stories', 'Harbor Discovery', paused, { label: ['Giới hạn', 'Limited'], tone: 'warning' }, 'Awareness'] },
    { name: 'Community Story Variant', id: 'DEMO-AD05', cells: ['Pebble Creative Trial', 'Pebble Creative AU', active, learning, 'Engagement'] },
  ] },
  { label: ['Bài viết', 'Posts'], columns: [['Bài viết', 'Post'], status, ['Tương tác với trang', 'Page engagement'], ['Cảm xúc về bài viết', 'Post reactions'], ['Bình luận về bài viết', 'Comments'], ['Số lượt lưu bài viết', 'Saves'], ['Số lượt chia sẻ bài viết', 'Shares'], ['Số lượt click vào liên kết', 'Link clicks']], rows: [
    { name: 'Video giới thiệu sản phẩm mới', id: 'POST_1048', cells: [{ label: ['Đang hoạt động', 'Active'], tone: 'success' }, '1,284', '742', '96', '184', '63', '421'] },
    { name: 'Ưu đãi cuối tuần - Giảm 20%', id: 'POST_1182', cells: [{ label: ['Đang hoạt động', 'Active'], tone: 'success' }, '2,041', '1,126', '132', '247', '88', '638'] },
    { name: 'Case study khách hàng tháng 9', id: 'POST_1215', cells: [{ label: ['Đang hoạt động', 'Active'], tone: 'success' }, '936', '511', '54', '121', '37', '284'] },
    { name: 'Behind the scenes - Team AezCheck', id: 'POST_1337', cells: [{ label: ['Tạm dừng', 'Paused'], tone: 'warning' }, '684', '389', '43', '78', '21', '173'] },
    { name: 'Hướng dẫn tối ưu quảng cáo', id: 'POST_1406', cells: [{ label: ['Đang hoạt động', 'Active'], tone: 'success' }, '1,562', '901', '118', '206', '74', '512'] },
    { name: 'Thông báo cập nhật tính năng', id: 'POST_1520', cells: [{ label: ['Đã kết thúc', 'Ended'], tone: 'neutral' }, '753', '428', '61', '92', '29', '196'] },
  ] },
]

export const postsFooterCopy: Copy = ['Hiển thị 1–6 trên tổng số 42 bài viết', 'Showing 1–6 of 42 posts']
