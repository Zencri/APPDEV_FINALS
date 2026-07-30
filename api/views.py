from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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

from .serializers import (
    RoleSerializer,
    StatusSerializer,
    CollegeSerializer,
    DepartmentSerializer,
    CourseSerializer,
    StudentSerializer,
    EmployeeSerializer,
    ItemCategorySerializer,
    ItemSerializer,
    BorrowingRecordSerializer,
)

class RoleListAPIView(generics.ListAPIView):
    queryset = Role.objects.all().order_by('id')
    serializer_class = RoleSerializer

class StatusListAPIView(generics.ListAPIView):
    queryset = Status.objects.all().order_by('id')
    serializer_class = StatusSerializer

class CollegeListAPIView(generics.ListAPIView):
    queryset = College.objects.all().order_by('college_name')
    serializer_class = CollegeSerializer

class DepartmentListAPIView(generics.ListAPIView):
    queryset = Department.objects.select_related('college').all().order_by('department_name')
    serializer_class = DepartmentSerializer

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.select_related('department', 'department__college').all().order_by('course_name')
    serializer_class = CourseSerializer

class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Student.objects.select_related(
        'course',
        'course__department',
        'course__department__college',
        'role',
        'status',
    ).all().order_by('last_name', 'first_name')
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        student_role, _ = Role.objects.get_or_create(
            role_name='Student',
            defaults={'description': 'Student borrower access'}
        )
        active_status, _ = Status.objects.get_or_create(
            status_name='Active'
        )
        serializer.save(
            role=student_role,
            status=active_status
        )

class StudentRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Student.objects.select_related(
        'course',
        'course__department',
        'course__department__college',
        'role',
        'status',
    ).all()
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class StudentDeleteAPIView(generics.DestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class EmployeeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Employee.objects.select_related(
        'department',
        'role',
        'status',
    ).all().order_by('last_name', 'first_name')
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        employee_role, _ = Role.objects.get_or_create(
            role_name='Staff',
            defaults={'description': 'Operational staff access'}
        )
        active_status, _ = Status.objects.get_or_create(
            status_name='Active'
        )
        serializer.save(
            role=employee_role,
            status=active_status
        )

class EmployeeRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Employee.objects.select_related(
        'department',
        'role',
        'status',
    ).all()
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class EmployeeDeleteAPIView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class ItemCategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer

class ItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = Item.objects.select_related('category').all().order_by('-created_at')
    serializer_class = ItemSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ItemRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Item.objects.select_related('category').all()
    serializer_class = ItemSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ItemDeleteAPIView(generics.DestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class BorrowingRecordListCreateAPIView(generics.ListCreateAPIView):
    queryset = BorrowingRecord.objects.select_related('item', 'student', 'employee').all().order_by('-borrow_date')
    serializer_class = BorrowingRecordSerializer

    def perform_create(self, serializer):
        # Default for the demo: assign to 'Juan Miguel Dela Cruz' (Student 2021-0001)
        student = Student.objects.filter(student_number='2021-0001').first()
        serializer.save(
            student=student,
            status='Pending'
        )

class BorrowingRecordRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = BorrowingRecord.objects.select_related('item', 'student', 'employee').all()
    serializer_class = BorrowingRecordSerializer

class BorrowingRecordDeleteAPIView(generics.DestroyAPIView):
    queryset = BorrowingRecord.objects.all()
    serializer_class = BorrowingRecordSerializer

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            return Response({
                "message": "Login successful",
                "username": user.username,
                "is_admin": user.is_staff
            })
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

class MeView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        # Check localStorage-based auth (frontend handles session)
        return Response({"message": "Use localStorage to check auth state on frontend"})
