import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #getPriceByType(type) {
     let price = {ADULT: 20, CHILD: 10, INFANT: 0}
     return price[type];
  }
  #getTotalAmount(ticketTypeRequests){
    let total = 0;
    for (let i = 0; i < ticketTypeRequests.length; i++) {
      
      total = total + (ticketTypeRequests[i].quantity * this.#getPriceByType(ticketTypeRequests[i].type))
    }
    return total;
  }
  #calculateSeats(ticketTypeRequests){
    let totalSeats = 0;
    for (let i = 0; i < ticketTypeRequests.length; i++) {
      if(ticketTypeRequests[i].type === 'ADULT' || ticketTypeRequests[i].type === 'CHILD'){
        totalSeats = totalSeats + ticketTypeRequests[i].quantity
      }
    }
    return totalSeats;
}

  #calculateTickets(ticketTypeRequests){
    let totalTickets = 0;
    for (let i = 0; i < ticketTypeRequests.length; i++) {
      totalTickets = totalTickets + ticketTypeRequests[i].quantity
    }
    return totalTickets;
}

  #validateTicket(accountId, ticketTypeRequests){
    let isAdultTicketExist = false;
    if(accountId <= 0){
      throw new Error("You don't have sufficient funds to pay");
    }
    if(this.#calculateTickets(ticketTypeRequests) > 20){
      throw new Error("Only a maximum of 20 tickets that can be purchased at a time")
    }
    for (let i = 0; i < ticketTypeRequests.length; i++) {
      if(ticketTypeRequests[i].type === 'ADULT' && ticketTypeRequests[i].quantity > 0){
        isAdultTicketExist = true;
      }
      if(!isAdultTicketExist && (ticketTypeRequests[i].type === 'CHILD' || ticketTypeRequests[i].type === 'INFANT') && ticketTypeRequests[i].quantity > 0){
        throw new Error(`${ticketTypeRequests[i].type} tickets cannot be purchased without purchasing an Adult ticket`)
      }
    }
    
  }
  
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateTicket(accountId, ticketTypeRequests);
    let totalTickets = this.#calculateTickets(ticketTypeRequests);
    let totalAmount = this.#getTotalAmount(ticketTypeRequests);
    let ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId,totalAmount)
    let totalSeats = this.#calculateSeats(ticketTypeRequests);
    let seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId,totalSeats);
    console.log(`Successfully paid ${totalAmount} Pounds`);
    console.log(`${totalSeats} seats with ${totalTickets} tickets booked Successfully`);
    // throws InvalidPurchaseException
  }
}
