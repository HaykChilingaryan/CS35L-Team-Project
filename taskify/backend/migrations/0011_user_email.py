# Generated by Django 5.0.2 on 2024-03-09 01:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_alter_user_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(default='example@example.com', max_length=254, unique=True),
        ),
    ]