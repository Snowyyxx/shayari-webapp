# views.py

from rest_framework import viewsets, filters, status
from .models import Shayari, Comment, ShayariReaction, Tag
from .serializers import ShayariSerializer, CommentSerializer, TagSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User

# User Registration View
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

# Shayari ViewSet
class ShayariViewSet(viewsets.ModelViewSet):
    queryset = Shayari.objects.all()
    serializer_class = ShayariSerializer # to and from JSON format
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author', 'content', 'tags__name']
    ordering_fields = ['like_count', 'dislike_count']

    def perform_create(self, serializer):
        
        serializer.save()


# Tag ViewSet
class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related('user', 'shayari').all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        shayari_id = self.request.query_params.get('shayari', None)
        if shayari_id is not None:
            return self.queryset.filter(shayari__id=shayari_id)
        else:
            return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Like Shayari
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_shayari(request, id):
    try:
        shayari = Shayari.objects.get(id=id)
    except Shayari.DoesNotExist:
        return Response({'error': 'Shayari not found.'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    reaction, created = ShayariReaction.objects.get_or_create(shayari=shayari, user=user)
    if reaction.reaction == 'like':
        return Response({'error': 'Already liked.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if reaction.reaction == 'dislike':
            shayari.dislike_count -= 1
        reaction.reaction = 'like'
        shayari.like_count += 1
        reaction.save()
        shayari.save()
        return Response({'message': 'Shayari liked.'}, status=status.HTTP_200_OK)

# Dislike Shayari
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dislike_shayari(request, id):
    try:
        shayari = Shayari.objects.get(id=id)
    except Shayari.DoesNotExist:
        return Response({'error': 'Shayari not found.'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    reaction, created = ShayariReaction.objects.get_or_create(shayari=shayari, user=user)
    if reaction.reaction == 'dislike':
        return Response({'error': 'Already disliked.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if reaction.reaction == 'like':
            shayari.like_count -= 1
        reaction.reaction = 'dislike'
        shayari.dislike_count += 1
        reaction.save()
        shayari.save()
        return Response({'message': 'Shayari disliked.'}, status=status.HTTP_200_OK)
