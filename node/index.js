const { Telegraf } = require('telegraf')
const axios  = require('axios')
const bot = new Telegraf('1601138751:AAHDMJm7qHykieHFXKp1BmLDo0q538oG1pI')

const wordsList = {
  "fr" : {
    "Hello" : "Bonjour",
    "Bye"   : "Au revoir",
  },
  "ar" : {
    "Hello" : "Bonjour",
    "Bye"   : "Au revoir",
  },
  "en" : {
    "Hello" : "Hello",
    "Bye"   : "Bye",
         }
}

//    /start
bot.start((ctx)=>{
  username = ctx.message.from.first_name + " "+ ctx.message.from.last_name
  language = ctx.message.from.language_code
  if(language in wordsList === false){
    language = "en"
  }
  ctx.reply(wordsList[language].Hello+" "+username)
  ctx.telegram.sendMessage(ctx.chat.id,"What you're looking for?",
    {
      reply_markup : {
                      inline_keyboard: [
                                        [{text:"Taxi",callback_data:"TAXI"},{text:"Pharmacie",callback_data:"PHARMA"}],
                                        [{text:"Restaurant",callback_data:"REST"},{text:"Dentiste",callback_data:"DENT"}],
                                        [{text:"Location Maison",callback_data:"LOCM"},{text:"Location Voiture",callback_data:"LOCV"}]
                                      ]
                     }
    }
  )
})
bot.action("TAXI",(ctx)=>{
  ctx.deleteMessage()
  ctx.reply("Mohammed : 07121548")
})
// ctx.from get user informations
// ctx.message get message informations
bot.hears("news",(ctx)=>{
  url = "https://newsapi.org/v2/everything?q=keyword&apiKey=dbf458b944e24aadbf87c9ee5e4b42f8"
  axios.get(url).then((res)=>{
    titles =[]
    images = []
    descriptions = []
    links = []
    articles = res.data.articles
    for (article in articles) {
      titles.push(articles[article].title)
      images.push(articles[article].urlToImage)
      descriptions.push(articles[article].description)
    }
    // ctx.reply(titles[0])
  })
})



bot.launch()
