class Player {
  constructor(config) {
    this.config = config
  }
  async init() {
    let _this = this
    return new Promise(async (resolve) => {
      let webControl = new WebControl({
        szPluginContainer: _this.el, // 指定 DIV 窗口标识
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        // 用于 IE10 使用 ActiveX 的 clsid
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",
        cbConnectSuccess() {
          _this.webControl = webControl
          _this.webControl.JS_StartService("window", {
            dllPath: "./VideoPluginConnect.dll"
          }).then(async () => {
            _this.webControl.JS_SetWindowControlCallback({
              cbIntegrationCallBack: function(oData) { // oData 是封装的视频 web 插件回调消息的消息体
              }
            })
            await _this.initPlayer(resolve)
          }, () => {
            // 启动服务失败
            console.error('启动服务失败')
            resolve({
              isSuccess: false,
              msg: '启动服务失败'
            })
          })
        },
        cbConnectError() {
          console.error('初始化插件失败')
          // WebControl.JS_WakeUp("VideoWebPlugin://");
          resolve({
            isSuccess: false,
            msg: '初始化插件失败'
          })
        },
        cbConnectClose() {
          console.error('中断')
          resolve({
            isSuccess: false,
            msg: '中断'
          })
        }
      })
    })
  }
  async initPlayer(resol) {
    return new Promise((resolve) => {
      let { el, width, height, ip, port, layout, appkey, isShowToolbar = true } = this.config
      this.webControl.JS_CreateWnd(el, width, height).then(async () => {
        let secretEncode = await this.getPubKey()
        const playMode = 0; //初始播放模式：0-预览，1-回放
        const snapDir = 'D:\\SnapDir'; //抓图存储路径
        const videoDir = 'D:\\VideoDir'; //紧急录像或录像剪辑存储路径
        const enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
        const encryptedFields = 'secret'; //加密字段，默认加密领域为secret
        const showSmart = 1; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        const buttonIDs = '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769'; //自定义工具条按钮
        ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////
        this.webControl
          .JS_RequestInterface({
            funcName: 'init',
            argument: JSON.stringify({
              appkey, //API网关提供的appkey
              secret: secretEncode, //API网关提供的secret
              ip, //API网关IP地址
              playMode: playMode, //播放模式（决定显示预览还是回放界面）
              port, //端口
              snapDir: snapDir, //抓图存储路径
              videoDir: videoDir, //紧急录像或录像剪辑存储路径
              layout: layout, //布局
              enableHTTPS: enableHTTPS, //是否启用HTTPS协议
              encryptedFields: encryptedFields, //加密字段
              showToolbar: +isShowToolbar, //是否显示工具栏
              showSmart: showSmart, //是否显示智能信息
              buttonIDs: buttonIDs, //自定义工具条按钮
              reconnectTimes: 3, // 重连次数
            })
          })
          .then((oData) => {
            this.webControl.JS_Resize(width, height); // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            resolve({
              isSuccess: true,
              msg: '初始化播放器成功'
            })
            resol(
              {
                isSuccess: true,
                msg: '初始化播放器成功',
                instance: this
              }
            )
          })
      })
    })

  }
  //获取公钥
  getPubKey() {
    return new Promise((resolve) => {
      this.webControl
        .JS_RequestInterface({
          funcName: 'getRSAPubKey',
          argument: JSON.stringify({
            keyLength: 1024,
          }),
        })
        .then((oData) => {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(oData.responseMsg.data)
          let data = encrypt.encrypt(this.config.secret)
          resolve(data)
        })
    })
  }

  play(sn, index = -1) {
    this.webControl.JS_RequestInterface({
      funcName: 'startPreview',
      argument: JSON.stringify({
        cameraIndexCode: sn, //监控点编号
        streamMode: 0, //主子码流标识
        transMode: 1, //传输协议
        gpuMode: 0, //是否开启GPU硬解
        // TODO 到时候放开, 还有bug
        wndId: index, //可指定播放窗口
      }),
    });
  }

  resize() {
    this.webControl.JS_Resize(this.config.width, this.config.height);
  }

  destroy() {
    this.webControl.JS_DestroyWnd()
  }
}
module.exports.default = module.exports = Player