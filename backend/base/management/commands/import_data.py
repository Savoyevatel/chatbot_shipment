# import_data.py

import csv
from django.core.management.base import BaseCommand
from base.models import Delivery  

class Command(BaseCommand):
    help = 'Import data from CSV file into SQLite database'

    def add_arguments(self, parser):
        parser.add_argument('test.py', type=str, help='/')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['test.py']

        # Open and read the CSV file
        with open(csv_file_path, 'r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Create a new instance of your Django model and save it
                your_model_instance = Delivery(
                    name_id = row['ID'],
                    country = row['Country'],
                    shipment = row['Shipment Mode'],
                    schedule_deliver_date = row['Scheduled Delivery Date'],
                    deliver_to_client = row['Delivered to Client Date'],
                    recorded_deliver_date = row['Delivery Recorded Date'],
                    pack_price = row['Pack Price'],
                    unit_price = row['Unit Price'],
                    manufacturing_site = row['Manufacturing Site'],
                    # Map CSV columns to your Django model fields
                )
                your_model_instance.save()

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))
