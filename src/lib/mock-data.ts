// 念念 — mock 数据（完整版）

// ─── 类型定义 ───────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  name: string
  birthYear: number
  hometown: string
  gender: "grandma" | "grandpa"
  avatarInitial: string
  avatarColor: string
  stories: number
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  summary: string
  createdAt: string
  content: string
}

export interface ChatMessage {
  id: string
  role: "ai" | "user"
  content: string
  timestamp: string
}

export interface Material {
  id: string
  profileId: string
  type: "chat" | "audio" | "text" | "photo"
  title: string
  summary: string
  content: string
  createdAt: string
  duration?: string      // 录音时长
  imageUrl?: string      // 照片 URL（mock 用颜色代替）
  imageColor?: string    // 照片 mock 颜色
  source?: string        // 文字来源：diary / letter / wechat / other
  timePeriod?: string    // 大约年代
  important?: boolean
}

export type TopicKey = "childhood" | "youth" | "young" | "middle" | "elder" | "free"

export interface TopicGroup {
  key: TopicKey
  label: string
  emoji: string
  ageRange: string
  questions: string[]
}

// ─── 预设问题库 ──────────────────────────────────────────────────────────────

export const PRESET_TOPICS: TopicGroup[] = [
  {
    key: "childhood",
    label: "童年记忆",
    emoji: "🌱",
    ageRange: "0-12岁",
    questions: [
      "您小时候住在哪里？家是什么样子的？",
      "小时候最喜欢玩什么？有哪些好朋友？",
      "上学时印象最深的老师是谁？",
      "家里有几口人？爸妈是做什么的？",
      "小时候最喜欢吃什么？妈妈做的什么菜最好吃？",
      "过年的时候是怎么过的？有什么特别的习俗？",
      "小时候调皮捣蛋做过什么事？",
      "那时候最大的梦想是什么？",
    ],
  },
  {
    key: "youth",
    label: "少年时光",
    emoji: "📚",
    ageRange: "13-18岁",
    questions: [
      "在哪里上的中学？学校大不大？",
      "那时候最擅长什么科目？",
      "有没有特别要好的同学？现在还联系吗？",
      "第一次离开家是什么时候？去哪里了？",
      "那个年代最流行什么？",
      "有没有偷偷喜欢过谁？",
      "当时最想做什么工作？",
      "人生中第一个转折点是什么？",
    ],
  },
  {
    key: "young",
    label: "青年奋斗",
    emoji: "💪",
    ageRange: "19-30岁",
    questions: [
      "第一份工作是什么？怎么找到的？",
      "第一次领工资是什么感觉？花在哪里了？",
      "怎么认识您爱人的？第一次见面什么印象？",
      "结婚那天是什么样的？",
      "最难的一段时间是什么时候？怎么挺过来的？",
      "那时候一个月挣多少钱？够花吗？",
      "有没有后悔过的选择？",
      "最自豪的一件事是什么？",
    ],
  },
  {
    key: "middle",
    label: "中年岁月",
    emoji: "🏠",
    ageRange: "31-50岁",
    questions: [
      "孩子出生的时候是什么感觉？",
      "在工作上最大的成就是什么？",
      "有没有特别感激的贵人？",
      "生活中最大的变化是什么？",
      "那些年最操心的事是什么？",
      "有没有搬过家？从哪搬到哪？",
      "教育孩子上有什么心得？",
      "夫妻之间吵过最大的一次架是因为什么？",
    ],
  },
  {
    key: "elder",
    label: "晚年感悟",
    emoji: "🌅",
    ageRange: "50+岁",
    questions: [
      "退休后每天都做些什么？",
      "回头看这一辈子，最满意的是什么？",
      "有没有什么遗憾的事？",
      "最想对子女说的一句话是什么？",
      "现在最大的心愿是什么？",
      "觉得这辈子最幸福的时刻是哪一刻？",
      "对年轻人有什么建议？",
      "如果重来一次，会做什么不同的选择？",
    ],
  },
  {
    key: "free",
    label: "自由话题",
    emoji: "✨",
    ageRange: "随意",
    questions: [
      "有什么特别想聊的事情吗？",
      "最近有什么让您高兴的事？",
      "您觉得这辈子最幸运的是什么？",
      "有没有一件事，您从没跟别人说过？",
      "如果能给年轻的自己写一封信，您会说什么？",
      "您最珍视的是什么？",
      "生命中遇到过的最好的人是谁？",
      "您最想被记住的是什么？",
    ],
  },
]

// 按 key 获取话题
export function getTopicByKey(key: TopicKey): TopicGroup {
  return PRESET_TOPICS.find((t) => t.key === key) ?? PRESET_TOPICS[0]
}

// ─── AI 回复库 ───────────────────────────────────────────────────────────────

export const AI_REPLIES_BY_TOPIC: Record<TopicKey, string[]> = {
  childhood: [
    "听您说这些，我仿佛也看到了那个小村子的样子。能跟我再描述一下家门口的景色吗？",
    "用竹篓子捉鱼，那画面真美！那时候家里几口人一起吃饭，热热闹闹的吗？",
    "妈妈做的菜最好吃——这是多少人心底最温暖的记忆啊。您还记得她的拿手菜是什么吗？",
    "过年打糍粑，那香气隔着屏幕我都能想象到。您们家过年有什么特别的规矩吗？",
    "小时候调皮的事情讲出来更有意思！那次被大人发现了吗？",
  ],
  youth: [
    "七里山路去上学，那需要多大的毅力啊！冬天走那条路是什么感觉？",
    "有好朋友的青春真幸运。您们后来还保持联系了吗？",
    "第一次离开家，心里是不舍还是兴奋？还是两种感觉都有？",
    "那个年代最流行的东西，您喜欢吗？还是觉得不懂？",
    "偷偷喜欢过的人——后来呢？有没有一个遗憾的故事？",
  ],
  young: [
    "第一份工作是什么感觉？第一天上班记得吗，有没有闹什么笑话？",
    "第一次领到工资，那种感觉一定很特别。您第一件想到的是什么？",
    "认识另一半的故事总是最动人的。那时候您们是怎么互相了解的？",
    "最难的时候能挺过来，一定有支撑您的力量。是什么让您撑下去了？",
    "那个年代的物价，现在听来真像另一个世界。您觉得那时候生活更简单吗？",
  ],
  middle: [
    "孩子出生的那一刻，一定是改变一切的瞬间。您当时第一个念头是什么？",
    "工作上的成就，有没有一次让您特别骄傲、想告诉所有人的？",
    "人生路上的贵人，有时候一句话就改变了方向。TA 说了什么让您记到现在？",
    "搬家意味着一段新生活。从旧家带走的，是什么？",
    "最操心孩子的事，现在回头看，您觉得当时的担心值得吗？",
  ],
  elder: [
    "退休生活有没有让您觉得意外的快乐？",
    "这一辈子最满意的，往往不是大事，而是某个平凡的时刻。您觉得是哪一刻？",
    "遗憾的事情说出来，有时候会轻松一点。您愿意跟我聊聊吗？",
    "对子女最想说的话，有时候当面说不出口。如果写成一封信，您会怎么开头？",
    "最幸福的时刻——我想仔细听您说。",
  ],
  free: [
    "您说得真好！那段经历对您后来的人生有什么影响吗？",
    "听您讲，我觉得您是一个很有智慧的人。这个智慧是怎么慢慢积累来的？",
    "这件事从来没跟人说过——那今天说出来，是什么感觉？",
    "如果能给年轻的自己一句话，您会说什么？",
    "谢谢您告诉我这些。这些故事太珍贵了，值得被好好保存下来。",
  ],
}

// ─── 档案数据 ────────────────────────────────────────────────────────────────

export const MOCK_PROFILES: Profile[] = [
  {
    id: "wang-xiulan",
    name: "王秀兰",
    birthYear: 1943,
    hometown: "湖南省湘潭县",
    gender: "grandma",
    avatarInitial: "王",
    avatarColor: "#C8956C",
    stories: 8,
    chapters: [
      {
        id: "ch-1",
        title: "第一章：童年记忆",
        summary: "在湖南小村子里度过的无忧童年，小河边的嬉戏，和邻家孩子捉鱼摸虾……",
        createdAt: "2024-03-10",
        content: `那时候我们住在湖南湘潭的一个小村子里，村子不大，几十户人家，家家户户都种着水稻。

我们村子门口有一条小河，清清亮亮的，夏天的时候河水不深，刚好到膝盖。我小时候最喜欢的事情，就是和村子里的孩子们一起去河里捉鱼。我们用竹篓子堵在石头缝里，等着鱼儿游进去，有时候一下午能捉好几条，拿回家让妈妈做成鱼汤。

那时候家里穷，但是我不觉得苦。妈妈会给我们做甜酒酿，爸爸会在冬天用稻草编出漂亮的草鞋。村子里的孩子们在一起，整天玩，整天笑，那种快乐是后来再也没有找到过的。

我还记得每到过年，全村子的人都聚在一起，杀猪、打糍粑。那糍粑的香气……到现在我闭上眼睛都能闻到。

现在想起那条河，总觉得它是我人生最美的背景。不管后来的日子有多难，那条河的声音好像一直都在。`,
      },
      {
        id: "ch-2",
        title: "第二章：求学时光",
        summary: "走了七里山路去上学，在煤油灯下做功课，遇见了一生中最好的老师……",
        createdAt: "2024-03-12",
        content: `上学要走七里路，天不亮就要出发，走过两座山头才到学校。冬天最难熬，路上结了冰，我们就互相搀扶着走，生怕滑倒。

我们的老师叫周先生，是从城里来的。他教我们语文，讲课很好听。他说，读书是穷人家孩子唯一能改变命运的路。这句话我记了一辈子。

那时候家里没有电，晚上做作业只能靠煤油灯。灯光昏黄，熏得眼睛发酸，但我每次都把功课做完了才去睡觉。妈妈看我这么用功，省下吃饭的钱给我买了一支新钢笔，说我将来一定有出息。

那支钢笔我用了好多年，后来磨损了也舍不得扔，一直放在抽屉里。有时候翻出来看，就想起那盏煤油灯，想起妈妈拿着灯给我照亮书本的样子。

周先生后来调回城里了，走的那天，我们全班同学都哭了。他是我这辈子最感激的人之一。`,
      },
      {
        id: "ch-3",
        title: "第三章：结婚那年",
        summary: "认识他是在生产队，第一次见面他帮我挑了一担水，就这么认识了……",
        createdAt: "2024-03-15",
        content: `认识他是在生产队干活的时候，那时候大家一起插秧、收割，整个村子的年轻人都在一起。

第一次见面，他帮我挑了一担水。那时候我心想，这个人倒是不错，踏实。后来慢慢地就开始说话，再后来就定了亲。

那个年代结婚没有什么大排场，就是请了两桌邻居吃饭，妈妈炒了几个菜，爸爸拿出了珍藏多年的一瓶酒。我穿着自己缝的红棉袄，他骑着借来的自行车把我接到他家。

就这么成了家。没有蜡烛，没有戒指，但是我那天特别高兴。

后来有了孩子，日子越来越忙，但是他一直都是那个踏实的人。这么多年，我觉得选他是我这辈子做的最对的一个决定。`,
      },
    ],
  },
  {
    id: "li-jianguo",
    name: "李建国",
    birthYear: 1949,
    hometown: "山东省济南市",
    gender: "grandpa",
    avatarInitial: "李",
    avatarColor: "#8B6914",
    stories: 5,
    chapters: [
      {
        id: "ch-4",
        title: "第一章：大院里的童年",
        summary: "生活在济南的大杂院里，和四十多户邻居共用一口井，街坊情谊比亲戚还亲……",
        createdAt: "2024-03-08",
        content: `我是在济南的一个大杂院里长大的。那个院子住了四十多户人家，共用院子中间的一口老井。

每天早上，大家都到井边打水，顺便聊聊天。谁家有什么事情，整个院子的人都知道。哪家有困难了，左邻右舍都会帮忙，送来粮食或者搭把手。那种日子，现在想起来觉得特别珍贵。

我们一帮孩子整天在胡同里跑，玩弹球、滚铁环、跳方格。大人们忙着生计，我们就自己玩，从早玩到晚，玩累了就在哪家的门槛上坐着歇一歇。

院子里有棵大槐树，夏天大家在树下乘凉，老人讲故事，孩子们围着听，一直到夜里才散。

那棵树现在还在不在，我也不知道。那个院子后来拆了，变成了高楼。但是那棵树，那口井，那些人，在我心里从来没有消失过。`,
      },
    ],
  },
]

// ─── 素材数据 ────────────────────────────────────────────────────────────────

export const MOCK_MATERIALS: Material[] = [
  // 对话记录
  {
    id: "mat-1",
    profileId: "wang-xiulan",
    type: "chat",
    title: "童年记忆对话",
    summary: "聊了小河边捉鱼、过年打糍粑，妈妈做的鱼汤……",
    content: "奶奶回忆了小时候住在湖南湘潭小村子的往事，描述了村口小河、用竹篓捉鱼、妈妈做甜酒酿和鱼汤的温暖记忆，以及全村人过年打糍粑的热闹场景。",
    createdAt: "2024-03-10",
    important: true,
  },
  {
    id: "mat-2",
    profileId: "wang-xiulan",
    type: "chat",
    title: "求学经历对话",
    summary: "走七里山路上学，遇见改变命运的周先生，煤油灯下苦读……",
    content: "奶奶讲述了每天步行七里山路上学的艰辛，在煤油灯下做功课的努力，以及对语文老师周先生的深刻感激——正是他的一句话改变了奶奶的人生方向。",
    createdAt: "2024-03-12",
    important: true,
  },
  {
    id: "mat-3",
    profileId: "wang-xiulan",
    type: "chat",
    title: "婚恋故事对话",
    summary: "生产队干活认识的他，第一次见面帮我挑了一担水……",
    content: "奶奶讲述了在生产队认识爷爷的经过，简朴却温馨的婚礼，以及几十年风雨同舟的夫妻情深。",
    createdAt: "2024-03-15",
  },
  // 录音转写
  {
    id: "mat-4",
    profileId: "wang-xiulan",
    type: "audio",
    title: "录音：家乡的春节",
    summary: "奶奶用方言讲了老家过年的风俗，杀年猪、做腊肉、走亲戚……",
    content: "（录音转写）那时候过年，头天就开始杀猪。村里好几家一起，男人们负责杀，女人们负责处理猪内脏做血肠。猪肉腌好了挂在屋梁上，过年的时候再取下来，那香味啊，隔好远都能闻到……",
    createdAt: "2024-03-18",
    duration: "3分42秒",
  },
  {
    id: "mat-5",
    profileId: "wang-xiulan",
    type: "audio",
    title: "录音：第一次进城",
    summary: "第一次去县城，看到百货大楼，不敢进门，就在门口站着看……",
    content: "（录音转写）我第一次去县城，大概是十五六岁。那时候县城对我来说就像天上一样。走进百货大楼，看见那么多东西摆在柜台上，我不知道怎么说，就是呆掉了一样，站在门口不敢进去……",
    createdAt: "2024-03-20",
    duration: "2分15秒",
  },
  // 文字资料
  {
    id: "mat-6",
    profileId: "wang-xiulan",
    type: "text",
    title: "日记节选：1968年",
    summary: "一段压箱底的老日记，记录了那年的心情和生活……",
    content: "今天生产队分了粮食，我们家分到了三百斤稻谷。妈妈高兴得直说够了够了。弟弟偷偷问我能不能过年吃白米饭，我说能。其实我也不确定，但是我想让他高兴一点。",
    createdAt: "2024-03-22",
    source: "diary",
    timePeriod: "1960年代",
    important: true,
  },
  {
    id: "mat-7",
    profileId: "wang-xiulan",
    type: "text",
    title: "给孙子的信",
    summary: "奶奶手写的信，叮嘱孙子好好读书，说人生最宝贵的是……",
    content: "小明，奶奶老了，很多话想说又不知道怎么说。奶奶这辈子吃了很多苦，但是奶奶不后悔。人活着，只要心里有爱，就不算苦。你好好念书，不是为了赚大钱，是为了让自己看得懂这个世界，懂得选择。",
    createdAt: "2024-03-25",
    source: "letter",
    timePeriod: "近年",
  },
  // 照片
  {
    id: "mat-8",
    profileId: "wang-xiulan",
    type: "photo",
    title: "老照片：结婚那天",
    summary: "1965年结婚时在院子里拍的，那件红棉袄是自己缝的",
    content: "1965年结婚时拍的照片，地点在老家院子里。奶奶穿着自己缝制的红棉袄，爷爷穿着中山装，两人站在院墙前。照片已经发黄，但笑容还在。",
    createdAt: "2024-03-26",
    imageColor: "#C8956C",
    timePeriod: "1965年",
    important: true,
  },
  {
    id: "mat-9",
    profileId: "wang-xiulan",
    type: "photo",
    title: "全家福：1982年",
    summary: "搬新家那年拍的全家福，孩子们都还小",
    content: "1982年搬进新家时拍的全家福，共五口人：爷爷奶奶和三个孩子。背景是新家的大门口，贴着春联。奶奶说那年是她最幸福的一年。",
    createdAt: "2024-03-27",
    imageColor: "#8B6914",
    timePeriod: "1982年",
  },
  // 李建国的素材
  {
    id: "mat-10",
    profileId: "li-jianguo",
    type: "chat",
    title: "大院故事对话",
    summary: "讲了大杂院里的四十户邻居，那口老井，还有槐树下的夜晚……",
    content: "爷爷详细描述了济南大杂院的生活场景：共用一口井、互帮互助的邻里情谊、孩子们在胡同里玩耍的快乐时光，以及夏夜在槐树下听老人讲故事的美好记忆。",
    createdAt: "2024-03-08",
    important: true,
  },
]

// ─── 聊天消息 ────────────────────────────────────────────────────────────────

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "ai",
    content: "奶奶好！今天想跟您聊聊小时候的事情，您小时候住在哪里呀？",
    timestamp: "14:23",
  },
  {
    id: "msg-2",
    role: "user",
    content: "我小时候住在湖南的一个小村子里，家门口有条小河",
    timestamp: "14:24",
  },
  {
    id: "msg-3",
    role: "ai",
    content: "哇，小河边一定有很多有趣的事情吧！您小时候经常去河边玩吗？都会做什么？",
    timestamp: "14:24",
  },
  {
    id: "msg-4",
    role: "user",
    content: "经常去！我们用竹篓子捉鱼，夏天的时候河水凉凉的，很舒服",
    timestamp: "14:25",
  },
  {
    id: "msg-5",
    role: "ai",
    content: "用竹篓子捉鱼真有意思！那捉到的鱼都怎么处理呢？是带回家让妈妈做菜吗？",
    timestamp: "14:25",
  },
  {
    id: "msg-6",
    role: "user",
    content: "对，拿回家让妈妈做鱼汤，那个味道啊，到现在我还记得",
    timestamp: "14:26",
  },
  {
    id: "msg-7",
    role: "ai",
    content: "妈妈做的鱼汤，那是家的味道呀。奶奶，您还记得妈妈做鱼汤时，厨房是什么样子的吗？",
    timestamp: "14:26",
  },
]

// ─── 工具函数 ────────────────────────────────────────────────────────────────

export function getProfileById(id: string): Profile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id)
}

export function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

export function getMaterialsByProfileId(profileId: string): Material[] {
  return MOCK_MATERIALS.filter((m) => m.profileId === profileId)
}

export function getMaterialCountByType(
  profileId: string
): Record<Material["type"], number> {
  const materials = getMaterialsByProfileId(profileId)
  return {
    chat: materials.filter((m) => m.type === "chat").length,
    audio: materials.filter((m) => m.type === "audio").length,
    text: materials.filter((m) => m.type === "text").length,
    photo: materials.filter((m) => m.type === "photo").length,
  }
}

export const MATERIAL_TYPE_LABELS: Record<Material["type"], string> = {
  chat: "对话",
  audio: "录音",
  text: "文字",
  photo: "照片",
}

export const MATERIAL_TYPE_ICONS: Record<Material["type"], string> = {
  chat: "💬",
  audio: "🎙️",
  text: "📄",
  photo: "🖼️",
}

export const SOURCE_LABELS: Record<string, string> = {
  diary: "日记",
  letter: "书信",
  wechat: "微信记录",
  other: "其他",
}
