from django.contrib import admin
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

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'role_name', 'description')
    search_fields = ('role_name',)

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'status_name')
    search_fields = ('status_name',)

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('id', 'college_name')
    search_fields = ('college_name',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'department_name', 'college')
    search_fields = ('department_name', 'college__college_name')
    list_filter = ('college',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'course_name', 'department')
    search_fields = ('course_name', 'department__department_name')
    list_filter = ('department',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'student_number',
        'last_name',
        'first_name',
        'middle_initial',
        'course',
        'gender',
        'email',
        'phone',
        'role',
        'status',
        'created_at',
        'updated_at',
    )
    search_fields = (
        'student_number',
        'last_name',
        'first_name',
        'email',
        'phone',
        'course__course_name',
    )
    list_filter = (
        'gender',
        'course',
        'role',
        'status',
    )

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'employee_number',
        'last_name',
        'first_name',
        'middle_initial',
        'department',
        'position',
        'gender',
        'email',
        'phone',
        'role',
        'status',
        'created_at',
        'updated_at',
    )
    search_fields = (
        'employee_number',
        'last_name',
        'first_name',
        'email',
        'phone',
        'department__department_name',
    )
    list_filter = (
        'department',
        'gender',
        'role',
        'status',
    )

@admin.register(ItemCategory)
class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'status', 'condition', 'created_at')
    search_fields = ('name', 'category__name')
    list_filter = ('category', 'status', 'condition')

@admin.register(BorrowingRecord)
class BorrowingRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'student', 'employee', 'borrow_date', 'expected_return_date', 'status')
    search_fields = ('item__name', 'student__student_number', 'employee__employee_number')
    list_filter = ('status', 'borrow_date')
