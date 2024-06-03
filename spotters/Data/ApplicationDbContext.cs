using Microsoft.EntityFrameworkCore;
using spotters.Modal;

namespace spotters.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
        }

        public DbSet<PlaneSighting> AirlineSightings { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<PlaneSighting>()
                .HasIndex(ps => ps.AirlineCode)
                .IsUnique();

            modelBuilder.Entity<PlaneSighting>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(ps => ps.CreatedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlaneSighting>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(ps => ps.ModifiedUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
