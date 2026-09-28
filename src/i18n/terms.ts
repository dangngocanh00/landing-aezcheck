import type { AppLocale } from './locales'

type TermsSection = { title: string; body: string }
type TermsCopy = {
  introTitle: string; intro: string; contents: string; sections: TermsSection[]
  limits: string; privacyLink: string; contactLink: string; ctaTitle: string; ctaBody: string
}

// Based on the detailed content instructions supplied by the owner.
// VI reference was unavailable; its indexed EN version confirmed the topic order:
// https://nolimitadsmanager.com/en/terms
// No unverified payment, refund or liability-cap policy is added.
export const termsCopy: Record<AppLocale, TermsCopy> = {
  vi: {
    introTitle: 'Giới thiệu', contents: 'Nội dung điều khoản',
    intro: 'Điều khoản này quy định việc truy cập và sử dụng nền tảng AezCheck, workspace AezCheck cùng các sản phẩm, dịch vụ liên quan. Khi sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu sử dụng thay mặt một tổ chức, bạn cần có thẩm quyền phù hợp để đại diện cho tổ chức đó.',
    sections: [
      { title: 'Phạm vi dịch vụ', body: 'AezCheck hỗ trợ quản lý và kiểm tra VIA, BM, TKQC, Fanpage, Campaign và Ads; quản lý khách hàng, tài chính và chi tiêu; quản lý nhân sự, phân quyền, audit log, cảnh báo, giám sát, báo cáo và phân tích. Shield / Tường lửa bảo vệ hỗ trợ kiểm soát rủi ro vận hành. Khả năng cung cấp từng tính năng phụ thuộc vào quyền truy cập, giới hạn gói dịch vụ và các nền tảng được kết nối; công cụ giám sát không bảo đảm loại bỏ mọi rủi ro.' },
      { title: 'Tài khoản và workspace', body: 'Bạn cần cung cấp thông tin tài khoản chính xác và bảo vệ thông tin đăng nhập. Chủ workspace chịu trách nhiệm quản lý thành viên, cấp hoặc thu hồi quyền phù hợp và kiểm soát tài sản được kết nối. Bạn chịu trách nhiệm đối với hoạt động thực hiện từ phiên đăng nhập hợp lệ thuộc quyền quản lý của mình và cần thông báo khi phát hiện truy cập trái phép. AezCheck có thể yêu cầu xác minh thêm trước khi thực hiện thao tác nhạy cảm.' },
      { title: 'Sử dụng hợp lệ', body: 'Bạn phải sử dụng AezCheck hợp pháp, tuân thủ pháp luật và chính sách của Meta cùng các nền tảng liên quan. Không sử dụng dịch vụ để gian lận, lách kiểm duyệt, dò quét hoặc khai thác lỗ hổng, reverse engineer trái phép hay chia sẻ quyền truy cập ngoài cơ chế phân quyền được cho phép. AezCheck có quyền tạm ngừng quyền truy cập khi phát hiện hành vi vi phạm.' },
      { title: 'Sở hữu trí tuệ và dữ liệu', body: 'Giao diện, mã nguồn, thương hiệu, tài liệu, mô hình dữ liệu và công nghệ của nền tảng thuộc AezCheck hoặc bên cấp phép. Dữ liệu vận hành do khách hàng đưa vào vẫn thuộc khách hàng; việc sử dụng dịch vụ không chuyển quyền sở hữu dữ liệu đó cho AezCheck. AezCheck xử lý dữ liệu để cung cấp, vận hành, cải thiện dịch vụ, bảo đảm an toàn và tuân thủ pháp luật. Nếu sử dụng dữ liệu tổng hợp, dữ liệu phải được xử lý theo cách phù hợp, ẩn danh và không làm lộ thông tin nhận diện khách hàng.' },
      { title: 'Gói dịch vụ / thanh toán', body: 'Free Plan hiện áp dụng cho người dùng AezCheck với thời hạn sử dụng vô thời hạn và các giới hạn tài nguyên bên dưới. AezCheck có thể điều chỉnh giới hạn hoặc bổ sung gói trả phí trong tương lai; thay đổi quan trọng sẽ được công bố hoặc thông báo phù hợp. Nếu bạn đăng ký gói trả phí sau này, các điều khoản thanh toán riêng được cung cấp cho gói đó sẽ áp dụng.' },
      { title: 'Quyền riêng tư', body: 'Việc xử lý và bảo vệ dữ liệu cá nhân liên quan đến dịch vụ được trình bày trong Chính sách bảo mật AezCheck. Bạn cần có quyền và căn cứ hợp pháp đối với dữ liệu cung cấp hoặc kết nối, đồng thời bảo đảm việc cấp quyền truy cập phù hợp với các nghĩa vụ bảo vệ dữ liệu của mình.' },
      { title: 'Giới hạn trách nhiệm', body: 'AezCheck cung cấp dịch vụ trên cơ sở nỗ lực hợp lý, nhưng dịch vụ có thể gặp lỗi hoặc gián đoạn. Một phần hoạt động phụ thuộc Meta và bên thứ ba; AezCheck không kiểm soát quyết định khóa hoặc hạn chế tài khoản, thay đổi API hay chính sách của Meta. Trong phạm vi pháp luật cho phép, AezCheck không chịu trách nhiệm đối với thiệt hại gián tiếp phát sinh từ hành vi của bên thứ ba hoặc việc sử dụng trái Điều khoản. Điều này không loại trừ trách nhiệm mà pháp luật không cho phép loại trừ.' },
      { title: 'Tạm ngừng và chấm dứt', body: 'AezCheck có thể tạm ngừng hoặc chấm dứt quyền sử dụng khi có vi phạm Điều khoản, hoạt động bất hợp pháp hoặc gian lận, rủi ro bảo mật, vi phạm chính sách nền tảng bên thứ ba hoặc yêu cầu hợp pháp của cơ quan có thẩm quyền. Biện pháp xử lý sẽ được áp dụng phù hợp với tính chất sự việc và nghĩa vụ pháp luật liên quan.' },
      { title: 'Thay đổi điều khoản', body: 'Điều khoản có thể được cập nhật khi sản phẩm, pháp luật hoặc thực tiễn vận hành thay đổi. AezCheck sẽ thông báo các thay đổi quan trọng qua email, thông báo trong hệ thống hoặc website. Bạn nên kiểm tra phiên bản được công bố để nắm được các điều kiện sử dụng đang áp dụng.' },
      { title: 'Luật áp dụng và giải quyết tranh chấp', body: 'Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Các bên ưu tiên giải quyết bất đồng thông qua thương lượng hoặc hòa giải. Nếu không đạt được thỏa thuận, tranh chấp được đưa đến cơ quan hoặc tòa án có thẩm quyền tại Việt Nam theo quy định pháp luật.' },
      { title: 'Thông tin liên hệ', body: 'Nếu có câu hỏi về Điều khoản hoặc việc sử dụng dịch vụ, hãy liên hệ AezCheck qua mục Liên hệ hiện có trên website.' },
    ],
    limits: '1 Workspace · 2 thành viên · 3 VIA · 5 BM · 75 TKQC · 50 Page — Thời hạn: vô thời hạn.',
    privacyLink: 'Chính sách bảo mật AezCheck', contactLink: 'Liên hệ AezCheck',
    ctaTitle: 'Cần điều khoản riêng cho tổ chức của bạn?',
    ctaBody: 'Nếu tổ chức của bạn cần các điều khoản vận hành, bảo mật hoặc cam kết dịch vụ riêng, hãy liên hệ AezCheck để trao đổi.',
  },
  en: {
    introTitle: 'Introduction', contents: 'Terms contents',
    intro: 'These Terms govern access to and use of the AezCheck platform, AezCheck workspaces and related products and services. By using the services, you agree to comply with these Terms. If you act for an organization, you must have appropriate authority to represent it.',
    sections: [
      { title: 'Scope of services', body: 'AezCheck supports management and checks for VIA, BM, ad accounts, Fanpages, Campaigns and Ads; customer management, finance and spending; team administration, permissions, audit logs, alerts, monitoring, reporting and analytics. Shield / Firewall protection supports operational risk controls. Feature availability depends on access permissions, plan limits and connected platforms; monitoring tools do not guarantee the elimination of every risk.' },
      { title: 'Accounts and workspaces', body: 'You must provide accurate account information and protect your credentials. Workspace owners manage members, grant or revoke appropriate permissions and control connected assets. You are responsible for activity from valid login sessions under your control and should report unauthorized access. AezCheck may require additional verification for sensitive actions.' },
      { title: 'Acceptable use', body: 'Use AezCheck lawfully and comply with applicable laws and the policies of Meta and other connected platforms. Fraud, evading moderation, unauthorized vulnerability scanning or exploitation, unauthorized reverse engineering and sharing access outside the permitted authorization mechanisms are prohibited. AezCheck may suspend access when violations are detected.' },
      { title: 'Intellectual property and data', body: 'The platform interface, source code, brands, documentation, data models and technology belong to AezCheck or its licensors. Operational data supplied by customers remains theirs; using the service does not transfer its ownership to AezCheck. AezCheck processes data to provide, operate and improve services, maintain security and comply with law. Any use of aggregated data must be appropriate and anonymized without exposing customer-identifying information.' },
      { title: 'Service plans / payments', body: 'The Free Plan currently applies to AezCheck users with no time limit and the resource limits below. AezCheck may revise these limits or introduce paid plans in the future; material changes will be published or communicated appropriately. If you later subscribe to a paid plan, the separate payment terms supplied for that plan will apply.' },
      { title: 'Privacy', body: 'The AezCheck Privacy Policy describes the processing and protection of personal data associated with the service. You must have the rights and lawful basis needed for data you supply or connect, and ensure access permissions comply with your data protection obligations.' },
      { title: 'Limitation of liability', body: 'AezCheck provides services using reasonable efforts, but errors or interruptions may occur. Operations partly depend on Meta and third parties; AezCheck does not control account suspensions or restrictions, API changes or Meta policies. To the extent permitted by law, AezCheck is not liable for indirect loss arising from third-party conduct or use contrary to these Terms. This does not exclude liability that cannot lawfully be excluded.' },
      { title: 'Suspension and termination', body: 'AezCheck may suspend or terminate access for breaches of these Terms, unlawful or fraudulent activity, security risks, violations of third-party platform policies or lawful requests from competent authorities. Measures will reflect the circumstances and applicable legal obligations.' },
      { title: 'Changes to the Terms', body: 'These Terms may be updated as the product, law or operational practices change. AezCheck will communicate material changes by email, in-product notice or the website. Please review the published version to understand the conditions currently applicable.' },
      { title: 'Governing law and dispute resolution', body: 'These Terms are governed by Vietnamese law. The parties will prioritize negotiation or mediation to resolve disagreements. Unresolved disputes will be submitted to a competent authority or court in Vietnam in accordance with applicable law.' },
      { title: 'Contact information', body: 'For questions about these Terms or use of the service, contact AezCheck through the existing Contact section of the website.' },
    ],
    limits: '1 Workspace · 2 members · 3 VIA · 5 BM · 75 ad accounts · 50 Pages — Duration: unlimited.',
    privacyLink: 'AezCheck Privacy Policy', contactLink: 'Contact AezCheck',
    ctaTitle: 'Need tailored terms for your organization?',
    ctaBody: 'If your organization needs specific operational, security or service commitments, contact AezCheck to discuss your requirements.',
  },
}
