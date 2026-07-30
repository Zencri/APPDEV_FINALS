from rest_framework import serializers
from .models import (
    Role,
    Status,
    College,
    Department,
    Course,
    Student,
    Employee,
    ItemCategory,
    Item,
    BorrowingRecord,
)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.college_name', read_only=True)

    class Meta:
        model = Department
        fields = [
            'id',
            'department_name',
            'college',
            'college_name',
        ]

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    college_name = serializers.CharField(source='department.college.college_name', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'course_name',
            'department',
            'department_name',
            'college_name',
        ]

class StudentSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)

    course_name = serializers.CharField(source='course.course_name', read_only=True)
    department_name = serializers.CharField(source='course.department.department_name', read_only=True)
    college_name = serializers.CharField(source='course.department.college.college_name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id',
            'student_number',
            'last_name',
            'first_name',
            'middle_initial',
            'birthdate',
            'gender',
            'course',
            'course_name',
            'department_name',
            'college_name',
            'region_code',
            'province_code',
            'city_municipality_code',
            'barangay_code',
            'street_address',
            'email',
            'phone',
            'photo',
            'role',
            'role_name',
            'status',
            'status_name',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'role': {'read_only': True},
            'status': {'read_only': True},
        }

class EmployeeSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_number',
            'last_name',
            'first_name',
            'middle_initial',
            'birthdate',
            'gender',
            'department',
            'department_name',
            'position',
            'region_code',
            'province_code',
            'city_municipality_code',
            'barangay_code',
            'street_address',
            'email',
            'phone',
            'photo',
            'role',
            'role_name',
            'status',
            'status_name',
            'created_at',
            'updated_at',
        ]

class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'category',
            'category_name',
            'description',
            'status',
            'condition',
            'image',
            'created_at',
            'updated_at',
        ]

class BorrowingRecordSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_image = serializers.ImageField(source='item.image', read_only=True)
    student_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()
    borrower_name = serializers.SerializerMethodField()

    class Meta:
        model = BorrowingRecord
        fields = [
            'id',
            'item',
            'item_name',
            'item_image',
            'student',
            'student_name',
            'employee',
            'employee_name',
            'borrower_name',
            'borrow_date',
            'expected_return_date',
            'actual_return_date',
            'status',
            'created_at',
            'updated_at',
        ]

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return None

    def get_employee_name(self, obj):
        if obj.employee:
            return f"{obj.employee.first_name} {obj.employee.last_name}"
        return None

    def get_borrower_name(self, obj):
        return self.get_student_name(obj) or self.get_employee_name(obj) or "Unknown"
