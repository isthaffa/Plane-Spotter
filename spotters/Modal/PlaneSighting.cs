using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace spotters.Modal
{
    public class PlaneSighting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlaneId { get; set; }

        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(5)]
        public string ShortName { get; set; }

        [RegularExpression(@"^[A-Z]{3}-\d{4}$")]
        public string AirlineCode { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool Active { get; set; } = true;

        public bool Delete { get; set; } = false;

        [ForeignKey("CreatedUserId")]
        public int CreatedUserId { get; set; }

        [ForeignKey("ModifiedUserId")]
        public int? ModifiedUserId { get; set; }

        public byte[]? Photo { get; set; }
    }
}
