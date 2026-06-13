from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display  = ('id', 'full_name', 'grade_level', 'gender', 'status', 'created_at')
    list_filter   = ('status', 'grade_level', 'gender')
    search_fields = ('full_name',)
    readonly_fields = ('created_at', 'updated_at')
    ordering      = ('-created_at',)
