using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public class Carrier: BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required string Name { get; set; }
}