/** 아이템 보상 */
export type ItemReward = {
  type: 'item';
  itemId: string;
  itemCount: number;
};
/** 메소 보상 */
export type MesoReward = {
  type: 'meso';
  quantity: number;
};
/** 메이플 포인트 보상 */
export type MaplePointReward = {
  type: 'maplePoint';
  quantity: number;
};
export type Reward = ItemReward | MesoReward | MaplePointReward;

// ... 다른 타입의 보상들이 추가되면 아래에 정의
// 예시 (인기도 보상)
// type PopularityReward = {
//   type: 'popularity';
//   quantity: number;
// };
