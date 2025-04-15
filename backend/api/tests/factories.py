import factory
from factory.django import DjangoModelFactory
from django.contrib.auth.hashers import make_password
from api.models import *

class CustomUserFactory(DjangoModelFactory):
    pass

class Course_unitFactory(DjangoModelFactory):
    pass

class programFactory(DjangoModelFactory):
    pass

class IssueFactory(DjangoModelFactory):
    pass

class Registration_TokenFactory(DjangoModelFactory):
    pass