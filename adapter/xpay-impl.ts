export default class Xpay {
    cardExpYear: string;
    customerName: string;
    creditCardNo: string;
    cardExpMonth: string;
    amount: number;
    cardCVVNo: number;
  
    constructor(
      cardExpYear: string,
      customerName: string,
      creditCardNo: string,
      cardExpMonth: string,
      amount: number,
      cardCVVNo: number
    ) {
      this.cardExpYear = cardExpYear;
      this.customerName = customerName;
      this.creditCardNo = creditCardNo;
      this.cardExpMonth = cardExpMonth;
      this.amount = amount;
      this.cardCVVNo = cardCVVNo;
    }
  }
  