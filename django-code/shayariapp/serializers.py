# serializers.py

from rest_framework import serializers
from .models import Shayari, Comment, Tag
from django.contrib.auth.models import User

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ShayariSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Shayari
        fields = ['id', 'title', 'author', 'content', 'like_count', 'dislike_count', 'user', 'tags']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        shayari = Shayari.objects.create(user=self.context['request'].user, **validated_data)
        for tag_data in tags_data:
            tag_name = tag_data.get('name')
            tag, created = Tag.objects.get_or_create(name=tag_name)
            shayari.tags.add(tag)
        return shayari

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)
        if tags_data:
            instance.tags.clear()
            for tag_data in tags_data:
                tag_name = tag_data.get('name')
                tag, created = Tag.objects.get_or_create(name=tag_name)
                instance.tags.add(tag)
        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    shayari = serializers.PrimaryKeyRelatedField(queryset=Shayari.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'shayari', 'user', 'content']
