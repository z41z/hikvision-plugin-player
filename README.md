# hikvision-plugin-player
Hikvision Player By WebControl Plugin


## Install

``` node
  npm i xxx //or yarn add xxx
```

## CDN

``` js
  <script src="https://unpkg.com/hikvision-plugin-player/dist/index.min.js"></script>
  <script>

  </script>
```

### Usage
``` html
  <div id="player" style="width:800px;height:600px"></div>
```
``` js
  import HikvisionPlugin from 'hikvision-plugin-player'
  let player = await new HikvisionPlugin.Player({
    el:'player',
    width:800,
    height:600,
    layout: '1x1',
    ip:'ISC ip',
    port:443,
    secret:'ISC secret',
    appkey:'ISC appkey',
    isShowToolbar: false
  }).init()
  
```