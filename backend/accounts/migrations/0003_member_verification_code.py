# Generated by Django 3.2.13 on 2023-03-10 05:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_member_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='verification_code',
            field=models.CharField(default=1, max_length=6),
            preserve_default=False,
        ),
    ]
