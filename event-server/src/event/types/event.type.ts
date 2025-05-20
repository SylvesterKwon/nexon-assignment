export type Condition = PremitiveCondition[];

export type PremitiveCondition =
  | QuestCondition
  | ReferralCondition
  | LoginStreakCondition;

/** 특정 퀘스트를 만족했는가 */
export type QuestCondition = {
  type: 'quest';
  questId: string;
};
/** 친구를 N명이상 초대했는가 */
export type ReferralCondition = {
  type: 'referral';
  referralCount: number;
};
/** 로그인 연속 N회 이상인가 */
export type LoginStreakCondition = {
  type: 'loginStreak';
  loginStreak: number;
};
// ... 다른 타입의 조건들이 추가되면 아래에 정의
// 예시
// type ItemCondition = {
//   requirement: {
//     itemId: string;
//     itemCount: number;
//   }[];
// };
