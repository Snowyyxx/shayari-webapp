# urls.py

from django.urls import path, include
from rest_framework import routers
from .views import (
    ShayariViewSet,
    CommentViewSet,
    TagViewSet,
    like_shayari,
    dislike_shayari,
    register_user,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'shayaris', ShayariViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
    path('shayari/<int:id>/like/', like_shayari, name='like_shayari'),
    path('shayari/<int:id>/dislike/', dislike_shayari, name='dislike_shayari'),
    path('api/register/', register_user, name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
