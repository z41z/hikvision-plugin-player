# hikvision-plugin-player
Hikvision Player By WebControl Plugin


## Install

``` node
  npm i hikvision-plugin-player -S
```

## CDN

``` js
  <script src="https://unpkg.com/hikvision-plugin-player/dist/index.min.js"></script>
  <script src="https://unpkg.com/hikvision-plugin-player/dist/jsencrypt.min.js"></script>
  <script src="https://unpkg.com/hikvision-plugin-player/dist/jsWebControl-1.0.0.min.js"></script>
```

### Usage
``` html
  // 必须引用基础库
  // <script src="https://unpkg.com/hikvision-plugin-player/dist/jsencrypt.min.js"></script>
  // <script src="https://unpkg.com/hikvision-plugin-player/dist/jsWebControl-1.0.0.min.js"></script>
  <template>
    <div id="player"></div>
  </template>
  <script>
  import HikvisionPlugin from 'hikvision-plugin-player'
  export default {
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      async init() {
        let player = await new HikvisionPlugin.Player({
          el: 'player',
          width: 800,
          height: 600,
          layout: '1x1',
          host: 'ISC Host',
          port: 443,
          secret: 'ISC Secret',
          appkey: 'ISC Appkey',
          isShowToolbar: false
        }).init()
        // player = {
        //   isSuccess: Boolean,
        //   instance: {
        //     config: Object,
        //     webControl: WebControl
        //   },
        //   msg: String
        // }
        this.player = player.instance
      }
    },
    components: {
    },
  }
  </script>
  <style lang="less" scoped>
  #player {
    width: 800px;
    height: 600px;
  }
  </style>
  
```
### Function
  - #### 初始化
    ``` js
      this.player.init()
    ```
  - #### 根据sn播放
    ``` js
      this.player.play(sn, winId = -1)
    ```
  - #### 调整窗口大小
    ``` js
      this.player.resize()
    ```
  - #### 销毁
    ``` js
      this.player.destroy()
    ```

### 海康Web插件开发指南
  - [海康Web插件开发指南](https://unpkg.com/hikvision-plugin-player/dist/视频WEB插件V1.5.2开发指南.pdf)