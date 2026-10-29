using Microsoft.EntityFrameworkCore;
using NotificationService.Domain.Entities;

namespace NotificationService.Infrastructure.Data;

public class NotificationDbContext(DbContextOptions<NotificationDbContext> options) : DbContext(options)
{
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.Property(notification => notification.Title).IsRequired().HasMaxLength(100);
            entity.Property(notification => notification.Message).IsRequired().HasMaxLength(2000);
            entity.HasIndex(notification => notification.UserId);
        });
    }
}
