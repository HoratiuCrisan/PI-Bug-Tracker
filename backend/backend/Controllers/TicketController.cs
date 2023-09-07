using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.OtherObjects;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
             // Inject database constructor
             // Add AutoMapper constructor
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TicketController(ApplicationDbContext context, IMapper mapper)
        {
            
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create-ticket")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketDto ticketDto)
        {
            var newTicket = new Ticket();

            _mapper.Map(ticketDto, newTicket);

            await _context.Ticket.AddAsync(newTicket);
            await _context.SaveChangesAsync();
            return Ok("Ticket created succesfully!");
        }

        [HttpGet]
        [Route("Get-Tickets")]
        public async Task<ActionResult<IEnumerable<Ticket>>>GetTickets()
        {
            // Get Tickets from Context

            var tickets = await _context.Ticket
                .Where(ticket => (!ticket.Status.ToLower().Equals("archived")))
                .ToListAsync();
            return Ok(tickets);
        }

        [HttpGet]
        [Route("Get-My-Tickets/{email}")]
        public async Task<ActionResult<IEnumerable<Ticket>>>GetMyTickets(string email)
        {
            // Get only the tickets where either the handler  
            // Or the submitter is the current user
            
            var tickets = await _context.Ticket
                .Where(ticket => (ticket.Handler == email || ticket.Submitter == email) && !ticket.Status.ToLower().Equals("archived"))
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpGet]
        [Route("Get-Archived-Tickets")]
        [Authorize (Roles = StaticUserRoles.ADMIN)]
        public async Task<ActionResult<IEnumerable<Ticket>>>GetArchivedTickets()
        {
            var tickets = await _context.Ticket
                .Where(ticket => (ticket.Status.ToLower().Equals("archived")))
                .ToListAsync();

            return Ok(tickets);
        }


        //Get ticket by id for the edit page
        [HttpGet]
        [Route("Edit-Ticket/{id}")]
        [Authorize (Roles = StaticUserRoles.ADMIN)]
        public ActionResult<Ticket> GetTicketById(int id)
        {
            var tickets = _context.Ticket.FirstOrDefault(ticket => ticket.Id == id);

            if (tickets == null)
                return NotFound();

            return tickets;
        }

        [HttpDelete]
        [Route("Delete-Ticket/{id}")]
        [Authorize (Roles = StaticUserRoles.ADMIN)]
        public ActionResult<Ticket> DeleteTicket(int id)
        {
            var ticket = _context.Ticket.FirstOrDefault(t =>t.Id == id);

            if (ticket == null)
                return NotFound();

            _context.Ticket.Remove(ticket);
            _context.SaveChanges();

            return Ok("Ticket deleted successfully!");
        }

        [HttpGet]
        [Route("Answer-Ticket/{id}")]
        public ActionResult<Ticket> AnswerTicketById(int id)
        {
            var ticket = _context.Ticket.FirstOrDefault(t => t.Id == id);

            if (ticket == null)
                return NotFound();

            return ticket;
        }

        [HttpPut]
        [Route("Discard-Ticket-Changes/{id}")]
        public ActionResult<Ticket> DiscardTicketChanges(int id, [FromBody] TicketDto ticketDto)
        {
            var ticket = _context.Ticket.FirstOrDefault(T => T.Id == id);

            if (ticket == null)
               return NotFound();

            /* Update description, handler, status, isActive
             * because when you discard changes, all the modifications
             * reset 
             */

            if (ticketDto.Response != null)
                ticket.Response = ticketDto.Response;

            if (ticketDto.Handler != null)
                ticket.Handler = ticketDto.Handler;

            if (!string.IsNullOrEmpty(ticketDto.Status))
                ticket.Status = ticketDto.Status;

            if (ticketDto.IsActive)
                ticket.IsActive = true;

            _context.SaveChanges();

            return Ok("Ticket data updated!");
        }

        [HttpPut]
        [Route("Complete-Ticket/{id}")]
        public ActionResult<Ticket> CompleteTicket(int id, [FromBody] TicketDto ticketDto)
        {
            var ticket = _context.Ticket.FirstOrDefault(t => t.Id == id);

            if (ticket == null) 
                return NotFound();

            /* Set ticket response,
             * Ticket handler, as the person that completed the ticket
             * Status will be set to archived
             * Add a completion date
             * And the active field will be set to flase since the ticket
             * is completed
             */
            if (!string.IsNullOrEmpty(ticketDto.Title))
                ticket.Title = ticketDto.Title;

            if (!string.IsNullOrEmpty(ticketDto.Description))
                ticket.Description = ticketDto.Description;

            if (!string.IsNullOrEmpty(ticketDto.Response)) 
                ticket.Response = ticketDto.Response;

            if (!string.IsNullOrEmpty (ticketDto.Status))
                ticket.Status = ticketDto.Status;

            if (!string.IsNullOrEmpty(ticketDto.Priority))
                ticket.Priority = ticketDto.Priority;

            if (!string.IsNullOrEmpty(ticketDto.Type))
                ticket.Type = ticketDto.Type;
            
            ticket.Handler = ticketDto.Handler;
            ticket.EndDate = ticketDto.EndDate;
            ticket.SolvedDate = ticketDto.SolvedDate;
            ticket.IsActive = ticketDto.IsActive;

            _context.SaveChanges();

            return Ok("Ticket completion done successfully!");
        }
    }
}
