import factory
from factory.django import DjangoModelFactory
from django.contrib.auth.hashers import make_password
from api.models import *
import shortuuid
from random import randint

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
    pass

class Verification_codeFactory(DjangoModelFactory):
    pass

class Email_NotificationFactory(DjangoModelFactory):
    pass