export default function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformances)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)

  return statementData

  function enrichPerformances(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
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

  function volumeCreditsFor(perf) {
    let result = 0

    result += Math.max(perf.audience - 30, 0)
    if (perf.play.type === 'comedy') result += Math.floor(perf.audience / 5)

    return result
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }
}