import Xpay from './xpay-impl';

export default class XpayToPayDAdapter {
    custCardNo: string;
    cardOwnerName: string;
    totalAmount: number;
    cardExpMonthDate: string;
    CVVNo: number;

    constructor(xpay: Xpay){
        this.custCardNo = xpay.creditCardNo
        this.cardOwnerName = xpay.customerName
        this.totalAmount = xpay.amount
        this.cardExpMonthDate = xpay.cardExpMonth
        this.CVVNo = xpay.cardCVVNo
    }
}