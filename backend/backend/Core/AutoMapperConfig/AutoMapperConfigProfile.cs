using AutoMapper;
using backend.Core.Dtos;
using backend.Models;

namespace backend.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile() 
        {
            //Map for Tickets

            CreateMap<TicketDto, Ticket>();
            CreateMap<TasksDto, Task>();
        }
    }
}
