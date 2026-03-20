// 念念 — mock 数据

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
        content: `我出生在湖南湘潭的一个小村子里，村子不大，几十户人家，家家户户都种着水稻。

我们村子门口有一条小河，清清亮亮的，夏天的时候河水不深，刚好到膝盖。我小时候最喜欢的事情，就是和村子里的孩子们一起去河里捉鱼。我们用竹篓子堵在石头缝里，等着鱼儿游进去，有时候一下午能捉好几条，拿回家让妈妈做成鱼汤。

那时候家里穷，但是我不觉得苦。妈妈会给我们做甜酒酿，爸爸会在冬天用稻草编出漂亮的草鞋。村子里的孩子们在一起，整天玩，整天笑，那种快乐是后来再也没有找到过的。

我还记得每到过年，全村子的人都聚在一起，杀猪、打糍粑。那糍粑的香气……到现在我闭上眼睛都能闻到。`,
      },
      {
        id: "ch-2",
        title: "第二章：求学时光",
        summary: "走了七里山路去上学，在煤油灯下做功课，遇见了一生中最好的老师……",
        createdAt: "2024-03-12",
        content: `我上学要走七里路，天不亮就要出发，走过两座山头才到学校。冬天最难熬，路上结了冰，我们就互相搀扶着走，生怕滑倒。

我们的老师叫周先生，是从城里来的。他教我们语文，讲课很好听。他说，读书是穷人家孩子唯一能改变命运的路。这句话我记了一辈子。

那时候家里没有电，晚上做作业只能靠煤油灯。灯光昏黄，熏得眼睛发酸，但我每次都把功课做完了才去睡觉。妈妈看我这么用功，省下吃饭的钱给我买了一支新钢笔，说我将来一定有出息。

那支钢笔我用了好多年，后来磨损了也舍不得扔，一直放在抽屉里。`,
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
        id: "ch-3",
        title: "第一章：大院里的童年",
        summary: "生活在济南的大杂院里，和四十多户邻居共用一口井，街坊情谊比亲戚还亲……",
        createdAt: "2024-03-08",
        content: `我是在济南的一个大杂院里长大的。那个院子住了四十多户人家，共用院子中间的一口老井。

每天早上，大家都到井边打水，顺便聊聊天。谁家有什么事情，整个院子的人都知道。哪家有困难了，左邻右舍都会帮忙，送来粮食或者搭把手。那种日子，现在想起来觉得特别珍贵。

我们一帮孩子整天在胡同里跑，玩弹球、滚铁环、跳方格。大人们忙着生计，我们就自己玩，从早玩到晚，玩累了就在哪家的门槛上坐着歇一歇。

院子里有棵大槐树，夏天大家在树下乘凉，老人讲故事，孩子们围着听，一直到夜里才散。`,
      },
    ],
  },
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "ai",
    content:
      "奶奶好！今天想跟您聊聊小时候的事情，您小时候住在哪里呀？",
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
    content:
      "哇，小河边一定有很多有趣的事情吧！您小时候经常去河边玩吗？都会做什么？",
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
    content:
      "用竹篓子捉鱼真有意思！那捉到的鱼都怎么处理呢？是带回家让妈妈做菜吗？",
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
    content:
      "妈妈做的鱼汤，那是家的味道呀。奶奶，您还记得妈妈做鱼汤时，厨房是什么样子的吗？",
    timestamp: "14:26",
  },
]

export function getProfileById(id: string): Profile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id)
}

export function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}
