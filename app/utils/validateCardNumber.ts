const validateCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number)

  const isValid =
    digits.reduceRight((acc, digit, index) => {
      if (index % 2 === digits.length % 2) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      return acc + digit
    }, 0) %
      10 ===
    0

  return isValid
}
export default validateCardNumber
