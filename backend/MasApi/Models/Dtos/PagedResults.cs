namespace MasApi.Models.Dtos;

public class PagedResults<T>
{
    public required ICollection<T> Items { get; set; }
    public required int TotalCount { get; set; }
    public required int Page { get; set; }
    public required int Limit { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Limit);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}