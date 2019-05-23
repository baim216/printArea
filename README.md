# printArea
printArea no jquery

## 说明
此功能是[jquery printArea](https://github.com/RitsC/PrintArea)代码修改，不需要安装任何依赖(也不需要jquery)

## install
```
npm install print-area
```

## use
```
import PrintArea from 'print-area';

const printArea = new PrintArea(element, options);
printArea.print();
```

##api

####params
  
| 名称(name) |  类型(type) |是否必填(required) | 默认值(default) | 说明(description) |
| ----- | ----- | ----- | ----- | ----- |
|element| Element/String |true|null|需要打印的元素，可以是元素节点，也可以是document.querySelector()选择器|
|options|Object|false|见下表|传递的参数|

####options
  
| 名称(name) |  类型(type) | 可选范围(required) | 默认值(default) | 说明(description) |
| ----- | ----- | ----- | ----- | ----- |
|mode|String|"iframe":将元素插入到iframe中打印  "popup":将元素插入到新的window中打印|"iframe"| 打印呈现的方式 |
|standard|String|"strict"  "loose"  "html5"|"html5"| 文档形式 |
|popHt|Number|无|500| mode="popup"时，窗口的高度 |
|popWd|Number|无|400| mode="popup"时，窗口的宽度 |
|popX|Number|无|200| mode="popup"时，窗口的位置，x方向 |
|popY|Number|无|200| mode="popup"时，窗口的位置，y方向 |
|popTitle|String|无|''| mode="popup"时，窗口的title |
|popClose|Boolean|true, false|true| mode="popup"时，打印完毕或者取消，是否关闭新打开的window |
|extraCss|String|无|''| 需要额外额引入的css的地址，如'/static/print-area.css,/static/print-media.css'，如果当前页面的link中有rel="stylesheet"属性会自动引入 |
|extraHead|String|无|''| 需要额外额引入的头，如'&lt;meta http-equiv="Content-Type" content="text/html;charset=utf-8"&gt;&lt;meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"&gt;'，当前页面的头会自动引入 |
|retainAttr|Array|无|["id", "class", "style"]| 打印元素上需要复制的属性 |

##version
0.1.0

## license
MIT
