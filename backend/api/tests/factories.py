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

class Course_unitFactory(DjangoModelFactory):
    class Meta:
        model = Course_unit
    
    course_unit_code = "TEST101"
    course_unit_name = "Test Course Unit"

class ProgramFactory(DjangoModelFactory):
    class Meta:
        model = Program
    
    program_name = "Test Program"

class CustomUserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser
    
    first_name = "Test"
    last_name = "User"
    username = "testuser"
    email = "test@example.com"
    password = factory.LazyFunction(lambda: make_password("password123"))
    confirm_password = "password123"
    role = "student"
    gender = "male"
    city = "Test City"
    token = "test_token"
    is_email_verified = False

class IssueFactory(DjangoModelFactory):
    class Meta:
        model = Issue
    
    issue_type = "missing_marks"
    description = "Test description"
    status = "pending"
    year_of_study = "1st_year"
    semester = "one"
    is_commented = False

    @factory.lazy_attribute
    def student(self):
        return CustomUserFactory(role="student")
    
    @factory.lazy_attribute
    def course_unit(self):
        return Course_unitFactory()
    
    @factory.lazy_attribute
    def lecturer(self):
        return CustomUserFactory(role="lecturer", username="lecturer", email="lecturer@example.com")
    
    @factory.lazy_attribute
    def registrar(self):
        return CustomUserFactory(role="academic_registrar", username="registrar", email="registrar@example.com")

class Registration_TokenFactory(DjangoModelFactory):
    class Meta:
        model = Registration_Token
    
    role = "lecturer"
    email = "staff@example.com"
    token = "test_registration_token"

class Verification_codeFactory(DjangoModelFactory):
    class Meta:
        model = Verification_code
    
    code = 12345
    is_verified = False

    @factory.lazy_attribute
    def user(self):
        return CustomUserFactory()

class Email_NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Email_Notification
    
    subject = "Test Subject"
    message = "Test message"
    
    @factory.lazy_attribute
    def user(self):
        return CustomUserFactory()
    
    @factory.lazy_attribute
    def issue(self):
        return IssueFactory()
