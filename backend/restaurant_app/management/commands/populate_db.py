from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from restaurant_app.models import Restaurant, RestaurantStaff
from menu_app.models import Category, MenuItem, MenuItemVariation
from order_app.models import Customer, Order, OrderItem
from tenants.models import UserProfile
from decimal import Decimal
import random
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Populate the database with sample restaurants, menus, and orders'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Clear existing data (optional)
        self.stdout.write('Clearing existing data...')
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Customer.objects.all().delete()
        MenuItemVariation.objects.all().delete()
        MenuItem.objects.all().delete()
        Category.objects.all().delete()
        RestaurantStaff.objects.all().delete()
        Restaurant.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        # Create sample restaurants
        self.create_restaurants()
        
        # Create sample customers
        self.create_customers()
        
        # Create sample orders
        self.create_orders()
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

    def create_restaurants(self):
        """Create sample restaurants with menus"""
        restaurants_data = [
            {
                'name': 'Pizza Bella',
                'description': 'Autentická talianska pizza pečená v kamennej peci',
                'address': 'Hlavná 123, Bratislava',
                'phone': '+421 123 456 789',
                'email': 'info@pizzabella.sk',
                'cuisine_type': 'italian',
                'rating': 4.5,
                'delivery_fee': Decimal('2.50'),
                'min_order_amount': Decimal('15.00'),
                'categories': [
                    {
                        'name': 'Pizza',
                        'items': [
                            {'name': 'Margherita', 'description': 'Rajčinová omáčka, mozzarella, bazalka', 'price': 8.90},
                            {'name': 'Prosciutto', 'description': 'Rajčinová omáčka, mozzarella, prosciutto', 'price': 11.90},
                            {'name': 'Quattro Stagioni', 'description': 'Rajčinová omáčka, mozzarella, šunka, huby, artičoky, olivy', 'price': 13.90},
                            {'name': 'Diavola', 'description': 'Rajčinová omáčka, mozzarella, pikantná saláma', 'price': 12.50},
                        ]
                    },
                    {
                        'name': 'Cestoviny',
                        'items': [
                            {'name': 'Spaghetti Carbonara', 'description': 'Spaghetti, slanina, vajcia, parmezán', 'price': 9.90},
                            {'name': 'Penne Arrabbiata', 'description': 'Penne, pikantná rajčinová omáčka', 'price': 8.50},
                        ]
                    }
                ]
            },
            {
                'name': 'Burger House',
                'description': 'Šťavnaté burgery z čerstvého hovädzieho mäsa',
                'address': 'Obchodná 456, Bratislava',
                'phone': '+421 987 654 321',
                'email': 'contact@burgerhouse.sk',
                'cuisine_type': 'burger',
                'rating': 4.3,
                'delivery_fee': Decimal('3.00'),
                'min_order_amount': Decimal('12.00'),
                'categories': [
                    {
                        'name': 'Burgery',
                        'items': [
                            {'name': 'Classic Burger', 'description': 'Hovädzie mäso, syr, šalát, paradajka, cibuľa', 'price': 7.90},
                            {'name': 'Bacon Burger', 'description': 'Hovädzie mäso, slanina, syr, šalát, paradajka', 'price': 9.90},
                            {'name': 'Veggie Burger', 'description': 'Vegetariánsky burger, šalát, paradajka, avokádo', 'price': 8.50},
                        ]
                    },
                    {
                        'name': 'Prílohy',
                        'items': [
                            {'name': 'Hranolky', 'description': 'Chrumkavé hranolky', 'price': 3.50},
                            {'name': 'Cibuľové krúžky', 'description': 'Smažené cibuľové krúžky', 'price': 4.20},
                        ]
                    }
                ]
            },
            {
                'name': 'Sushi Zen',
                'description': 'Najčerstvejšie sushi v meste',
                'address': 'Panská 789, Bratislava',
                'phone': '+421 555 123 456',
                'email': 'info@sushizen.sk',
                'cuisine_type': 'sushi',
                'rating': 4.7,
                'delivery_fee': Decimal('4.00'),
                'min_order_amount': Decimal('20.00'),
                'categories': [
                    {
                        'name': 'Sushi',
                        'items': [
                            {'name': 'Salmon Nigiri', 'description': 'Čerstvý losos na ryži (2ks)', 'price': 5.90},
                            {'name': 'Tuna Roll', 'description': 'Tuniak, uhorka, avokádo (8ks)', 'price': 12.90},
                            {'name': 'California Roll', 'description': 'Krabí mäso, avokádo, uhorka (8ks)', 'price': 11.50},
                        ]
                    },
                    {
                        'name': 'Polievky',
                        'items': [
                            {'name': 'Miso polievka', 'description': 'Tradičná japonská polievka', 'price': 4.50},
                        ]
                    }
                ]
            },
            {
                'name': 'Healthy Bowl',
                'description': 'Zdravé a výživné jedlá plné vitamínov',
                'address': 'Zelená 321, Bratislava',
                'phone': '+421 777 888 999',
                'email': 'hello@healthybowl.sk',
                'cuisine_type': 'healthy',
                'rating': 4.4,
                'delivery_fee': Decimal('2.90'),
                'min_order_amount': Decimal('18.00'),
                'categories': [
                    {
                        'name': 'Buddha Bowls',
                        'items': [
                            {'name': 'Green Bowl', 'description': 'Quinoa, avokádo, brokolica, špenát, tahini dresing', 'price': 12.90},
                            {'name': 'Protein Bowl', 'description': 'Grilované kuracie mäso, sladké zemiaky, čečovica', 'price': 14.50},
                        ]
                    },
                    {
                        'name': 'Smoothies',
                        'items': [
                            {'name': 'Green Smoothie', 'description': 'Špenát, banán, mango, kokosové mlieko', 'price': 5.90},
                            {'name': 'Berry Blast', 'description': 'Čučoriedky, maliny, jogurt, med', 'price': 6.50},
                        ]
                    }
                ]
            },
            {
                'name': 'Slovenská kuchyňa',
                'description': 'Tradičné slovenské jedlá ako od babičky',
                'address': 'Národná 654, Bratislava',
                'phone': '+421 444 555 666',
                'email': 'info@slovenskakuchyna.sk',
                'cuisine_type': 'slovak',
                'rating': 4.6,
                'delivery_fee': Decimal('3.50'),
                'min_order_amount': Decimal('16.00'),
                'categories': [
                    {
                        'name': 'Hlavné jedlá',
                        'items': [
                            {'name': 'Schnitzel s hranolkami', 'description': 'Vyprážaný rezeň s hranolkami a šalátom', 'price': 9.90},
                            {'name': 'Goulash s haluškami', 'description': 'Tradičný guláš s bramborovými haluškami', 'price': 11.50},
                            {'name': 'Bryndzové halušky', 'description': 'Halušky s bryndzou a slaninou', 'price': 8.90},
                        ]
                    },
                    {
                        'name': 'Polievky',
                        'items': [
                            {'name': 'Kapustnica', 'description': 'Tradičná slovenská kapustová polievka', 'price': 4.90},
                            {'name': 'Fazuľová polievka', 'description': 'Hustá fazuľová polievka s klobásou', 'price': 5.50},
                        ]
                    }
                ]
            }
        ]

        for restaurant_data in restaurants_data:
            self.stdout.write(f'Creating restaurant: {restaurant_data["name"]}')
            
            # Create user for restaurant
            user = User.objects.create_user(
                username=restaurant_data['email'],
                email=restaurant_data['email'],
                password='password123',
                first_name=restaurant_data['name'],
            )
            
            # Create user profile
            user_profile = UserProfile.objects.create(
                user=user,
                phone=restaurant_data['phone'],
                role='owner',
                restaurant_name=restaurant_data['name']
            )
            
            # Create restaurant
            restaurant = Restaurant.objects.create(
                name=restaurant_data['name'],
                description=restaurant_data['description'],
                address=restaurant_data['address'],
                phone=restaurant_data['phone'],
                email=restaurant_data['email'],
                cuisine_type=restaurant_data['cuisine_type'],
                delivery_fee=restaurant_data['delivery_fee'],
                minimum_order=restaurant_data['min_order_amount'],
                is_active=True,
                is_accepting_orders=True
            )
            
            # Create restaurant staff
            RestaurantStaff.objects.create(
                restaurant=restaurant,
                user=user,
                role='owner',
                phone=restaurant_data['phone'],
                is_active=True
            )
            
            # Create categories and menu items
            for category_data in restaurant_data['categories']:
                category = Category.objects.create(
                    restaurant=restaurant,
                    name=category_data['name'],
                    description=f'{category_data["name"]} zo {restaurant_data["name"]}',
                    is_active=True
                )
                
                for item_data in category_data['items']:
                    menu_item = MenuItem.objects.create(
                        restaurant=restaurant,
                        category=category,
                        name=item_data['name'],
                        description=item_data['description'],
                        price=item_data['price'],
                        is_available=True,
                        is_vegetarian=random.choice([True, False]),
                        is_vegan=random.choice([True, False]),
                        is_gluten_free=random.choice([True, False])
                    )
                    
                    # Add some variations for selected items
                    if random.choice([True, False]):
                        MenuItemVariation.objects.create(
                            menu_item=menu_item,
                            name='Veľká porcia',
                            price_adjustment=Decimal('2.00'),
                            is_available=True
                        )

    def create_customers(self):
        """Create sample customers"""
        customers_data = [
            {'username': 'jan.novak', 'email': 'jan.novak@email.com', 'first_name': 'Ján', 'last_name': 'Novák', 'phone': '+421 901 123 456'},
            {'username': 'maria.svoboda', 'email': 'maria.svoboda@email.com', 'first_name': 'Mária', 'last_name': 'Svoboda', 'phone': '+421 902 234 567'},
            {'username': 'peter.horvath', 'email': 'peter.horvath@email.com', 'first_name': 'Peter', 'last_name': 'Horváth', 'phone': '+421 903 345 678'},
        ]
        
        for customer_data in customers_data:
            self.stdout.write(f'Creating customer: {customer_data["first_name"]} {customer_data["last_name"]}')
            
            # Create user
            user = User.objects.create_user(
                username=customer_data['username'],
                email=customer_data['email'],
                password='password123',
                first_name=customer_data['first_name'],
                last_name=customer_data['last_name']
            )
            
            # Create user profile
            user_profile = UserProfile.objects.create(
                user=user,
                phone=customer_data['phone'],
                role='staff'  # Using 'staff' for customers since there's no 'customer' role
            )
            
            # Create customer
            Customer.objects.create(
                name=f"{customer_data['first_name']} {customer_data['last_name']}",
                email=customer_data['email'],
                phone=customer_data['phone'],
                address=f'Testovacia {random.randint(1, 100)}, Bratislava'
            )

    def create_orders(self):
        """Create sample orders"""
        customers = list(Customer.objects.all())
        restaurants = list(Restaurant.objects.all())
        
        statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
        
        for i in range(20):  # Create 20 sample orders
            customer = random.choice(customers)
            restaurant = random.choice(restaurants)
            
            # Create order
            order = Order.objects.create(
                customer=customer,
                restaurant=restaurant,
                order_number=f'ORD{str(i+1).zfill(6)}',
                delivery_address=customer.address,
                delivery_phone=customer.phone,
                status=random.choice(statuses),
                subtotal=Decimal('0.00'),
                delivery_fee=restaurant.delivery_fee,
                total_amount=Decimal('0.00'),
                delivery_notes=f'Vzorová objednávka #{i+1}'
            )
            
            # Add random menu items to order
            menu_items = list(MenuItem.objects.filter(restaurant=restaurant))
            num_items = random.randint(1, 4)
            subtotal = Decimal('0.00')
            
            for _ in range(num_items):
                menu_item = random.choice(menu_items)
                quantity = random.randint(1, 3)
                
                order_item = OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=quantity,
                    unit_price=menu_item.price,
                    total_price=menu_item.price * quantity,
                    special_instructions=random.choice(['', 'Bez cibuľky', 'Extra pikantné', 'Menej soli'])
                )
                
                subtotal += order_item.total_price
            
            # Update order totals
            order.subtotal = subtotal
            order.total_amount = subtotal + order.delivery_fee
            order.save()
            
        self.stdout.write(f'Created {Order.objects.count()} sample orders')
