import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import (
    Role, Status, College, Department, Course,
    Student, Employee, ItemCategory, Item, BorrowingRecord
)

class Command(BaseCommand):
    help = 'Seeds the database with test data for BorrowBox'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding...")

        # 1. Users (Admin and Normal)
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write("Created admin user (admin / admin123)")

        if not User.objects.filter(username='user').exists():
            User.objects.create_user('user', 'user@example.com', 'user123')
            self.stdout.write("Created normal user (user / user123)")

        # 2. Base Data (Roles and Statuses)
        student_role, _ = Role.objects.get_or_create(role_name="Student", defaults={"description": "Undergraduate student"})
        employee_role, _ = Role.objects.get_or_create(role_name="Staff", defaults={"description": "University staff"})
        active_status, _ = Status.objects.get_or_create(status_name="Active")

        # 3. Colleges, Departments, Courses
        college_eng, _ = College.objects.get_or_create(college_name="College of Engineering")
        college_sci, _ = College.objects.get_or_create(college_name="College of Science")

        dept_cpe, _ = Department.objects.get_or_create(department_name="Computer Engineering", college=college_eng)
        dept_cs, _ = Department.objects.get_or_create(department_name="Computer Science", college=college_sci)
        dept_it, _ = Department.objects.get_or_create(department_name="Information Technology", college=college_eng)

        course_cpe, _ = Course.objects.get_or_create(course_name="BS Computer Engineering", department=dept_cpe)
        course_cs, _ = Course.objects.get_or_create(course_name="BS Computer Science", department=dept_cs)
        course_it, _ = Course.objects.get_or_create(course_name="BS Information Technology", department=dept_it)

        # 4. Students
        students_data = [
            ("2021-0001", "Doe", "John", "A", course_cpe, "Male"),
            ("2021-0002", "Smith", "Jane", "B", course_cs, "Female"),
            ("2022-0003", "Rizal", "Jose", "P", course_cpe, "Male"),
            ("2023-0004", "Cruz", "Maria", "C", course_it, "Female"),
        ]
        
        created_students = []
        for s_num, last, first, mi, course, gender in students_data:
            student, _ = Student.objects.get_or_create(
                student_number=s_num,
                defaults={
                    'last_name': last, 'first_name': first, 'middle_initial': mi,
                    'course': course, 'gender': gender,
                    'role': student_role, 'status': active_status,
                    'birthdate': '2000-01-01', 'email': f"{first.lower()}@student.edu", 'phone': '09000000000'
                }
            )
            created_students.append(student)

        # 5. Employees
        employees_data = [
            ("E-001", "Torres", "Juan", "M", dept_cpe, "Male", "Professor"),
            ("E-002", "Reyes", "Ana", "L", dept_it, "Female", "Lab Assistant"),
        ]
        
        created_employees = []
        for e_num, last, first, mi, dept, gender, position in employees_data:
            emp, _ = Employee.objects.get_or_create(
                employee_number=e_num,
                defaults={
                    'last_name': last, 'first_name': first, 'middle_initial': mi,
                    'department': dept, 'gender': gender, 'position': position,
                    'role': employee_role, 'status': active_status,
                    'birthdate': '1980-01-01', 'email': f"{first.lower()}@staff.edu", 'phone': '09111111111'
                }
            )
            created_employees.append(emp)

        # 6. Item Categories
        cat_electronics, _ = ItemCategory.objects.get_or_create(name="Electronics", description="Laptops, tablets, chargers")
        cat_lab, _ = ItemCategory.objects.get_or_create(name="Laboratory Equipment", description="Microscopes, multimeters")
        cat_av, _ = ItemCategory.objects.get_or_create(name="Audio/Visual", description="Projectors, cameras, microphones")
        cat_furniture, _ = ItemCategory.objects.get_or_create(name="Furniture", description="Chairs, desks")

        # 7. Items
        items_data = [
            ("Dell XPS 15 Laptop", cat_electronics, "Available", "Good"),
            ("MacBook Pro M2", cat_electronics, "Borrowed", "New"),
            ("Lenovo ThinkPad", cat_electronics, "Available", "Fair"),
            ("Epson Projector X1", cat_av, "Available", "Good"),
            ("Sony A7 III Camera", cat_av, "Borrowed", "New"),
            ("Fluke Multimeter", cat_lab, "Maintenance", "Damaged"),
            ("Olympus Microscope", cat_lab, "Available", "Good"),
            ("Office Chair Ergonomic", cat_furniture, "Available", "Fair"),
            ("Whiteboard Markers Box", cat_furniture, "Available", "New"),
            ("Logitech Web Camera", cat_electronics, "Available", "Good"),
        ]

        created_items = []
        for name, category, status, condition in items_data:
            item, _ = Item.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'description': f"A standard {name.lower()} used for academic purposes.",
                    'status': status,
                    'condition': condition,
                }
            )
            created_items.append(item)

        # 8. Borrowing Records
        self.stdout.write("Generating borrowing records...")
        
        # Give MacBook Pro to John Doe
        macbook = Item.objects.get(name="MacBook Pro M2")
        BorrowingRecord.objects.get_or_create(
            item=macbook,
            student=created_students[0],
            defaults={
                'status': 'Approved',
                'borrow_date': timezone.now().date(),
                'expected_return_date': (timezone.now() + timedelta(days=7)).date()
            }
        )

        # Give Sony Camera to Ana Reyes
        camera = Item.objects.get(name="Sony A7 III Camera")
        BorrowingRecord.objects.get_or_create(
            item=camera,
            employee=created_employees[1],
            defaults={
                'status': 'Approved',
                'borrow_date': (timezone.now() - timedelta(days=2)).date(),
                'expected_return_date': (timezone.now() + timedelta(days=3)).date()
            }
        )

        # Create an overdue record for testing
        projector = Item.objects.get(name="Epson Projector X1")
        projector.status = "Borrowed"
        projector.save()
        BorrowingRecord.objects.get_or_create(
            item=projector,
            student=created_students[1],
            defaults={
                'status': 'Approved',
                'borrow_date': (timezone.now() - timedelta(days=10)).date(),
                'expected_return_date': (timezone.now() - timedelta(days=3)).date() # Overdue by 3 days
            }
        )

        # Create a pending request
        thinkpad = Item.objects.get(name="Lenovo ThinkPad")
        BorrowingRecord.objects.get_or_create(
            item=thinkpad,
            student=created_students[2],
            defaults={
                'status': 'Pending',
                'borrow_date': timezone.now().date(),
                'expected_return_date': (timezone.now() + timedelta(days=1)).date()
            }
        )
        
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
