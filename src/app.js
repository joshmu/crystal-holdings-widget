//#!/usr/bin/env node

const axios = require('axios')
const moment = require('moment')
const isOnline = require('is-online')
const {CMC_PRO_API_KEY, walletUrl, equityUrl, userId} = require('./creds.js')
const wallet = require(walletUrl)

;(async () => {
  if (!(await isOnline())) return ''

  let equity
  try {
    equity = await getEquity()
  } catch (e) {
    console.log('error occurred grabbing equity')
    return ''
  }

  let usdurl =
    'http://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH&convert=USD&CMC_PRO_API_KEY=' +
    CMC_PRO_API_KEY

  // TODO: little hack to check if we have an internet connection
  let response
  try {
    response = await axios.get(usdurl)
  } catch (e) {
    return ''
  }

  let data = response.data.data

  let ethusd = data.ETH.quote.USD.price
  let btcusd = data.BTC.quote.USD.price

  let btcurl =
    'http://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=BTC&CMC_PRO_API_KEY=' +
    CMC_PRO_API_KEY

  let response2 = await axios.get(btcurl)
  let data2 = response2.data.data

  let ethbtc = data2.ETH.quote.BTC.price

  /*
    let wallet = walletArray.reduce((prev, curr) => {
        prev[curr.symbol] = curr.amount
        return prev
    }, {})
    */

  // console.log('ethbtc', ethbtc)

  // HISTORICAL
  let historical = {
    btc: 0.76417045,
    btcprice: 7324,
    eth: 12.1911486,
    ethprice: 459.09,
    usd: 5596.78, // this is the total usd based on historic price data
    date: '2018-07-22', // year-month-day
    oldwallet: {
      btc: 0.7641634,
      eth: 0,
      usd: 0.05
    }
  }

  // TOTALS
  let totalBTC = wallet.btc + wallet.eth * ethbtc + wallet.usd / btcusd
  let totalETH = wallet.btc / ethbtc + wallet.eth + wallet.usd / ethusd
  let totalUSD = totalBTC * btcusd

  function percentage(curr, prev) {
    return Math.round(((curr - prev) / prev) * 100)
  }

  let stats = {
    btc: percentage(totalBTC * equity, historical.btc),
    eth: percentage(totalETH * equity, historical.eth),
    usd: percentage(totalUSD * equity, historical.usd),
    historicalusdnow: (historical.btc * btcusd).toFixed(2), // usd value if crypto was held in the past
    days: moment().diff(historical.date, 'days')
  }

  let daily = {
    btc: (stats.btc / stats.days).toFixed(2),
    eth: (stats.eth / stats.days).toFixed(2),
    usd: (stats.usd / stats.days).toFixed(2)
  }
  stats.daily = daily

  // OUTPUT
  let output = {
    historical: historical,
    stats: stats,
    totals: {
      btc: (totalBTC * equity).toFixed(2),
      eth: (totalETH * equity).toFixed(2),
      usd: Math.round(totalUSD * equity)
    },
    wallet: wallet
  }

  //let result = JSON.stringify(output)
  //console.log(JSON.stringify(output))
  // ₿ > bitcoin symbol
  var txt =
    output.totals.btc +
    ' | ' +
    '$' +
    output.totals.usd +
    ' | ' +
    (output.stats.btc > 0 ? '+' : '!!!') +
    output.stats.btc +
    '% BTC | ' +
    (output.stats.usd > 0 ? '+' : '!!!') +
    output.stats.usd +
    '% USD | ' +
    output.stats.days +
    ' DAYS'

  // output to ubersicht to use
  console.log(txt)

  // console.log('done')
})()

async function getEquity() {
  const response = await axios.get(equityUrl)
  let rows = response.data
  let equityStr = rows.find(r => r.id === userId).equity
  // remove percent sign change to a number and convert back to decimal
  return +equityStr.replace('%', '') / 100
}
