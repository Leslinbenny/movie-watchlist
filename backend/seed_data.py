import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'watchlist_project.settings')
django.setup()

from django.contrib.auth.models import User
from watchlist.models import Media

def run_seed():
    print("Seeding demo user and realistic media items...")

    # Create demo user
    user, created = User.objects.get_or_create(username='demo')
    user.set_password('password123')
    user.email = 'demo@example.com'
    user.save()

    # Clear existing media for demo user
    Media.objects.filter(owner=user).delete()

    sample_items = [
        # Watched Items (with 5-star ratings)
        {
            'title': 'Inception',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'year': 2010,
            'genre': 'Sci-Fi / Action',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Breaking Bad',
            'type': 'TV',
            'status': 'Watched',
            'rating': 5,
            'year': 2008,
            'genre': 'Crime / Drama',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Interstellar',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'year': 2014,
            'genre': 'Sci-Fi / Adventure',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'The Dark Knight',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'year': 2008,
            'genre': 'Action / Crime',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Stranger Things',
            'type': 'TV',
            'status': 'Watched',
            'rating': 4,
            'year': 2016,
            'genre': 'Sci-Fi / Mystery',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3YTgtZTZlN2RmZDU2PC00XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        # To Watch Items
        {
            'title': 'Dune: Part Two',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': None,
            'year': 2024,
            'genre': 'Sci-Fi / Adventure',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Severance',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': None,
            'year': 2022,
            'genre': 'Sci-Fi / Thriller',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BZjJlYTlmNTItZDM2NC00ODExLThlMDgtNmU3NmQyMGU4ZDFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Oppenheimer',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': None,
            'year': 2023,
            'genre': 'Biography / Drama',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Succession',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': None,
            'year': 2018,
            'genre': 'Drama',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BZTI4Yzk1MzMtODFhYi00NWQ5LTg2NmYtZGE3Mjc4NTY4NDM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
        {
            'title': 'Spirited Away',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': None,
            'year': 2001,
            'genre': 'Animation / Fantasy',
            'poster_url': 'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2Y5OWNiY2FmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
        },
    ]

    for item_data in sample_items:
        Media.objects.create(owner=user, **item_data)

    print(f"Successfully seeded {len(sample_items)} items for user '{user.username}'!")

if __name__ == '__main__':
    run_seed()
