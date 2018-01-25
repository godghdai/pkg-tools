##功能简介
####搜索包，从github或npm搜索
![](./serch.jpg)

|  option | alias  | describe  |
| ------------ | ------------ | ------------ |
| --limit |-l |每页显示的条目 |
| --page| -p | 分页显示，第几页 |
| --trans| -t |按翻译后包名搜索，中文转英文或者英文转中文 |
| --g| -g |从github获取版本，默认从npm |

####查询包版本，从github或npm获取
![](./versions.jpg)

|  option | alias  | describe  |
| ------------ | ------------ | ------------ |
| --limit |-l |返回的条目数 |
| --range| -r | 根据条件(semver range)过滤版本列表 |
| --g| -g |从github获取版本，默认从npm |

####查单词
![](./trans.jpg)

|  option | alias  | describe  |
| ------------ | ------------ | ------------ |
| --engine |-e |翻译引擎，值为（baidu,qq,youdao首字母) |

####从github克隆主包及依赖，用来批量下载源码
![](./clone.jpg)

|  option | alias  | describe  |
| ------------ | ------------ | ------------ |
| --filter |-f |过滤包名的正则 |
| --include |-i |保留包名的正则 |
| --main |-m |是否克隆主包，默认不克隆 |

