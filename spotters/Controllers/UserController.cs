using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using spotters.Modal;
using spotters.Data;

namespace spotters.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            var existingUser = await _context.Users
                                             .Where(u => u.UserName == user.UserName)
                                             .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                return BadRequest(new { Status = 400, Message = "Username already exists. Please choose a different username." });
            }

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login(User user)
        {
            var existingUser = await _context.Users
                .Where(u => u.UserName == user.UserName)
                .FirstOrDefaultAsync();

            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            return Ok(existingUser);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
    }
}