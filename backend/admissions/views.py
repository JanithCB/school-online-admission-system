from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Count
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Applications.
    
    This viewset provides standard REST API endpoints (GET, POST, PUT, PATCH, DELETE) 
    for the Application model. It uses MultiPartParser and FormParser to correctly 
    handle requests that include file uploads (photo and document fields).
    """
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    
    # Best practice: Explicitly enable form-data parsing for file uploads, and JSONParser for normal updates
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @action(detail=False, methods=['get'])
    def status_summary(self, request):
        """
        Custom endpoint to get a count of applications by their status.
        URL: GET /api/admissions/applications/status_summary/
        """
        # Query the database to group by status and count
        summary = self.queryset.values('status').annotate(count=Count('status'))
        
        # Transform queryset result into a simple dictionary
        data = {item['status']: item['count'] for item in summary}
        
        # Ensure standard statuses always appear in the result, even if count is 0
        response_data = {
            'Processing': data.get('Processing', 0),
            'Accepted': data.get('Accepted', 0),
            'Rejected': data.get('Rejected', 0),
            'Total': sum(data.values())
        }
        
        return Response(response_data)
