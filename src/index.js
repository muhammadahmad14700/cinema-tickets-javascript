import TicketService from './pairtest/TicketService.js';

let ticketService = new TicketService();
try {
    //function call with proper valid data
    ticketService.purchaseTickets(1,
        { type: 'ADULT', quantity: 10 },
        { type: 'CHILD', quantity: 4 },
        { type: 'INFANT', quantity: 4 }) 

    //function call with accountId <= 0
    // ticketService.purchaseTickets(0,
    //     { type: 'ADULT', quantity: 10 },
    //     { type: 'CHILD', quantity: 4 },
    //     { type: 'INFANT', quantity: 4 })

    //function call for purchasing CHILD or INFANT without an Adult ticket
    // ticketService.purchaseTickets(1,
    //     { type: 'ADULT', quantity: 0 },
    //     { type: 'CHILD', quantity: 4 },
    //     { type: 'INFANT', quantity: 4 })
    
    //function call with more than 20 tickets at a time
    // ticketService.purchaseTickets(1,
    //     { type: 'ADULT', quantity: 10 },
    //     { type: 'CHILD', quantity: 7 },
    //     { type: 'INFANT', quantity: 4 })
} catch (error) {
    console.log(error.message)
}
