from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Media
from .serializers import MediaSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for registering a new user account.
    Upon successful registration, returns user data and JWT tokens so the user is immediately logged in.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens immediately on registration
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    Protected endpoint to retrieve the currently authenticated user's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class MediaViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Media items.
    Enforces strict data isolation: users can ONLY query and manipulate their own watchlist.
    """
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Strict user isolation: Only return media belonging to the requesting user
        return Media.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Auto-assign the authenticated user as the owner
        serializer.save(owner=self.request.user)
