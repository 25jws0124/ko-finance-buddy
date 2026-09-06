// lib/i18n.js
// 라이브러리 없이 단순 객체. 번역 제외 항목:
//  - evidence(문서 원문 인용)  - 출처의 기관명·문서명  - required_docs 의 서류 이름
// 서류 이름은 창구에서 그대로 보여줘야 하므로 한국어를 유지하고 괄호로 병기한다.

export const LANGS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
];

export const STRINGS = {
  ko: {
    appName: 'KO-Finance Buddy',
    langAria: '언어 선택',

    trustLine1: (rv, rt, date) => `규칙 DB ${rv}/${rt}건 공식근거 검증 · 확인일 ${date}`,
    trustLine2: '근거가 없으면 답하지 않습니다',

    mySituation: '내 상황',
    heroEmptyTitle: '두 가지만 고르면\n바로 알려드려요',
    heroEmptySub: '체류자격과 금융업무를 고르세요.',
    heroHalfSub: '하나만 더 고르면 됩니다.',
    heroFullSub: '이 조합의 규칙은 공식 출처로 대조되어 있어요.',
    stepOf: (n) => `2단계 중 ${n}단계`,

    step1: '1. 체류자격을 고르세요',
    step2: '2. 무엇을 하려고 하세요?',
    privacyFoot: '계좌번호·여권번호는 묻지 않아요. 고른 내용은 기기에만 남습니다.',

    visa: {
      'D-2': { title: 'D-2 유학생', sub: '대학·대학원 재학' },
      'E-9': { title: 'E-9 비전문취업', sub: '고용허가제 근로' },
    },
    task: {
      account_open: '계좌 만들기',
      salary_account: '급여·알바비 받을 계좌',
      limit_release: '이체한도 풀기',
      overseas_remit: '본국으로 송금하기',
    },

    quick: '자주 쓰는 기능',
    quickDoc: '문서 사진으로\n이해하기',
    quickPrep: '준비물\n체크리스트',
    quickScam: '이 상황의\n사기 주의보',
    quickSrc: '출처\n모아보기',

    ctaHome: '내 상황으로 확인하기',
    ctaHomeHintOff: '체류자격과 금융업무를 모두 고르면 켜집니다',
    ctaHomeHintOn: '개인정보는 저장하지 않아요',

    resultTitle: '판정 결과',
    eligible: { conditional: '조건부 가능', possible: '가능', impossible: '불가' },
    abstainBadge: '공식기관 확인 필요',
    limitCardLabel: '인터넷뱅킹 1일 이체한도',
    limitNow: '지금',
    limitNowValue: '100만원',
    limitAfter: '해제 후',
    limitAfterValue: '제한 없음',
    trapTitle: '가장 놓치기 쉬운 함정',
    faq1Q: '한도제한계좌가 뭔가요?',
    faq1A: '금융거래 목적을 증빙하지 않고 만든 계좌입니다. 통장은 정상적으로 나오지만 인터넷·모바일뱅킹 이체가 1일 100만원, ATM 출금·이체가 1일 100만원, 창구 출금·이체가 1일 300만원으로 제한됩니다.',
    faq2Q: '왜 영업점에 가야 하나요?',
    sourcesTitle: '근거 출처',
    srcVerified: '원문 대조 완료',
    srcUnverified: '원문 대조 전',
    srcOpen: '원문 보기',
    srcCheckedAt: (d) => `확인일 ${d}`,
    srcUnverifiedNote: '아직 대조하지 않아 판정에 쓰지 않았습니다',
    noRecommendFoot: '이 서비스는 상품을 추천하지 않고, 조항과 주의할 이유만 보여드립니다.',
    ctaResult: '준비물 챙기러 가기',

    prepTitle: '준비물 챙기기',
    prepCount: (n, t) => `챙길 서류 ${n}가지 / ${t}가지`,
    prepSubSome: '가방에 넣었으면 눌러서 체크하세요.',
    prepSubNone: '아직 하나도 체크하지 않았어요.',
    docSectionTitle: '서류가 한국어라 모르겠다면',
    docSectionSub: '사진을 올려보세요. 문서에 적힌 문장 그대로 풀어드려요.',
    uploadLabel: '사진 올리기',
    uploadNote: '사진은 저장하지 않고 바로 지웁니다',
    analyzing: '문서를 읽는 중이에요',
    analyzeDone: (n) => `읽기 완료 · ${n}가지로 정리했어요`,
    retake: '다시 찍기',
    blockTodo: '해야 할 일',
    blockMoney: '돈과 관련된 주의점',
    blockNeed: '추가 확인 필요',
    evidenceLabel: '문서 원문',
    droppedNote: (n) => `근거 문장이 없는 항목 ${n}개는 서버에서 자동으로 걸러냈습니다.`,
    uploadFoot: '업로드한 사진은 분석 직후 삭제되고, 서버에 남지 않습니다.',
    ctaPrep: '확인 화면으로',
    ctaPrepHint: '준비물을 하나 이상 체크하면 넘어갈 수 있어요',
    analyzeBtn: '분석하기',

    unreadableTitle: '글자가 잘 안 보여요',
    unreadableBody: '밝은 곳에서 다시 찍어주시면 좋아요. 서류 전체가 화면에 들어오게 찍으면 더 잘 읽어요.',
    skipPhoto: '사진 없이 계속하기',

    confirmTitle: '은행 가기 전 최종 점검',
    sumSituation: '내 상황',
    sumVerdict: '판정',
    sumPrep: '준비물',
    sumVisit: '방문',
    sumPrepValue: (d, t) => `${t}개 중 ${d}개 완료`,
    visitNeeded: '영업점 방문 필요',
    visitNotNeeded: '방문 없이 가능',
    tileHow: '처리 방법',
    tileHowValue: '비대면 불가\n창구에서만',
    tileAfter: '해제 후',
    tileAfterValue: '인터넷뱅킹\n한도 제한 없음',
    scamTitle: '이 업무에 붙는 사기 수법',
    evidenceFoot: (d) => `정보 기준일 ${d} · 근거가 없는 항목은 표시하지 않았습니다`,
    evidenceFootLead: '근거',
    ctaConfirm: '체크리스트 저장하고 은행 갈 준비 끝내기',
    ctaConfirmLoading: '저장하는 중…',

    doneTitle: '은행 갈 준비가 끝났어요',
    doneSub: (n) => `서류 ${n}가지를 챙겨 영업점 창구에서 담당자에게 아래 문장을 보여주세요.`,
    showTellerLabel: '창구에서 이 화면을 그대로 보여주세요',
    tellerScript: {
      account_open: '"계좌를 새로 만들러 왔습니다.\n금융거래 목적 확인 서류도 가져왔어요."',
      salary_account: '"급여를 받을 계좌를 만들러 왔습니다.\n재직 관련 서류를 가져왔어요."',
      limit_release: '"금융거래 목적 확인을 하러 왔습니다.\n한도제한계좌를 해제하고 싶어요."',
      overseas_remit: '"해외송금 절차를 문의하러 왔습니다."',
    },
    doneDocs: (list) => `${list} 를 함께 냅니다`,
    saveImage: '체크리스트 이미지로 저장',
    goHome: '다른 금융업무 확인하기',
    doneFoot: '이 서비스는 상품을 추천하지 않고, 절차만 안내합니다',

    abstainHead: '확인된 공식 근거가 없어\n답을 만들지 않았어요',
    abstainBody: '은행 영업점이나 출입국·외국인청에서 확인하세요. 저희가 추측해서 알려드리면 더 위험합니다.',
    abstainWhereLabel: '어디에 물어보면 되나요',
    abstainCenter: '외국인종합안내센터 1345',
    abstainCenterSub: '20개 언어 통역 · 평일 09:00–18:00',
    abstainBank: '계좌를 만든 은행 영업점',
    abstainBankSub: '외국환 거래 담당 창구에 문의',
    abstainWhyLabel: '왜 멈췄나요',
    abstainWhy: (unv, total) =>
      `이 조합은 규칙 DB ${total}건 중 대조되지 않은 ${unv}건에 해당합니다. 출처(기관명·문서명·확인일)가 확보되면 자동으로 열립니다.`,
    abstainFoot: (d) => `정보 기준일 ${d} · 근거가 없으면 답하지 않습니다`,
    abstainCta: '1345로 전화하기',
    abstainCtaHint: '근거가 생기면 알림으로 알려드릴까요?',

    errGeneric: '문제가 생겼어요. 잠시 후 다시 시도해주세요.',
  },

  en: {
    appName: 'KO-Finance Buddy',
    langAria: 'Select language',

    trustLine1: (rv, rt, date) => `${rv} of ${rt} rules checked against official sources · as of ${date}`,
    trustLine2: 'If there is no source, we do not answer',

    mySituation: 'Your situation',
    heroEmptyTitle: 'Pick just two things\nand we will tell you',
    heroEmptySub: 'Choose your visa status and what you want to do.',
    heroHalfSub: 'One more to go.',
    heroFullSub: 'The rule for this combination is checked against official sources.',
    stepOf: (n) => `Step ${n} of 2`,

    step1: '1. Choose your visa status',
    step2: '2. What do you want to do?',
    privacyFoot: 'We never ask for your account or passport number. Your choices stay on this device.',

    visa: {
      'D-2': { title: 'D-2 Student', sub: 'Enrolled at a university' },
      'E-9': { title: 'E-9 Non-professional', sub: 'Employment Permit System' },
    },
    task: {
      account_open: 'Open an account',
      salary_account: 'Account for salary / part-time pay',
      limit_release: 'Lift the transfer limit',
      overseas_remit: 'Send money home',
    },

    quick: 'Shortcuts',
    quickDoc: 'Understand a\ndocument photo',
    quickPrep: 'Document\nchecklist',
    quickScam: 'Scam alert for\nthis situation',
    quickSrc: 'All\nsources',

    ctaHome: 'Check with my situation',
    ctaHomeHintOff: 'Choose both to continue',
    ctaHomeHintOn: 'We do not store personal data',

    resultTitle: 'Result',
    eligible: { conditional: 'Possible with conditions', possible: 'Possible', impossible: 'Not possible' },
    abstainBadge: 'Check with an official body',
    limitCardLabel: 'Daily internet-banking transfer limit',
    limitNow: 'Now',
    limitNowValue: 'KRW 1,000,000',
    limitAfter: 'After lifting',
    limitAfterValue: 'No limit',
    trapTitle: 'The trap people miss most',
    faq1Q: 'What is a limited-transaction account?',
    faq1A: 'It is an account opened without proving the purpose of the transactions. The passbook is issued normally, but internet/mobile transfers are capped at KRW 1,000,000 per day, ATM withdrawals and transfers at KRW 1,000,000 per day, and over-the-counter withdrawals and transfers at KRW 3,000,000 per day.',
    faq2Q: 'Why do I have to visit a branch?',
    sourcesTitle: 'Sources',
    srcVerified: 'Checked against the original',
    srcUnverified: 'Not yet checked',
    srcOpen: 'Open source',
    srcCheckedAt: (d) => `Checked ${d}`,
    srcUnverifiedNote: 'Not yet checked, so it was not used in the result',
    noRecommendFoot: 'This service does not recommend products. It only shows the rules and why to be careful.',
    ctaResult: 'Get your documents ready',

    prepTitle: 'Get your documents ready',
    prepCount: (n, t) => `${n} of ${t} documents packed`,
    prepSubSome: 'Tap to check off what is already in your bag.',
    prepSubNone: 'Nothing checked off yet.',
    docSectionTitle: 'If the document is in Korean',
    docSectionSub: 'Upload a photo. We explain it using the sentences printed on it.',
    uploadLabel: 'Upload a photo',
    uploadNote: 'The photo is not stored — it is deleted right away',
    analyzing: 'Reading the document',
    analyzeDone: (n) => `Done · ${n} points found`,
    retake: 'Retake',
    blockTodo: 'What to do',
    blockMoney: 'Money-related warnings',
    blockNeed: 'Needs confirmation',
    evidenceLabel: 'Original text',
    droppedNote: (n) => `${n} item(s) without a source sentence were removed by the server.`,
    uploadFoot: 'The uploaded photo is deleted right after analysis and never stored on the server.',
    ctaPrep: 'Go to final check',
    ctaPrepHint: 'Check at least one document to continue',
    analyzeBtn: 'Analyze',

    unreadableTitle: 'The text is hard to read',
    unreadableBody: 'Try again in brighter light, with the whole document inside the frame.',
    skipPhoto: 'Continue without a photo',

    confirmTitle: 'Final check before the bank',
    sumSituation: 'Your situation',
    sumVerdict: 'Result',
    sumPrep: 'Documents',
    sumVisit: 'Visit',
    sumPrepValue: (d, t) => `${d} of ${t} done`,
    visitNeeded: 'Branch visit required',
    visitNotNeeded: 'No visit needed',
    tileHow: 'How',
    tileHowValue: 'Not available online\nCounter only',
    tileAfter: 'After lifting',
    tileAfterValue: 'Internet banking\nno limit',
    scamTitle: 'Scams attached to this task',
    evidenceFoot: (d) => `As of ${d} · items without a source are not shown`,
    evidenceFootLead: 'Source',
    ctaConfirm: 'Save the checklist and finish',
    ctaConfirmLoading: 'Saving…',

    doneTitle: 'You are ready for the bank',
    doneSub: (n) => `Take your ${n} documents and show the sentence below to the teller.`,
    showTellerLabel: 'Show this screen to the teller',
    tellerScript: {
      account_open: '"계좌를 새로 만들러 왔습니다.\n금융거래 목적 확인 서류도 가져왔어요."',
      salary_account: '"급여를 받을 계좌를 만들러 왔습니다.\n재직 관련 서류를 가져왔어요."',
      limit_release: '"금융거래 목적 확인을 하러 왔습니다.\n한도제한계좌를 해제하고 싶어요."',
      overseas_remit: '"해외송금 절차를 문의하러 왔습니다."',
    },
    doneDocs: (list) => `Submit together: ${list}`,
    saveImage: 'Save checklist as image',
    goHome: 'Check another task',
    doneFoot: 'This service does not recommend products. It only explains the procedure.',

    abstainHead: 'We found no verified\nofficial source, so we did not answer',
    abstainBody: 'Please check with a bank branch or the immigration office. Guessing would be more dangerous for you.',
    abstainWhereLabel: 'Where to ask',
    abstainCenter: 'Foreigner Information Center 1345',
    abstainCenterSub: 'Interpretation in 20 languages · Weekdays 09:00–18:00',
    abstainBank: 'The branch where you opened your account',
    abstainBankSub: 'Ask the foreign-exchange counter',
    abstainWhyLabel: 'Why did we stop',
    abstainWhy: (unv, total) =>
      `This combination falls under the ${unv} of ${total} rules that are not yet checked against an original source. It opens automatically once a source (organization, document, date) is secured.`,
    abstainFoot: (d) => `As of ${d} · if there is no source, we do not answer`,
    abstainCta: 'Call 1345',
    abstainCtaHint: 'Want a notification when a source is added?',

    errGeneric: 'Something went wrong. Please try again in a moment.',
  },

  vi: {
    appName: 'KO-Finance Buddy',
    langAria: 'Chọn ngôn ngữ',

    trustLine1: (rv, rt, date) => `${rv}/${rt} quy tắc đã đối chiếu nguồn chính thức · ngày ${date}`,
    trustLine2: 'Không có căn cứ thì chúng tôi không trả lời',

    mySituation: 'Tình huống của bạn',
    heroEmptyTitle: 'Chỉ cần chọn hai mục\nchúng tôi sẽ hướng dẫn',
    heroEmptySub: 'Hãy chọn tư cách lưu trú và việc bạn muốn làm.',
    heroHalfSub: 'Chỉ còn một mục nữa.',
    heroFullSub: 'Quy tắc cho tổ hợp này đã được đối chiếu với nguồn chính thức.',
    stepOf: (n) => `Bước ${n}/2`,

    step1: '1. Chọn tư cách lưu trú',
    step2: '2. Bạn muốn làm gì?',
    privacyFoot: 'Chúng tôi không hỏi số tài khoản hay số hộ chiếu. Lựa chọn chỉ lưu trên máy bạn.',

    visa: {
      'D-2': { title: 'D-2 Du học sinh', sub: 'Đang học đại học/cao học' },
      'E-9': { title: 'E-9 Lao động phổ thông', sub: 'Chế độ cấp phép lao động' },
    },
    task: {
      account_open: 'Mở tài khoản',
      salary_account: 'Tài khoản nhận lương / tiền làm thêm',
      limit_release: 'Gỡ hạn mức chuyển khoản',
      overseas_remit: 'Gửi tiền về nước',
    },

    quick: 'Chức năng hay dùng',
    quickDoc: 'Hiểu giấy tờ\nqua ảnh chụp',
    quickPrep: 'Danh sách\ngiấy tờ',
    quickScam: 'Cảnh báo lừa đảo\ncho tình huống này',
    quickSrc: 'Xem tất cả\nnguồn',

    ctaHome: 'Kiểm tra theo tình huống của tôi',
    ctaHomeHintOff: 'Chọn cả hai mục để tiếp tục',
    ctaHomeHintOn: 'Chúng tôi không lưu thông tin cá nhân',

    resultTitle: 'Kết quả',
    eligible: { conditional: 'Được, nếu đủ điều kiện', possible: 'Được', impossible: 'Không được' },
    abstainBadge: 'Cần hỏi cơ quan chính thức',
    limitCardLabel: 'Hạn mức chuyển khoản internet banking / ngày',
    limitNow: 'Hiện tại',
    limitNowValue: '1.000.000 KRW',
    limitAfter: 'Sau khi gỡ',
    limitAfterValue: 'Không giới hạn',
    trapTitle: 'Cái bẫy dễ bỏ sót nhất',
    faq1Q: 'Tài khoản hạn mức giới hạn là gì?',
    faq1A: 'Là tài khoản mở mà chưa chứng minh mục đích giao dịch. Sổ vẫn được cấp bình thường, nhưng chuyển khoản internet/mobile bị giới hạn 1.000.000 KRW/ngày, rút và chuyển qua ATM 1.000.000 KRW/ngày, tại quầy 3.000.000 KRW/ngày.',
    faq2Q: 'Vì sao phải đến chi nhánh?',
    sourcesTitle: 'Nguồn căn cứ',
    srcVerified: 'Đã đối chiếu bản gốc',
    srcUnverified: 'Chưa đối chiếu',
    srcOpen: 'Xem bản gốc',
    srcCheckedAt: (d) => `Ngày kiểm tra ${d}`,
    srcUnverifiedNote: 'Chưa đối chiếu nên không dùng để kết luận',
    noRecommendFoot: 'Dịch vụ này không giới thiệu sản phẩm, chỉ nêu quy định và lý do cần lưu ý.',
    ctaResult: 'Đi chuẩn bị giấy tờ',

    prepTitle: 'Chuẩn bị giấy tờ',
    prepCount: (n, t) => `Đã chuẩn bị ${n}/${t} giấy tờ`,
    prepSubSome: 'Đã bỏ vào cặp thì bấm để đánh dấu.',
    prepSubNone: 'Chưa đánh dấu mục nào.',
    docSectionTitle: 'Nếu giấy tờ bằng tiếng Hàn',
    docSectionSub: 'Hãy tải ảnh lên. Chúng tôi giải thích đúng theo câu chữ in trên giấy.',
    uploadLabel: 'Tải ảnh lên',
    uploadNote: 'Ảnh không được lưu, sẽ bị xóa ngay',
    analyzing: 'Đang đọc giấy tờ',
    analyzeDone: (n) => `Đã đọc xong · ${n} mục`,
    retake: 'Chụp lại',
    blockTodo: 'Việc cần làm',
    blockMoney: 'Lưu ý về tiền',
    blockNeed: 'Cần xác nhận thêm',
    evidenceLabel: 'Nguyên văn trong giấy tờ',
    droppedNote: (n) => `${n} mục không có câu căn cứ đã bị máy chủ tự động loại bỏ.`,
    uploadFoot: 'Ảnh tải lên bị xóa ngay sau khi phân tích và không lưu trên máy chủ.',
    ctaPrep: 'Sang màn hình xác nhận',
    ctaPrepHint: 'Đánh dấu ít nhất một giấy tờ để tiếp tục',
    analyzeBtn: 'Phân tích',

    unreadableTitle: 'Chữ hơi khó đọc',
    unreadableBody: 'Hãy chụp lại ở nơi sáng hơn, lấy trọn cả tờ giấy vào khung hình.',
    skipPhoto: 'Tiếp tục mà không cần ảnh',

    confirmTitle: 'Kiểm tra lần cuối trước khi đến ngân hàng',
    sumSituation: 'Tình huống',
    sumVerdict: 'Kết luận',
    sumPrep: 'Giấy tờ',
    sumVisit: 'Đến quầy',
    sumPrepValue: (d, t) => `Xong ${d}/${t}`,
    visitNeeded: 'Phải đến chi nhánh',
    visitNotNeeded: 'Không cần đến quầy',
    tileHow: 'Cách xử lý',
    tileHowValue: 'Không làm online\nChỉ tại quầy',
    tileAfter: 'Sau khi gỡ',
    tileAfterValue: 'Internet banking\nkhông giới hạn',
    scamTitle: 'Chiêu lừa thường gặp với việc này',
    evidenceFoot: (d) => `Thông tin tính đến ${d} · mục không có căn cứ sẽ không hiển thị`,
    evidenceFootLead: 'Căn cứ',
    ctaConfirm: 'Lưu danh sách và hoàn tất chuẩn bị',
    ctaConfirmLoading: 'Đang lưu…',

    doneTitle: 'Bạn đã sẵn sàng đến ngân hàng',
    doneSub: (n) => `Mang theo ${n} giấy tờ và đưa câu dưới đây cho nhân viên quầy xem.`,
    showTellerLabel: 'Hãy đưa màn hình này cho nhân viên quầy',
    tellerScript: {
      account_open: '"계좌를 새로 만들러 왔습니다.\n금융거래 목적 확인 서류도 가져왔어요."',
      salary_account: '"급여를 받을 계좌를 만들러 왔습니다.\n재직 관련 서류를 가져왔어요."',
      limit_release: '"금융거래 목적 확인을 하러 왔습니다.\n한도제한계좌를 해제하고 싶어요."',
      overseas_remit: '"해외송금 절차를 문의하러 왔습니다."',
    },
    doneDocs: (list) => `Nộp kèm: ${list}`,
    saveImage: 'Lưu danh sách thành ảnh',
    goHome: 'Kiểm tra việc khác',
    doneFoot: 'Dịch vụ này không giới thiệu sản phẩm, chỉ hướng dẫn thủ tục.',

    abstainHead: 'Chưa có căn cứ chính thức\nnên chúng tôi không đưa ra câu trả lời',
    abstainBody: 'Hãy hỏi chi nhánh ngân hàng hoặc Cục Xuất nhập cảnh. Nếu chúng tôi đoán thì còn nguy hiểm hơn cho bạn.',
    abstainWhereLabel: 'Hỏi ở đâu',
    abstainCenter: 'Tổng đài hỗ trợ người nước ngoài 1345',
    abstainCenterSub: 'Thông dịch 20 ngôn ngữ · T2–T6 09:00–18:00',
    abstainBank: 'Chi nhánh ngân hàng đã mở tài khoản',
    abstainBankSub: 'Hỏi quầy phụ trách giao dịch ngoại hối',
    abstainWhyLabel: 'Vì sao dừng lại',
    abstainWhy: (unv, total) =>
      `Tổ hợp này thuộc ${unv}/${total} quy tắc chưa được đối chiếu bản gốc. Khi có nguồn (cơ quan, tên văn bản, ngày kiểm tra), mục này sẽ tự mở.`,
    abstainFoot: (d) => `Thông tin tính đến ${d} · không có căn cứ thì không trả lời`,
    abstainCta: 'Gọi 1345',
    abstainCtaHint: 'Bạn có muốn nhận thông báo khi có căn cứ không?',

    errGeneric: 'Đã xảy ra sự cố. Vui lòng thử lại sau giây lát.',
  },
};

/** 날짜 표기: 2026-09-06 → 2026.09.06 (목업 표기) */
export function fmtDate(d) {
  return typeof d === 'string' ? d.replace(/-/g, '.') : d;
}

export function t(lang) {
  return STRINGS[lang] ?? STRINGS.ko;
}

/** 서류 이름: 한국어 원문 유지 + 선택 언어 병기 */
export function docName(doc, lang) {
  if (!doc) return '';
  if (lang === 'ko') return doc.ko;
  const alt = doc[lang];
  return alt && alt !== doc.ko ? `${doc.ko} (${alt})` : doc.ko;
}

export function docNote(doc, lang) {
  if (!doc) return '';
  return doc[`note_${lang}`] || doc.note_ko || '';
}
