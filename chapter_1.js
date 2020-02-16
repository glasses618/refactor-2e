function statement(invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  for (const perf of invoice.performances) {
    // 印出這筆訂單
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
    totalAmount += amountFor(perf)
  }

  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf)
  }

  result += `Amount owed is ${usd(totalAmount)}\n`
  result += `You earned ${volumeCredits} credits\n`

  return result

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
    if (playFor(perf).type === 'comedy') result += Math.floor(perf.audience / 5)

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    let result = 0

    switch (playFor(aPerformance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerformance).type}`)
    }

    return result
  }
}

module.exports = { statement }
