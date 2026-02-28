# 弹幕库使用文档

一个功能完善的 React 弹幕组件库，支持侧边栏弹幕和飘屏弹幕两种显示模式。

## 目录

- [安装和使用](#安装和使用)
- [API 文档](#api-文档)
  - [类型定义](#类型定义)
  - [配置接口](#配置接口)
  - [工具函数](#工具函数)
  - [弹幕生成器](#弹幕生成器)
  - [React Hooks](#react-hooks)
- [示例代码](#示例代码)
  - [侧边栏弹幕示例](#侧边栏弹幕示例)
  - [飘屏弹幕示例](#飘屏弹幕示例)
- [最佳实践](#最佳实践)

---

## 安装和使用

### 安装依赖

弹幕库已经集成在项目中，无需额外安装。直接使用导入路径：

```typescript
import {
  DanmakuGenerator,
  useDanmaku,
  useDanmakuPool,
  // 其他导出...
} from '@/shared/danmaku';
```

### 基本使用流程

1. 导入所需的类型、工具函数或 Hooks
2. 准备弹幕文本池和用户池（可选）
3. 使用 `DanmakuGenerator` 生成弹幕
4. 使用 `useDanmaku` 或 `useDanmakuPool` 管理弹幕状态
5. 在组件中渲染弹幕

---

## API 文档

### 类型定义

#### DanmakuMessage

弹幕消息接口，表示单条弹幕的完整信息。

```typescript
interface DanmakuMessage {
  id: string;              // 弹幕唯一标识
  text: string;            // 弹幕文本内容
  color: string;           // 弹幕颜色（十六进制格式）
  size: DanmakuSize;       // 弹幕尺寸
  userId?: string;         // 用户 ID（侧边栏模式需要）
  userName?: string;       // 用户名（侧边栏模式需要）
  userAvatar?: string;     // 用户头像 URL（侧边栏模式需要）
  timestamp?: string;      // 发送时间戳（格式："HH:MM:SS"）
  top?: number;            // 弹幕在轨道中的位置（飘屏模式需要，0-1 之间）
  delay?: number;          // 延迟显示时间（飘屏模式需要，毫秒）
  duration?: number;       // 显示持续时间（飘屏模式需要，毫秒）
}
```

#### DanmakuUser

用户信息接口，表示发送弹幕的用户。

```typescript
interface DanmakuUser {
  id: string;        // 用户唯一标识
  name: string;      // 用户昵称
  avatar: string;    // 用户头像 URL
  level: number;     // 用户等级
  badge: string[];   // 用户徽章列表
}
```

#### DanmakuSize

弹幕尺寸类型：

```typescript
type DanmakuSize = 'small' | 'medium' | 'large';
```

尺寸规则（根据文本长度）：
- `large`：文本长度 <= 3
- `medium`：文本长度 4-8
- `small`：文本长度 > 8

#### DanmakuType

弹幕显示模式类型：

```typescript
type DanmakuType = 'sidebar' | 'horizontal';
```

- `sidebar`：侧边栏模式，弹幕垂直排列
- `horizontal`：飘屏模式，弹幕水平飘动

#### DanmakuTheme

主题样式类型：

```typescript
type DanmakuTheme = 'blood' | 'mix' | 'dongzhu' | 'kaige' | 'tiger' | 'sweet';
```

主题说明：
- `blood`：热血红色主题
- `mix`：紫色混合主题（默认）
- `dongzhu`：冬竹蓝色主题
- `kaige`：凯歌金色主题
- `tiger`：虎橙色主题
- `sweet`：甜蜜粉色主题

#### ColorType

颜色类型：

```typescript
type ColorType = 'primary' | 'secondary' | 'accent';
```

- `primary`：主色调
- `secondary`：辅助色
- `accent`：强调色

### 配置接口

#### DanmakuPoolConfig

弹幕池配置接口：

```typescript
interface DanmakuPoolConfig {
  maxCapacity: number;     // 弹幕池最大容量
  displaySpeed: number;    // 弹幕显示速度（毫秒/条）
  enableMerge: boolean;    // 是否启用弹幕合并
  enableFilter: boolean;   // 是否启用弹幕过滤
  trackCount: number;      // 弹幕轨道数量
  opacity: number;         // 弹幕透明度（0-1）
}
```

#### UseDanmakuConfig

useDanmaku Hook 配置：

```typescript
interface UseDanmakuConfig {
  poolConfig?: DanmakuPoolConfig;  // 弹幕池配置
  defaultTheme?: DanmakuTheme;     // 默认主题，默认为 'mix'
  defaultSize?: DanmakuSize;       // 默认尺寸，默认为 'medium'
  autoPlay?: boolean;              // 是否自动播放，默认为 false
  loop?: boolean;                  // 是否循环播放，默认为 false
  danmakuType?: DanmakuType;       // 弹幕类型，默认为 'sidebar'
}
```

#### BatchOptions

批量生成选项：

```typescript
interface BatchOptions {
  count: number;             // 生成数量
  type: DanmakuType;         // 弹幕类型
  theme?: DanmakuTheme;      // 主题样式
  timeRangeStart?: number;   // 时间范围起始（毫秒）
  timeRangeEnd?: number;     // 时间范围结束（毫秒）
  randomColor?: boolean;     // 是否随机颜色
  randomSize?: boolean;      // 是否随机尺寸
}
```

#### GeneratorConfig

弹幕生成器配置：

```typescript
interface GeneratorConfig {
  videoDuration: number;     // 视频时长（毫秒）
  density: number;           // 弹幕密度（条/秒）
  theme?: DanmakuTheme;      // 主题样式
  colorType?: ColorType;     // 颜色类型
  minInterval?: number;      // 最小间隔时间（毫秒）
  maxInterval?: number;      // 最大间隔时间（毫秒）
}
```

### 工具函数

#### getSizeByTextLength

根据文本长度判断弹幕尺寸。

```typescript
function getSizeByTextLength(text: string): DanmakuSize;
```

**参数：**
- `text`：弹幕文本

**返回值：**
- `DanmakuSize`：弹幕尺寸（'small' | 'medium' | 'large'）

**示例：**
```typescript
const size = getSizeByTextLength('你好');  // 返回 'large'
const size2 = getSizeByTextLength('这是一条很长的弹幕');  // 返回 'small'
```

#### getThemeColor

获取主题颜色。

```typescript
function getThemeColor(theme: DanmakuTheme, type: ColorType): string;
```

**参数：**
- `theme`：主题类型
- `type`：颜色类型（'primary' | 'secondary' | 'accent'）

**返回值：**
- `string`：颜色值（十六进制格式）

**示例：**
```typescript
const color = getThemeColor('blood', 'primary');  // 返回 '#FF4444'
```

#### getRandomDanmakuType

随机获取弹幕类型。

```typescript
function getRandomDanmakuType(): DanmakuType;
```

**返回值：**
- `DanmakuType`：随机的弹幕类型（'sidebar' 或 'horizontal'）

#### generateTimestamp

生成时间戳字符串。

```typescript
function generateTimestamp(date?: Date): string;
```

**参数：**
- `date`：日期对象，可选，默认为当前时间

**返回值：**
- `string`：格式化的时间字符串（格式："HH:MM:SS"）

**示例：**
```typescript
const timestamp = generateTimestamp();  // 返回 "14:30:25"
const timestamp2 = generateTimestamp(new Date('2024-01-01 10:20:30'));  // 返回 "10:20:30"
```

#### getDanmakuColor

从主题颜色中随机获取弹幕颜色。

```typescript
function getDanmakuColor(theme: DanmakuTheme): string;
```

**参数：**
- `theme`：主题类型

**返回值：**
- `string`：随机选择的主题颜色值

### 弹幕生成器

#### DanmakuGenerator

弹幕生成器类，负责生成单条或批量弹幕消息。

**构造函数参数：**

```typescript
constructor(config: {
  theme?: DanmakuTheme;      // 主题样式，默认为 'mix'
  textPool: string[];        // 弹幕文本池（必需）
  users?: DanmakuUser[];     // 用户池，可选
  colorType?: ColorType;     // 颜色类型，默认为 'primary'
  danmakuType?: DanmakuType; // 弹幕类型，默认为 'sidebar'
  randomColor?: boolean;     // 是否随机颜色，默认为 false
  randomSize?: boolean;      // 是否随机尺寸，默认为 false
})
```

**实例方法：**

##### generateMessage

生成单条弹幕消息。

```typescript
generateMessage(index: number): DanmakuMessage;
```

**参数：**
- `index`：弹幕索引，用于生成唯一 ID

**返回值：**
- `DanmakuMessage`：单条弹幕消息对象

**示例：**
```typescript
const generator = new DanmakuGenerator({
  textPool: ['你好', '世界', '弹幕测试'],
  theme: 'blood'
});

const message = generator.generateMessage(0);
// 返回：{ id: 'danmaku-1234567890-0', text: '你好', color: '#FF4444', ... }
```

##### generateBatch

批量生成弹幕消息。

```typescript
generateBatch(options: BatchOptions): DanmakuMessage[];
```

**参数：**
- `options`：批量生成选项

**返回值：**
- `DanmakuMessage[]`：弹幕消息数组

**示例：**
```typescript
const messages = generator.generateBatch({
  count: 10,
  type: 'horizontal',
  theme: 'sweet',
  randomColor: true,
  randomSize: true
});
```

### React Hooks

#### useDanmaku

弹幕管理 Hook，提供弹幕列表状态和管理函数。

**参数：**

```typescript
useDanmaku(config: UseDanmakuConfig);
```

**返回值：**

```typescript
{
  danmakuList: DanmakuMessage[];           // 所有弹幕列表
  currentDanmaku: DanmakuMessage[];        // 当前应该显示的弹幕
  isPlaying: boolean;                      // 是否正在播放
  currentTime: number;                     // 当前播放进度（毫秒）
  addDanmaku: (message: DanmakuMessage) => void;           // 添加单条弹幕
  addDanmakuBatch: (messages: DanmakuMessage[]) => void;   // 批量添加弹幕
  removeDanmaku: (id: string) => void;     // 移除指定弹幕
  clearDanmaku: () => void;                // 清空所有弹幕
  setPlaying: (playing: boolean) => void;  // 更新播放状态
  setCurrentTime: (time: number) => void;  // 更新当前时间
  getDanmakuByTimeRange: (start: number, end: number) => DanmakuMessage[];  // 根据时间范围获取弹幕
}
```

**示例：**
```typescript
const {
  danmakuList,
  currentDanmaku,
  addDanmaku,
  isPlaying,
  setPlaying
} = useDanmaku({
  defaultTheme: 'blood',
  autoPlay: true,
  danmakuType: 'sidebar'
});
```

#### useDanmakuPool

弹幕池管理 Hook，提供弹幕池状态和管理函数。

**参数：**

```typescript
useDanmakuPool(config: DanmakuPoolConfig);
```

**返回值：**

```typescript
{
  pool: DanmakuMessage[];                  // 弹幕池队列
  trackCount: number;                      // 弹幕轨道数量
  opacity: number;                         // 弹幕透明度
  trackOccupancy: boolean[];               // 轨道占用情况
  availableTracks: number[];               // 可用轨道列表
  poolStatus: {                            // 弹幕池状态
    currentSize: number;
    maxCapacity: number;
    isFull: boolean;
    availableTracks: number;
    occupancyRate: number;
  };
  addToPool: (message: DanmakuMessage) => void;           // 添加弹幕到池
  addToPoolBatch: (messages: DanmakuMessage[]) => void;   // 批量添加弹幕到池
  removeFromPool: (id: string) => void;    // 从弹幕池移除弹幕
  clearPool: () => void;                   // 清空弹幕池
  occupyTrack: (trackIndex: number) => void;  // 占用轨道
  releaseTrack: (trackIndex: number) => void; // 释放轨道
  getNextAvailableTrack: () => number;     // 获取下一个可用轨道
  processDanmaku: (messages: DanmakuMessage[]) => DanmakuMessage[];  // 处理弹幕（合并和过滤）
  mergeDuplicateDanmaku: (messages: DanmakuMessage[]) => DanmakuMessage[];  // 合并重复弹幕
  filterDanmaku: (messages: DanmakuMessage[]) => DanmakuMessage[];      // 过滤弹幕
}
```

**示例：**
```typescript
const {
  pool,
  addToPool,
  getNextAvailableTrack,
  occupyTrack,
  releaseTrack
} = useDanmakuPool({
  maxCapacity: 100,
  displaySpeed: 1000,
  trackCount: 8,
  enableFilter: true
});
```

---

## 示例代码

### 侧边栏弹幕示例

侧边栏弹幕适合用于直播聊天室、视频评论区等场景，弹幕垂直排列显示。

```tsx
import React, { useState, useEffect } from 'react';
import {
  DanmakuGenerator,
  useDanmaku,
  type DanmakuMessage,
  type DanmakuUser
} from '@/shared/danmaku';

// 弹幕文本池
const TEXT_POOL = [
  '这个视频太棒了！',
  '学到了学到了',
  '666666',
  '前方高能',
  '感谢分享',
  'mark 一下',
  '大佬牛逼',
  '再来亿遍',
  '通俗易懂',
  '收藏了'
];

// 用户池
const USERS: DanmakuUser[] = [
  {
    id: 'user1',
    name: '小明',
    avatar: '/avatars/user1.png',
    level: 5,
    badge: ['vip', 'active']
  },
  {
    id: 'user2',
    name: '小红',
    avatar: '/avatars/user2.png',
    level: 3,
    badge: ['newbie']
  },
  {
    id: 'user3',
    name: '大佬',
    avatar: '/avatars/user3.png',
    level: 10,
    badge: ['expert', 'vip', 'founder']
  }
];

// 侧边栏弹幕组件
const SidebarDanmakuItem: React.FC<{ message: DanmakuMessage }> = ({ message }) => {
  return (
    <div
      style={{
        padding: '8px 12px',
        marginBottom: '8px',
        backgroundColor: `${message.color}20`,  // 20% 透明度背景
        borderLeft: `3px solid ${message.color}`,
        borderRadius: '4px',
        fontSize: message.size === 'large' ? '16px' : message.size === 'medium' ? '14px' : '12px',
        color: '#333',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        {message.userAvatar && (
          <img
            src={message.userAvatar}
            alt={message.userName}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              marginRight: '8px'
            }}
          />
        )}
        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
          {message.userName || '匿名用户'}
        </span>
        <span style={{ marginLeft: '8px', fontSize: '10px', color: '#999' }}>
          {message.timestamp}
        </span>
      </div>
      <div>{message.text}</div>
    </div>
  );
};

// 侧边栏弹幕示例组件
const SidebarDanmakuExample: React.FC = () => {
  const [inputText, setInputText] = useState('');
  
  // 使用 useDanmaku Hook 管理弹幕
  const {
    danmakuList,
    currentDanmaku,
    addDanmaku,
    clearDanmaku,
    isPlaying,
    setPlaying
  } = useDanmaku({
    defaultTheme: 'mix',
    defaultSize: 'medium',
    autoPlay: true,
    danmakuType: 'sidebar',
    poolConfig: {
      maxCapacity: 50,  // 最多显示 50 条弹幕
      displaySpeed: 1000
    }
  });

  // 创建弹幕生成器
  const generator = React.useMemo(() => {
    return new DanmakuGenerator({
      textPool: TEXT_POOL,
      users: USERS,
      theme: 'mix',
      danmakuType: 'sidebar',
      randomColor: true,
      randomSize: true
    });
  }, []);

  // 模拟接收弹幕（每秒随机生成一条）
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const message = generator.generateMessage(Date.now());
      addDanmaku(message);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, generator, addDanmaku]);

  // 发送自定义弹幕
  const handleSendDanmaku = () => {
    if (!inputText.trim()) return;

    const customMessage: DanmakuMessage = {
      id: `custom-${Date.now()}`,
      text: inputText,
      color: '#FF69B4',
      size: 'medium',
      userName: '我',
      userAvatar: '/avatars/me.png',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    addDanmaku(customMessage);
    setInputText('');
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* 弹幕显示区域 */}
      <div
        style={{
          flex: 1,
          height: '500px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '16px',
          overflowY: 'auto'
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
          侧边栏弹幕（{danmakuList.length}条）
        </h3>
        
        {currentDanmaku.map((message) => (
          <SidebarDanmakuItem key={message.id} message={message} />
        ))}
        
        {currentDanmaku.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '100px' }}>
            暂无弹幕
          </div>
        )}
      </div>

      {/* 控制区域 */}
      <div style={{ width: '300px' }}>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setPlaying(!isPlaying)}
            style={{
              padding: '10px 20px',
              backgroundColor: isPlaying ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          
          <button
            onClick={clearDanmaku}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清空
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入弹幕内容..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '8px',
              boxSizing: 'border-box'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendDanmaku()}
          />
          
          <button
            onClick={handleSendDanmaku}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            发送弹幕
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#666' }}>
          <p>当前弹幕数：{danmakuList.length}</p>
          <p>显示弹幕数：{currentDanmaku.length}</p>
          <p>播放状态：{isPlaying ? '播放中' : '已暂停'}</p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarDanmakuExample;
```

### 飘屏弹幕示例

飘屏弹幕适合用于视频弹幕、直播弹幕等场景，弹幕水平飘过屏幕。

```tsx
import React, { useState, useEffect } from 'react';
import {
  DanmakuGenerator,
  useDanmaku,
  type DanmakuMessage,
  type DanmakuUser
} from '@/shared/danmaku';

// 弹幕文本池
const TEXT_POOL = [
  '前方高能预警！！！',
  '名场面来了',
  '这操作太秀了',
  '全体起立',
  '泪目',
  '爷青回',
  '梦幻联动',
  '时代的眼泪',
  '经典永流传',
  '此生无悔'
];

// 用户池
const USERS: DanmakuUser[] = [
  {
    id: 'user1',
    name: '弹幕用户 A',
    avatar: '/avatars/a.png',
    level: 5,
    badge: ['vip']
  },
  {
    id: 'user2',
    name: '弹幕用户 B',
    avatar: '/avatars/b.png',
    level: 8,
    badge: ['expert', 'vip']
  }
];

// 飘屏弹幕组件
const HorizontalDanmakuItem: React.FC<{ message: DanmakuMessage }> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 延迟显示
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, message.delay || 0);

    // 持续时间后隐藏
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, (message.delay || 0) + (message.duration || 6000));

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message.delay, message.duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${(message.top || 0) * 100}%`,
        left: 0,
        padding: '8px 16px',
        backgroundColor: `${message.color}CC`,  // CC=80% 透明度
        borderRadius: '20px',
        color: 'white',
        fontSize: message.size === 'large' ? '18px' : message.size === 'medium' ? '16px' : '14px',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        animation: 'danmakuMove 6s linear forwards',
        zIndex: 1000
      }}
    >
      {message.text}
    </div>
  );
};

// 飘屏弹幕示例组件
const HorizontalDanmakuExample: React.FC = () => {
  const [videoDuration, setVideoDuration] = useState(60000);  // 视频时长 60 秒
  const [currentTime, setCurrentTime] = useState(0);
  
  // 使用 useDanmaku Hook 管理弹幕
  const {
    danmakuList,
    currentDanmaku,
    addDanmakuBatch,
    clearDanmaku,
    isPlaying,
    setPlaying,
    setCurrentTime
  } = useDanmaku({
    defaultTheme: 'blood',
    autoPlay: false,
    danmakuType: 'horizontal',
    poolConfig: {
      maxCapacity: 100,
      displaySpeed: 500
    }
  });

  // 创建弹幕生成器
  const generator = React.useMemo(() => {
    return new DanmakuGenerator({
      textPool: TEXT_POOL,
      users: USERS,
      theme: 'blood',
      danmakuType: 'horizontal',
      randomColor: true,
      randomSize: true
    });
  }, []);

  // 生成弹幕（在指定时间点）
  const generateDanmakuAtTime = (timeMs: number) => {
    const messages = generator.generateBatch({
      count: Math.floor(Math.random() * 3) + 1,  // 随机生成 1-3 条
      type: 'horizontal',
      theme: 'blood',
      timeRangeStart: timeMs,
      timeRangeEnd: timeMs + 1000,
      randomColor: true,
      randomSize: true
    });
    
    addDanmakuBatch(messages);
  };

  // 模拟视频播放
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 100;
        
        // 在特定时间点生成弹幕
        if (newTime % 5000 < 100) {  // 每 5 秒生成一次
          generateDanmakuAtTime(newTime);
        }
        
        // 循环播放
        if (newTime >= videoDuration) {
          return 0;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, videoDuration, setCurrentTime]);

  // 进度条拖拽
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  // 格式化时间
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
        飘屏弹幕示例
      </h3>

      {/* 弹幕显示区域 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}
      >
        {/* 模拟视频内容 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '24px'
        }}>
          视频播放区域
        </div>

        {/* 弹幕层 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '40px',  // 留出底部控制区域
          overflow: 'hidden'
        }}>
          {currentDanmaku.map((message) => (
            <HorizontalDanmakuItem key={message.id} message={message} />
          ))}
        </div>

        {/* 弹幕计数 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
          fontSize: '12px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          弹幕数：{danmakuList.length}
        </div>
      </div>

      {/* 控制区域 */}
      <div style={{ marginBottom: '16px' }}>
        {/* 进度条 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', width: '40px' }}>
            {formatTime(currentTime)}
          </span>
          
          <input
            type="range"
            min="0"
            max={videoDuration}
            value={currentTime}
            onChange={handleProgressChange}
            style={{ flex: 1, cursor: 'pointer' }}
          />
          
          <span style={{ fontSize: '12px', width: '40px' }}>
            {formatTime(videoDuration)}
          </span>
        </div>

        {/* 控制按钮 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPlaying(!isPlaying)}
            style={{
              padding: '10px 20px',
              backgroundColor: isPlaying ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '暂停' : '播放'}
          </button>

          <button
            onClick={() => generateDanmakuAtTime(currentTime)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            发送弹幕
          </button>

          <button
            onClick={clearDanmaku}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清空弹幕
          </button>
        </div>
      </div>

      {/* 状态信息 */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <p style={{ margin: '4px 0' }}>当前时间：{formatTime(currentTime)}</p>
        <p style={{ margin: '4px 0' }}>总弹幕数：{danmakuList.length}</p>
        <p style={{ margin: '4px 0' }}>显示弹幕数：{currentDanmaku.length}</p>
        <p style={{ margin: '4px 0' }}>播放状态：{isPlaying ? '播放中' : '已暂停'}</p>
      </div>

      <style>{`
        @keyframes danmakuMove {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default HorizontalDanmakuExample;
```

---

## 最佳实践

### 1. 性能优化

#### 限制弹幕数量
使用 `poolConfig.maxCapacity` 限制弹幕池容量，避免 DOM 节点过多：

```typescript
const { danmakuList } = useDanmaku({
  poolConfig: {
    maxCapacity: 100,  // 最多保留 100 条弹幕
    displaySpeed: 1000
  }
});
```

#### 使用 React.memo 优化渲染
对于频繁更新的弹幕组件，使用 `React.memo` 避免不必要的重渲染：

```typescript
const DanmakuItem = React.memo(({ message }: { message: DanmakuMessage }) => {
  return <div>{message.text}</div>;
});
```

#### 虚拟滚动
对于侧边栏弹幕，当弹幕数量很大时，考虑使用虚拟滚动技术。

### 2. 弹幕去重和过滤

#### 启用弹幕合并
避免相同内容的弹幕重复显示：

```typescript
const { processDanmaku } = useDanmakuPool({
  maxCapacity: 100,
  enableMerge: true,  // 启用合并
  enableFilter: true  // 启用过滤
});

// 处理弹幕
const processed = processDanmaku(rawMessages);
```

#### 自定义过滤逻辑
实现敏感词过滤等自定义过滤规则：

```typescript
const SENSITIVE_WORDS = ['敏感词 1', '敏感词 2'];

const filterDanmaku = (messages: DanmakuMessage[]): DanmakuMessage[] => {
  return messages.filter(message => {
    // 过滤空文本
    if (!message.text || message.text.trim() === '') {
      return false;
    }
    
    // 过滤敏感词
    const hasSensitiveWord = SENSITIVE_WORDS.some(word => 
      message.text.includes(word)
    );
    
    return !hasSensitiveWord;
  });
};
```

### 3. 弹幕主题切换

#### 动态切换主题
根据用户选择动态切换弹幕主题：

```typescript
const [currentTheme, setCurrentTheme] = useState<DanmakuTheme>('mix');

const { addDanmaku } = useDanmaku({
  defaultTheme: currentTheme
});

// 切换主题
const handleThemeChange = (theme: DanmakuTheme) => {
  setCurrentTheme(theme);
};
```

#### 使用主题颜色配置
根据主题获取对应的颜色：

```typescript
import { getThemeColor, THEME_COLORS } from '@/shared/danmaku';

const primaryColor = getThemeColor('blood', 'primary');  // '#FF4444'
const allColors = THEME_COLORS.sweet;  // 获取甜蜜主题的所有颜色
```

### 4. 弹幕与视频同步

#### 根据视频时间轴显示弹幕
将弹幕与视频播放进度同步：

```typescript
const VideoWithDanmaku: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    setCurrentTime,
    getDanmakuByTimeRange,
    addDanmakuBatch
  } = useDanmaku({
    autoPlay: false,
    danmakuType: 'horizontal'
  });

  // 视频时间更新时同步弹幕
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime * 1000;  // 转换为毫秒
      setCurrentTime(currentTime);
      
      // 获取当前时间点应该显示的弹幕
      const danmaku = getDanmakuByTimeRange(currentTime, currentTime + 1000);
      // 渲染弹幕...
    }
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      onTimeUpdate={handleTimeUpdate}
    />
  );
};
```

#### 预加载弹幕
提前加载一段时间内的弹幕，避免卡顿：

```typescript
// 预加载未来 5 秒的弹幕
const preloadDanmaku = (currentTime: number) => {
  const futureDanmaku = getDanmakuByTimeRange(
    currentTime,
    currentTime + 5000
  );
  
  // 提前准备好这些弹幕
  addDanmakuBatch(futureDanmaku);
};
```

### 5. 用户体验优化

#### 弹幕平滑过渡
使用 CSS 动画实现平滑的弹幕效果：

```css
@keyframes danmakuMove {
  from {
    transform: translateX(100vw);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
```

#### 弹幕交互
支持点击弹幕查看详情或举报：

```typescript
const DanmakuItem: React.FC<{ message: DanmakuMessage }> = ({ message }) => {
  const handleClick = () => {
    console.log('点击弹幕:', message);
    // 显示用户信息、举报等
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {message.text}
    </div>
  );
};
```

#### 弹幕透明度调节
允许用户调节弹幕透明度：

```typescript
const [opacity, setOpacity] = useState(1);

const { pool } = useDanmakuPool({
  maxCapacity: 100,
  opacity: opacity  // 0-1 之间
});

// 用户通过滑块调节透明度
<input
  type="range"
  min="0"
  max="1"
  step="0.1"
  value={opacity}
  onChange={(e) => setOpacity(parseFloat(e.target.value))}
/>
```

### 6. 弹幕生成策略

#### 合理设置弹幕密度
根据视频时长和类型设置合适的弹幕密度：

```typescript
const generator = new DanmakuGenerator({
  textPool: TEXT_POOL,
  theme: 'mix'
});

// 生成弹幕
const messages = generator.generateBatch({
  count: 50,  // 生成 50 条弹幕
  type: 'horizontal',
  timeRangeStart: 0,
  timeRangeEnd: videoDuration,  // 根据视频时长分配
  randomColor: true
});
```

#### 避免弹幕重叠
对于飘屏弹幕，合理分配轨道位置：

```typescript
const { getNextAvailableTrack, occupyTrack, releaseTrack } = useDanmakuPool({
  trackCount: 8  // 8 个轨道
});

// 分配轨道
const trackIndex = getNextAvailableTrack();
if (trackIndex !== -1) {
  occupyTrack(trackIndex);
  
  // 弹幕显示完成后释放轨道
  setTimeout(() => {
    releaseTrack(trackIndex);
  }, duration);
}
```

### 7. 错误处理

#### 处理空文本池
确保文本池不为空：

```typescript
const TEXT_POOL = defaultTexts.length > 0 ? defaultTexts : ['默认弹幕'];

const generator = new DanmakuGenerator({
  textPool: TEXT_POOL
});
```

#### 处理用户池为空
用户池为空时，弹幕会显示为匿名用户：

```typescript
const generator = new DanmakuGenerator({
  textPool: TEXT_POOL,
  users: users.length > 0 ? users : undefined  // 空数组传 undefined
});
```

### 8. 测试建议

#### 单元测试
为弹幕生成逻辑编写单元测试：

```typescript
describe('DanmakuGenerator', () => {
  it('应该生成单条弹幕', () => {
    const generator = new DanmakuGenerator({
      textPool: ['测试弹幕']
    });
    
    const message = generator.generateMessage(0);
    expect(message.text).toBe('测试弹幕');
    expect(message.id).toBeDefined();
  });
  
  it('应该批量生成弹幕', () => {
    const generator = new DanmakuGenerator({
      textPool: ['测试弹幕']
    });
    
    const messages = generator.generateBatch({
      count: 10,
      type: 'sidebar'
    });
    
    expect(messages).toHaveLength(10);
  });
});
```

#### 集成测试
测试完整的弹幕流程：

```typescript
describe('弹幕集成测试', () => {
  it('应该正确处理弹幕的添加和移除', () => {
    const { result } = renderHook(() => 
      useDanmaku({ defaultTheme: 'mix' })
    );
    
    const message: DanmakuMessage = {
      id: 'test-1',
      text: '测试',
      color: '#FF0000',
      size: 'medium'
    };
    
    act(() => {
      result.current.addDanmaku(message);
    });
    
    expect(result.current.danmakuList).toHaveLength(1);
    
    act(() => {
      result.current.removeDanmaku('test-1');
    });
    
    expect(result.current.danmakuList).toHaveLength(0);
  });
});
```

---

## 常见问题

### Q: 如何自定义弹幕样式？
A: 弹幕组件的样式完全由您控制。参考示例代码中的 `SidebarDanmakuItem` 和 `HorizontalDanmakuItem` 组件，您可以根据需求自定义渲染逻辑和样式。

### Q: 如何实现弹幕的持久化存储？
A: 可以将弹幕数据保存到 localStorage 或后端数据库：

```typescript
// 保存到 localStorage
localStorage.setItem('danmaku', JSON.stringify(danmakuList));

// 从 localStorage 加载
const savedDanmaku = JSON.parse(localStorage.getItem('danmaku') || '[]');
addDanmakuBatch(savedDanmaku);
```

### Q: 如何实现实时弹幕（WebSocket）？
A: 监听 WebSocket 消息并添加到弹幕池：

```typescript
useEffect(() => {
  const ws = new WebSocket('ws://your-server.com');
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    addDanmaku(message);
  };
  
  return () => ws.close();
}, [addDanmaku]);
```

### Q: 弹幕动画卡顿怎么办？
A: 可以尝试以下优化：
1. 减少同时显示的弹幕数量
2. 使用 CSS transform 而非 left/top 属性
3. 开启硬件加速（will-change 属性）
4. 使用 requestAnimationFrame 优化动画

---

## 更新日志

- **v1.0.0**: 初始版本，支持侧边栏和飘屏两种弹幕模式
- 提供完整的类型定义和配置系统
- 实现弹幕生成器和 React Hooks
- 包含完整的测试用例

---

## 许可证

MIT License
