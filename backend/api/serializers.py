from .models import *
from rest_framework import serializers
from api import models
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer






class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['id'] = user.id
        token['email'] = user.email  
        token['role'] = user.role  
        token['username'] = user.username
        print(token)
        return token






class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email']
        



class CustomUserprofileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"
    
    

        
class Course_unitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course_unit
        fields = "__all__"

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'
        
    def create(self, validated_data):
        course_units = validated_data.pop('course_units', [])
        program = Program.objects.create(name=validated_data['program_name'])
        program.course_units.set(course_units) 
        return program
        
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
 
 



            


class IssueSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    registrar = UserSerializer(read_only=True)
    
    #program = ProgramSerializer()
    class Meta:
        model = Issue
        fields = ['id','student','issue_type','course_unit','description','image','status','created_at','comment','updated_at','registrar','year_of_study','semester','lecturer','is_commented']

class Student_RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        #fields = "__all__"
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password','confirm_password', 'gender','program']
        
        
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
            }


    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        email = data.get('email')
        username = data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")

        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already taken.")
        
        if password != confirm_password:
            raise serializers.ValidationError("Passwords don't match....")
        
        return data
    
    def create(self, validated_data):
        """Create a new user with hashed password."""
        password = validated_data.pop('password')  # Extract password
        validated_data["role"] = 'student'
        validated_data["is_active"] = True
        validated_data["token"] = None
        print(validated_data)
        
        user = CustomUser(**validated_data)  # Create user instance without saving
        user.set_password(password)  # Hash the password
        user.save()  # Save user with hashed password
        return user

class Lecturer_and_Registrar_RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"
        #fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password','confirm_password', 'gender','token',]
        
        
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
            }

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        email_value = data.get('email')
        username = data.get('username')
        
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        
        if '@' not in email_value or email_value.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
    
        if CustomUser.objects.filter(email=email_value).exists():
            raise serializers.ValidationError("Email already taken.")
        
        if password != confirm_password:
            raise serializers.ValidationError("Passwords don't match....")
        
        return data
    
    def create(self, validated_data):
        """Create a new user with hashed password."""
        validated_data["is_active"] = True
        password = validated_data.pop('password')  # Extract password
        role = validated_data.get('role')
        groups = validated_data.pop('groups', []) if 'groups' in validated_data else []
        user_permissions = validated_data.pop('user_permissions', []) if 'user_permissions' in validated_data else []
        
        user = CustomUser(**validated_data)  # Create user instance without saving
        user.set_password(password)  # Hash the password
        if groups:
            user.groups.set(groups)  
        
        if user_permissions:
            user.user_permissions.set(user_permissions)

        user.save()
        
        group,created = Group.objects.get_or_create(name = role)
        user.groups.add(group)
        return user

class Registration_Token_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Registration_Token
        fields = ['id', 'email', 'token', 'role']
    
        
    def validate(self, data):
        email_value = data.get('email')
        if '@' not in email_value or email_value.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        if CustomUser.objects.filter(email = data.get('email')).exists():
            raise serializers.ValidationError(f'The email {data.get('email')} is already taken')
        return data


class Verify_Email_serializer(serializers.Serializer):
    code = serializers.IntegerField()
    email = serializers.EmailField()
    

class Resend_Verification_CodeSerializer(serializers.Serializer):
    email = serializers.EmailField() 



class Resend_Password_Reset_CodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
class Password_ResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    
class Verify_Password_Reset_CodeSerializer(serializers.Serializer):
    code = serializers.IntegerField()

class Final_Password_ResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=50,write_only=True)
    confirm_password = serializers.CharField(max_length=50,write_only=True)
    email = serializers.EmailField()
    
    def validate(self,validated_data):
        if validated_data['password'] != validated_data['confirm_password']:
            raise serializers.ValidationError("Passwords donot match....")
        
        return validated_data
        
class Email_notificationSerializer(serializers.ModelSerializer):
    issue_id = serializers.IntegerField(source='issue.id')
    class Meta:
        model =Email_Notification
        fields = ['id', 'subject', 'message', 'created_at', 'issue_id']
        


