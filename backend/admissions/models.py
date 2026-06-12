from django.db import models
from django.core.validators import FileExtensionValidator

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

    applicant_name = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50, choices=GRADE_CHOICES)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    extracurricular_activities = models.JSONField(default=list, blank=True)
    applicant_image = models.ImageField(upload_to='images/')
    applicant_document = models.FileField(
        upload_to='documents/', 
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processing')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.applicant_name
