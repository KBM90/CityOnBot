const {Telegraf} = require('telegraf')
const Extra = require('extra')
const QrCode = require('qrcode-reader')
const Jimp = require('jimp')
const bot = new Telegraf('1601138751:AAHDMJm7qHykieHFXKp1BmLDo0q538oG1pI')

bot.use(Telegraf.log())
bot.catch(err => {
  console.log('Ooops', err)
})

bot.start(ctx => ctx.reply('Hello'))
bot.help(ctx => ctx.reply('Help message'))
bot.on('message', ctx => {
  if (ctx.message.photo) {
    let photo = ctx.message.photo
    let fileId = photo[photo.length - 1].file_id
    ctx.telegram
      .getFile(fileId)
      .then(file => {
        console.log('file:' + JSON.stringify(file))
        return ctx.telegram.getFileLink(file.file_id)
      })
      .then(url => {
        console.log('Url ' + url)
        return Jimp.read(url).then(image => {
          var qr = new QrCode()

          return new Promise((resolve, reject) => {
            qr.callback = function (err, value) {
              if (err) {
                return reject(err)
              }
              return resolve(value)
            }
            qr.decode(image.bitmap)
          })
        })
      })
      .then(value => {
        ctx.telegram.sendMessage(
          ctx.from.id,
          'QR detected: ' + JSON.stringify(value)
        )
      })
      .catch(err => {
        ctx.telegram.sendMessage(ctx.from.id, 'Error detected: ' + err)
      })
  } else {
    ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard))
  }
})

bot.action('delete', ({ deleteMessage }) => deleteMessage())
bot.startPolling()
