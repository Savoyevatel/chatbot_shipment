# Generated by Django 5.1 on 2024-08-09 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0003_delivery_name_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="delivery",
            name="name_id",
            field=models.DecimalField(
                blank=True, decimal_places=0, max_digits=20, null=True
            ),
        ),
    ]
