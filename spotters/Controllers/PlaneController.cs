using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using spotters.Data;
using spotters.Modal;
namespace spotters.Controllers
{
    [Route("api/sighting")]
    [ApiController]
    public class PlaneController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlaneController(ApplicationDbContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlaneSighting>>> GetAirlineSightings()
        {
            return await _context.AirlineSightings.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PlaneSighting>> GetPlaneSighting(int id)
        {
            var planeSighting = await _context.AirlineSightings.FindAsync(id);

            if (planeSighting == null)
            {
                return NotFound();
            }

            return planeSighting;
        }

        [HttpPost]
        public async Task<ActionResult<PlaneSighting>> PostAirlineSighting([FromForm] PlaneSighting airlineSighting, [FromForm] IFormFile? file = null)
        {
            if (file != null)
            {
                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                airlineSighting.Photo = stream.ToArray();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.AirlineSightings.Add(airlineSighting);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate") == true)
            {
                return Conflict(new { message = "An airline with the same code already exists." });
            }

            return CreatedAtAction(nameof(GetPlaneSighting), new { id = airlineSighting.PlaneId }, airlineSighting);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAirlineSighting(int id, [FromForm] PlaneSighting updatedSighting, [FromForm] IFormFile? Photo = null)
        {
            var existingSighting = await _context.AirlineSightings.FindAsync(id);
            if (existingSighting == null)
            {
                return NotFound();
            }

            existingSighting.Name = updatedSighting.Name;
            existingSighting.ShortName = updatedSighting.ShortName;
            existingSighting.AirlineCode = updatedSighting.AirlineCode;
            existingSighting.Location = updatedSighting.Location;
            existingSighting.CreatedDate = updatedSighting.CreatedDate;
            existingSighting.Active = updatedSighting.Active;
            existingSighting.Delete = updatedSighting.Delete;
            existingSighting.ModifiedUserId = updatedSighting.ModifiedUserId;

            if (Photo != null)
            {
                using var stream = new MemoryStream();
                await Photo.CopyToAsync(stream);
                existingSighting.Photo = stream.ToArray();
            }

            _context.Entry(existingSighting).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirlineSightingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate") == true)
            {
                return Conflict(new { message = "An airline with the same code already exists." });
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirlineSighting(int id)
        {
            var airlineSighting = await _context.AirlineSightings.FindAsync(id);
            if (airlineSighting == null)
            {
                return NotFound();
            }

            _context.AirlineSightings.Remove(airlineSighting);
            await _context.SaveChangesAsync();

            return NoContent();
        }

   

        private bool AirlineSightingExists(int id)
        {
            return _context.AirlineSightings.Any(e => e.PlaneId == id);
        }
    }
}
