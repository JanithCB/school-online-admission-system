from django.db import models
from .validators import validate_image_extension, validate_document_extension, validate_file_size

class Application(models.Model):
    STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    GRADE_CHOICES = [(f'Grade {i}', f'Grade {i}') for i in range(1, 13)]

    full_name = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50, choices=GRADE_CHOICES)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    
    # Store multiple activities as JSON array e.g., ["Sports", "Music"]
    activities = models.JSONField(default=list, blank=True)
    
    # Require images only, enforce sizes and extensions
    photo = models.ImageField(
        upload_to='photos/%Y/%m/',
        validators=[validate_image_extension, validate_file_size]
    )
    
    # Require pdf, doc, docx only
    document = models.FileField(
        upload_to='documents/%Y/%m/',
        validators=[validate_document_extension, validate_file_size]
    )
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='Processing'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.grade_level}"
