# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2017-12-20 09:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0003_auto_20171220_1808'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
