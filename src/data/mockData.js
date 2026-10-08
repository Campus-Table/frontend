// src/data/mockData.js

export const stores = [
  // =====================================================
  // 1. 51장국밥
  // =====================================================
  {
    id: '51jang',
    name: '51장국밥',
    description: '든든한 국밥과 한식 메뉴',
    category: '한식',
    menus: [
      {
        id: '51jang-1',
        name: '고기만국밥',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-2',
        name: '공기밥 추가',
        price: 1000,
        soldOut: false,
      },
      {
        id: '51jang-3',
        name: '광주 크림순대국밥',
        price: 8400,
        soldOut: false,
      },
      {
        id: '51jang-4',
        name: '닭곰탕(밥 포함)',
        price: 5500,
        soldOut: false,
      },
      {
        id: '51jang-5',
        name: '닭칼국수',
        price: 5900,
        soldOut: false,
      },
      {
        id: '51jang-6',
        name: '물냉면',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-7',
        name: '물냉면+왕만두',
        price: 8400,
        soldOut: false,
      },
      {
        id: '51jang-8',
        name: '물비빔냉면',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-9',
        name: '물비빔냉면+왕만두',
        price: 8400,
        soldOut: false,
      },
      {
        id: '51jang-10',
        name: '비빔냉면',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-11',
        name: '비빔냉면+왕만두',
        price: 8400,
        soldOut: false,
      },
      {
        id: '51jang-12',
        name: '순대국밥',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-13',
        name: '순대만국밥',
        price: 6500,
        soldOut: false,
      },
      {
        id: '51jang-14',
        name: '얼큰고기만국밥',
        price: 7500,
        soldOut: false,
      },
      {
        id: '51jang-15',
        name: '얼큰순대국밥',
        price: 7500,
        soldOut: false,
      },
      {
        id: '51jang-16',
        name: '왕만두',
        price: 2000,
        soldOut: false,
      },
      {
        id: '51jang-17',
        name: '편육한접시',
        price: 2500,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 2. 가오슝
  // =====================================================
  {
    id: 'gaosung',
    name: '가오슝',
    description: '다양한 덮밥과 면 요리',
    category: '아시안',
    menus: [
      {
        id: 'gaohsiung-1',
        name: '갈비튀김덮밥',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gaohsiung-2',
        name: '대만식고기덮밥',
        price: 8400,
        soldOut: false,
      },
      {
        id: 'gaohsiung-3',
        name: '동파육덮밥',
        price: 9400,
        soldOut: false,
      },
      {
        id: 'gaohsiung-4',
        name: '마늘쫑민찌덮밥',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'gaohsiung-5',
        name: '마파두부덮밥',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'gaohsiung-6',
        name: '마파참깨덮밥',
        price: 7400,
        soldOut: false,
      },
      {
        id: 'gaohsiung-7',
        name: '마파참깨면',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gaohsiung-8',
        name: '우육면',
        price: 7400,
        soldOut: false,
      },
      {
        id: 'gaohsiung-9',
        name: '자장면',
        price: 6400,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 3. 값찌개
  // =====================================================
  {
    id: 'gapjjigae',
    name: '값찌개',
    description: '따뜻하고 든든한 찌개',
    category: '한식',
    menus: [
      {
        id: 'gapjjigae-1',
        name: '공기밥',
        price: 1000,
        soldOut: false,
      },
      {
        id: 'gapjjigae-2',
        name: '돼지김치찌개(밥포함)',
        price: 6500,
        soldOut: false,
      },
      {
        id: 'gapjjigae-3',
        name: '바지락순두부(밥포함)',
        price: 6200,
        soldOut: false,
      },
      {
        id: 'gapjjigae-4',
        name: '순두부찌개(밥포함)',
        price: 6000,
        soldOut: false,
      },
      {
        id: 'gapjjigae-5',
        name: '스팸김치찌개(밥포함)',
        price: 6500,
        soldOut: false,
      },
      {
        id: 'gapjjigae-6',
        name: '스팸순두부(밥포함)',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'gapjjigae-7',
        name: '우삼겹된장찌개(밥포함)',
        price: 6500,
        soldOut: false,
      },
      {
        id: 'gapjjigae-8',
        name: '우삼겹순두부(밥포함)',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'gapjjigae-9',
        name: '참치김치찌개(밥포함)',
        price: 6500,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 4. 경성카츠
  // =====================================================
  {
    id: 'gyeongseong',
    name: '경성카츠',
    description: '바삭한 한 끼',
    category: '돈카츠',
    menus: [
      {
        id: 'gyeongseong-1',
        name: '고구마치즈돈카츠',
        price: 8300,
        soldOut: false,
      },
      {
        id: 'gyeongseong-2',
        name: '등심돈카츠',
        price: 7500,
        soldOut: false,
      },
      {
        id: 'gyeongseong-3',
        name: '새우튀김 우동',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'gyeongseong-4',
        name: '샐러드파스타+등심카츠',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gyeongseong-5',
        name: '샐러드파스타+치킨카츠',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gyeongseong-6',
        name: '왕돈카츠',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gyeongseong-7',
        name: '우동',
        price: 4900,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 5. 광뚝
  // =====================================================
  {
    id: 'gwangttuk',
    name: '광뚝',
    description: '불고기와 뚝배기 한식',
    category: '한식',
    menus: [
      {
        id: 'gwangttuk-1',
        name: '간장 불고기',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-2',
        name: '고추장 불고기',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-3',
        name: '떡왕만두뚝배기',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-4',
        name: '뚝배기알밥',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-5',
        name: '물만두',
        price: 1900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-6',
        name: '부산물밀면(곱빼기)',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-7',
        name: '부산비빔면(곱빼기)',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-8',
        name: '사골갈제비',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-9',
        name: '얼큰떡왕만두뚝배기',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-10',
        name: '얼큰사골갈제비',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-11',
        name: '얼큰칼왕만두뚝배기',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-12',
        name: '칼왕만두뚝배기',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'gwangttuk-13',
        name: '콩나물불백',
        price: 6500,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 6. 도쿄야
  // =====================================================
  {
    id: 'tokyoya',
    name: '도쿄야',
    description: '오므라이스와 함박스테이크',
    category: '일식',
    menus: [
      {
        id: 'tokyoya-1',
        name: '59오므라이스',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'tokyoya-2',
        name: '갈릭함박스테이크',
        price: 9900,
        soldOut: false,
      },
      {
        id: 'tokyoya-3',
        name: '돈코츠라멘',
        price: 7400,
        soldOut: false,
      },
      {
        id: 'tokyoya-4',
        name: '도쿄야오므라이스',
        price: 7400,
        soldOut: false,
      },
      {
        id: 'tokyoya-5',
        name: '도쿄함박스테이크',
        price: 8900,
        soldOut: false,
      },
      {
        id: 'tokyoya-6',
        name: '불닭함박스테이크',
        price: 9900,
        soldOut: false,
      },
      {
        id: 'tokyoya-7',
        name: '음료',
        price: 0,
        soldOut: false,
      },
      {
        id: 'tokyoya-8',
        name: '투움바오므라이스',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'tokyoya-9',
        name: '투움바함박스테이크',
        price: 9900,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 7. 바버든든
  // =====================================================
  {
    id: 'babideundeun',
    name: '바비든든',
    description: '든든한 덮밥 한 끼',
    category: '덮밥',
    menus: [
      {
        id: 'babodeundeun-1',
        name: '고기든든',
        price: 3900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-2',
        name: '고기든든(킹)',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-3',
        name: '스팸마요덮밥(라지)',
        price: 4900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-4',
        name: '제육덮밥',
        price: 3900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-5',
        name: '제육덮밥(킹)',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-6',
        name: '참치마요덮밥(라지)',
        price: 4900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-7',
        name: '춘천닭갈비덮밥(킹)',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-8',
        name: '치킨마요덮밥(라지)',
        price: 4900,
        soldOut: false,
      },
      {
        id: 'babodeundeun-9',
        name: '햄볶음김치덮밥',
        price: 4900,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 8. 비비고고
  // =====================================================
  {
    id: 'bibigogo',
    name: '비비고고',
    description: '카레와 비빔밥',
    category: '한식',
    menus: [
      {
        id: 'bibigogo-1',
        name: '기본카레',
        price: 4900,
        soldOut: false,
      },
      {
        id: 'bibigogo-2',
        name: '불고기비빔밥',
        price: 7500,
        soldOut: false,
      },
      {
        id: 'bibigogo-3',
        name: '불고기카레',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'bibigogo-4',
        name: '새우카레',
        price: 6900,
        soldOut: false,
      },
      {
        id: 'bibigogo-5',
        name: '오색비빔밥',
        price: 6500,
        soldOut: false,
      },
      {
        id: 'bibigogo-6',
        name: '육회비빔밥',
        price: 7900,
        soldOut: false,
      },
      {
        id: 'bibigogo-7',
        name: '치킨카레',
        price: 6900,
        soldOut: false,
      },
    ],
  },

  // =====================================================
  // 9. 폭풍분식
  // =====================================================
  {
    id: 'pokpung',
    name: '폭풍분식',
    description: '라면, 김밥, 떡볶이 분식',
    category: '분식',
    menus: [
      {
        id: 'pokpung-1',
        name: '닭가슴살포케',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'pokpung-2',
        name: '떡라면',
        price: 4000,
        soldOut: false,
      },
      {
        id: 'pokpung-3',
        name: '라볶이',
        price: 5000,
        soldOut: false,
      },
      {
        id: 'pokpung-4',
        name: '라죽',
        price: 4000,
        soldOut: false,
      },
      {
        id: 'pokpung-5',
        name: '만두라면',
        price: 4500,
        soldOut: false,
      },
      {
        id: 'pokpung-6',
        name: '짜파게티',
        price: 4000,
        soldOut: false,
      },
      {
        id: 'pokpung-7',
        name: '참치김밥',
        price: 3800,
        soldOut: false,
      },
      {
        id: 'pokpung-8',
        name: '치즈김밥',
        price: 3800,
        soldOut: false,
      },
      {
        id: 'pokpung-9',
        name: '치즈라면',
        price: 4000,
        soldOut: false,
      },
      {
        id: 'pokpung-10',
        name: '폭풍김밥',
        price: 3500,
        soldOut: false,
      },
      {
        id: 'pokpung-11',
        name: '폭풍라면',
        price: 3500,
        soldOut: false,
      },
      {
        id: 'pokpung-12',
        name: '훈제연어포케',
        price: 5900,
        soldOut: false,
      },
      {
        id: 'pokpung-13',
        name: '훈제오리포케',
        price: 5900,
        soldOut: false,
      },
    ],
  },
]

// -----------------------------------------------------
// 기타 Campus Table 프로토타입 데이터
// -----------------------------------------------------

export const congestion = {
  status: '혼잡',
  level: 'high',
  currentUsers: 87,
  totalSeats: 120,
}

export const student = {
  mileage: 15000,
}

export const formatPrice = (price) => {
  return `${price.toLocaleString('ko-KR')}원`
}

export const getStoreById = (storeId) => {
  return stores.find((store) => store.id === storeId)
}

export const getMenuById = (storeId, menuId) => {
  const store = getStoreById(storeId)

  if (!store) {
    return undefined
  }

  return store.menus.find((menu) => menu.id === menuId)
}