function statement(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformances)
  return renderPlainText(statementData, plays)

  function enrichPerformances(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`

  for (const perf of data.performances) {
    // 印出這筆訂單
    result += `${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(totalAmount())}\n`
  result += `You earned ${totalVolumeCredits()} credits\n`

  return result

  function totalAmount() {
    let result = 0
    for (const perf of data.performances) {
      result += amountFor(perf)
    }

    return result
  }

  function totalVolumeCredits() {
    let result = 0
    for (const perf of data.performances) {
      result += volumeCreditsFor(perf)
    }

    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100)
  }

  function volumeCreditsFor(perf) {
    let result = 0

    result += Math.max(perf.audience - 30, 0)
    if (perf.play.type === 'comedy') result += Math.floor(perf.audience / 5)

    return result
  }

  function amountFor(aPerformance) {
    let result = 0

    switch (aPerformance.play.type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) {
        result += 10000 + (500 * (aPerformance.audience - 20))
      }
      result += 300 * aPerformance.audience
      break
    default:
      throw new Error(`unknown type: ${aPerformance.play.type}`)
    }

    return result
  }
}

module.exports = { statement }
