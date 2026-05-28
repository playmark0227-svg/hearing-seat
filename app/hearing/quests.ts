import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "single"
  | "multi"
  | "cardGrid"
  | "color";

export type Option = {
  value: string;
  label: string;
  emoji?: string;
  hint?: string;
};

export type Field = {
  key: string;
  label: string;
  description?: string;
  placeholder?: string;
  type: FieldType;
  required?: boolean;
  options?: Option[];
};

export type Quest = {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  color: string; // tailwind gradient suffix tokens
  fields: Field[];
};

export const QUESTS: Quest[] = [
  {
    id: 1,
    emoji: "🌱",
    title: "Quest 1：はじまりの自己紹介",
    subtitle: "まずは基本情報を教えてください",
    color: "from-neon-pink to-neon-purple",
    fields: [
      {
        key: "companyName",
        label: "会社名 / サービス名",
        placeholder: "例：株式会社サンプル / 〇〇カフェ",
        type: "text",
        required: true,
      },
      {
        key: "industry",
        label: "業種",
        type: "single",
        required: true,
        options: [
          { value: "it", label: "IT / Web", emoji: "💻" },
          { value: "food", label: "飲食", emoji: "🍽️" },
          { value: "beauty", label: "美容 / サロン", emoji: "💄" },
          { value: "medical", label: "医療 / 福祉", emoji: "🏥" },
          { value: "education", label: "教育 / スクール", emoji: "📚" },
          { value: "ec", label: "EC / 物販", emoji: "🛍️" },
          { value: "maker", label: "製造 / メーカー", emoji: "🏭" },
          { value: "realestate", label: "不動産 / 建築", emoji: "🏠" },
          { value: "consulting", label: "コンサル / 士業", emoji: "🧠" },
          { value: "other", label: "その他", emoji: "✨" },
        ],
      },
      {
        key: "contactName",
        label: "ご担当者名",
        placeholder: "例：山田 太郎",
        type: "text",
        required: true,
      },
      {
        key: "contactEmail",
        label: "メールアドレス",
        placeholder: "例：sample@example.com",
        type: "email",
        required: false,
      },
    ],
  },
  {
    id: 2,
    emoji: "🎯",
    title: "Quest 2：サイトの目的を定める",
    subtitle: "このHPで何を達成したいですか？（複数選択OK）",
    color: "from-neon-purple to-neon-blue",
    fields: [
      {
        key: "purposes",
        label: "サイトの主な目的",
        type: "multi",
        required: true,
        options: [
          { value: "lead", label: "問合せ獲得", emoji: "📨" },
          { value: "branding", label: "ブランディング", emoji: "👑" },
          { value: "awareness", label: "認知度UP", emoji: "📣" },
          { value: "recruit", label: "採用強化", emoji: "🧑‍💼" },
          { value: "sales", label: "商品販売 / EC", emoji: "🛒" },
          { value: "info", label: "情報発信", emoji: "📰" },
          { value: "support", label: "サポート / FAQ", emoji: "💬" },
          { value: "reserve", label: "予約獲得", emoji: "📅" },
        ],
      },
      {
        key: "goalKpi",
        label: "達成したい目標やKPI（任意）",
        description: "例：月間問合せ10件 / 月商◯万円 / 採用応募◯名 など",
        placeholder: "数字や状態でゴールを書いてみましょう",
        type: "textarea",
      },
    ],
  },
  {
    id: 3,
    emoji: "👥",
    title: "Quest 3：届けたい相手を描こう",
    subtitle: "ターゲットユーザーをイメージしてください",
    color: "from-neon-blue to-neon-lime",
    fields: [
      {
        key: "target",
        label: "メインターゲット",
        description: "年齢・性別・職業・地域・興味関心など、思いつく限りでOK",
        placeholder: "例：30代女性、都内在住、子育て中、ナチュラル志向",
        type: "textarea",
        required: true,
      },
      {
        key: "userAction",
        label: "サイトを見た人に取ってほしい行動",
        type: "multi",
        options: [
          { value: "contact", label: "問合せ・相談", emoji: "💬" },
          { value: "reserve", label: "予約する", emoji: "📅" },
          { value: "buy", label: "購入する", emoji: "💳" },
          { value: "download", label: "資料DL", emoji: "📥" },
          { value: "apply", label: "応募する", emoji: "🧑‍💼" },
          { value: "follow", label: "SNSフォロー", emoji: "💗" },
          { value: "subscribe", label: "メルマガ登録", emoji: "✉️" },
        ],
      },
    ],
  },
  {
    id: 4,
    emoji: "🎨",
    title: "Quest 4：デザインの方向性",
    subtitle: "“らしさ” を一緒に言語化しましょう",
    color: "from-neon-pink to-neon-gold",
    fields: [
      {
        key: "imageWords",
        label: "イメージワード（複数選択OK）",
        type: "multi",
        required: true,
        options: [
          { value: "modern", label: "モダン", emoji: "✨" },
          { value: "simple", label: "シンプル", emoji: "⚪" },
          { value: "luxury", label: "高級感", emoji: "👑" },
          { value: "natural", label: "ナチュラル", emoji: "🌿" },
          { value: "pop", label: "ポップ", emoji: "🎈" },
          { value: "cool", label: "クール", emoji: "🧊" },
          { value: "warm", label: "あたたかい", emoji: "🔥" },
          { value: "trust", label: "信頼感", emoji: "🛡️" },
          { value: "playful", label: "遊び心", emoji: "🎮" },
          { value: "japanese", label: "和", emoji: "🎴" },
        ],
      },
      {
        key: "mainColor",
        label: "メインカラーの方向性",
        description: "完全に決まっていなくてもOK、近いものを選んでください",
        type: "color",
        required: true,
        options: [
          { value: "#ff4fa3", label: "ピンク" },
          { value: "#ff7a59", label: "オレンジ" },
          { value: "#ffd24f", label: "イエロー" },
          { value: "#7fd97a", label: "グリーン" },
          { value: "#4fc3ff", label: "ブルー" },
          { value: "#9b5cff", label: "パープル" },
          { value: "#1f2937", label: "ブラック" },
          { value: "#f5f3ef", label: "ベージュ" },
          { value: "#b91c1c", label: "レッド" },
          { value: "#0ea5e9", label: "ネイビー" },
        ],
      },
      {
        key: "referenceUrls",
        label: "参考にしたいサイトのURL（任意）",
        description: "業界外でも好きなテイストがあれば歓迎です",
        placeholder: "https://...（複数ある場合は改行で）",
        type: "textarea",
      },
    ],
  },
  {
    id: 5,
    emoji: "🧩",
    title: "Quest 5：構成と機能を選ぼう",
    subtitle: "必要なページ・機能をチェック",
    color: "from-neon-purple to-neon-pink",
    fields: [
      {
        key: "pages",
        label: "必要なページ",
        type: "cardGrid",
        required: true,
        options: [
          { value: "top", label: "トップ", emoji: "🏠" },
          { value: "about", label: "会社概要", emoji: "🏢" },
          { value: "service", label: "サービス紹介", emoji: "💼" },
          { value: "works", label: "実績 / 制作例", emoji: "📁" },
          { value: "news", label: "お知らせ / ブログ", emoji: "📰" },
          { value: "faq", label: "FAQ", emoji: "❓" },
          { value: "recruit", label: "採用情報", emoji: "🧑‍💼" },
          { value: "gallery", label: "ギャラリー", emoji: "🖼️" },
          { value: "menu", label: "メニュー / 価格", emoji: "📋" },
          { value: "shop", label: "店舗 / アクセス", emoji: "📍" },
          { value: "contact", label: "お問合せ", emoji: "✉️" },
          { value: "ec", label: "ECショップ", emoji: "🛒" },
        ],
      },
      {
        key: "features",
        label: "必要な機能",
        type: "multi",
        options: [
          { value: "form", label: "お問合せフォーム", emoji: "📝" },
          { value: "reserve", label: "予約システム", emoji: "📅" },
          { value: "payment", label: "決済機能", emoji: "💳" },
          { value: "member", label: "会員機能", emoji: "🧑" },
          { value: "blog", label: "ブログCMS", emoji: "✍️" },
          { value: "multilang", label: "多言語対応", emoji: "🌐" },
          { value: "sns", label: "SNS連携", emoji: "💗" },
          { value: "map", label: "地図埋込", emoji: "🗺️" },
          { value: "search", label: "サイト内検索", emoji: "🔍" },
          { value: "analytics", label: "アクセス解析", emoji: "📊" },
        ],
      },
    ],
  },
  {
    id: 6,
    emoji: "📦",
    title: "Quest 6：素材・コンテンツの状況",
    subtitle: "今ある素材を教えてください",
    color: "from-neon-lime to-neon-blue",
    fields: [
      {
        key: "copyStatus",
        label: "原稿（テキスト）",
        type: "single",
        required: true,
        options: [
          { value: "ready", label: "ほぼ準備済み", emoji: "✅" },
          { value: "partial", label: "一部だけある", emoji: "🟡" },
          { value: "none", label: "これから用意する", emoji: "⏳" },
          { value: "outsource", label: "ライティングも依頼したい", emoji: "🪄" },
        ],
      },
      {
        key: "imageStatus",
        label: "写真・素材",
        type: "single",
        required: true,
        options: [
          { value: "ready", label: "写真あり", emoji: "🖼️" },
          { value: "partial", label: "一部だけある", emoji: "🟡" },
          { value: "none", label: "ほぼない", emoji: "🚫" },
          { value: "shoot", label: "撮影から依頼したい", emoji: "📷" },
        ],
      },
      {
        key: "logoStatus",
        label: "ロゴ",
        type: "single",
        required: true,
        options: [
          { value: "ready", label: "完成データあり", emoji: "✅" },
          { value: "making", label: "現在制作中", emoji: "🛠️" },
          { value: "new", label: "新規制作も依頼したい", emoji: "🪄" },
        ],
      },
    ],
  },
  {
    id: 7,
    emoji: "🚀",
    title: "Quest 7：スケジュールと予算",
    subtitle: "最後の章！実現に向けた条件を教えてください",
    color: "from-neon-gold to-neon-pink",
    fields: [
      {
        key: "launchTimeline",
        label: "公開希望の時期",
        type: "single",
        required: true,
        options: [
          { value: "1m", label: "1ヶ月以内", emoji: "⚡" },
          { value: "2-3m", label: "2〜3ヶ月", emoji: "🗓️" },
          { value: "3-6m", label: "3〜6ヶ月", emoji: "📆" },
          { value: "6m+", label: "半年以上", emoji: "🐢" },
          { value: "tbd", label: "未定 / 相談したい", emoji: "🤔" },
        ],
      },
      {
        key: "budget",
        label: "ご予算の目安",
        type: "single",
        required: true,
        options: [
          { value: "u30", label: "〜30万円", emoji: "💰" },
          { value: "30-50", label: "30〜50万円", emoji: "💰" },
          { value: "50-100", label: "50〜100万円", emoji: "💎" },
          { value: "100-300", label: "100〜300万円", emoji: "💎" },
          { value: "300+", label: "300万円〜", emoji: "🏆" },
          { value: "tbd", label: "相談して決めたい", emoji: "🤝" },
        ],
      },
      {
        key: "operation",
        label: "公開後の運用",
        type: "single",
        options: [
          { value: "self", label: "自社で更新したい", emoji: "🧑‍💻" },
          { value: "partial", label: "一部委託したい", emoji: "🤝" },
          { value: "all", label: "全て任せたい", emoji: "🪄" },
          { value: "tbd", label: "まだ決めていない", emoji: "🤔" },
        ],
      },
      {
        key: "freeNotes",
        label: "その他の想い・参考情報・競合サイトなど（任意）",
        placeholder: "気になる競合サイトのURL、こだわり、不安なことなど自由にどうぞ",
        type: "textarea",
      },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

export function isFieldFilled(field: Field, value: unknown): boolean {
  if (field.type === "multi" || field.type === "cardGrid") {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === "string" && value.trim().length > 0;
}

export function isQuestComplete(quest: Quest, answers: Answers): boolean {
  return quest.fields.every((f) => {
    if (!f.required) return true;
    return isFieldFilled(f, answers[f.key]);
  });
}

export type _ReactNodeAlias = ReactNode;
