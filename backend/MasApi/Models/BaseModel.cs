using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public abstract class BaseModel
{
    public (bool, List<ValidationResult>) Validate()
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(this, null, null);
        bool isValid = Validator.TryValidateObject(this, validationContext, validationResults, true);
        return (isValid, validationResults);
    }
}