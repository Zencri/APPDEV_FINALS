import os
import urllib.request
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from api.models import Item

# Map each item name to a real Unsplash photo URL
ITEM_IMAGES = {
    "Dell XPS 15 Laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    "MacBook Pro M2": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    "Lenovo ThinkPad": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
    "Epson Projector X1": "https://images.unsplash.com/photo-1478720568477-152d9b5e7b3a?w=600&h=400&fit=crop",
    "Sony A7 III Camera": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
    "Fluke Multimeter": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    "Olympus Microscope": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
    "Office Chair Ergonomic": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=400&fit=crop",
    "Whiteboard Markers Box": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    "Logitech Web Camera": "https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=600&h=400&fit=crop",
}

class Command(BaseCommand):
    help = 'Downloads and assigns real photos to each inventory item'

    def handle(self, *args, **kwargs):
        # Make sure media/items directory exists
        media_items_dir = os.path.join('media', 'items')
        os.makedirs(media_items_dir, exist_ok=True)

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        for item_name, image_url in ITEM_IMAGES.items():
            try:
                item = Item.objects.get(name=item_name)
            except Item.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"  Skipping — item not found: {item_name}"))
                continue

            # Clean filename
            safe_name = item_name.lower().replace(' ', '_').replace('/', '_')
            filename = f"{safe_name}.jpg"
            filepath = os.path.join(media_items_dir, filename)

            try:
                self.stdout.write(f"  Downloading image for: {item_name}...")
                req = urllib.request.Request(image_url, headers=headers)
                with urllib.request.urlopen(req, timeout=15) as response:
                    image_data = response.read()

                # Save file to disk
                with open(filepath, 'wb') as f:
                    f.write(image_data)

                # Update the item's image field to the relative media path
                item.image = f"items/{filename}"
                item.save()
                self.stdout.write(self.style.SUCCESS(f"  [OK] Saved image for: {item_name}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  [FAIL] Failed for {item_name}: {e}"))

        self.stdout.write(self.style.SUCCESS("\nAll item images processed!"))
