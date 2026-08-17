import html
import re
from datetime import datetime
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Media


class UserSerializer(serializers.ModelSerializer):
    """Serializer for displaying current user information."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for new user registration with strict validation
    and parameterized password hashing.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=6,
        max_length=128,
        help_text="Password must be between 6 and 128 characters."
    )
    email = serializers.EmailField(required=False, allow_blank=True, max_length=254)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def validate_username(self, value):
        cleaned_username = value.strip()
        if not cleaned_username:
            raise serializers.ValidationError("Username cannot be empty.")
        if not re.match(r'^[\w.@+-]+$', cleaned_username):
            raise serializers.ValidationError("Username contains invalid characters. Use letters, numbers, and @/./+/-/_ only.")
        if User.objects.filter(username__iexact=cleaned_username).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return cleaned_username

    def validate_email(self, value):
        if value:
            return value.strip().lower()
        return ''

    def create(self, validated_data):
        # Uses Django's built-in PBKDF2 password hashing & parameterized SQL
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class MediaSerializer(serializers.ModelSerializer):
    """
    Serializer for Media watchlist items.
    All inputs are strictly validated, sanitized, and safely handled via Django ORM parameterized queries.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    title = serializers.CharField(max_length=255, required=True)
    type = serializers.ChoiceField(choices=Media.TYPE_CHOICES, default='Movie')
    status = serializers.ChoiceField(choices=Media.STATUS_CHOICES, default='Unwatched')

    class Meta:
        model = Media
        fields = [
            'id',
            'title',
            'type',
            'status',
            'rating',
            'poster_url',
            'year',
            'genre',
            'owner',
            'created_at',
            'updated_at'
        ]

    def validate_title(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Title cannot be blank.")
        # Strip potential HTML tags while preserving text safely
        cleaned = re.sub(r'<[^>]*>', '', cleaned)
        return cleaned

    def validate_genre(self, value):
        if value:
            cleaned = re.sub(r'<[^>]*>', '', value.strip())
            return cleaned[:100]
        return None

    def validate_year(self, value):
        if value is not None:
            current_year = datetime.now().year
            if value < 1888 or value > current_year + 10:
                raise serializers.ValidationError(f"Year must be between 1888 and {current_year + 10}.")
        return value

    def validate_poster_url(self, value):
        if value:
            cleaned = value.strip()
            # Strictly enforce http/https protocols or data:image SVG scheme (prevent javascript: or data:text/html)
            if not (cleaned.startswith('http://') or cleaned.startswith('https://') or cleaned.startswith('data:image/')):
                raise serializers.ValidationError("Poster URL must start with http://, https://, or be a valid image data URI.")
            return cleaned[:1000]
        return None

    def validate_rating(self, value):
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Rating must be an integer between 1 and 5.")
        return value
