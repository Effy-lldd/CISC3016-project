# news.json（3条新闻，全覆盖前端所需字段）
```json
[
  {
    "id": 1,
    "title": "",
    "source": "",
    "author": "",
    "publishTime": "",
    "summary": "",
    "image": "",
    "audioUrl": "",
    "content": "",
    "comments": ["", "", ""]
  },
  {
    "id": 2,
    "title": "",
    "source": "",
    "author": "",
    "publishTime": "",
    "summary": "",
    "image": "",
    "audioUrl": "",
    "content": "",
    "comments": ["", "", ""]
  },
  {
    "id": 3,
    "title": "",
    "source": "",
    "author": "",
    "publishTime": "",
    "summary": "",
    "image": "",
    "audioUrl": "",
    "content": "",
    "comments": ["", "", ""]
  }
]
```

## 字段说明

| 字段名       | 数据类型 | 作用说明                                                                 |
|--------------|----------|--------------------------------------------------------------------------|
| id           | 数字     | 新闻唯一标识，区分不同新闻                 |
| title        | 字符串   | 新闻标题，用于列表页卡片、详情页顶部展示                                 |
| source       | 字符串   | 新闻来源站点（如Reuters、Bloomberg）             |
| author       | 字符串   | 新闻作者/分析师      |
| publishTime  | 字符串   | 发布时间（UTC格式）                         |
| image        | 字符串   | 新闻配图地址，无图时填空字符串               |
| audioUrl     | 字符串   | 音频分析地址，无音频时填空字符串            |
| content      | 字符串   | 新闻完整正文|
| comments     | 数组     | 一条随机评论 + 两条AI生成评论        |

