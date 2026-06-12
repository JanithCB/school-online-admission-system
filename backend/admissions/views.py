from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        summary = Application.objects.values('status').annotate(count=Count('status'))
        # Format the output as {"Processing": 5, "Accepted": 2, ...}
        status_counts = {item['status']: item['count'] for item in summary}
        
        # Ensure all statuses are present in the summary, even if count is 0
        all_statuses = ['Processing', 'Accepted', 'Rejected']
        for status in all_statuses:
            if status not in status_counts:
                status_counts[status] = 0

        return Response(status_counts)
