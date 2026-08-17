from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Media


class WatchlistAPITests(APITestCase):
    def setUp(self):
        # Create two distinct users to verify data isolation
        self.user1 = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='password123'
        )
        self.user2 = User.objects.create_user(
            username='bob',
            email='bob@example.com',
            password='password123'
        )

        # URLs
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.media_list_url = reverse('media-list')

        # Obtain JWT token for Alice
        login_response = self.client.post(self.login_url, {
            'username': 'alice',
            'password': 'password123'
        })
        self.token_alice = login_response.data['access']

        # Pre-populate some media
        self.alice_movie = Media.objects.create(
            title='Inception',
            type='Movie',
            status='Unwatched',
            owner=self.user1
        )
        self.bob_tv = Media.objects.create(
            title='Breaking Bad',
            type='TV',
            status='Watched',
            rating=5,
            owner=self.user2
        )

    def test_user_registration(self):
        """Test registering a new user."""
        response = self.client.post(self.register_url, {
            'username': 'charlie',
            'email': 'charlie@example.com',
            'password': 'strongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], 'charlie')

    def test_user_login(self):
        """Test login returns access and refresh tokens."""
        response = self.client.post(self.login_url, {
            'username': 'alice',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_unauthenticated_access_denied(self):
        """Ensure unauthenticated requests to media endpoints are rejected."""
        response = self.client.get(self.media_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_media_isolation_alice_cannot_see_bob_media(self):
        """Ensure Alice only sees her own media items, not Bob's."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        response = self.client.get(self.media_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item['title'] for item in response.data]
        self.assertIn('Inception', titles)
        self.assertNotIn('Breaking Bad', titles)

    def test_create_media_item(self):
        """Test creating a new unwatched movie item."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        data = {
            'title': 'Interstellar',
            'type': 'Movie',
            'status': 'Unwatched'
        }
        response = self.client.post(self.media_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Interstellar')
        self.assertEqual(response.data['owner'], 'alice')

    def test_mark_as_watched_and_rate(self):
        """Test updating status to Watched and assigning a rating."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        detail_url = reverse('media-detail', kwargs={'pk': self.alice_movie.id})
        
        # Mark as watched and rate 5 stars
        response = self.client.patch(detail_url, {
            'status': 'Watched',
            'rating': 5
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Watched')
        self.assertEqual(response.data['rating'], 5)

    def test_alice_cannot_modify_or_delete_bob_media(self):
        """Ensure Alice gets 404 when trying to access or delete Bob's item."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        bob_detail_url = reverse('media-detail', kwargs={'pk': self.bob_tv.id})

        # Try to update Bob's TV show
        response = self.client.patch(bob_detail_url, {'rating': 1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Try to delete Bob's TV show
        response = self.client.delete(bob_detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_media_item(self):
        """Test deleting own media item."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        detail_url = reverse('media-detail', kwargs={'pk': self.alice_movie.id})

        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Media.objects.filter(id=self.alice_movie.id).exists())

    def test_invalid_rating_rejected(self):
        """Ensure rating greater than 5 or less than 1 is rejected."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        data = {
            'title': 'Test Movie',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 6  # Invalid
        }
        response = self.client.post(self.media_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sql_injection_payloads_in_title_are_safely_neutralized(self):
        """
        Test that SQL injection attacks (DROP TABLE, OR 1=1, UNION SELECT)
        are safely parameterized and cannot breach or alter the database.
        """
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        
        sqli_payloads = [
            "'; DROP TABLE watchlist_media; --",
            "' OR '1'='1",
            "1' UNION SELECT 1, 'hacked', 'Movie', 'Watched', 5, 'http://a.com', 2020, 'Action', 1, '2020-01-01', '2020-01-01'--",
            "admin' --",
            "1; SELECT * FROM auth_user;"
        ]

        for payload in sqli_payloads:
            response = self.client.post(self.media_list_url, {
                'title': payload,
                'type': 'Movie',
                'status': 'Unwatched'
            })
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            # Verify the database table is intact and the title was saved as a safe literal string
            saved_item = Media.objects.get(id=response.data['id'])
            self.assertEqual(saved_item.title, payload)
            self.assertTrue(Media.objects.exists())

    def test_sql_injection_in_username_registration_rejected(self):
        """Ensure invalid SQL injection characters in usernames are rejected."""
        invalid_sqli_usernames = [
            "admin'--",
            "' OR 1=1--",
            "user; DROP TABLE auth_user;"
        ]
        for bad_user in invalid_sqli_usernames:
            response = self.client.post(self.register_url, {
                'username': bad_user,
                'password': 'password123'
            })
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_xss_tags_in_title_are_stripped(self):
        """Ensure script tags and HTML injection are stripped from titles."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_alice}')
        response = self.client.post(self.media_list_url, {
            'title': '<script>alert("XSS")</script>The Matrix',
            'type': 'Movie',
            'status': 'Unwatched'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'alert("XSS")The Matrix')
        self.assertNotIn('<script>', response.data['title'])
