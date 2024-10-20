# models.py

from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Shayari(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    content = models.TextField()
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    tags = models.ManyToManyField(Tag, related_name='shayaris', blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    content = models.TextField()
    shayari = models.ForeignKey(Shayari, null=True, blank=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.content[:20]

class ShayariReaction(models.Model):
    shayari = models.ForeignKey(Shayari, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=10)  # 'like' or 'dislike'

    class Meta:
        unique_together = ('shayari', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.reaction} - {self.shayari.title}"
