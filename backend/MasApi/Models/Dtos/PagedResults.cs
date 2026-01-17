namespace MasApi.Models.Dtos;

public class PagedResults<T>
{
    public required ICollection<T> Items { get; set; }
    public required int TotalCount { get; set; }
    public required int PageNumber { get; set; }
    public required int ItemsPerPage { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / ItemsPerPage);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}