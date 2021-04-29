// this is used to localy test only
// const { Telegraf } = require('telegraf')
// const bot = new Telegraf('1601138751:AAHDMJm7qHykieHFXKp1BmLDo0q538oG1pI')

//This is used for deployement to Heroku server
const { Composer } = require('micro-bot')
const bot = new Composer()
const axios  = require('axios')

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
var language   =  ""
var clicked    =  ""
var latitude   =  0
var longitude  =  0
var message_id = 0
const wordsList = {
  "fr" : {
    "Hello" : "Bonjour",
    "Bye"   : "Au revoir",
    "wlcmMssg" :  "que cherchez-vous?"
  },
  "ar" : {
    "Hello"         : "مرحبا",
    "Bye"           : "Au revoir",
    "wlcmMssg"      : "عن ماذا تبحث؟",
    "Pharmacy"      : "صيدلية",
    "Taxi"          : "سيارة أجرة",
    "Food"          : "مطاعم",
    "Dentist"       : "طبيب أسنان",
    "RentalCars"    : "سيارة للكراء",
    "RentalHouses"  : "منزل للكراء",
    "MakeUp"        : "متجر مواد تجميل",
    "Perfumist"     : "متجر عطور ",
    "Barber"        : "حلاق",
    "Return"        : "رجوع"
  },
  "en" : {
    "Hello" : "Hello",
    "Bye"   : "Bye",
    "wlcmMssg" : "what you're looking for?"
         }
}

// Start Menu
bot.start((ctx)=>{
  // ctx.deleteMessage()
  message_id = ctx.message["message_id"]
  username = ctx.message.from.first_name + " "+ ctx.message.from.last_name
  language = ctx.message.from.language_code
  if(language in wordsList === false){
    language = "en"
  }
  ctx.reply(wordsList[language].Hello+" "+username)
  buildHomeList(ctx)

})
// ####################### Home Buttons Callbacks ###################
//###################################################################

bot.action("TAXI",(ctx)=>{
  ctx.deleteMessage()
  showReturn(ctx)
}).catch((error,ctx)=>{
  if (error) {console.log(error)}
})
bot.action("PHARMA",(ctx)=>{
  ctx.deleteMessage(message_id)
  ctx.telegram.sendMessage(ctx.chat.id,"\u{1F3E5}",{
    reply_markup : {
                    inline_keyboard : [
                                      [{text:"La Plage",callback_data:"PH1"}],
                                      [{text:"HiLaL",callback_data:"PH2"}]
                                      ]
                    }
  })
  // showReturn(ctx)
}).catch((error,ctx)=>{
  if (error) {console.log(error)}
})

bot.action("RETURN",(ctx)=>{
  buildHomeList(ctx)
}).catch((error,ctx)=>{
  if (error) {console.log(error)}
})
// #############Pharmacy lists calbacks ###################
bot.action("PH1",(ctx)=>{
  showLocation(ctx,35.083519,-2.22071)
  ctx.reply("\u{260E} : 0634548754 ")

}).catch((error,ctx)=>{
  if (error) {console.log(error)}
})
//################### Show Return Button function ########
function showReturn(ctx){
  ctx.telegram.sendMessage(ctx.chat.id,wordsList[language].Return,{
    reply_markup : {
                    inline_keyboard: [
                                      [{text:"\u{21A9}",callback_data:"RETURN"}],
                                     ]
                   }
  })
}
//#################### Build Home List ################
function buildHomeList(ctx){
  ctx.telegram.sendMessage(ctx.chat.id,wordsList[language].wlcmMssg,
    {
      reply_markup : {
                      inline_keyboard: [
                                        [{text:wordsList[language].Taxi,callback_data:"TAXI"},{text:wordsList[language].Pharmacy,callback_data:"PHARMA"}],
                                        [{text:wordsList[language].Food,callback_data:"REST"},{text:wordsList[language].Dentist,callback_data:"DENT"}],
                                        [{text:wordsList[language].RentalHouses,callback_data:"LOCM"},{text:wordsList[language].RentalCars,callback_data:"LOCV"}],
                                        [{text:wordsList[language].MakeUp,callback_data:"MAKEUP"},{text:wordsList[language].Perfumist,callback_data:"PERFUM"}]
                                      ]
                     }
    }
  )
  .catch((error,ctx)=>{
    if (error){console.log(error)}
  })
}
// ################### SHow Location #############
function showLocation(ctx,latitude,longitude){
  console.log(ctx)
  ctx.telegram.sendLocation(ctx.chat.id,latitude,longitude)
  .catch((error,ctx)=>{
    if (error){console.log(error)}
  })
}



//this is the standar launch for local testing
// bot.launch()

//this is the alternative of bot.launch() for Heroku
module.exports = bot
