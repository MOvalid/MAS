using Microsoft.EntityFrameworkCore;

namespace MasApi.Data
{
    public class MasDbContext(DbContextOptions<MasDbContext> options) : DbContext(options)
    {

        // Define your DbSets here
        // public DbSet<YourEntity> YourEntities { get; set; }
    }
}