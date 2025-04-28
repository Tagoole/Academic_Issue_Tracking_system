from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView



#from .views import RegisterAPI
router = DefaultRouter()
router.register(r'issues', IssueViewSet, 'issues')  # Registers IssueViewSet to handle CRUD operations for issues
router.register(r'department', DepartmentViewSet, 'department')  # Registers DepartmentViewSet to handle CRUD operations for departments
router.register(r'course_unit', Course_unitViewSet, 'course_unit')  # Registers Course_unitViewSet to handle CRUD operations for course units
router.register(r'program', ProgramViewSet, 'program')  # Registers ProgramViewSet to handle CRUD operations for programs
router.register(r'registration_token', Registration_Token_viewset, 'registration_token')  # Registers Registration_Token_viewset to handle CRUD operations for registration tokens
router.register(r'registrar_issue_management', Registrar_Issue_ManagementViewSet, 'registrar_issue_management')  # Registers Registrar_Issue_ManagementViewSet to handle CRUD operations for registrar issue management
router.register(r'lecturer_issue_management', Lecturer_Issue_Manangement, 'lecturer_issue_management')  # Registers Lecturer_Issue_Manangement to handle CRUD operations for lecturer issue management
router.register(r'student_issues', Student_Issue_Viewset, 'student_issues')  # Registers Student_Issue_ReadOnlyViewset to handle read-only operations for student issues
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'conversations', ConversationViewSet, basename='conversation')





urlpatterns = [
    path('',include(router.urls)),
    path('register_student_user/', Student_Registration.as_view(), name='register_student_user'),  # Endpoint to register a student user
    path('register_lect_and_registrar/', Lecturer_and_Registrar_Registration.as_view(), name='register_lect_and_registrar'),  # Endpoint to register lecturers and registrars
    path("access_token/", CustomTokenObtainPairView.as_view(), name="access_token"),  # Endpoint to obtain access tokens
    path("refresh_token/", TokenRefreshView.as_view(), name="refresh_token"),  # Endpoint to refresh access tokens
    path("verify_email/",verify_email,name='verify_email'),
    path('resend_verify_code/',resend_verification_code,name='resend_verify_code'),
    path('password_reset_code/',password_reset_code,name='password_reset_code'),
    path('verify_password_reset_code/',verify_password_reset_code,name='verify_password_reset_code'),
    path('final_password_reset/',final_password_reset,name='final_password_reset'),
    path('user_email_notifications/', get_user_email_notifications, name='user_email_notifications'),  # Endpoint to retrieve user email notifications
    path('resend_password_reset_code/',resend_password_reset_code,name = 'resend_password_reset_code'),
    path('get_registrars/', get_registrars, name='get_registrars'),  # Endpoint to retrieve a list of registrars
    path('get_lecturers/',get_lecturers,name = 'get_lecturers'),
    path('get_students/',get_students,name = 'get_students'),
    path('delete_account/',delete_account,name='delete_account'),
    path('users/search/', UserSearchView.as_view(), name='user-search'),

]






