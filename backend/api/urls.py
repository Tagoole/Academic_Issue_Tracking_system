from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


#from .views import RegisterAPI
router = DefaultRouter()
router.register(r'issues', IssueViewSet,'issues')
router.register(r'department',DepartmentViewSet,'department')
router.register(r'course_unit',Course_unitViewSet,'course_unit')
router.register(r'program',ProgramViewSet,'program')
router.register(r'registration_token',Registration_Token_viewset,'registration_token')

urlpatterns = [
    path('',include(router.urls)),
    path('register_student_user/',Student_Registration.as_view(),name = 'register_student_user'),
    path('register_lect_and_registrar/',Lecturer_and_Registrar_Registration.as_view(),name='register_lect_and_registrar'),
    path("access_token/",TokenObtainPairView.as_view(),name = "access_token"),
    path("refresh_token/",TokenRefreshView.as_view(),name = "refresh_token")
]
