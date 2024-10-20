# Generated by Django 5.0.7 on 2024-10-17 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shayariapp", "0002_comment_user_shayari_user_shayarireaction"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=30, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name="shayari",
            name="tags",
            field=models.ManyToManyField(
                blank=True, related_name="shayaris", to="shayariapp.tag"
            ),
        ),
    ]