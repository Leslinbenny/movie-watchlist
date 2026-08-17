from django.db import models
from django.contrib.auth.models import User


class Media(models.Model):
    MEDIA_TYPES = [
        ('Movie', 'Movie'),
        ('TV', 'TV'),
    ]

    STATUS_CHOICES = [
        ('Watched', 'Watched'),
        ('Unwatched', 'Unwatched'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        choices=[
            (1, '1'),
            (2, '2'),
            (3, '3'),
            (4, '4'),
            (5, '5'),
        ]
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title