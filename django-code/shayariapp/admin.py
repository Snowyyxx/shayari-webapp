# admin.py

from django.contrib import admin
from .models import Shayari, Comment, Tag

admin.site.register(Shayari)
admin.site.register(Comment)
admin.site.register(Tag)
