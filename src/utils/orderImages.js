import {
  getStoreMenus,
} from '../api/storeApi'

// ======================================================
// 메뉴 API 응답을 배열로 변환
// ======================================================

function normalizeMenus(result) {
  if (Array.isArray(result)) {
    return result
  }

  if (Array.isArray(result?.menus)) {
    return result.menus
  }

  return []
}

// ======================================================
// 주문 1개의 메뉴에 이미지 정보 붙이기
//
// 주문 API:
// {
//   storeId: 1,
//   items: [
//     {
//       menuId: 12,
//       menuName: '순대국밥'
//     }
//   ]
// }
//
// 메뉴 API:
// {
//   id: 12,
//   imageUrl: 'https://...'
// }
//
// menuId === id 를 비교해서 imageUrl을 붙임
// ======================================================

export async function attachImagesToOrder(order) {
  if (!order) {
    return order
  }

  const storeId =
    order.storeId ??
    order.store?.id

  const orderItems =
    Array.isArray(order.items)
      ? order.items
      : []

  if (!storeId || orderItems.length === 0) {
    return order
  }

  try {
    const result =
      await getStoreMenus(storeId)

    const menus =
      normalizeMenus(result)

    const itemsWithImages =
      orderItems.map((item) => {
        const menuId =
          item.menuId ??
          item.menu?.id ??
          item.id

        const matchedMenu =
          menus.find(
            (menu) =>
              Number(menu.id) ===
              Number(menuId)
          )

        return {
          ...item,

          // 기존 이미지가 있으면 그대로 사용하고,
          // 없으면 메뉴 API의 imageUrl 사용
          imageUrl:
            item.imageUrl ||
            item.image ||
            item.menu?.imageUrl ||
            matchedMenu?.imageUrl ||
            '',

          // 혹시 주문 API에 이름이 없는 경우도 보완
          menuName:
            item.menuName ||
            item.name ||
            item.menu?.name ||
            matchedMenu?.name ||
            '메뉴 정보 없음',

          // 가격 정보도 필요한 경우 보완
          price: Number(
            item.price ??
              item.unitPrice ??
              item.menu?.price ??
              matchedMenu?.price ??
              0
          ),
        }
      })

    return {
      ...order,
      items: itemsWithImages,
    }
  } catch (error) {
    console.error(
      '주문 메뉴 이미지 연결 실패:',
      error
    )

    // 이미지 조회 실패 때문에
    // 주문 화면 자체가 깨지면 안 되므로
    // 원래 주문 데이터를 그대로 반환
    return order
  }
}

// ======================================================
// 주문 여러 개에 이미지 정보 붙이기
//
// MyOrders의 주문 히스토리에서 사용
// 같은 가게의 주문이 여러 개여도
// 메뉴 API는 가게별로 한 번만 호출
// ======================================================

export async function attachImagesToOrders(orders) {
  if (!Array.isArray(orders)) {
    return []
  }

  if (orders.length === 0) {
    return []
  }

  const menuCache =
    new Map()

  const results =
    await Promise.all(
      orders.map(async (order) => {
        const storeId =
          order.storeId ??
          order.store?.id

        const orderItems =
          Array.isArray(order.items)
            ? order.items
            : []

        if (
          !storeId ||
          orderItems.length === 0
        ) {
          return order
        }

        try {
          let menus

          // 같은 가게 메뉴를 이미 가져왔다면
          // 다시 API 호출하지 않음
          if (
            menuCache.has(
              String(storeId)
            )
          ) {
            menus =
              await menuCache.get(
                String(storeId)
              )
          } else {
            const menuPromise =
              getStoreMenus(storeId)
                .then(normalizeMenus)

            menuCache.set(
              String(storeId),
              menuPromise
            )

            menus =
              await menuPromise
          }

          const itemsWithImages =
            orderItems.map((item) => {
              const menuId =
                item.menuId ??
                item.menu?.id ??
                item.id

              const matchedMenu =
                menus.find(
                  (menu) =>
                    Number(menu.id) ===
                    Number(menuId)
                )

              return {
                ...item,

                imageUrl:
                  item.imageUrl ||
                  item.image ||
                  item.menu?.imageUrl ||
                  matchedMenu?.imageUrl ||
                  '',

                menuName:
                  item.menuName ||
                  item.name ||
                  item.menu?.name ||
                  matchedMenu?.name ||
                  '메뉴 정보 없음',

                price: Number(
                  item.price ??
                    item.unitPrice ??
                    item.menu?.price ??
                    matchedMenu?.price ??
                    0
                ),
              }
            })

          return {
            ...order,
            items:
              itemsWithImages,
          }
        } catch (error) {
          console.error(
            `가게 ${storeId} 메뉴 이미지 연결 실패:`,
            error
          )

          return order
        }
      })
    )

  return results
} 
