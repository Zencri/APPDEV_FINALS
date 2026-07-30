from django.db import models

class Role(models.Model):
    role_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.role_name

class Status(models.Model):
    status_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.status_name

class College(models.Model):
    college_name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.college_name

class Department(models.Model):
    department_name = models.CharField(max_length=150)
    college = models.ForeignKey(
        College,
        on_delete=models.PROTECT,
        related_name='departments',
        blank=True,
        null=True
    )

    class Meta:
        unique_together = ('department_name', 'college')
        ordering = ['department_name']

    def __str__(self):
        if self.college:
            return f"{self.department_name} - {self.college.college_name}"
        return self.department_name

class Course(models.Model):
    course_name = models.CharField(max_length=150)
    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name='courses'
    )

    class Meta:
        unique_together = ('course_name', 'department')
        ordering = ['course_name']

    def __str__(self):
        return f"{self.course_name} - {self.department.department_name}"

class Student(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    student_number = models.CharField(max_length=50, unique=True)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    middle_initial = models.CharField(max_length=10, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    
    course = models.ForeignKey(
        Course,
        on_delete=models.PROTECT,
        related_name='students'
    )

    region_code = models.CharField(max_length=20, blank=True, null=True)
    province_code = models.CharField(max_length=20, blank=True, null=True)
    city_municipality_code = models.CharField(max_length=20, blank=True, null=True)
    barangay_code = models.CharField(max_length=20, blank=True, null=True)
    street_address = models.CharField(max_length=255, blank=True, null=True)

    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    photo = models.ImageField(upload_to='students/', blank=True, null=True)

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='students'
    )
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        related_name='students'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.student_number} - {self.last_name}, {self.first_name}"

class Employee(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    employee_number = models.CharField(max_length=50, unique=True)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    middle_initial = models.CharField(max_length=10, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)

    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name='employees',
        blank=True,
        null=True
    )
    position = models.CharField(max_length=150)

    region_code = models.CharField(max_length=20, blank=True, null=True)
    province_code = models.CharField(max_length=20, blank=True, null=True)
    city_municipality_code = models.CharField(max_length=20, blank=True, null=True)
    barangay_code = models.CharField(max_length=20, blank=True, null=True)
    street_address = models.CharField(max_length=255, blank=True, null=True)

    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    photo = models.ImageField(upload_to='employees/', blank=True, null=True)

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='employees'
    )
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        related_name='employees'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.employee_number} - {self.last_name}, {self.first_name}"

class ItemCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Item(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Borrowed', 'Borrowed'),
        ('Maintenance', 'Maintenance'),
    ]
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor'),
        ('Damaged', 'Damaged'),
    ]

    name = models.CharField(max_length=150)
    category = models.ForeignKey(
        ItemCategory,
        on_delete=models.PROTECT,
        related_name='items'
    )
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Available')
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='Good')
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class BorrowingRecord(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Returned', 'Returned'),
        ('Overdue', 'Overdue'),
        ('Rejected', 'Rejected'),
    ]

    item = models.ForeignKey(
        Item,
        on_delete=models.PROTECT,
        related_name='borrowings'
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name='borrowings',
        blank=True,
        null=True
    )
    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name='borrowings',
        blank=True,
        null=True
    )

    borrow_date = models.DateField(auto_now_add=True)
    expected_return_date = models.DateField()
    actual_return_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-borrow_date']

    def __str__(self):
        borrower = self.student.last_name if self.student else self.employee.last_name if self.employee else "Unknown"
        return f"{self.item.name} - {borrower} ({self.status})"
