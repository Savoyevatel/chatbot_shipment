from django.db import models
from django.contrib.auth.models import User

class Delivery(models.Model):
    # Define fields matching your dataset columns
    id = models.AutoField(primary_key=True, editable=False)
    name_id = models.DecimalField(max_digits=20, decimal_places=0, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shipment = models.CharField(max_length=200, null=True, blank=True)
    schedule_deliver_date = models.DateTimeField(auto_now_add=False, null=True, blank= True)
    deliver_to_client = models.DateTimeField(auto_now_add=False, null=True, blank= True)
    recorded_deliver_date = models.DateTimeField(auto_now_add=False, null=True, blank= True)
    pack_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    manufacturing_site = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.name_id)