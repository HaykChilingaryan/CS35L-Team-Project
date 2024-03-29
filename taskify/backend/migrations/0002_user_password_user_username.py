# Generated by Django 5.0.2 on 2024-02-12 05:16

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default='password', max_length=255, validators=[django.core.validators.MinLengthValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='username',
            field=models.CharField(default='username', max_length=255, unique=True),
            preserve_default=False,
        ),
    ]
