from django.urls import path
from .views import (
    RoleListAPIView,
    StatusListAPIView,
    CollegeListAPIView,
    DepartmentListAPIView,
    CourseListAPIView,
    
    StudentListCreateAPIView,
    StudentRetrieveUpdateAPIView,
    StudentDeleteAPIView,
    
    EmployeeListCreateAPIView,
    EmployeeRetrieveUpdateAPIView,
    EmployeeDeleteAPIView,

    ItemCategoryListCreateAPIView,
    
    ItemListCreateAPIView,
    ItemRetrieveUpdateAPIView,
    ItemDeleteAPIView,

    BorrowingRecordListCreateAPIView,
    BorrowingRecordRetrieveUpdateAPIView,
    BorrowingRecordDeleteAPIView,
    LoginView,
    LogoutView,
    MeView,
)

urlpatterns = [
    path('roles/', RoleListAPIView.as_view(), name='role-list'),
    path('status/', StatusListAPIView.as_view(), name='status-list'),
    path('colleges/', CollegeListAPIView.as_view(), name='college-list'),
    path('departments/', DepartmentListAPIView.as_view(), name='department-list'),
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    
    path('students/', StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentRetrieveUpdateAPIView.as_view(), name='student-detail-update'),
    path('students/<int:pk>/delete/', StudentDeleteAPIView.as_view(), name='student-delete'),
    
    path('employees/', EmployeeListCreateAPIView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateAPIView.as_view(), name='employee-detail-update'),
    path('employees/<int:pk>/delete/', EmployeeDeleteAPIView.as_view(), name='employee-delete'),

    path('categories/', ItemCategoryListCreateAPIView.as_view(), name='category-list-create'),
    
    path('items/', ItemListCreateAPIView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemRetrieveUpdateAPIView.as_view(), name='item-detail-update'),
    path('items/<int:pk>/delete/', ItemDeleteAPIView.as_view(), name='item-delete'),

    path('borrowings/', BorrowingRecordListCreateAPIView.as_view(), name='borrowing-list-create'),
    path('borrowings/<int:pk>/', BorrowingRecordRetrieveUpdateAPIView.as_view(), name='borrowing-detail-update'),
    path('borrowings/<int:pk>/delete/', BorrowingRecordDeleteAPIView.as_view(), name='borrowing-delete'),
    
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
]
