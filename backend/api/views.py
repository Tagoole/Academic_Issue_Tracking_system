from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from rest_framework.response import Response
from .serializers import *
from rest_framework.decorators import APIView,api_view
from .models import *
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from random import randint

class IssueViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
class Lecturer_Issue_Manangement(ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self): 
        user = self.request.user
        return Issue.objects.filter(lecturer = user)
    
class Student_Issue_ReadOnlyViewset(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(student = user)
    
class Registrar_Issue_ManagementViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(registrar = user)
    
class DepartmentViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class Course_unitViewSet(ModelViewSet):
    queryset = Course_unit.objects.all()
    serializer_class = Course_unitSerializer

class ProgramViewSet(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    
class Lecturer_and_Registrar_Registration(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data.copy()
        token_value = data['token']
        email_value = data['email']
        
        token_object = Registration_Token.objects.filter(token=token_value, email=email_value).first()
        if token_object:
            data['role'] = token_object.role 
            data['is_email_verified'] = True
            print("Updated data:", data)
            
            
        serializer = Lecturer_and_Registrar_RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()  # Save user using serializer
            return Response({
                "message": "User Created Successfully",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "gender": user.gender,
                    "role":user.role,
                    "program": user.program.id if user.program else None,
                    "is_email_verified": user.is_email_verified,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Student_Registration(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data=request.data
        serializer = Student_RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()  # Save user using serializer
            '''Creating and saving the verification code object..'''
            
            verification_code = randint(10000,99999)
            verification,created = Verification_code.objects.get_or_create(
                user = user,
                defaults={"code": verification_code})
            
            verification.code = verification_code
            #verification_code.created_at = timezone.now()
            verification.save()
            
            '''Sending the email...'''
            subject = 'Email verification Code..'
            message = f"Hello, your Verification code is: {verification_code}"
            receipient_email= data.get('email')
            
            try:
                send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({
                    "message": "User Created Successfully, Token created and email sent!",
                    "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "role":user.role,
                    "gender": user.gender,
                    "program": user.program.id if user.program else None,
                    "is_email_verified": user.is_email_verified,
                
                    }}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Registration_Token_viewset(ModelViewSet):
    queryset = Registration_Token.objects.all()
    serializer_class = Registration_Token_Serializer
    http_method_names = ['get','post','delete']
    
    def create(self,request):
        serializer = self.get_serializer(data = request.data)
        
        if serializer.is_valid():
            token_instance = serializer.save()
            
            subject = "Your Registration Token for the Academic Issue Tracking System"
            message = f"Hello, your registration token is: {token_instance.token}"
            receipient_email = token_instance.email
            
            try:
                send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
                return Response({"message": "Token created and email sent!"}, status=status.HTTP_201_CREATED)
            
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def verify_email(request):
    data = request.data
    serializer = Verify_Email_serializer(data = data)
    if serializer.is_valid():
        verification_code = data.get('code')
        user = data.get('user')
        
        try:
            verification = Verification_code.objects.get(code = verification_code)
            
            if verification.is_verification_code_expired():
                return Response({'error':'Verification Code has expired..'},status = status.HTTP_400_BAD_REQUEST)
            
            verification_code.created_at = timezone.now()
            verification.is_verified = True
            verification.save()
            user_verification = CustomUser.objects.get(user = user)
            
            if user_verification:
                user_verification.is_email_verified = True
                user_verification.save()
                
                return Response({'Message':'Email verified successfully...'},status = status.HTTP_200_OK)
            
            
        except:
            return Response({'error':'Invalid Verification code'},status = status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def resend_verification_code(request):
    data = request.data
    user = data.get('user')
    try:
        user_codes = Verification_code.objects.filter(user = user)
        if user_codes:
            user_codes.delete()
        verification_code = randint(10000,99999)
        verification,created = Verification_code.objects.get_or_create(
                user = user,
                defaults={"code": verification_code})
            
        verification.code = verification_code
        verification.save()
        
        subject = 'Email verification Code Resend..'
        message = f"Hello, your Verification code is: {verification_code}"
        receipient_email= data.get('email')
            
        try:
            send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
    except Exception as e:
        return Response({'Error':f'{e}'})

@api_view(['POST'])
def password_reset_code(request):
    serializer = Password_ResetSerializer(data = request.data)
    if serializer.is_valid():
        email = serializer.validated_data.get('email')
        
        try:
            user = CustomUser.objects.get(email = email)
        except Exception as e:
            return Response({'Error': e})
        
        verification_code, created = Verification_code.objects.get_or_create(user=user)
        verification_code.code = randint(100000, 999999)
        verification_code.created_at = timezone.now()
        verification_code.is_verified = False
        verification_code.save()
        
        send_mail(
            "Password Reset Code",
            f"Your password reset code is {verification_code.code}. It will expire in 10 minutes.",
            "no-reply@aits.com",
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Password reset code sent to email"}, status=status.HTTP_200_OK)
        
        
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_password_reset_code(request):
    serializer = Verify_Password_Reset_CodeSerializer(data = request.data)
    if serializer.is_valid():
        code = serializer.validated_data.get('code')
        user = serializer.validated_data.get('user')
        
        try:
            get_code = Verification_code.objects.get(user = user, code = code) 
        except Exception as e:
            return Response({'Error':e},status= status.HTTP_400_BAD_REQUEST)
        
        if get_code.is_verification_code_expired():
            return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message':'Confirmed...'})
        
        
        
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def final_password_reset(request):
    serializer = Final_Password_ResetSerializer(data = request.data)
    if serializer.is_valid():
        password = serializer.validated_data.get('passsword')
        confirm_password = serializer.validated_data.get('confirm_password')
        user = serializer.validated_data.get('user')
        
        get_user = CustomUser.objects.get(user = user)
        
        get_user.set_password(password)
        get_user.set_password(confirm_password)
        
        user.save()
        
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    
        