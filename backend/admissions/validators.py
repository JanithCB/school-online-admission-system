import os
from django.core.exceptions import ValidationError

def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Only image files (jpg, jpeg, png, gif, webp) are allowed.')

def validate_document_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf', '.doc', '.docx']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Only PDF, DOC, and DOCX files are allowed.')

def validate_file_size(value):
    filesize = value.size
    # 5MB limit
    if filesize > 5242880:
        raise ValidationError("The maximum file size that can be uploaded is 5MB")
