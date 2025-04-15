from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from rest_framework.response import Response
from .serializers import *
from rest_framework.decorators import APIView,api_view,permission_classes,action
from .models import *
from rest_framework import status
from .permissions import *
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.core.mail import send_mail,EmailMessage
from django.conf import settings
from random import randint
from django.db.models import Q
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Extract validated data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate data
        validated_data = serializer.validated_data

        # Get the user
        user = serializer.user
        
        response.data['role'] = user.role
        response.data['id'] = user.id
        response.data['email'] = user.email
        response.data['username'] = user.username
        response.data['gender'] = user.gender
        response.data['program'] = user.program.id if user.program else None
        print(response.data)
        print(user.role)
        

        return response

class IssueViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    
    def create(self, request, *args, **kwargs):
        # Make a mutable copy of the request data
        data = request.data.copy()
        
        # Debug print
        print("--- ORIGINAL REQUEST DATA ---")
        print(request.data)
        print("-------------------")
        
        # Handle student username - convert to User ID
        student_username =  data.get('student_username') or data.get('student')
        if student_username:
            try:
                student = CustomUser.objects.get(username=student_username)
                data['student'] = student.id
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': f'Student with username {student_username} not found'}, 
                    status=400
                )
        
        # Handle registrar name - convert to User ID
        registrar_name = data.get('registrar_username') or data.get('registrar')
        if registrar_name:
            try:
                # Try to find by username first, then by name if that exists
                try:
                    registrar = CustomUser.objects.get(username=registrar_name)
                except CustomUser.DoesNotExist:
                    # If your User model has a name field, use this:
                    registrar = CustomUser.objects.get(name=registrar_name)
                data['registrar'] = registrar.id
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': f'Registrar with name {registrar_name} not found'}, 
                    status=400
                )
        
        # Debug print after conversion
        print("--- MODIFIED REQUEST DATA ---")
        print(data)
        print("-------------------")
        
        # Use modified data for serialization
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
        
class Lecturer_Issue_Manangement(ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self): 
        user = self.request.user
        return Issue.objects.filter(lecturer = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()

    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(student__username__icontains = search_query) |
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
class Student_Issue_ReadOnlyViewset(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(student = user)
    
        
    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
    
    
class Registrar_Issue_ManagementViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(registrar = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_success = send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
            if send_success > 0:
                Email_Notification.objects.create(
                    user = student, 
                    issue = issue, 
                    subject = subject, 
                    message = message).save()
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()
        
    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(student__username__icontains = search_query) |
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
            
    
    
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
        print(data)
        token_value = data['registration_token']
        email_value = data['email']
        
        token_object = Registration_Token.objects.filter(token=token_value, email=email_value).first()
        if token_object:
            data['role'] = token_object.role 
            data['is_email_verified'] = True
            
            
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
        print(request.data)
        data=request.data
        serializer = Student_RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()  # Save user using serializer
            print(serializer.validated_data)
            '''Creating and saving the verification code object..'''
            
            verification_code = randint(10000,99999)
            verification,created = Verification_code.objects.get_or_create(
                user = user,
                defaults={"code": verification_code})
            
            verification.code = verification_code
            #verification_code.created_at = timezone.now()
            verification.save()
                
            subject = 'Email Verification Code'
            message = f"Hello, your Verification code is: {verification_code}"
            recipient_email = data.get('email')

            email = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [recipient_email]
            )
            #try:
            email.send(fail_silently=False)
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
            #except Exception as e:
                #print(f"Email sending failed: {str(e)}")
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Registration_Token_viewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
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
                print(token_instance.token)
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
        verification_code = serializer.validated_data.get('code')
        user_email = serializer.validated_data.get('email')
        
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            verification = Verification_code.objects.get(user = user,code = verification_code)
            
            if verification.is_verification_code_expired():
                return Response({'error':'Verification Code has expired..'},status = status.HTTP_400_BAD_REQUEST)
            
            verification.is_verified = True
            verification.save()
            
            user.is_email_verified = True
            user.save()
            return Response({'Message':'Email verified successfully...'},status = status.HTTP_200_OK)
            
            
        except Verification_code.DoesNotExist:
            return Response({'error':'Verification Code doesnot exist..'},status = status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['POST'])
def resend_verification_code(request):
    data = request.data
    serializer = Resend_Verification_CodeSerializer(data = data)
    if serializer.is_valid():
        user_email = serializer.validated_data.get('email')
        try:
            user = CustomUser.objects.get(email = user_email)
        except CustomUser.DoesNotExist:
            return Response({'Error':'No user found...'})
        
        result = Verification_code.resend_verification_code(user = user, subject= 'Email verification Code Resend..')
        if result:
            return Response({'Message':f'Successful.....'},status=status.HTTP_200_OK)
        return Response({'Error':'Failure...........--'},status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)


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
def resend_password_reset_code(request):
    serializer= Resend_Password_Reset_CodeSerializer(data = request.data)
    if serializer.is_valid():
        user_email = serializer.validated_data.get('email')
        try:
            user = CustomUser.objects.get(email = user_email)
        except CustomUser.DoesNotExist:
            return Response({'Error':'No user found...'})
        """I am using the verification code model to rsend the password reset code.."""
        result = Verification_code.resend_verification_code(user = user, subject= 'Reset Account Password...')
        if result:
            return Response({'Message':f'Successfully Resent the Password Reset Code .....'},status=status.HTTP_200_OK)
        return Response({'Error':'Failure...........--'},status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
     
        
@api_view(['POST'])
def verify_password_reset_code(request):
    serializer = Verify_Password_Reset_CodeSerializer(data = request.data)
    if serializer.is_valid():
        code = serializer.validated_data.get('code')
        user = serializer.validated_data.get('user')
        print(serializer.validated_data)
        get_code = Verification_code.objects.filter(code=code).first()
        if not get_code:
            return Response({"error": "Invalid verification code or user."}, status=status.HTTP_400_BAD_REQUEST)

        if get_code.is_verification_code_expired():
            return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message':'Confirmed...'})
        
        
        
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def final_password_reset(request):
    serializer = Final_Password_ResetSerializer(data = request.data)
    if serializer.is_valid():
        password = serializer.validated_data.get('password')
        confirm_password = serializer.validated_data.get('confirm_password')
        email = serializer.validated_data.get('email')
        
        try:
            get_user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        get_user.set_password(password)
        #get_user.set_password(confirm_password)
        
        get_user.save()
        
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_email_notifications(request):
    data = request.data
    notifications = Email_Notification.objects.filter(user = data.get('user'))
    number = notifications.count()
    serializer = Email_notificationSerializer(notifications,many = True)
    return Response ({'number':number,
                      'data':serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_registrars(request):
    registrars = CustomUser.objects.filter(role='academic_registrar')
    
    serializer = UserSerializer(registrars, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_lecturers(request):
    lecturers = CustomUser.objects.filter(role='lecturer')
    
    serializer = UserSerializer(lecturers, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

