import factory
from factory.django import DjangoModelFactory
from django.contrib.auth.hashers import make_password
from api.models import *
import shortuuid
from random import randint


class DepartmentFactory(DjangoModelFactory):
    class Meta:
        model = Department
    
    department_name = "Test Department"
    description = "This is a test department"
    
    
class CustomUserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser

class Course_unitFactory(DjangoModelFactory):
    class Meta:
        model = Course_unit


class ProgramFactory(DjangoModelFactory):
    class Meta:
        model = Program


class IssueFactory(DjangoModelFactory):
    class Meta:
        model = Issue


class Registration_TokenFactory(DjangoModelFactory):
    class Meta:
        model = Registration_Token


class Verification_codeFactory(DjangoModelFactory):
    class Meta:
        model = Verification_code


class Email_NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Email_Notification