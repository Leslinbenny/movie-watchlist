from django.contrib import admin
from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'status', 'rating', 'owner', 'created_at')
    list_filter = ('type', 'status', 'rating')
    search_fields = ('title', 'owner__username')
