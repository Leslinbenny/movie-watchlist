from django.db import models
from django.contrib.auth.models import User


class Media(models.Model):
    MEDIA_TYPES = [
        ('Movie', 'Movie'),
        ('TV', 'TV'),
    ]
    TYPE_CHOICES = MEDIA_TYPES

    STATUS_CHOICES = [
        ('Watched', 'Watched'),
        ('Unwatched', 'Unwatched'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='Movie')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Unwatched')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    poster_url = models.CharField(max_length=1000, null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='media_items')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.owner.username}"