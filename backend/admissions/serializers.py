import json
from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def to_internal_value(self, data):
        """
        Custom method to handle 'activities' when sent via multipart/form-data.
        Form data always sends strings, so we must parse it to a list for our JSONField.
        """
        # Create a mutable copy of the QueryDict
        mutable_data = data.copy() if hasattr(data, 'copy') else data

        if 'activities' in mutable_data:
            activities_val = mutable_data['activities']
            if isinstance(activities_val, str):
                try:
                    # If frontend sends stringified JSON array: '["Math", "Art"]'
                    parsed = json.loads(activities_val)
                    if isinstance(parsed, list):
                        mutable_data.setlist('activities', parsed) if hasattr(mutable_data, 'setlist') else mutable_data.update({'activities': parsed})
                except json.JSONDecodeError:
                    # If frontend sends comma-separated string: 'Math, Art'
                    activities_list = [a.strip() for a in activities_val.split(',') if a.strip()]
                    if hasattr(mutable_data, 'setlist'):
                        mutable_data.setlist('activities', activities_list)
                    else:
                        mutable_data['activities'] = activities_list

        return super().to_internal_value(mutable_data)
