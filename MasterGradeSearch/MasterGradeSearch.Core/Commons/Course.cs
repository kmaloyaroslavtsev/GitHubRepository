﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterGradeSearch.Core.Commons
{
    /// <summary>
    ///     Тип "Направление подготовки". Соотносится с таблицей Courses в базе данных
    /// </summary>
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        public int InstituteId { get; set; }

        [ForeignKey("InstituteId")]
        public Institute Institute { get; set; }

        [Required]
        public int DisciplineId { get; set; }

        
        [ForeignKey("DisciplineId")]
        public Discipline Discipline { get; set; }

        [Required]
        public LearningType LearningType { get; set; }

        [Required]
        public bool PreparatoryCourses { get; set; }

        [Required]
        public bool Hostel { get; set; }
      
        [Required]
        public bool Budget { get; set; }
        
        [Required]
        public bool Extrabudgetary { get; set; }
        
        [Required]
        public decimal Cost { get; set; }

        public virtual ICollection<Exam> Exams { get; set; }
    }
}