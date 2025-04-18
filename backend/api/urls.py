from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


#from .views import RegisterAPI
router = DefaultRouter()
router.register(r'issues', IssueViewSet,'issues')
router.register(r'department',DepartmentViewSet,'department')
router.register(r'course_unit',Course_unitViewSet,'course_unit')
router.register(r'program',ProgramViewSet,'program')
router.register(r'registration_token',Registration_Token_viewset,'registration_token')
router.register(r'registrar_issue_management',Registrar_Issue_ManagementViewSet,'registrar_issue_management')
router.register(r'lecturer_issue_management', Lecturer_Issue_Manangement, 'lecturer_issue_management')
router.register(r'student_issues', Student_Issue_ReadOnlyViewset, 'student_issues')


urlpatterns = [
    path('',include(router.urls)),
    path('register_student_user/',Student_Registration.as_view(),name = 'register_student_user'),
    path('register_lect_and_registrar/',Lecturer_and_Registrar_Registration.as_view(),name='register_lect_and_registrar'),
    path("access_token/",CustomTokenObtainPairView.as_view(),name = "access_token"),
    path("refresh_token/",TokenRefreshView.as_view(),name = "refresh_token"),
    path("verify_email/",verify_email,name='verify_email'),
    path('resend_verify_code/',resend_verification_code,name='resend_verify_code'),
    path('password_reset_code/',password_reset_code,name='password_reset_code'),
    path('verify_password_reset_code/',verify_password_reset_code,name='verify_password_reset_code'),
    path('final_password_reset/',final_password_reset,name='final_password_reset'),
    path('user_email_notifications/',get_user_email_notifications,name = 'user_email_notifications'),
    path('resend_password_reset_code/',resend_password_reset_code,name = 'resend_password_reset_code'),
    path('get_registrars/',get_registrars,name = 'get_registrars'),
    path('get_lecturers/',get_lecturers,name = 'get_lecturers'),
    
]
